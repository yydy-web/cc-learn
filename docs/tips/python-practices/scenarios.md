---
title: Python 测试实战案例
description: Python 自动化测试完整实战案例——电商 Web UI 端到端、REST API CRUD 全流程、UI+API 混合测试，包含完整代码和 Claude Code 提示词
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★★★☆☆ |
| 🧪 测试 | ★★★★★ | ★★★☆☆ |
| 📦 产品 | ★★☆☆☆ | ★★★★★ |

**🎯 学习产出：** 掌握 Python 测试实战，能独立完成电商 UI E2E、REST API CRUD、UI+API 混合测试全流程

**🚀 AI 能力提升：** 测试生成、自动化工作流
:::

# Python 测试实战案例

本文提供 3 个完整的 Python 自动化测试实战案例，每个案例包含从需求描述、提示词、完整代码到运行验证的全流程。案例覆盖 Web UI E2E、REST API CRUD 和 UI+API 混合测试三种最经典的测试场景。

:::info
本文是 [Python 测试工具链概览](./index) 的实战补充。PO 模式详解请参考 [Page Object Model 深度实践](./playwright-pom)，API 测试架构请参考 [API 测试架构模式](./api-testing-patterns)。
:::

## 场景一：电商 Web UI 端到端测试

### 业务流程

```
首页 → 搜索"无线耳机"→ 点击第一个商品 → 进入详情页
→ 选择数量为 2 → 加入购物车 → 进入购物车 → 验证商品和数量
→ 点击结算 → 进入结算页 → 填写收货地址 → 提交订单 → 验证成功提示
```

### 项目结构

```
ecommerce-tests/
├── conftest.py              # 共享 fixture
├── pages/
│   ├── base_page.py
│   ├── home_page.py
│   ├── product_detail_page.py
│   ├── cart_page.py
│   └── checkout_page.py
├── pages/components/
│   └── header.py
├── data/
│   └── users.py             # 测试用户数据
└── tests/
    ├── conftest.py
    └── test_e2e_checkout.py
```

### Claude Code 提示词

```
> 为电商网站编写 Playwright + pytest 端到端测试：
>
> 测试流程：首页 → 搜索"无线耳机" → 点击第一个商品 → 数量选 2 → 加入购物车
> → 进入购物车验证商品和数量 → 结算 → 填写地址 → 提交订单 → 验证成功
>
> 要求：
> - 使用 Page Object Model，每个页面一个类
> - BasePage 封装 navigate()、wait_for_loaded()、screenshot()
> - 共享组件（Header）提取为独立类
> - conftest.py 管理 fixture 层级
> - 测试数据（用户、地址）放在 data/ 目录
> - 每个关键步骤添加截图
> - 使用 data-testid 作为首选选择器
```

### 完整代码

**`conftest.py`**（项目根）：

```python
import pytest
from playwright.sync_api import Page, BrowserContext

BASE_URL = "http://localhost:3000"

@pytest.fixture(scope="session")
def browser_context(browser: "Browser") -> "BrowserContext":
    """session 级别，共享浏览器上下文"""
    context = browser.new_context(
        viewport={"width": 1440, "height": 900},
        locale="zh-CN",
    )
    yield context
    context.close()

@pytest.fixture(scope="function")
def page(browser_context: BrowserContext) -> Page:
    """每个测试独立的新页面"""
    page = browser_context.new_page()
    yield page
    page.close()

@pytest.fixture(scope="function")
def home_page(page: Page) -> "HomePage":
    """导航到首页并等待加载完成"""
    from pages.home_page import HomePage
    hp = HomePage(page, BASE_URL)
    hp.navigate().wait_for_loaded()
    return hp

@pytest.fixture(scope="function")
def logged_in_home_page(page: Page) -> "HomePage":
    """已登录用户的首页"""
    from pages.home_page import HomePage
    from pages.login_page import LoginPage
    from data.users import TEST_USER

    hp = HomePage(page, BASE_URL)
    hp.navigate()
    hp.header.go_to_login()
    lp = LoginPage(page, BASE_URL)
    lp.login(TEST_USER["username"], TEST_USER["password"])
    return hp
```

