---
title: Python 自动化测试最佳实践
description: 使用 Claude Code 编写 Python Web UI 和 API 自动化测试的完整指南，涵盖 Playwright、pytest、httpx、Page Object 模式、数据驱动测试和调试技巧
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★★★  | ★★★☆☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★★    |

**🎯 学习产出：** 掌握 Python 自动化测试最佳实践，能独立用 Claude Code 编写 Playwright UI 和 httpx API 的高质量测试代码

**🚀 AI 能力提升：** 代码生成、测试生成
:::

# Python 自动化测试最佳实践

Claude Code 对 Python 生态（pytest、Playwright、httpx 等）有良好的支持。本文介绍如何使用 Claude Code 编写高质量的 Python Web UI 和 API 自动化测试，从环境搭建到调试排错的最佳实践。

:::info
本文聚焦 Python 测试编写本身——如何使用 Claude Code 作为助手高效生成、组织和维护测试代码，而非 Claude Code 的工具链集成。Python 的 Claude Code 工具链（LSP、CodeGraph、Serena、ECC 等）请参阅 [Python 测试工具链概览](/tips/python-practices/)。
:::

## 项目环境搭建

### Python 版本与虚拟环境

推荐 Python 3.11+，使用 `uv` 管理虚拟环境（更快的依赖安装）：

```bash
# 使用 uv 创建项目
uv init python-tests
cd python-tests
uv venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows PowerShell

# 安装测试核心依赖
uv add --dev pytest pytest-asyncio pytest-playwright pytest-xdist
uv add --dev httpx pydantic python-dotenv

# 安装 Playwright 浏览器
playwright install chromium
```

:::tip
**为什么推荐 uv 而不是 pip？** `uv` 的依赖安装速度比 pip 快 10-100 倍，且默认锁定依赖版本（类似 poetry.lock），适合需要可重复性的测试项目。
:::

### 项目目录结构

推荐的 Python 测试项目结构：

```
my-project-tests/
├── CLAUDE.md                  # Claude Code 项目约定
├── pyproject.toml             # 项目配置 + 依赖
├── pyrightconfig.json         # Python LSP 配置
├── conftest.py                # 根级 fixture（浏览器、客户端、base_url）
├── .env                       # 敏感数据（不提交 Git）
├── pages/                     # Page Object 类
│   ├── base_page.py
│   ├── login_page.py
│   └── components/            # 可复用组件
│       └── header.py
├── fixtures/                  # 自定义 fixture 模块
│   └── data_fixtures.py
├── data/                      # 测试数据
│   ├── users.py
│   └── products.py
├── utils/                     # 工具函数
│   ├── api_client.py
│   └── assertions.py
└── tests/                     # 测试用例
    ├── conftest.py
    ├── ui/
    │   ├── test_login.py
    │   └── test_checkout.py
    └── api/
        ├── test_users.py
        └── test_products.py
```

### CLAUDE.md 配置

在项目根目录创建 `CLAUDE.md`，声明 Python 版本、测试框架和约定：

````markdown title="CLAUDE.md"
# Python 自动化测试项目

## 技术栈

- Python 3.12 + uv 管理依赖
- pytest 作为测试框架，pytest-asyncio 运行异步测试
- Playwright + pytest-playwright 做 Web UI E2E 测试
- httpx + pydantic 做 API 接口测试

## 运行测试

```bash
uv run pytest tests/ -v                    # 运行所有测试
uv run pytest tests/ui/ -v --headed        # UI 测试可视化
uv run pytest tests/api/ -v -s             # API 测试打印日志
uv run pytest tests/ -n auto               # 并行运行
uv run pytest tests/ --tracing on          # 开启 Playwright Trace
```

## 测试约定

- 测试文件命名：`test_<模块名>.py`，放在 `tests/ui/` 或 `tests/api/` 下
- 测试函数命名：`test_<操作>_<预期结果>`，如 `test_login_with_valid_credentials`
- 使用 Page Object Model 封装页面操作
- API 测试使用 httpx.AsyncClient + pytest-asyncio
- 选择器优先级：`data-testid` > `role` > `label` > `placeholder` > CSS
- 禁止在测试用例中硬编码 URL，使用 `base_url` fixture
- 敏感数据用 `.env` 管理，不提交 Git
````

## Playwright UI 测试

### 基础入门

#### 安装与配置

```bash
uv add --dev pytest-playwright
playwright install chromium
```

```ini
# pytest.ini
[pytest]
asyncio_mode = auto
addopts = -v --tb=short
```

或使用 `pyproject.toml`：

```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
addopts = "-v --tb=short"
```

#### 第一个测试用例

