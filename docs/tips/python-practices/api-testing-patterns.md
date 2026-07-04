---
title: API 测试架构模式
description: pytest + httpx 下的 API 测试分层策略、响应验证层级、认证令牌管理、资源清理模式和幂等性保障的完整实践指南
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★★★☆☆ |
| 🧪 测试 | ★★★★★ | ★★★☆☆ |
| 📦 产品 | ★★☆☆☆ | ★★★★★ |

**🎯 学习产出：** 掌握 API 测试模式，能独立设计分层 API 测试架构并实现资源清理和幂等性保障

**🚀 AI 能力提升：** 测试生成
:::

# API 测试架构模式

本文介绍使用 pytest + httpx 进行 API 接口测试的架构模式。从单个接口的原子测试到多接口编排的流程测试，从基础断言到 pydantic 模型验证，覆盖真实项目中 API 测试的核心挑战。

:::info
本文是 [Python 测试工具链概览](./index) 的深度实践子页面。API 测试的基础用法（fixture、parametrize、httpx 入门）请参阅 [Python 自动化测试最佳实践](/tips/python-best-practices#api-接口测试)。
:::

## 测试分层策略

### 第一层：原子测试

测试单个 API 端点的基本行为——每个测试只测一个端点的一个方面。

```python
# tests/api/test_users.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_user_by_id(client: AsyncClient, existing_user: dict):
    """GET /api/users/{id} — 查询存在的用户"""
    response = await client.get(f"/api/users/{existing_user['id']}")

    assert response.status_code == 200
    data = response.json()
    assert data["username"] == existing_user["username"]
    assert data["email"] == existing_user["email"]

@pytest.mark.asyncio
async def test_get_user_not_found(client: AsyncClient):
    """GET /api/users/{id} — 查询不存在的用户"""
    response = await client.get("/api/users/99999")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()

@pytest.mark.asyncio
async def test_create_user_success(auth_client: AsyncClient):
    """POST /api/users — 成功创建用户"""
    payload = {
        "username": "newuser",
        "email": "new@example.com",
        "password": "Str0ng!Pass",
    }

    response = await auth_client.post("/api/users", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert "id" in data
    assert "password" not in data  # 响应中不应包含密码

    # 清理
    await auth_client.delete(f"/api/users/{data['id']}")
```

### 第二层：流程测试

多个 API 接口串联，模拟真实的业务流程。

```python
# tests/api/test_user_workflow.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_user_lifecycle(client: AsyncClient):
    """用户完整生命周期：注册 → 登录 → 查询个人信息 → 更新 → 删除"""
    # Step 1: 注册
    register_payload = {
        "username": "lifecycle_user",
        "email": "lifecycle@example.com",
        "password": "TestPass123!",
    }
    response = await client.post("/api/auth/register", json=register_payload)
    assert response.status_code == 201
    user_id = response.json()["id"]

    # Step 2: 登录获取 token
    login_payload = {"username": "lifecycle_user", "password": "TestPass123!"}
    response = await client.post("/api/auth/login", json=login_payload)
    assert response.status_code == 200
    token = response.json()["access_token"]

    # Step 3: 用 token 查询个人信息
    headers = {"Authorization": f"Bearer {token}"}
    response = await client.get(f"/api/users/{user_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "lifecycle@example.com"

    # Step 4: 更新个人简介
    update_payload = {"bio": "Test account for lifecycle"}
    response = await client.patch(
        f"/api/users/{user_id}", json=update_payload, headers=headers
    )
    assert response.status_code == 200
    assert response.json()["bio"] == "Test account for lifecycle"

    # Step 5: 删除用户
    response = await client.delete(f"/api/users/{user_id}", headers=headers)
    assert response.status_code == 204

    # Step 6: 验证删除后不可查询
    response = await client.get(f"/api/users/{user_id}", headers=headers)
    assert response.status_code == 404
```

### 第三层：数据驱动测试

使用 `@pytest.mark.parametrize` 覆盖边界值和异常输入。

```python
# tests/api/test_validation.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
@pytest.mark.parametrize("field, value, expected_error", [
    ("username", "", "用户名不能为空"),
    ("username", "ab", "用户名至少 3 个字符"),
    ("username", "a" * 51, "用户名最多 50 个字符"),
    ("email", "", "邮箱不能为空"),
    ("email", "not-an-email", "邮箱格式不正确"),
    ("email", "test@example.com", None),  # 有效值不应报错
    ("password", "", "密码不能为空"),
    ("password", "12345", "密码至少 8 个字符"),
    ("password", "no-upper-1", "密码必须包含大写字母"),
])
async def test_register_validation(
    client: AsyncClient, field: str, value: str, expected_error: str | None
):
    """注册接口的字段校验——参数化覆盖所有规则"""
    payload = {
        "username": "validuser",
        "email": "valid@example.com",
        "password": "ValidPass1!",
    }
    payload[field] = value  # 只替换被测试的字段

    response = await client.post("/api/auth/register", json=payload)

    if expected_error is None:
        assert response.status_code == 201
    else:
        assert response.status_code == 422
        errors = response.json()["detail"]
        assert any(expected_error in err["msg"] for err in errors)
```

## 响应验证三种层级

### 层级一：基础断言（状态码 + 关键字段）

```python
response = await client.get(f"/api/users/{user_id}")
assert response.status_code == 200
data = response.json()
assert data["username"] == expected_username
assert "id" in data
assert "created_at" in data
```

### 层级二：结构验证（pydantic 模型）

```python
# schemas/user.py
from pydantic import BaseModel, Field
from datetime import datetime

class UserResponse(BaseModel):
    id: int
    username: str = Field(min_length=3, max_length=50)
    email: str
    bio: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

class PaginatedUsersResponse(BaseModel):
    items: list[UserResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

# tests/api/test_users.py
from schemas.user import UserResponse

@pytest.mark.asyncio
async def test_get_user_response_matches_schema(
    client: AsyncClient, existing_user: dict
):
    """验证响应结构符合 UserResponse 模型"""
    response = await client.get(f"/api/users/{existing_user['id']}")

    assert response.status_code == 200
    # pydantic 自动校验所有字段类型和约束
    user = UserResponse(**response.json())
    assert user.username == existing_user["username"]
```

### 层级三：语义验证（字段值合法性）

```python
@pytest.mark.asyncio
async def test_user_response_semantic_checks(
    client: AsyncClient, existing_user: dict
):
    """验证响应字段值的语义合法性"""
    response = await client.get(f"/api/users/{existing_user['id']}")
    data = response.json()

    # 时间字段格式正确
    from datetime import datetime
    datetime.fromisoformat(data["created_at"])
    datetime.fromisoformat(data["updated_at"])

    # created_at 不应晚于 updated_at
    assert data["created_at"] <= data["updated_at"]

    # email 包含 @
    assert "@" in data["email"]

    # id 是正整数
    assert isinstance(data["id"], int) and data["id"] > 0
```

## httpx fixture 封装

推荐封装一个功能完备的 `client` fixture，自动注入 base_url、认证头、超时和日志：

```python
# conftest.py
import pytest
import logging
from httpx import AsyncClient

logger = logging.getLogger(__name__)

@pytest.fixture(scope="session")
def base_url() -> str:
    """API 基础 URL——可通过环境变量覆盖"""
    import os
    return os.getenv("API_BASE_URL", "http://localhost:8000")

@pytest.fixture(scope="session")
async def admin_token(base_url: str) -> str:
    """管理员 token——session 级别，整个测试套件只登录一次"""
    async with AsyncClient(base_url=base_url) as client:
        response = await client.post("/api/auth/login", json={
            "username": "admin",
            "password": "admin_secret",
        })
        assert response.status_code == 200
        return response.json()["access_token"]

@pytest.fixture(scope="function")
async def client(base_url: str) -> AsyncClient:
    """每个测试函数独立的 httpx 客户端——无认证头"""
    async with AsyncClient(
        base_url=base_url,
        timeout=30.0,
    ) as client:
        yield client

@pytest.fixture(scope="function")
async def auth_client(base_url: str, admin_token: str) -> AsyncClient:
    """带管理员认证头的 httpx 客户端"""
    async with AsyncClient(
        base_url=base_url,
        timeout=30.0,
        headers={"Authorization": f"Bearer {admin_token}"},
    ) as client:
        yield client
```

:::tip
`AsyncClient` 支持 `base_url` 参数，之后调用 `client.get("/api/users")` 时自动拼接完整 URL。避免在每个测试中硬编码 `http://localhost:8000`——方便 CI 环境通过环境变量切换。
:::

## 认证令牌管理

### 模式：session scope fixture 登录一次

```python
# conftest.py
@pytest.fixture(scope="session")
async def admin_token(base_url: str) -> str:
    """整个测试套件只登录一次，所有测试复用同一个 token"""
    async with AsyncClient(base_url=base_url) as client:
        resp = await client.post("/api/auth/login", json={
            "username": "admin",
            "password": "admin_secret",
        })
        assert resp.status_code == 200
        return resp.json()["access_token"]
```

:::warning
如果 API 的 token 有过期时间，session scope 的 token 可能在长测试套件中过期（超过默认 30-60 分钟）。此时降级为 module scope，并在 token 过期时自动刷新。
:::

### 自动刷新过期 token

```python
@pytest.fixture(scope="module")
async def auth_client_with_refresh(base_url: str):
    """自动刷新过期的 token"""
    async with AsyncClient(base_url=base_url, timeout=30.0) as client:
        # 首次登录
        resp = await client.post("/api/auth/login", json={
            "username": "admin", "password": "admin_secret",
        })
        token = resp.json()["access_token"]
        client.headers["Authorization"] = f"Bearer {token}"
        yield client
```

## 资源清理模式

### 模式一：yield fixture 自动清理（推荐）

```python
@pytest.fixture(scope="function")
async def created_user(auth_client: AsyncClient) -> dict:
    """创建测试用户，测试结束后自动删除"""
    response = await auth_client.post("/api/users", json={
        "username": "temp_user_for_test",
        "email": "temp@example.com",
        "password": "TempPass1!",
    })
    assert response.status_code == 201
    user = response.json()

    yield user  # 测试用例获得 user 对象

    # 清理（测试结束后执行——即使测试失败也会执行）
    await auth_client.delete(f"/api/users/{user['id']}")
```

### 模式二：try-finally 显式清理

```python
@pytest.mark.asyncio
async def test_create_and_verify_order(auth_client: AsyncClient):
    """创建订单后验证，最后清理"""
    order = None
    try:
        response = await auth_client.post("/api/orders", json={
            "product_id": 1, "quantity": 2,
        })
        assert response.status_code == 201
        order = response.json()

        assert order["status"] == "pending"
        assert order["quantity"] == 2
    finally:
        if order:
            await auth_client.delete(f"/api/orders/{order['id']}")
```

### 模式三：唯一标识隔离（无需清理）

每个测试使用唯一标识生成资源，测试之间互不干扰：

```python
import uuid

@pytest.mark.asyncio
async def test_create_user_with_unique_username(auth_client: AsyncClient):
    """使用 UUID 生成唯一用户名，避免与其他测试冲突"""
    unique_username = f"test_user_{uuid.uuid4().hex[:8]}"

    response = await auth_client.post("/api/users", json={
        "username": unique_username,
        "email": f"{unique_username}@example.com",
        "password": "TestPass1!",
    })
    assert response.status_code == 201
```

## 幂等性保障

测试必须可以重复运行。以下是常见幂等性模式：

```python
@pytest.mark.asyncio
async def test_create_user_idempotent(auth_client: AsyncClient):
    """POST 前先 DELETE 旧数据，确保重复运行不冲突"""
    username = "idempotent_test_user"

    # 清理可能存在的旧数据（上次运行失败残留）
    existing = await auth_client.get("/api/users", params={"username": username})
    if existing.json()["total"] > 0:
        user_id = existing.json()["items"][0]["id"]
        await auth_client.delete(f"/api/users/{user_id}")

    # 现在安全创建
    response = await auth_client.post("/api/users", json={
        "username": username,
        "email": f"{username}@example.com",
        "password": "TestPass1!",
    })
    assert response.status_code == 201
```

:::tip
幂等性是 API 测试的核心准则——同一个测试无论运行多少次，结果应该一致。最佳实践是将幂等性检查封装为 conftest.py 中的 fixture，而不是在每个测试中重复编写 `DELETE` 前检查 `existing` 的代码。
:::