**`tests/test_e2e_checkout.py`**：

```python
from playwright.sync_api import Page, expect
from pages.home_page import HomePage
from pages.product_detail_page import ProductDetailPage
from pages.cart_page import CartPage
from pages.checkout_page import CheckoutPage

def test_complete_checkout_flow(logged_in_home_page: HomePage):
    """
    完整购物流程 E2E 测试
    首页 → 搜索 → 商品详情 → 加购 → 购物车 → 结算 → 提交订单
    """
    hp = logged_in_home_page

    # === Step 1: 搜索商品 ===
    hp.header.search("无线耳机")
    hp.screenshot("01-search-results")

    # 验证搜索结果
    assert len(hp.get_all_product_names()) > 0
    first_product_name = hp.get_first_product_name()

    # === Step 2: 进入商品详情页 ===
    pdp = hp.click_first_product()
    pdp.wait_for_loaded()
    pdp.screenshot("02-product-detail")

    # 验证详情页
    assert pdp.get_product_name() == first_product_name
    assert pdp.get_price_value() > 0

    # === Step 3: 选择数量并加入购物车 ===
    pdp.select_quantity(2)
    pdp.add_to_cart()
    pdp.screenshot("03-added-to-cart")

    # === Step 4: 进入购物车验证 ===
    cart = CartPage(hp.page, hp.base_url)
    cart.navigate().wait_for_loaded()
    cart.screenshot("04-cart")

    cart_items = cart.get_item_names()
    assert first_product_name in cart_items
    assert cart.get_item_quantity(first_product_name) == 2

    # === Step 5: 进入结算页 ===
    checkout = cart.proceed_to_checkout()
    checkout.screenshot("05-checkout")

    # === Step 6: 填写收货地址 ===
    from data.users import SHIPPING_ADDRESS
    checkout.fill_shipping_address(SHIPPING_ADDRESS)
    checkout.screenshot("06-address-filled")

    # === Step 7: 提交订单 ===
    checkout.select_payment_method("credit_card")
    order_confirmation = checkout.submit_order()
    order_confirmation.screenshot("07-order-confirmed")

    # === Step 8: 验证订单成功 ===
    expect(order_confirmation.success_icon).to_be_visible()
    expect(order_confirmation.order_number).to_be_visible()
    assert order_confirmation.get_order_status() == "已下单"
```

### 运行与调试

```bash
# 带界面运行（可视化调试）
pytest tests/test_e2e_checkout.py -s --headed --slowmo 1000

# 开启 Trace（失败时自动保存）
pytest tests/test_e2e_checkout.py --tracing on

# 查看失败 Trace
playwright show-trace test-results/.../trace.zip

# 并行运行所有 UI 测试
pytest tests/ -n auto --headed
```

## 场景二：REST API CRUD 全流程

### 测试目标

以用户管理 API 为例，完整测试 CRUD 操作链：

```
POST /api/auth/register  → 创建用户
GET  /api/users/{id}     → 查询用户
PUT  /api/users/{id}     → 更新用户
GET  /api/users/{id}     → 验证更新
POST /api/auth/login     → 登录验证
DELETE /api/users/{id}   → 删除用户
GET  /api/users/{id}     → 验证删除（404）
```

### Claude Code 提示词

```
> 为 REST API 用户管理模块编写 pytest + httpx 接口测试：
>
> 测试 CRUD 完整流程：注册 → 查询 → 更新 → 验证更新 → 登录 → 删除 → 验证删除
>
> 要求：
> - 使用 pytest-asyncio + httpx.AsyncClient
> - base_url 通过 fixture 注入，支持环境变量覆盖
> - pydantic 模型校验响应结构
> - conftest.py 中 session scope fixture 管理 admin token
> - 每一个 API 调用断言状态码 + 关键字段 + 结构校验
> - 使用 parametrize 覆盖字段校验的边界值
> - 数据驱动测试覆盖创建用户的异常输入场景
```

### 完整代码

**`conftest.py`**：