```python
# tests/ui/test_first_test.py
from playwright.sync_api import Page, expect

def test_homepage_loads(page: Page):
    """验证首页能正常加载"""
    page.goto("http://localhost:3000")

    # 断言页面标题
    expect(page).to_have_title("我的电商网站")

    # 断言关键元素可见
    expect(page.locator("[data-testid='logo']")).to_be_visible()
    expect(page.locator("[data-testid='search-input']")).to_be_visible()

def test_search_functionality(page: Page):
    """验证搜索功能"""
    page.goto("http://localhost:3000")

    # 输入搜索关键词
    page.fill("[data-testid='search-input']", "蓝牙耳机")
    page.click("[data-testid='search-btn']")

    # 等待结果加载
    page.wait_for_selector("[data-testid='product-card']")

    # 验证搜索结果
    product_names = page.locator("[data-testid='product-name']").all_inner_texts()
    assert len(product_names) > 0
```

#### 内置 fixture

`pytest-playwright` 提供了以下内置 fixture：

| fixture        | scope    | 说明                                      |
| -------------- | -------- | ----------------------------------------- |
| `page`         | function | 每个测试独立的新页面                      |
| `browser`      | session  | 浏览器实例                                |
| `context`      | function | 浏览器上下文（隔离 cookies/localStorage） |
| `browser_name` | session  | 当前浏览器名称（chromium/firefox/webkit） |
| `browser_type` | session  | 浏览器类型对象                            |
| `playwright`   | session  | Playwright 实例                           |
| `is_chromium`  | function | 当前是否 Chromium                         |

:::info
不需要用 `--browser` 参数时，默认使用 Chromium。CI 中可通过 `--browser firefox` 或 `--browser webkit` 切换。
:::

#### 定位器策略

Playwright 定位器推荐按以下优先级选择：

```python
# 1. 角色定位（最稳定，反映语义）
page.get_by_role("button", name="登录")
page.get_by_role("heading", name="商品列表")
page.get_by_role("textbox", name="用户名")

# 2. 标签定位（表单元素）
page.get_by_label("邮箱地址")
page.get_by_label("记住我")

# 3. 占位符定位
page.get_by_placeholder("请输入搜索关键词")

# 4. 测试 ID（团队约定，最稳定的自定义方案）
page.locator("[data-testid='login-btn']")
page.locator("[data-testid='product-card']")

# 5. 文本内容（适合按钮/链接）
page.get_by_text("加入购物车")
page.get_by_text("立即购买", exact=True)

# 6. CSS / XPath（最后选择——容易因 UI 变更而断裂）
page.locator(".btn-primary")
page.locator("//button[@class='submit-btn']")
```

:::tip
`:has-text()` 和 `:text()` 已弃用。使用 `get_by_text()` 或 `get_by_role()` 替代。
:::

#### 常用操作

```python
# 点击
page.click("[data-testid='submit-btn']")
page.get_by_role("button", name="提交").click()

# 输入
page.fill("[data-testid='username']", "admin")
page.get_by_label("密码").fill("secret")

# 下拉选择
page.select_option("[data-testid='category']", "electronics")

# 勾选/取消勾选
page.check("[data-testid='agree-terms']")
page.uncheck("[data-testid='subscribe']")

# 等待
page.wait_for_selector("[data-testid='result-list']")
page.wait_for_url("**/dashboard")
page.wait_for_load_state("networkidle")

# 断言可见性
expect(page.locator("[data-testid='error-msg']")).to_be_visible()
expect(page.locator("[data-testid='loading']")).not_to_be_visible()

# 断言文本
expect(page.locator("[data-testid='title']")).to_have_text("商品详情")
expect(page.locator("[data-testid='price']")).to_contain_text("99")

# 断言 URL
expect(page).to_have_url("**/login")
```

#### 截图与视频

```python
# conftest.py 中配置自动截图
@pytest.fixture(scope="function")
def page(context: "BrowserContext") -> "Page":
    page = context.new_page()
    yield page
    # 测试失败时自动截图（简化示例）
    page.close()

# 或使用 Playwright 内置的视频录制
@pytest.fixture(scope="function")
def context(browser: "Browser") -> "BrowserContext":
    context = browser.new_context(
        record_video_dir="videos/",
        record_video_size={"width": 1280, "height": 720},
    )
    yield context
    context.close()
```

### 进阶实践

#### conftest.py 组织共享 fixture

使用分层 `conftest.py` 管理 fixture 的 visibility scope：

```
conftest.py                  # session 级别：base_url, browser
├── tests/conftest.py        # module 级别：共享测试数据
├── tests/ui/conftest.py     # UI 专用：login_page fixture
└── tests/api/conftest.py    # API 专用：auth_client fixture
```

**根 conftest.py**：

```python
# conftest.py（项目根）
import pytest
import os
from dotenv import load_dotenv

load_dotenv()

@pytest.fixture(scope="session")
def base_url():
    return os.getenv("BASE_URL", "http://localhost:3000")

@pytest.fixture(scope="session")
def api_base_url():
    return os.getenv("API_BASE_URL", "http://localhost:8000")
```

**tests/ui/conftest.py**：

```python
# tests/ui/conftest.py
import pytest
from playwright.sync_api import Page
from pages.login_page import LoginPage

@pytest.fixture(scope="function")
def login_page(page: Page, base_url: str) -> LoginPage:
    """返回已导航至登录页的 LoginPage 对象"""
    lp = LoginPage(page, base_url)
    lp.navigate().wait_for_loaded()
    return lp
```

