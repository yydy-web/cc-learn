---
title: Page Object Model 深度实践
description: Playwright + pytest 下的 Page Object Model 完整实现指南，涵盖 BasePage 基类、多页面电商系统、组件嵌套、多环境切换和认证态复用
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★★★☆☆ |
| 🧪 测试 | ★★★★★ | ★★★☆☆ |
| 📦 产品 | ★★☆☆☆ | ★★★★★ |

**🎯 学习产出：** 掌握 Playwright POM 模式，能独立设计多页面电商系统的 Page Object Model 架构

**🚀 AI 能力提升：** 测试生成、自动化工作流
:::

# Page Object Model 深度实践

Page Object Model（PO）是 UI 自动化测试中最核心的设计模式。它的核心理念是：**将页面结构和操作封装为对象，让测试用例不直接接触 DOM 选择器**。当页面 UI 变更时，你只需修改对应的 Page Object 类，测试用例本身不受影响。

:::info
本文是 [Python 测试工具链概览](./index) 的深度实践子页面。PO 的基础用法和入门示例请参阅 [Python 自动化测试最佳实践](/tips/python-best-practices#进阶实践)。
:::

## PO 模式的核心理念

没有 PO 的测试用例长这样：

```python
def test_login(page):
    page.goto("/login")
    page.fill("input[name='username']", "admin")
    page.fill("input[name='password']", "secret")
    page.click("button[type='submit']")
    page.wait_for_url("/dashboard")
    expect(page.locator(".welcome-message")).to_have_text("欢迎回来，admin")
```

问题是：10 个测试都包含登录逻辑，登录页的 DOM 变更时 10 个测试都要改。

使用 PO 后：

```python
def test_login(login_page):
    dashboard_page = login_page.login("admin", "secret")
    expect(dashboard_page.welcome_message).to_have_text("欢迎回来，admin")
```

## 设计原则

1. **一个方法做一件事**：`login_page.login(user, pwd)` 而不是 `login_page.do_stuff()`
2. **返回 PO 对象实现链式调用**：`login_page.login().search().add_to_cart()`
3. **断言不要放在 PO 里**：PO 负责操作和状态查询（返回 `Locator`），断言留给测试用例
4. **选择器集中管理**：所有 locator 在 PO 类的顶部定义，不散落在方法中

## 完整示例：多页面电商系统

以下是一个电商系统的完整 PO 实现，包含 5 个页面和 2 个嵌套组件。

### BasePage 基类

```python
# pages/base_page.py
from playwright.sync_api import Page, Locator, expect

class BasePage:
    """所有 Page Object 的基类，封装通用操作"""

    def __init__(self, page: Page, base_url: str):
        self.page = page
        self.base_url = base_url

    @property
    def url(self) -> str:
        raise NotImplementedError("子类必须定义 url")

    def navigate(self) -> "BasePage":
        """导航到该页面"""
        self.page.goto(f"{self.base_url}{self.url}")
        return self

    def wait_for_loaded(self) -> "BasePage":
        """等待页面加载完成"""
        self.page.wait_for_load_state("networkidle")
        return self

    def get_title(self) -> str:
        """获取页面标题"""
        return self.page.title()

    def screenshot(self, name: str) -> None:
        """截取当前页面截图"""
        self.page.screenshot(path=f"screenshots/{name}.png", full_page=True)

    def expect_url_contains(self, path: str) -> None:
        """断言 URL 包含指定路径（用于测试用例）"""
        expect(self.page).to_have_url(f"**{path}**")
```

### 嵌套组件

```python
# pages/components/header.py
from playwright.sync_api import Page, Locator

class Header:
    """页面顶部导航栏——出现在所有页面上"""

    def __init__(self, page: Page):
        self.page = page
        self.logo: Locator = page.locator(".header-logo")
        self.search_input: Locator = page.locator("[data-testid='search-input']")
        self.search_btn: Locator = page.locator("[data-testid='search-btn']")
        self.cart_icon: Locator = page.locator("[data-testid='cart-icon']")
        self.cart_badge: Locator = page.locator("[data-testid='cart-badge']")
        self.user_menu: Locator = page.locator("[data-testid='user-menu']")
        self.login_link: Locator = page.locator("[data-testid='login-link']")

    def search(self, keyword: str) -> None:
        self.search_input.fill(keyword)
        self.search_btn.click()

    def get_cart_count(self) -> str:
        return self.cart_badge.inner_text()

    def go_to_cart(self) -> None:
        self.cart_icon.click()

    def go_to_login(self) -> None:
        self.login_link.click()
```

```python
# pages/components/product_card.py
from playwright.sync_api import Page, Locator

class ProductCard:
    """商品卡片组件——出现在商品列表页"""

    def __init__(self, locator: Locator):
        self.root = locator
        self.name: Locator = locator.locator("[data-testid='product-name']")
        self.price: Locator = locator.locator("[data-testid='product-price']")
        self.add_to_cart_btn: Locator = locator.locator("[data-testid='add-to-cart-btn']")

    def get_name(self) -> str:
        return self.name.inner_text()

    def get_price(self) -> str:
        return self.price.inner_text()

    def add_to_cart(self) -> None:
        self.add_to_cart_btn.click()
```

### 业务页面类

```python
# pages/login_page.py
from playwright.sync_api import Page, Locator
from pages.base_page import BasePage
from pages.components.header import Header

class LoginPage(BasePage):
    url = "/login"

    def __init__(self, page: Page, base_url: str):
        super().__init__(page, base_url)
        self.header = Header(page)
        self.username_input: Locator = page.locator("[data-testid='username-input']")
        self.password_input: Locator = page.locator("[data-testid='password-input']")
        self.login_btn: Locator = page.locator("[data-testid='login-btn']")
        self.error_message: Locator = page.locator("[data-testid='login-error']")

    def login(self, username: str, password: str) -> "DashboardPage":
        """登录并返回 DashboardPage 对象"""
        self.username_input.fill(username)
        self.password_input.fill(password)
        self.login_btn.click()
        self.page.wait_for_url("**/dashboard")
        # 注意：实际项目中需导入 DashboardPage
        return DashboardPage(self.page, self.base_url)

    def login_expecting_error(self, username: str, password: str) -> "LoginPage":
        """登录期望失败，返回自身继续断言错误信息"""
        self.username_input.fill(username)
        self.password_input.fill(password)
        self.login_btn.click()
        self.error_message.wait_for(state="visible")
        return self


# pages/dashboard_page.py（最小实现，演示链式调用）
from pages.base_page import BasePage
from pages.components.header import Header

class DashboardPage(BasePage):
    url = "/dashboard"

    def __init__(self, page, base_url):
        super().__init__(page, base_url)
        self.header = Header(page)
        self.welcome_message = page.locator("[data-testid='welcome-message']")
```

```python
# pages/product_list_page.py
from playwright.sync_api import Page, Locator
from pages.base_page import BasePage
from pages.components.header import Header
from pages.components.product_card import ProductCard

class ProductListPage(BasePage):
    url = "/products"

    def __init__(self, page: Page, base_url: str):
        super().__init__(page, base_url)
        self.header = Header(page)
        self.product_cards: Locator = page.locator("[data-testid='product-card']")
        self.category_filter: Locator = page.locator("[data-testid='category-filter']")
        self.sort_select: Locator = page.locator("[data-testid='sort-select']")
        self.no_results: Locator = page.locator("[data-testid='no-results']")

    def get_product(self, index: int) -> ProductCard:
        """获取第 index 个商品的 ProductCard 组件"""
        return ProductCard(self.product_cards.nth(index))

    def get_all_product_names(self) -> list[str]:
        """获取页面上所有商品的名称"""
        return self.product_cards.locator("[data-testid='product-name']").all_inner_texts()

    def get_first_product_name(self) -> str:
        """获取第一个商品的名称"""
        return self.product_cards.locator("[data-testid='product-name']").first.inner_text()

    def click_first_product(self):
        """点击第一个商品，进入详情页"""
        self.product_cards.locator("[data-testid='product-name']").first.click()
        self.page.wait_for_url("**/products/*")
        from pages.product_detail_page import ProductDetailPage
        return ProductDetailPage(self.page, self.base_url)

    def search(self, keyword: str) -> "ProductListPage":
        """通过 Header 组件搜索"""
        self.header.search(keyword)
        self.page.wait_for_load_state("networkidle")
        return self

    def filter_by_category(self, category: str) -> "ProductListPage":
        self.category_filter.select_option(category)
        self.page.wait_for_load_state("networkidle")
        return self

    def sort_by(self, option: str) -> "ProductListPage":
        self.sort_select.select_option(option)
        self.page.wait_for_load_state("networkidle")
        return self
```

```python
# pages/product_detail_page.py
from playwright.sync_api import Page
from pages.base_page import BasePage

class ProductDetailPage(BasePage):
    url = "/products"  # 实际 URL 需要拼接 product_id

    def __init__(self, page: Page, base_url: str):
        super().__init__(page, base_url)

    def navigate_to_product(self, product_id: int) -> "ProductDetailPage":
        self.page.goto(f"{self.base_url}/products/{product_id}")
        return self

    def get_product_name(self) -> str:
        return self.page.locator("[data-testid='product-name']").inner_text()

    def get_price_value(self) -> float:
        price_text = self.page.locator("[data-testid='product-price']").inner_text()
        return float(price_text.replace("¥", "").strip())

    def get_description(self) -> str:
        return self.page.locator("[data-testid='product-description']").inner_text()

    def select_quantity(self, qty: int) -> "ProductDetailPage":
        self.page.locator("[data-testid='quantity-select']").select_option(str(qty))
        return self

    def add_to_cart(self) -> "ProductDetailPage":
        self.page.locator("[data-testid='add-to-cart-btn']").click()
        self.page.locator("[data-testid='cart-notification']").wait_for(state="visible")
        return self
```

### conftest.py 中 fixture 与 PO 的协作

```python
# conftest.py
import pytest
from playwright.sync_api import Page, BrowserContext
from pages.login_page import LoginPage
from pages.product_list_page import ProductListPage

@pytest.fixture(scope="function")
def login_page(page: Page, base_url: str) -> LoginPage:
    """返回已导航至登录页的 LoginPage 对象"""
    lp = LoginPage(page, base_url)
    lp.navigate().wait_for_loaded()
    return lp

@pytest.fixture(scope="function")
def product_list_page(page: Page, base_url: str) -> ProductListPage:
    """返回已导航至商品列表页的 ProductListPage 对象"""
    plp = ProductListPage(page, base_url)
    plp.navigate().wait_for_loaded()
    return plp

@pytest.fixture(scope="function")
def logged_in_page(page: Page, base_url: str, test_user: dict) -> Page:
    """执行登录并返回已认证的 Page 对象"""
    lp = LoginPage(page, base_url)
    lp.navigate().wait_for_loaded()
    lp.login(test_user["username"], test_user["password"])
    return page
```

## 多环境 baseURL 切换

### 方式一：pytest-base-url 插件

```bash
pip install pytest-base-url
```

```ini
# pytest.ini
[pytest]
base_url = http://localhost:3000
```

```python
# conftest.py
@pytest.fixture(scope="function")
def product_list_page(page: Page, base_url: str) -> ProductListPage:
    plp = ProductListPage(page, base_url)
    plp.navigate().wait_for_loaded()
    return plp
```

命令行切换环境：

```bash
pytest --base-url https://staging.example.com
pytest --base-url https://prod.example.com
```

### 方式二：自定义 CLI 参数

```python
# conftest.py
def pytest_addoption(parser):
    parser.addoption("--env", default="dev", choices=["dev", "staging", "prod"])

@pytest.fixture(scope="session")
def base_url(request):
    env_urls = {
        "dev": "http://localhost:3000",
        "staging": "https://staging.example.com",
        "prod": "https://www.example.com",
    }
    return env_urls[request.config.getoption("--env")]
```

## 认证态复用：storageState

避免每个测试重新登录——将登录后的浏览器状态保存为文件：

```python
# conftest.py
import pytest
import os
from playwright.sync_api import BrowserContext, Page

AUTH_FILE = "auth.json"

@pytest.fixture(scope="session")
def browser_context(browser: "Browser") -> "BrowserContext":
    """创建或加载登录态"""
    if os.path.exists(AUTH_FILE):
        # 复用已保存的登录态
        context = browser.new_context(storage_state=AUTH_FILE)
    else:
        # 首次登录并保存状态
        context = browser.new_context()
        page = context.new_page()
        page.goto("http://localhost:3000/login")
        page.fill("[data-testid='username-input']", "testuser")
        page.fill("[data-testid='password-input']", "secret")
        page.click("[data-testid='login-btn']")
        page.wait_for_url("**/dashboard")
        context.storage_state(path=AUTH_FILE)
        page.close()
    yield context
    context.close()
```

:::tip
`storage_state` 保存的是整个浏览器上下文的完整状态——包括 cookies、localStorage、sessionStorage 和 IndexedDB。这意味着基于 token 和基于 cookie 的认证方案都可以复用。
:::

## 完整测试用例示例

```python
# tests/test_ecommerce.py
from playwright.sync_api import Page, expect

def test_search_and_add_to_cart(
    logged_in_page: Page,
    product_list_page: "ProductListPage",
):
    """端到端：登录 → 搜索商品 → 加入购物车 → 验证购物车数量"""
    # Given: 已登录用户在商品列表页
    plp = product_list_page

    # When: 搜索 "蓝牙耳机"
    plp.header.search("蓝牙耳机")

    # Then: 搜索结果至少有一个商品
    product_names = plp.get_all_product_names()
    assert len(product_names) > 0
    assert any("蓝牙" in name for name in product_names)

    # When: 将第一个商品加入购物车
    first_product = plp.get_product(0)
    product_name = first_product.get_name()
    first_product.add_to_cart()

    # Then: 购物车徽标显示数量
    expect(plp.header.cart_badge).to_have_text("1")

def test_login_with_invalid_credentials(login_page: "LoginPage"):
    """异常场景：无效凭据登录"""
    # When: 使用错误密码登录
    login_page.login_expecting_error("admin", "wrong_password")

    # Then: 显示错误消息
    expect(login_page.error_message).to_be_visible()
    expect(login_page.error_message).to_have_text("用户名或密码错误")
```

## PO 设计原则总结

| 原则             | 说明                                 | 反例                           |
| ---------------- | ------------------------------------ | ------------------------------ |
| 一个方法做一件事 | `login(user, pwd)` 只做登录          | `do_all_stuff()`               |
| 返回 PO 实现链式 | `login().search().add_to_cart()`     | 方法返回 `None`                |
| 断言不在 PO 里   | 断言留在测试用例中                   | PO 方法内写 `assert`           |
| 选择器集中定义   | `__init__` 顶部定义所有 Locator      | 方法内临时 `page.locator(...)` |
| nestable 组件    | Header/Footer/Sidebar 等复用为组件类 | 每个页面重复定义导航栏         |

:::tip 下一步
掌握了 PO 模式的设计原则后，建议阅读 [API 测试架构模式](./api-testing-patterns) 了解后端接口测试的分层策略，或查看 [真实场景实战案例](./scenarios) 了解 UI+API 混合测试的完整流程。
:::