```python
import pytest
import os
from httpx import AsyncClient

@pytest.fixture(scope="session")
def base_url():
    return os.getenv("API_BASE_URL", "http://localhost:8000")

@pytest.fixture(scope="session")
async def admin_token(base_url: str):
    """管理员 token——整个 session 只登录一次"""
    async with AsyncClient(base_url=base_url) as client:
        resp = await client.post("/api/auth/login", json={
            "username": "admin",
            "password": os.getenv("ADMIN_PASSWORD", "admin123"),
        })
        assert resp.status_code == 200
        return resp.json()["access_token"]

@pytest.fixture
async def client(base_url: str):
    """匿名客户端"""
    async with AsyncClient(base_url=base_url, timeout=30.0) as c:
        yield c

@pytest.fixture
async def auth_client(base_url: str, admin_token: str):
    """管理员客户端"""
    async with AsyncClient(
        base_url=base_url,
        timeout=30.0,
        headers={"Authorization": f"Bearer {admin_token}"},
    ) as c:
        yield c

@pytest.fixture
async def created_user(auth_client: AsyncClient):
    """创建测试用户并在测试结束后自动删除"""
    import uuid
    unique = uuid.uuid4().hex[:8]
    payload = {
        "username": f"test_user_{unique}",
        "email": f"test_{unique}@example.com",
        "password": "TestPass123!",
        "full_name": "Test User",
    }
    resp = await auth_client.post("/api/auth/register", json=payload)
    assert resp.status_code == 201
    user = resp.json()
    yield user
    # 清理
    await auth_client.delete(f"/api/users/{user['id']}")
```

**`tests/api/test_user_crud.py`**：

```python
import pytest
from httpx import AsyncClient
from schemas.user import UserResponse

@pytest.mark.asyncio
class TestUserCRUD:
    """用户管理 CRUD 测试"""

    async def test_01_register_user(self, auth_client: AsyncClient):
        """POST /api/auth/register — 创建用户"""
        import uuid
        unique = uuid.uuid4().hex[:8]
        payload = {
            "username": f"crud_test_{unique}",
            "email": f"crud_{unique}@example.com",
            "password": "TestPass123!",
            "full_name": "CRUD Test User",
        }
        resp = await auth_client.post("/api/auth/register", json=payload)

        assert resp.status_code == 201
        user = UserResponse(**resp.json())
        assert user.username == payload["username"]
        assert user.email == payload["email"]
        assert "password" not in resp.json()

        # 存储供后续测试使用
        TestUserCRUD.test_user_id = user.id

    async def test_02_get_user(self, auth_client: AsyncClient):
        """GET /api/users/{id} — 查询用户"""
        resp = await auth_client.get(
            f"/api/users/{TestUserCRUD.test_user_id}"
        )

        assert resp.status_code == 200
        user = UserResponse(**resp.json())
        assert user.id == TestUserCRUD.test_user_id
        assert user.is_active is True

    async def test_03_update_user(self, auth_client: AsyncClient):
        """PUT /api/users/{id} — 更新用户"""
        payload = {"full_name": "Updated Name", "bio": "New bio"}
        resp = await auth_client.put(
            f"/api/users/{TestUserCRUD.test_user_id}", json=payload
        )

        assert resp.status_code == 200
        user = resp.json()
        assert user["full_name"] == "Updated Name"
        assert user["bio"] == "New bio"

    async def test_04_verify_update(self, auth_client: AsyncClient):
        """GET /api/users/{id} — 验证更新持久化"""
        resp = await auth_client.get(
            f"/api/users/{TestUserCRUD.test_user_id}"
        )

        assert resp.status_code == 200
        assert resp.json()["full_name"] == "Updated Name"

    async def test_05_delete_user(self, auth_client: AsyncClient):
        """DELETE /api/users/{id} — 删除用户"""
        resp = await auth_client.delete(
            f"/api/users/{TestUserCRUD.test_user_id}"
        )
        assert resp.status_code == 204

    async def test_06_verify_deleted(self, auth_client: AsyncClient):
        """GET /api/users/{id} — 验证删除后返回 404"""
        resp = await auth_client.get(
            f"/api/users/{TestUserCRUD.test_user_id}"
        )
        assert resp.status_code == 404
```

### JSON Schema 响应验证