**tests/api/conftest.py**：

```python
# tests/api/conftest.py
import pytest
from httpx import AsyncClient

@pytest.fixture(scope="session")
async def admin_token(api_base_url: str):
    """管理员 token——session 级别，只登录一次"""
    async with AsyncClient(base_url=api_base_url) as client:
        resp = await client.post("/api/auth/login", json={
            "username": "admin",
            "password": "admin_secret",
        })
        return resp.json()["access_token"]

@pytest.fixture(scope="function")
async def auth_client(api_base_url: str, admin_token: str):
    """带认证头的 httpx 客户端——每个测试独立"""
    async with AsyncClient(
        base_url=api_base_url,
        timeout=30.0,
        headers={"Authorization": f"Bearer {admin_token}"},
    ) as client:
        yield client
```

#### Page Object Model 基础

一个页面一个类，封装 locator 和 action：

```python
# pages/login_page.py
from playwright.sync_api import Page, Locator

class LoginPage:
    def __init__(self, page: Page, base_url: str):
        self.page = page
        self.url = f"{base_url}/login"
        # 所有选择器在类顶部集中定义
        self.username_input: Locator = page.locator("[data-testid='username-input']")
        self.password_input: Locator = page.locator("[data-testid='password-input']")
        self.login_btn: Locator = page.locator("[data-testid='login-btn']")
        self.error_msg: Locator = page.locator("[data-testid='login-error']")

    def navigate(self) -> "LoginPage":
        self.page.goto(self.url)
        return self

    def wait_for_loaded(self) -> "LoginPage":
        self.page.wait_for_load_state("networkidle")
        return self

    def login(self, username: str, password: str) -> Page:
        """登录并返回已认证的 Page 对象"""
        self.username_input.fill(username)
        self.password_input.fill(password)
        self.login_btn.click()
        self.page.wait_for_url("**/dashboard")
        return self.page

    def login_expecting_error(self, username: str, password: str) -> "LoginPage":
        """登录失败时返回自身，便于链式调用断言错误"""
        self.username_input.fill(username)
        self.password_input.fill(password)
        self.login_btn.click()
        self.error_msg.wait_for(state="visible")
        return self
```

:::tip
PO 的深度实践（BasePage 基类、嵌套组件、多页面链式调用、认证态复用）请参阅 [Page Object Model 深度实践](/tips/python-practices/playwright-pom)。
:::

#### CLI 选项与并行执行

```bash
# 可视化调试（显示浏览器窗口，放慢操作）
pytest tests/ui/ --headed --slowmo 1000

# 指定浏览器
pytest tests/ui/ --browser firefox
pytest tests/ui/ --browser webkit

# 开启 Trace（失败时自动保存 trace.zip）
pytest tests/ui/ --tracing on

# 并行执行
uv add --dev pytest-xdist
pytest tests/ -n auto
pytest tests/ui/ -n 4
```

:::warning
并行执行时，Playwright 默认每个 worker 使用自己的浏览器实例。确保 fixture 的 scope 不冲突——function scope 的 `page` fixture 天然隔离，但 module/session scope 的 fixture 在并行时可能竞争。
:::

## API 接口测试

### 为什么选 httpx

| 维度       | requests   | httpx                             |
| ---------- | ---------- | --------------------------------- |
| async 支持 | 需要额外库 | 原生 `AsyncClient`                |
| HTTP/2     | 不支持     | 原生支持                          |
| 超时控制   | 全局设置   | 细粒度（connect/read/write/pool） |
| 连接池     | 会话级     | 客户端级复用                      |
| 类型注解   | 不完整     | 完整 PEP 484 类型提示             |

对 pytest 异步测试而言，`httpx.AsyncClient` 配合 `pytest-asyncio` 是自然选择。

### 基础 fixture 结构

```python
# conftest.py
import pytest
from httpx import AsyncClient

@pytest.fixture(scope="session")
def api_base_url():
    import os
    return os.getenv("API_BASE_URL", "http://localhost:8000")

@pytest.fixture(scope="function")
async def client(api_base_url: str):
    """匿名客户端——每个测试独立"""
    async with AsyncClient(base_url=api_base_url, timeout=30.0) as c:
        yield c

@pytest.fixture(scope="function")
async def auth_client(api_base_url: str):
    """带认证的客户端"""
    async with AsyncClient(base_url=api_base_url, timeout=30.0) as c:
        # 先登录获取 token
        resp = await c.post("/api/auth/login", json={
            "username": "testuser",
            "password": "test_secret",
        })
        token = resp.json()["access_token"]
        c.headers["Authorization"] = f"Bearer {token}"
        yield c
```

### 请求方法测试

