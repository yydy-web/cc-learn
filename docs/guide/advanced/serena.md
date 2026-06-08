---
title: Serena 代码语义工具
description: 使用 Serena 为 Claude Code 提供 IDE 级的符号级代码理解、导航和重构能力
---

# Serena 代码语义工具

Serena 是一个开源的 MCP 工具包，为 AI 编程助手提供 IDE 级别的代码语义能力。与基于文本搜索的工具不同，Serena 通过语言服务器协议（LSP）或 JetBrains 分析引擎，提供**符号级**的操作——让 Claude Code 像开发者在 IDE 中一样理解、导航和修改代码。

## 为什么需要 Serena

Claude Code 默认使用 `Grep`、`Glob`、`Read` 等文本搜索工具来理解代码。这种方式在简单任务中没问题，但在复杂的重构和跨文件操作中会遇到瓶颈：

- **重命名不精确**：文本替换会误改注释、字符串和无关同名符号
- **引用查找困难**：找到一个函数的所有调用者需要多次工具调用
- **重构风险高**：移动符号、内联函数等操作没有语义感知，容易破坏代码
- **Token 浪费**：每次读取整个文件来理解一个函数，上下文效率低

Serena 通过 LSP 提供**原子化的语义操作**——一次调用完成精确重命名、安全删除、符号级编辑，比文本搜索更可靠、更高效。

:::info
**Claude Code 内置 LSP vs Serena MCP LSP：** Claude Code 从 v2.0.74 起内置了 LSP 集成（如 Java 的 jdtls），提供诊断推送和代码导航能力。Serena 则专注于**符号级重构操作**——内置 LSP 不提供重命名、移动、安全删除等功能。两者可以同时启用。Java 项目的 LSP 配置详见 [Java LSP 配置指南](/tips/java-practices/lsp-setup)。
:::

:::info
Serena vs 文本搜索对比：

- **文本搜索**：重命名 `UserService.authenticate()` 需要 grep 所有文件 → 逐个检查 → 手动替换 → 可能误改
- **Serena**：一次 `rename_symbol` 调用，LSP 精确找到所有引用，原子化替换
  :::

## 架构

```
Claude Code ──MCP──▶ Serena Server ──LSP/JetBrains──▶ 语言后端
                           │
                     MCP 工具层（语义操作）
```

Serena 由两层组成：

1. **语言后端**：提供代码语义理解
   - **LSP 后端**（免费/开源，默认）：支持 40+ 种语言（Python、TypeScript、Rust、Go、Java、C/C++ 等）
   - **JetBrains 插件**（付费，有免费试用）：利用 JetBrains IDE 分析引擎，额外支持类型层次、移动重构、内联重构和交互式调试

2. **MCP 工具层**：将语义能力暴露为标准化 MCP 工具，供任何兼容客户端调用

## 安装

### 前置条件