```python
# schemas/user.py
from pydantic import BaseModel, Field
from datetime import datetime

class UserResponse(BaseModel):
    id: int
    username: str = Field(min_length=3, max_length=50)
    email: str
    full_name: str | None = None
    bio: str | None = None
    is_active: bool
    role: str
    created_at: datetime
    updated_at: datetime

class UserListResponse(BaseModel):
    items: list[UserResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
```

## 场景三：UI + API 混合测试

### 测试思路

```
API 创建测试数据 → UI 验证页面展示 → API 清理数据
```

这种模式避免了纯 UI 测试对测试数据的依赖——测试数据由 API 精确控制，UI 只负责验证展示效果。

### Claude Code 提示词

```
> 编写 Python 混合测试，API + UI 协作：
>
> 流程：
> 1. 先用 httpx 调用 POST /api/products 创建 3 个测试商品（名称含品牌标识便于识别）
> 2. 再用 Playwright 打开商品列表页，验证这 3 个商品正确显示（名称、价格）
> 3. 点击第一个商品进入详情页，验证详情页数据与 API 返回一致
> 4. 测试完成后用 httpx DELETE 清理测试数据
>
> 要求：
> - API 和 UI 部分使用独立的 fixture
> - 共用一个声明了 scope='module' 的 fixture 传递测试数据
> - UI 部分使用 Page Object Model
```

### 完整代码

```python
# tests/test_hybrid_product.py
import pytest
from httpx import AsyncClient
from playwright.sync_api import Page
from pages.product_list_page import ProductListPage
from pages.product_detail_page import ProductDetailPage

@pytest.fixture(scope="module")
def test_products():
    """module 级别——本模块所有测试共享的测试数据"""
    return [
        {
            "name": "混合测试-商品A",
            "price": 99.00,
            "description": "API 创建的商品 A",
        },
        {
            "name": "混合测试-商品B",
            "price": 199.00,
            "description": "API 创建的商品 B",
        },
        {
            "name": "混合测试-商品C",
            "price": 299.00,
            "description": "API 创建的商品 C",
        },
    ]

@pytest.fixture(scope="module")
async def api_created_products(
    auth_client: AsyncClient, test_products: list[dict]
):
    """通过 API 创建测试商品，测试结束后清理"""
    created = []
    for product in test_products:
        resp = await auth_client.post("/api/products", json=product)
        assert resp.status_code == 201
        created.append(resp.json())

    yield created

    # 清理所有创建的商品
    for product in created:
        await auth_client.delete(f"/api/products/{product['id']}")

def test_ui_displays_api_created_products(
    page: Page,
    api_created_products: list[dict],
    test_products: list[dict],
):
    """UI 验证：API 创建的商品正确显示在列表页"""
    # Given: 3 个商品已通过 API 创建
    plp = ProductListPage(page, "http://localhost:3000")
    plp.navigate().wait_for_loaded()

    # When: 获取页面上的商品名称
    displayed_names = plp.get_all_product_names()

    # Then: 所有 API 创建的商品都显示在页面上
    for product in test_products:
        assert product["name"] in displayed_names, (
            f"商品 '{product['name']}' 未在列表页显示"
        )

def test_ui_product_detail_matches_api_data(
    page: Page,
    api_created_products: list[dict],
):
    """UI 验证：商品详情页的数据与 API 一致"""
    # Given: API 创建的第一个商品
    api_product = api_created_products[0]

    # When: UI 打开该商品的详情页
    pdp = ProductDetailPage(page, "http://localhost:3000")
    pdp.navigate_to_product(api_product["id"]).wait_for_loaded()

    # Then: UI 显示的数据与 API 数据一致
    assert pdp.get_product_name() == api_product["name"]
    assert pdp.get_price_value() == api_product["price"]
    assert pdp.get_description() == api_product["description"]
```

:::tip
UI + API 混合测试的核心优势在于**数据可控性**。纯 UI 测试依赖数据库中已存在的数据（不可控），纯 API 测试不验证前端展示（不全面）。混合模式是两者的最佳平衡：API 精确创建数据，UI 验证展示，API 清理收尾。
:::