```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
class TestProductsAPI:
    """商品 API 测试"""

    async def test_list_products(self, client: AsyncClient):
        """GET /api/products — 查询商品列表"""
        resp = await client.get("/api/products")

        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data["items"], list)
        assert "total" in data

    async def test_get_product(self, client: AsyncClient, existing_product_id: int):
        """GET /api/products/{id} — 查询单个商品"""
        resp = await client.get(f"/api/products/{existing_product_id}")

        assert resp.status_code == 200
        assert resp.json()["id"] == existing_product_id

    async def test_create_product(self, auth_client: AsyncClient):
        """POST /api/products — 创建商品"""
        payload = {
            "name": "测试商品",
            "price": 99.00,
            "description": "这是一个测试商品",
        }
        resp = await auth_client.post("/api/products", json=payload)

        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == "测试商品"
        assert data["price"] == 99.00
        assert "id" in data

        # 清理
        await auth_client.delete(f"/api/products/{data['id']}")

    async def test_update_product(self, auth_client: AsyncClient, existing_product_id: int):
        """PUT /api/products/{id} — 更新商品"""
        resp = await auth_client.put(
            f"/api/products/{existing_product_id}",
            json={"price": 149.00},
        )

        assert resp.status_code == 200
        assert resp.json()["price"] == 149.00

    async def test_delete_product(self, auth_client: AsyncClient):
        """DELETE /api/products/{id} — 删除商品"""
        # 先创建一个商品
        create_resp = await auth_client.post("/api/products", json={
            "name": "待删除商品",
            "price": 9.99,
        })
        product_id = create_resp.json()["id"]

        # 删除
        resp = await auth_client.delete(f"/api/products/{product_id}")
        assert resp.status_code == 204

        # 验证已删除
        get_resp = await auth_client.get(f"/api/products/{product_id}")
        assert get_resp.status_code == 404
```

### 响应断言：状态码 + 字段 + Schema

```python
from pydantic import BaseModel, Field
from datetime import datetime

class ProductResponse(BaseModel):
    id: int
    name: str = Field(min_length=1, max_length=200)
    price: float = Field(gt=0)
    description: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

@pytest.mark.asyncio
async def test_product_schema_validation(client: AsyncClient, existing_product_id: int):
    """验证响应结构符合 ProductResponse 模型"""
    resp = await client.get(f"/api/products/{existing_product_id}")

    assert resp.status_code == 200
    # pydantic 自动校验所有字段类型和约束——类型不匹配直接抛 ValidationError
    product = ProductResponse(**resp.json())
    assert product.id == existing_product_id
    assert product.price > 0
    assert len(product.name) >= 1
```

### 数据驱动测试

```python
@pytest.mark.asyncio
@pytest.mark.parametrize("field, value, expected_status, expected_msg", [
    ("name", "", 422, "商品名称不能为空"),
    ("price", -1, 422, "价格必须大于 0"),
    ("price", 0, 422, "价格必须大于 0"),
    ("price", "not_a_number", 422, "价格必须是数字"),
    # 合法值
    ("name", "合法商品名", 201, None),
    ("price", 99.99, 201, None),
])
async def test_create_product_validation(
    auth_client: AsyncClient, field, value, expected_status, expected_msg
):
    """商品创建——参数化覆盖边界值和异常输入"""
    # 有效默认值
    payload = {"name": "测试商品", "price": 99.00}
    payload[field] = value

    resp = await auth_client.post("/api/products", json=payload)

    assert resp.status_code == expected_status
    if expected_msg:
        assert expected_msg in str(resp.json())
    else:
        # 创建成功，清理
        await auth_client.delete(f"/api/products/{resp.json()['id']}")
```

### 多接口编排：yield fixture

```python
@pytest.fixture(scope="function")
async def order_with_items(auth_client: AsyncClient, existing_product_id: int):
    """创建包含商品的订单——测试结束后自动取消"""
    # 创建订单
    resp = await auth_client.post("/api/orders", json={
        "items": [{"product_id": existing_product_id, "quantity": 2}],
    })
    assert resp.status_code == 201
    order = resp.json()

    yield order  # 测试用例获得 order

    # 清理（如果订单不是已完成状态则取消）
    try:
        await auth_client.post(f"/api/orders/{order['id']}/cancel")
    except Exception:
        pass  # 可能已被测试中取消

@pytest.mark.asyncio
async def test_order_status(auth_client: AsyncClient, order_with_items: dict):
    """测试订单创建后状态为 pending"""
    order_id = order_with_items["id"]
    resp = await auth_client.get(f"/api/orders/{order_id}")

    assert resp.status_code == 200
    assert resp.json()["status"] == "pending"
    assert len(resp.json()["items"]) == 1
```

:::tip
API 测试的架构模式（测试分层、响应验证三种层级、认证令牌管理、资源清理与幂等性）的深度内容请参阅 [API 测试架构模式](/tips/python-practices/api-testing-patterns)。
:::

## 测试数据与状态管理

### fixture scope 选择策略

| scope      | 生命周期      | 适用场景                    | 性能影响             |
| ---------- | ------------- | --------------------------- | -------------------- |
| `function` | 每个测试函数  | 需要完全隔离的操作（默认）  | 慢——每个测试重建     |
| `class`    | 每个测试类    | 类内测试共享前置条件        | 中等                 |
| `module`   | 每个 .py 文件 | 模块级共享的只读数据        | 快——一个文件创建一次 |
| `session`  | 整个测试套件  | 数据库连接、token、全局配置 | 最快——全体共享       |

