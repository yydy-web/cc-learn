---
title: Python LSP 配置指南
description: 配置 Claude Code 内置 Python LSP（basedpyright），从 grep 文本搜索升级到语义级代码理解和即时诊断，大幅提升 Python 测试开发效率
---

# Python LSP 配置指南

Claude Code 从 v2.0.74 开始支持 LSP（Language Server Protocol）集成。对 Python 项目而言，配置 LSP 意味着从 grep 全文搜索升级到**语义级代码理解**——查询速度从 30 秒降到 50 毫秒，准确率从模糊匹配提升到 100% 语义精确。

:::info
本文是 [Python 测试工具链概览](/tips/python-practices/) 的子页面。LSP 是 Claude Code 的内置能力，与 [Serena](/guide/advanced/serena) 的 MCP LSP 互补但不冲突——两者可以同时启用。
:::

## 为什么要配置 LSP

### 没有 LSP 时 Claude Code 如何工作

Claude Code 本质上是一个运行在终端中的 AI 编程助手，它没有内置的代码语义理解能力。当你问它「`create_user` fixture 在哪里定义」时，它只能用 grep/ripgrep 在整个代码库中做全文搜索。对于一个包含 `conftest.py`、`fixtures/`、`factories/` 的 Python 测试项目，搜索 "create_user" 可能返回数十个匹配——函数定义、变量名、注释、字符串字面量全混在一起。Claude 需要逐个读取文件来判断哪个才是真正的定义，这个过程通常需要 30-60 秒，而且可能出错。

更大的问题在于代码编辑。当 Claude 修改了一个 fixture 签名（比如给 `create_user` 加了个 `role` 参数），它无法知道哪些测试用例需要同步修改——只能等你运行 pytest 报错，再把错误贴回来让它修复。这种来回迭代极其低效。

### 配置 LSP 后的体验

启用 LSP 后，同样的查询在 50 毫秒内返回精确结果。不是 30 秒，是 50 毫秒。不是模糊匹配，是 100% 准确的语义定位。

更关键的是「被动诊断」能力：每次 Claude 编辑文件后，语言服务器会即时推送类型错误、缺失导入、未定义变量等诊断信息。Claude 能在同一轮对话中看到这些错误并立刻修复，在你看到结果之前就已经完成了整个修复循环。

### 性能对比

| 维度     | 无 LSP                     | 有 LSP               |
| -------- | -------------------------- | -------------------- |
| 查询速度 | 30-60 秒（grep 搜索）      | ~50 毫秒（语义查询） |
| 准确率   | 可能误匹配注释/字符串      | 100% 语义准确        |
| 错误检测 | 需要手动运行 pytest 后反馈 | 编辑时即时推送       |
| 修复迭代 | 多轮对话来回               | 单轮自动完成         |

## 安装 basedpyright

basedpyright 是目前 Python 生态中性能最好、功能最完整的 LSP 实现。它是 Pyright 的社区增强版，增加了类型检查的严格度控制和更好的 monorepo 支持。

```bash
# 使用 pip 安装（推荐）
pip install basedpyright

# 或使用 uv
uv add --dev basedpyright

# 或使用 npm（全局安装）
npm install -g basedpyright
```

:::info
**为什么用 basedpyright 而不是 pyright？** basedpyright 在 pyright 的基础上增加了更灵活的类型检查级别控制、更好的 monorepo 支持、以及对 pytest fixture 类型的更好推断。对 Python 测试项目而言，basedpyright 对 conftest.py 和 fixture 的理解优于原版。
:::

## 配置

### pyrightconfig.json（推荐）

在项目根目录创建 `pyrightconfig.json`：

```json
{
  "include": ["tests", "pages", "fixtures", "utils"],
  "exclude": ["**/__pycache__", "**/.pytest_cache", "**/node_modules"],
  "venvPath": ".",
  "venv": ".venv",
  "pythonVersion": "3.11",
  "typeCheckingMode": "basic",
  "reportMissingTypeStubs": false,
  "reportUnknownMemberType": false,
  "reportUnusedVariable": "warning",
  "reportUnusedImport": "warning"
}
```