安装 [uv](https://docs.astral.sh/uv/getting-started/installation/)（Python 包管理器）：

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 方式一：安装 Serena（推荐）

```bash
# 安装
uv tool install -p 3.13 serena-agent

# 初始化项目
serena init
```

`serena init` 会在当前目录创建 Serena 配置文件。如果要使用 JetBrains 后端：

```bash
serena init -b JetBrains
```

### 方式二：通过 pip 安装

```bash
pip install serena-agent
serena init
```

### 配置 Claude Code

Serena 作为 MCP 服务器运行，需要在 Claude Code 中注册：

```bash
# stdio 模式（推荐）
claude mcp add --scope user serena -- serena
```

或手动编辑 `~/.claude.json`：

```json
{
  "mcpServers": {
    "serena": {
      "type": "stdio",
      "command": "serena",
      "args": ["--project-path", "/path/to/your/project"]
    }
  }
}
```

### 方式三：HTTP 模式

Serena 也可以作为 HTTP 服务器运行，适合远程或多客户端场景：

```bash
# 启动 HTTP 服务器
serena --transport http --port 9123

# 在 Claude Code 中配置
claude mcp add --scope user --transport http serena http://localhost:9123/mcp
```

### 方式四：通过 CC-Switch 管理

如果你已安装 [CC-Switch](/guide/advanced/cc-switch)，可以通过它管理 Serena 的 MCP 服务器配置：

1. 打开 CC-Switch Desktop
2. 进入 MCP 服务器管理
3. 添加 Serena MCP 服务器配置
4. CC-Switch 会自动同步到 Claude Code

:::tip
CC-Switch 特别适合在多个 AI 工具之间同步 Serena 的 MCP 配置——一次配置，所有工具生效。
:::

## MCP 工具

Serena 为 Claude Code 提供以下 MCP 工具：

### 代码检索

| 工具                          | 用途                               | 使用场景                      |
| ----------------------------- | ---------------------------------- | ----------------------------- |
| `find_symbol`                 | 按名称查找符号（函数、类、方法等） | "找到 UserService 类"         |
| `get_symbols_overview`        | 获取文件的符号大纲                 | "这个文件有哪些函数和类？"    |
| `find_referencing_symbols`    | 查找所有引用某个符号的地方         | "哪些地方调用了 deleteUser？" |
| `search_project_dependencies` | 搜索项目依赖                       | JetBrains 专属                |
| `type_hierarchy`              | 查看类型继承层次                   | JetBrains 专属                |

### 符号级编辑

| 工具                   | 用途                         | 使用场景           |
| ---------------------- | ---------------------------- | ------------------ |
| `replace_symbol_body`  | 替换整个符号的实现           | 重写某个函数       |
| `insert_before_symbol` | 在符号前插入代码             | 在函数前添加装饰器 |
| `insert_after_symbol`  | 在符号后插入代码             | 在类定义后添加方法 |
| `rename_symbol`        | 精确重命名符号（含所有引用） | 重命名函数/类/变量 |

### 重构（JetBrains 专属）

| 工具                 | 用途                     | 使用场景       |
| -------------------- | ------------------------ | -------------- |
| `rename_file`        | 重命名文件并更新所有引用 | 重命名模块     |
| `move_symbol`        | 移动符号到其他文件       | 提取公共模块   |
| `move_file`          | 移动文件并更新导入       | 重组项目结构   |
| `inline_refactoring` | 内联函数/变量            | 简化代码       |
| `safe_delete`        | 安全删除（检查所有引用） | 删除前确认影响 |

### 交互式调试（JetBrains 专属）

| 工具                  | 用途               | 使用场景         |
| --------------------- | ------------------ | ---------------- |
| `set_breakpoint`      | 设置断点           | 调试特定代码路径 |
| `evaluate_expression` | 在调试上下文中求值 | 检查运行时变量   |
| `step_through`        | 单步执行           | 跟踪执行流程     |

### 通用工具

| 工具            | 用途            | 备注                        |
| --------------- | --------------- | --------------------------- |
| `read_file`     | 读取文件内容    | 通常由 Claude Code 自身提供 |
| `list_dir`      | 列出目录内容    | 通常由 Claude Code 自身提供 |
| `execute_shell` | 执行 shell 命令 | 通常由 Claude Code 自身提供 |

:::tip
通用工具（`read_file`、`list_dir`、`execute_shell`）默认禁用，因为 Claude Code 自身已提供这些能力。可以在配置中按需启用。
:::

## 使用示例

### 示例一：精确重命名

```
> 把 src/services/auth.ts 中的 authenticate 函数重命名为 verifyCredentials，包括所有调用处
```

Serena 会通过 `rename_symbol` 一次调用完成：找到 `authenticate` 的定义和所有引用，原子化替换为 `verifyCredentials`。

### 示例二：查找调用链

```
> 哪些地方调用了 UserService.deleteUser？如果删除这个方法会影响什么？
```

Claude Code 会调用 `find_referencing_symbols` 获取所有引用点，包括控制器、测试、中间件等。

### 示例三：安全重构

```
> 把 src/utils/validation.ts 中的 validateEmail 函数移动到 src/utils/email.ts
```

Serena 的 `move_symbol`（JetBrains）会自动处理导入更新、旧文件清理。

### 示例四：代码理解

```
> 这个文件的结构是什么？有哪些公开 API？
```

Claude Code 调用 `get_symbols_overview` 获取文件大纲，包括所有函数、类、方法及其可见性。

### 示例五：符号级编辑

```
> 在 parseConfig 函数之前添加 @deprecated 装饰器
```

Serena 通过 `insert_before_symbol` 精确在函数定义前插入代码，不需要手动计算行号。

## 配置系统

Serena 支持多层配置，按优先级从低到高：

1. **全局配置**：`~/.serena/config.yaml`
2. **MCP 启动参数**：CLI 命令行参数
3. **项目配置**：`<project>/.serena/config.yaml`（可提交到 Git）
4. **本地覆盖**：`<project>/.serena/config.local.yaml`（不提交）
5. **执行上下文**：按客户端区分的配置

### 项目配置示例

```yaml title=".serena/config.yaml"
# 语言后端
backend: lsp # 或 "JetBrains"

# 工具开关
tools:
  # 启用语义工具
  find_symbol: true
  rename_symbol: true
  replace_symbol_body: true
  # 禁用基础工具（Claude Code 已提供）
  read_file: false
  list_dir: false
  execute_shell: false

# LSP 后端配置
lsp:
  languages:
    - typescript
    - python
    - rust
```

### Modes（模式）

Serena 支持动态组合配置片段——`modes`。根据当前任务激活不同的工具集：

```yaml title=".serena/modes/refactor.yaml"
name: refactor
description: 重构模式——启用所有重构工具
tools:
  rename_symbol: true
  move_symbol: true
  safe_delete: true
  inline_refactoring: true
```

```yaml title=".serena/modes/readonly.yaml"
name: readonly
description: 只读模式——仅启用检索工具
tools:
  find_symbol: true
  get_symbols_overview: true
  find_referencing_symbols: true
  replace_symbol_body: false
  rename_symbol: false
```

## 支持的语言

### LSP 后端（40+ 种语言）

Python、TypeScript、JavaScript、Rust、Go、Java、C、C++、Kotlin、Swift、Scala、Ruby、PHP、C#、Dart、Lua、Haskell、Elixir、Erlang、OCaml、F#、R、Julia、Perl、Zig、Nim、Crystal、Groovy、Clojure、Lisp、Fortran、COBOL、Assembly、SQL、HTML、CSS、SCSS、XML、YAML、TOML、Markdown、LaTeX、Shell、PowerShell

### JetBrains 后端

支持所有 JetBrains IDE 识别的语言，额外能力包括：

- 类型层次探索
- 移动重构（符号/文件/目录）
- 内联重构
- 交互式调试
- 搜索项目依赖

## 内存管理

Serena 内置跨会话内存系统，可以在不同 Claude Code 会话之间持久化知识：

- 代码库的关键决策和约定
- 常用符号的位置和作用
- 项目特定的术语和模式

:::info
Serena 的内存系统独立于 Claude Code 的 CLAUDE.md 和 Memory 功能。两者可以互补使用——CLAUDE.md 记录高层约定，Serena 内存记录代码级细节。
:::

## 与其他工具的对比

| 方面           | Serena                        | CodeGraph            | Code Review Graph   | Graphify                      |
| -------------- | ----------------------------- | -------------------- | ------------------- | ----------------------------- |
| **定位**       | IDE 级语义操作                | 代码探索和知识图谱   | 代码审查和架构分析  | 多模态知识图谱                |
| **核心技术**   | LSP / JetBrains               | tree-sitter + SQLite | tree-sitter + 图论  | NLP + 图数据库                |
| **语言支持**   | 40+（LSP）/ 全部（JetBrains） | 20+                  | 30+                 | 13+（tree-sitter）            |
| **实现语言**   | —                             | —                    | —                   | Python                        |
| **MCP 工具**   | 服务器模式                    | 服务器模式           | 服务器模式          | 服务器模式                    |
| **重构能力**   | ✅ 符号重命名、移动、安全删除 | ❌                   | ❌                  | ❌                            |
| **符号编辑**   | ✅ 替换、插入、删除符号体     | ❌                   | ❌                  | ❌                            |
| **调试能力**   | ✅ JetBrains 专属             | ❌                   | ❌                  | ❌                            |
| **影响分析**   | 通过引用查找                  | ✅ 专用工具          | ✅ Blast-Radius     | ❌                            |
| **调用链追踪** | 通过引用递归                  | ✅ `codegraph_trace` | ✅ 执行流分析       | ✅ 图遍历                     |
| **核心能力**   | 符号级精确操作                | 代码探索和知识图谱   | 代码审查和架构分析  | 跨文档知识图谱 + 自然语言查询 |
| **社区检测**   | ❌                            | ❌                   | ✅ Leiden 算法      | ❌                            |
| **可视化**     | ❌                            | ❌                   | ✅ D3.js 交互式图谱 | ❌                            |
| **依赖要求**   | Python (uv)                   | Node.js (npm)        | Python (pip)        | Python                        |
| **免费方案**   | LSP 后端完全免费              | 完全免费             | 完全免费            | 完全免费                      |
| **最佳场景**   | 精确重构、符号级编辑          | 日常代码探索         | PR 审查、架构分析   | 跨文档研究、多模态材料        |

### 选型建议

**选择 Serena 如果：**

- 你需要精确的符号级重构（重命名、移动、安全删除）
- 你使用 JetBrains IDE（额外获得调试、类型层次等能力）
- 你处理 40+ 种语言的多语言项目
- 你需要原子化的代码修改操作

**选择 CodeGraph 如果：**

- 你主要需要快速探索代码库结构
- 你偏好零配置、开箱即用的工具
- 你需要知识图谱式的代码查询

**选择 Code Review Graph 如果：**

- 你主要需要代码审查和 PR 审核
- 你需要 Blast-Radius 影响分析和架构可视化

**选择 Graphify 如果：**

- 你有混合类型的材料（代码 + 论文 + PDF + 图片）
- 你需要发现跨文档之间的关联

**组合使用：**

- Serena 用于精确重构和符号级编辑
- CodeGraph 用于日常代码探索和知识图谱查询
- Code Review Graph 用于代码审查和架构分析
- Graphify 用于跨文档类型的知识整合和研究材料整理
- 三者通过 MCP 并行运行，互不冲突

## 卸载

```bash
# 移除 MCP 配置
claude mcp remove serena

# 卸载 Serena
uv tool uninstall serena-agent
```

## 相关资源

- [Serena GitHub](https://github.com/oraios/serena) — 项目仓库（24.9k Stars）
- [Serena 官方文档](https://oraios.github.io/serena/) — 完整使用指南
- [Serena PyPI](https://pypi.org/project/serena-agent/) — Python 包
- [uv 安装指南](https://docs.astral.sh/uv/getting-started/installation/) — 前置条件

## 下一步

- [MCP 服务器](/guide/advanced/mcp-servers) — 深入了解 MCP 服务器配置
- [CodeGraph 代码智能](/guide/advanced/codegraph) — 另一个代码智能工具
- [Code Review Graph](/guide/advanced/code-review-graph) — 代码审查专用工具
- [Graphify 知识图谱](/guide/advanced/graphify) — 多模态知识图谱工具
- [代码图谱工具对比](/guide/advanced/code-graph-tools) — 四工具详细对比
- [技巧与最佳实践](/tips/best-practices) — 更多高效使用技巧