```python
@pytest.fixture(scope="function")   # 默认，每个测试重建
def fresh_user(auth_client):
    user = create_user(auth_client, name="func_user")
    yield user
    delete_user(auth_client, user["id"])

@pytest.fixture(scope="class")      # 类内所有测试共享
def shared_user(auth_client):
    user = create_user(auth_client, name="class_user")
    yield user
    delete_user(auth_client, user["id"])

@pytest.fixture(scope="module")     # 模块内只读数据
def product_catalog():
    """只读的测试数据，不需要清理"""
    return [
        {"name": "商品A", "price": 9.99},
        {"name": "商品B", "price": 19.99},
        {"name": "商品C", "price": 29.99},
    ]

@pytest.fixture(scope="session")    # 全局：DB 连接、admin token
def db_connection():
    conn = create_db_connection()
    yield conn
    conn.close()
```

:::warning
`session` scope 的 fixture 在并行执行（`pytest -n auto`）时多个 worker 共享。确保 session fixture 是线程安全的——典型场景如 admin token（只读）、数据库连接（每个 worker 独立 schema）。
:::

### 测试数据工厂模式

**方式一：自定义 factory 函数**

```python
# data/factories.py
import uuid
from typing import Any

def make_user(**overrides: Any) -> dict[str, Any]:
    """生成用户测试数据，overrides 可覆盖任何字段"""
    unique = uuid.uuid4().hex[:8]
    return {
        "username": f"user_{unique}",
        "email": f"user_{unique}@example.com",
        "password": "TestPass123!",
        "full_name": f"Test User {unique}",
        **overrides,  # 覆盖默认值
    }

def make_product(**overrides: Any) -> dict[str, Any]:
    unique = uuid.uuid4().hex[:8]
    return {
        "name": f"测试商品 {unique}",
        "price": 99.00,
        "description": f"自动化测试生成的商品 {unique}",
        **overrides,
    }

# 使用
def test_with_custom_user(auth_client):
    user_data = make_user(
        username="vip_user",
        email="vip@example.com",
    )
    resp = await auth_client.post("/api/users", json=user_data)
    assert resp.status_code == 201
```

**方式二：factory_boy（复杂场景）**

```bash
uv add --dev factory-boy
```

```python
# data/factories.py
import factory
import uuid

class UserFactory(factory.Factory):
    class Meta:
        model = dict

    username = factory.LazyFunction(lambda: f"user_{uuid.uuid4().hex[:8]}")
    email = factory.LazyAttribute(lambda o: f"{o.username}@example.com")
    password = "TestPass123!"
    full_name = factory.Faker("name")
    is_active = True

class AdminUserFactory(UserFactory):
    role = "admin"

# 使用
def test_with_factory_boy():
    user = UserFactory(username="specific_user")
    admin = AdminUserFactory()
```

### 数据库状态管理

```python
# conftest.py
import pytest

@pytest.fixture(scope="function", autouse=True)
async def clean_database():
    """每个测试函数执行前后清理数据库——autouse 自动应用"""
    # 注意：生产项目中应指向测试数据库
    yield
    # 清理（测试后）

@pytest.fixture(scope="function")
async def seed_data(auth_client):
    """测试前种子数据，测试后清理"""
    # 创建种子数据
    products = []
    for i in range(3):
        resp = await auth_client.post("/api/products", json={
            "name": f"种子商品 {i}",
            "price": 10.0 * (i + 1),
        })
        products.append(resp.json())

    yield products

    # 清理种子数据
    for p in products:
        await auth_client.delete(f"/api/products/{p['id']}")
```

### 敏感数据管理

```bash
uv add --dev python-dotenv
```

```bash
# .env（不提交到 Git）
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:8000
TEST_ADMIN_USERNAME=admin
TEST_ADMIN_PASSWORD=admin_secret_do_not_use_in_prod
API_KEY=sk-test-1234567890
```

```python
# conftest.py
import os
from dotenv import load_dotenv

load_dotenv()  # 自动加载 .env 文件

@pytest.fixture(scope="session")
def admin_credentials():
    return {
        "username": os.getenv("TEST_ADMIN_USERNAME", "admin"),
        "password": os.getenv("TEST_ADMIN_PASSWORD", "changeme"),
    }
```

:::danger
永远不要把真实的密码、API Key、Token 写在代码或提交到 Git。`.env` 文件必须加到 `.gitignore` 中。CI 环境通过 Secrets 变量注入。
:::

### 测试隔离原则

1. **每个测试独立**——不依赖其他测试的执行结果或执行顺序
2. **不依赖数据库中的特定状态**——测试自己创建需要的数据
3. **用 `randomize` 确保顺序无关**——推荐使用 `pytest-randomly` 打乱测试顺序
4. **禁止 `test_02` 依赖 `test_01` 的副作用**——如果需要共享 setup，放到 fixture 中