### pyproject.toml 配置

也可以将配置放在 `pyproject.toml` 的 `[tool.pyright]` 段中：

```toml
[tool.pyright]
include = ["tests", "pages", "fixtures", "utils"]
exclude = ["**/__pycache__", "**/.pytest_cache"]
venvPath = "."
venv = ".venv"
pythonVersion = "3.11"
typeCheckingMode = "basic"
reportMissingTypeStubs = false
reportUnknownMemberType = false
```

:::tip
`typeCheckingMode` 有四个级别：`off`、`basic`、`standard`、`strict`。测试项目建议使用 `basic`（捕获明显的类型错误但不强制完整的类型注解）。如果你在测试项目中也要求严格类型注解（如 factory 返回值），可以升级到 `standard`。
:::

### 虚拟环境检测

basedpyright 需要知道虚拟环境的位置来进行包导入分析。确保以下配置正确：

```json
{
  "venvPath": ".",
  "venv": ".venv"
}
```

这告诉 basedpyright 在项目根目录的 `.venv/` 下查找虚拟环境。如果你使用 `uv` 创建虚拟环境，路径通常是 `.venv/`。如果使用 conda 或 Poetry，调整为对应路径。

## pytest fixture 语义兼容性

basedpyright 默认无法推断 pytest fixture 的返回类型——因为 fixture 是通过 `conftest.py` 插件机制注入的，不属于常规的类型系统。这会导致使用 fixture 时出现 "类型未知" 的误报。

### 解决方法：安装 pytest 类型存根

```bash
pip install pytest-types
# 或
uv add --dev pytest-types
```

### 为自定义 fixture 添加类型注解

在 `conftest.py` 中为 fixture 添加返回类型注解：

```python
import pytest
from playwright.sync_api import Page, BrowserContext
from typing import Generator

@pytest.fixture(scope="function")
def login_page(page: Page) -> Generator[Page, None, None]:
    """返回已登录的 Page 对象"""
    page.goto("/login")
    page.fill("[data-testid='username']", "testuser")
    page.fill("[data-testid='password']", "secret")
    page.click("[data-testid='login-btn']")
    page.wait_for_url("/dashboard")
    yield page
```

:::warning
basedpyright 对 pytest fixture 的类型推断仍然有限。如果遇到 fixture 类型误报，可以在 `pyrightconfig.json` 中设置 `"reportUnknownMemberType": false` 来抑制，或者使用 `# type: ignore` 注释。
:::

## 验证 LSP 是否生效

进入 Python 项目后，向 Claude Code 提问：

```
> UserService 在哪里定义？
```

判断标准：

- **秒返回精确文件路径和行号** = LSP 已生效
- **返回多个 grep 结果并逐个分析** = LSP 未生效

也可以在 Claude Code 中检查 LSP 状态：

```bash
# 检查 LSP 是否在运行
claude status
# 在输出中查找 "LSP" 相关行
```

## 常见问题排查

### 问题 1：basedpyright 无法检测虚拟环境

**症状**：导入第三方库（pytest、playwright、httpx）时提示 "无法解析导入"

**解决**：

```bash
# 确认虚拟环境路径
which python  # 或 Get-Command python (Windows PowerShell)

# 更新 pyrightconfig.json
# 确保 venvPath 和 venv 指向正确的虚拟环境目录
```

### 问题 2：pytest fixture 出现大量类型误报

**症状**：所有 fixture 参数都标记为 "类型未知"

**解决**：

```bash
pip install pytest-types
```

并在 `pyrightconfig.json` 中添加：

```json
{
  "reportUnknownMemberType": false,
  "reportUnknownArgumentType": false
}
```

### 问题 3：basedpyright 与项目 Python 版本不匹配

**症状**：match case、`str | None` 等新语法报错

**解决**：在 `pyrightconfig.json` 中显式指定 Python 版本：

```json
{
  "pythonVersion": "3.12"
}
```