## 提示词策略

### 编写高质量测试的通用原则

与手动编写代码相比，Claude Code 的测试生成有一些关键原则：

**1. 精确指定框架版本和 API**

```
❌ "帮我写一个登录页面的测试"
✅ "使用 Playwright + pytest 写一个登录页面的 UI 测试：
   - 使用 data-testid 选择器
   - 验证成功登录后跳转到 /dashboard
   - 验证密码错误时显示 '用户名或密码错误'
   - 使用 page fixture，不要手动创建 browser"
```

**2. 分层生成**

```
> 第一步：帮我搭建项目的 conftest.py，包含 base_url、page、auth_client 等核心 fixture
> 第二步：创建 LoginPage 的 Page Object 类，封装 login() 和 login_expecting_error()
> 第三步：编写登录成功和失败两个测试用例
> 第四步：用 parametrize 添加多个失败场景的测试
```

**3. 引用现有代码风格**

```
> 参考 tests/ui/test_checkout.py 中的代码风格和 fixture 用法，
> 为 ProductDetailPage 编写测试
```

### 提示词模板

#### 从零生成 Playwright UI 测试

```
> 使用 Playwright + pytest 编写 [页面名称] 的 UI 测试：
>
> 测试场景：
> - [场景1描述]
> - [场景2描述]
> - [场景3描述（异常场景）]
>
> 要求：
> - 使用同步 API（sync_playwright，不是 async）
> - 优先使用 data-testid 选择器
> - 每个测试前通过 fixture 导航到目标页面
> - 使用 expect() 做断言
> - 异常场景验证错误提示文案
> - 添加截图（page.screenshot）在关键步骤
```

#### 为已有页面编写 Page Object

```
> 为 [页面URL] 编写 Page Object 类：
>
> 页面包含以下元素：
> - [元素1]：[选择器]，[行为描述]
> - [元素2]：[选择器]，[行为描述]
> - [元素3]：[选择器]，[行为描述]
>
> 要求：
> - 类名 [ClassName]
> - __init__ 接收 page: Page 和 base_url: str
> - 封装常用操作（点击、输入、读取）为方法
> - 返回自身或关联 Page Object 实现链式调用
> - 参考 pages/ 目录下已有类的代码风格
```

#### 生成 API 接口测试

```
> 使用 httpx + pytest-asyncio 为以下 API 端点编写测试：
>
> [HTTP方法] [路径] — [描述]
> 请求体：
> {
>   "field1": "type1",
>   "field2": "type2"
> }
> 成功响应（状态码 [N]）：
> {
>   "id": int,
>   "field1": "string",
>   "created_at": "datetime"
> }
>
> 要求：
> - 使用 AsyncClient + base_url fixture
> - 测试正常创建 + 必填字段缺失 + 字段格式错误
> - 用 parametrize 覆盖所有校验规则
> - pydantic 模型验证响应结构
> - 测试后自动清理创建的数据
> - 参考 tests/api/test_products.py 的风格
```

#### 编写 conftest.py 共享 fixture

```
> 为 Python 测试项目创建 conftest.py：
>
> 需要的 fixture：
> - base_url（session scope，支持环境变量覆盖）
> - api_base_url（session scope）
> - admin_token（session scope，自动登录获取）
> - auth_client（function scope，自动注入 Authorization header）
> - test_user（function scope，创建测试用户并自动清理）
>
> 要求：
> - 使用 httpx.AsyncClient
> - session scope 的 fixture 要有清理逻辑
> - 使用 .env 管理敏感数据
> - 完整的类型注解
```

#### 调试失败测试

```
> 这个测试失败了，帮我分析原因并修复：
>
> [粘贴错误信息]
>
> 测试代码：
> [粘贴失败的测试]
>
> 相关的 fixture 和 PO 代码：
> [粘贴相关代码]
```

#### 重构测试代码

```
> 重构以下测试代码：
> 1. 提取重复的选择器为 Page Object
> 2. 提取重复的 fixture 到 conftest.py
> 3. 用 parametrize 合并相似参数组合的测试
> 4. 确保重构后所有现有测试通过
>
> [粘贴需要重构的代码]
```

## 自定义 Skills

Skills 是 Claude Code 的核心扩展机制——每个 Skill 是一个 `SKILL.md` 文件，包含结构化的提示词和工作流步骤。以下是三个 Python 测试专属的 Skill 推荐。

### playwright-tdd：Playwright UI 测试 TDD

```markdown title=".claude/skills/playwright-tdd/SKILL.md"
# Playwright TDD 工作流

为 Web UI 功能编写 Playwright 端到端测试的 TDD 工作流。

## 步骤

1. 分析需求——理解用户流程和关键断言点
2. 编写 Page Object（如果需要新页面）：
   - 在 `pages/` 下创建 PO 类
   - 继承 BasePage
   - 所有选择器使用 data-testid 优先
   - 添加 navigate()、wait_for_loaded() 方法
3. 编写测试用例（RED）：
   - 使用 project fixture（page、conftest 中的自定义 fixture）
   - 每个测试函数覆盖一个用户场景
   - 添加关键步骤截图
4. 运行测试确认失败：`uv run pytest tests/ui/ -v --headed`
5. 如果测试通过（UI 已就绪），则证明 UI 正确
6. 如果测试失败，分析错误截图和 Trace 修复
7. 运行全量测试确认无回归

## 约定

- 测试函数命名：`test_<动作>_<预期结果>`
- 使用 `expect()` 做所有断言
- PO 方法不包含断言——断言留在测试用例中
- 每个测试独立，不依赖其他测试的执行结果
```

### api-test-generator：API 接口测试生成器

```markdown title=".claude/skills/api-test-generator/SKILL.md"
# API 测试生成器

为 REST API 端点生成完整的 pytest + httpx 测试代码。

## 步骤

1. 理解 API 接口：
   - 如果有 OpenAPI/Swagger spec，读取并解析
   - 如果没有，询问：端点路径、HTTP 方法、请求体、认证方式、成功/失败响应
2. 生成 pydantic Schema（`schemas/` 目录）：
   - 为每个响应创建 BaseModel
   - 添加 Field 约束（min_length、gt、regex 等）
3. 生成测试类：
   - 正常流程测试（200/201）
   - 异常输入测试（422/400）
   - 认证测试（401/403）
   - 资源不存在测试（404）
4. 使用 parametrize 覆盖边界值
5. 添加清理逻辑（yield fixture 或 DELETE）
6. 运行测试确认：`uv run pytest tests/api/ -v`

## 约定

- 测试类命名：`Test<Resource>API`
- 使用 httpx.AsyncClient + pytest-asyncio
- base_url 通过 fixture 注入，不硬编码
- 响应用 pydantic 模型校验结构
- 每个测试类最后放 DELETE 清理
```

### test-data-builder：测试数据工厂生成

````markdown title=".claude/skills/test-data-builder/SKILL.md"
# 测试数据工厂生成器

为测试数据实体生成 factory 函数或 factory_boy Factory 类。

## 步骤

1. 分析实体——从已有代码或 API 响应中提取字段结构
2. 选择方式：
   - 简单实体（< 5 字段）：自定义 factory 函数 + uuid 唯一标识
   - 复杂实体（嵌套关联、多种变体）：factory_boy Factory 类
3. 生成 factory 代码，放在 `data/factories.py`
4. 确保所有字段有合理默认值
5. 支持 overrides 精确控制特定字段
6. 创建 conftest.py fixture 封装（可选）

## 示例

自定义 factory 函数：

```python
def make_user(**overrides):
    unique = uuid.uuid4().hex[:8]
    return {
        "username": f"user_{unique}",
        "email": f"user_{unique}@example.com",
        "password": "TestPass123!",
        **overrides,
    }
```
````

```

### 使用自定义 Skills

创建 SKILL.md 后，在 Claude Code 中通过斜杠命令调用：

```

> /playwright-tdd
> 为结账流程编写端到端测试：选择商品 → 加入购物车 → 填写地址 → 提交订单

```

```

> /api-test-generator
> 为用户管理 API 生成完整测试：POST /api/users, GET /api/users, GET /api/users/{id},
> PUT /api/users/{id}, DELETE /api/users/{id}，需要 admin token 认证

```

```

> /test-data-builder
> 为订单实体生成测试数据工厂，包含关联的商品和用户数据

```

:::tip
自定义 Skills 的核心价值在于**一致性**——无论哪个开发者使用，只要调用同一个 Skill，生成的结果都遵循相同的标准和步骤。建议将 SKILL.md 文件纳入版本控制（Git），作为团队测试规范的一部分。Skills 的基础知识请参考 [自定义技能](/skills/overview/custom-skills)。
:::

## 调试与排错

### 常见问题排查

#### 问题 1：元素不可见 / 不可交互

**症状**：
```

playwright.\_impl.\_errors.TimeoutError: Timeout 30000ms exceeded.
waiting for locator("[data-testid='submit-btn']") to be visible

````

**原因与解决**：

| 原因 | 解决方法 |
| --- | --- |
| 元素尚未渲染 | `page.wait_for_selector("[data-testid='submit-btn']")` 在操作前等待 |
| 元素被其他元素遮挡 | 点击前 `page.locator("[data-testid='modal-overlay']").wait_for(state="hidden")` |
| 元素在 iframe 中 | `page.frame_locator("iframe").locator("...")` |
| 元素在视口外需要滚动 | `page.locator("...").scroll_into_view_if_needed()` |
| 选择器写错 | 用 `playwright codegen` 重新获取正确的选择器 |

#### 问题 2：超时错误

```python
# expect 超时（默认 5 秒）
expect(page.locator("[data-testid='message']")).to_have_text("成功", timeout=10000)

# action 超时（默认 30 秒）
page.click("[data-testid='slow-btn']", timeout=60000)
````

:::tip
区分 action 超时和 expect 超时：action 超时说明按钮本身就是没出现；expect 超时说明按钮出现了但文案不对。前者优先检查页面加载和选择器，后者优先检查业务逻辑。
:::

#### 问题 3：浏览器上下文不匹配

**症状**：

```
Target closed
Error: Browser context has been closed
```

**原因**：

- 测试使用了 session scope 的 fixture，但 Playwright 的 context 是 function scope
- 手动调用了 `context.close()` 或 `page.close()` 但 fixture 后续还在使用

**解决**：始终使用 function scope 的 page fixture，不要在测试中手动关闭 page/context——Playwright 的 `pytest-playwright` 插件会自动管理。

#### 问题 4：选择器不稳定

```python
# ❌ 脆弱的 CSS 选择器（UI 框架自动生成的类名会变）
page.locator(".css-1x2y3z4")

# ✅ 稳定的选择器
page.locator("[data-testid='login-btn']")
page.get_by_role("button", name="登录")
page.get_by_label("用户名")
```

### Playwright Trace Viewer 完整使用指南

Trace Viewer 是调试 UI 测试失败的最强工具——它记录了测试执行的每一步，包括 DOM 快照、网络请求、控制台日志和时间线。

```bash
# 运行测试时开启 Trace
pytest tests/ui/ --tracing on

# 查看 Trace
playwright show-trace test-results/test-login-chromium/trace.zip
```

Trace Viewer 界面提供四个面板：

| 面板        | 内容                           | 用途                                |
| ----------- | ------------------------------ | ----------------------------------- |
| Actions     | 所有 Playwright 操作的逐步列表 | 精确看到哪一步操作后失败了          |
| Screenshots | 每一步操作前后的 DOM 截图      | 直观对比预期 vs 实际                |
| Network     | 所有网络请求和响应             | 检查 API 调用是否成功、数据是否正确 |
| Console     | 浏览器控制台日志               | 检查 JS 错误和自定义日志            |

### 可视化调试

```bash
# 显示浏览器窗口，每步操作间隔 1 秒
pytest tests/ui/ -s --headed --slowmo 1000

# 仅运行失败的测试
pytest tests/ --lf

# 失败时进入 pdb 调试器（检查当前页面状态）
pytest tests/ --trace
```

### Playwright Codegen 录制辅助

`playwright codegen` 可以录制你的浏览器操作并生成 Playwright 代码：

```bash
# 打开录制工具
playwright codegen http://localhost:3000

# 指定输出语言和选择器偏好
playwright codegen --target python-pytest --test-id-attribute data-testid http://localhost:3000
```

在打开的浏览器中进行操作，Codegen 会实时生成对应的 Python 测试代码。这对以下场景特别有用：

- 不确定选择器怎么写——看 Codegen 生成的 locator
- 复杂交互（拖拽、文件上传、多步骤表单）——录制后在此基础上修改
- 快速生成测试框架代码——录制核心流程，手动添加断言和 parametrize

### pytest 调试技巧

```bash
# 显示 print() 输出（默认 pytest 会捕获 stdout）
pytest tests/ -s

# 仅运行上一次失败的测试
pytest tests/ --lf

# 在第一个失败处停止
pytest tests/ -x

# 失败时自动进入 pdb
pytest tests/ --trace

# 运行最慢的 N 个测试
pytest tests/ --durations=10

# 输出详细失败信息（包括局部变量）
pytest tests/ --tb=long

# 按关键字筛选测试
pytest tests/ -k "login"
pytest tests/ -k "login or register"
pytest tests/ -k "not slow"
```

### 网络拦截与 Mock

在 UI 测试中 mock API 响应，避免依赖后端状态：

```python
def test_ui_with_mocked_api(page: Page, base_url: str):
    """UI 测试中 mock 后端 API 响应，确保测试独立性"""
    # Mock GET /api/products 返回固定数据
    page.route("**/api/products", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='''{
            "items": [
                {"id": 1, "name": "Mock商品A", "price": 99.00},
                {"id": 2, "name": "Mock商品B", "price": 199.00}
            ],
            "total": 2
        }''',
    ))

    page.goto(f"{base_url}/products")

    # UI 应该显示 mock 的 2 个商品
    products = page.locator("[data-testid='product-card']")
    expect(products).to_have_count(2)

    # 验证显示的是 mock 数据
    expect(page.locator("[data-testid='product-name']").first).to_have_text("Mock商品A")

# 按 URL 部分 mock
def test_partial_mock(page: Page):
    # 只 mock 搜索 API，其他 API 正常访问
    page.route("**/api/products?search=*", lambda route: route.fulfill(
        status=200,
        json={"items": [], "total": 0},
    ))

# 修改真实响应（不替换，仅修改部分字段）
def test_modify_response(page: Page, base_url: str):
    def handle_route(route):
        response = route.fetch()  # 获取真实响应
        body = response.json()
        body["items"][0]["price"] = 999.99  # 修改第一个商品的价格
        route.fulfill(response=response, json=body)

    page.route("**/api/products", handle_route)
    page.goto(f"{base_url}/products")
```
