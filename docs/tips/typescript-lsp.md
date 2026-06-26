---
title: TypeScript LSP 使用技巧
description: Claude Code 内置 LSP 工具的 TypeScript 实战指南——从安装配置到语义级代码理解，让代码导航和重构准确率达到 100%
---

# TypeScript LSP 使用技巧

> 从 grep 文本搜索升级到语义级代码理解——查询速度从 45 秒降到 50 毫秒，准确率从 95% 升到 100%。

## 为什么用 LSP

Claude Code 有 Grep 和 Glob 工具，它们做**文本匹配**——搜字符串 "getUser" 会命中 `getUser`、`getUserName`、`getUserById`、`// getUser is deprecated`。LSP 做**语义理解**——搜 `getUser` 函数的所有**调用方**，不会误中注释或同名变量。

**CircleCI 在 vuejs/core（~149K 行 TypeScript）上的实测**：

| 指标 | LSP | Grep |
|------|-----|------|
| 速度 | ~50ms | 45+ 秒 |
| Token 消耗 | 6,280 | 12,764 |
| 准确率（Sonnet） | 100% | ~95%（漏 11/260） |
| 成本（Opus） | $0.50 | $0.62 |

**关键结论**：LSP 不仅更快更准，还更省 token——而且模型越弱收益越大，LSP 给弱模型兜底。

## 快速安装

```bash
# 1. 开启 LSP 支持（加到 ~/.bashrc 或 ~/.zshrc）
export ENABLE_LSP_TOOL=1

# 2. 安装 TypeScript 语言服务器（推荐 vtsls）
npm install -g @vtsls/language-server typescript

# 3. 在 Claude Code 中安装插件
/plugin install typescript-lsp@claude-plugins-official

# 4. 重载
/reload-plugins
```

**要求**：Claude Code ≥ v2.0.74。

## 核心操作速查

Claude Code 内置 LSP 工具提供 9 种操作，按场景选用：

| 操作 | 做什么 | 什么时候用 |
|------|--------|-----------|
| `goToDefinition` | 跳转到符号定义 | 修改陌生代码前，先看清楚定义 |
| `findReferences` | 找到所有引用 | 重构/重命名前，评估影响范围 |
| `goToImplementation` | 找到接口实现 | 面向接口编程时找到具体实现 |
| `hover` | 类型信息 + 文档 + 签名 | 理解 API 用法 |
| `documentSymbol` | 列出文件中所有符号 | 快速浏览陌生大文件 |
| `workspaceSymbol` | 跨文件搜索符号 | 找到和某功能相关的所有代码 |
| `incomingCalls` | 找到调用方 | "谁在调这个函数？" |
| `outgoingCalls` | 找到被调用方 | "这个函数内部调了谁？" |
| `diagnostics` | 获取编译错误和警告 | 写完代码立即检查 |

### 决策树

```text
你需要什么？
├─ 符号的定义或实现        → LSP: goToDefinition / goToImplementation
├─ 符号的所有用法          → LSP: findReferences
├─ 类型信息、文档、签名    → LSP: hover
├─ 调用链或依赖关系        → LSP: incomingCalls / outgoingCalls
├─ 文本搜索（TODO、字符串） → Grep
└─ 文件名匹配              → Glob
```

## 三条铁律

来自社区最佳实践（`zircote/lsp-tools`），每一条都针对 AI 编码最常见的错误模式：

### 铁律 1：禁止在没看定义前修改陌生代码

```text
❌ Claude 看到一行 import { maskPhone } from '@/utils/phone'，
   直接改了 maskPhone 的调用方式——但它不知道这个函数的签名
✅ 先用 goToDefinition 看 maskPhone 的定义，
   确认参数类型、返回值、副作用，然后才改调用方
```

### 铁律 2：禁止在没做引用分析前重构

```text
❌ Claude 重命名了一个 export 的函数名，只改了定义，
   没改 12 个调用方——构建全炸
✅ 改名前先用 findReferences 找到所有引用，
   逐一确认改动范围，再批量修改
```

### 铁律 3：禁止声称"代码没问题"而不跑 LSP 诊断

```text
❌ Claude: "这个组件应该没问题了"
   实际上有 3 个类型错误，tsserver 早就报了
✅ 每次改动后跑 diagnostics 确认 0 错误，
   有错先修再继续
```

## 实战用例

### 用例 1：理解陌生 API

打开一个不熟悉的项目，看到一行 `useQuery` 但不知道从哪来的：

```text
> 对 useQuery 做 hover，看它的类型签名和文档
```

LSP 返回：函数签名、参数类型、返回值类型、JSDoc 注释。不用翻 node_modules 源码。

### 用例 2：安全地重命名

要把 `getUserList` 重命名为 `fetchUsers`：

```text
> 1. findReferences getUserList — 看所有调用方
> 2. 确认 8 个文件，3 个 .ts，5 个 .vue
> 3. 逐个文件改名，保证没有遗漏
```

grepping `getUserList` 会漏掉通过别名 import 的或在 `as` 子句里的引用——LSP 不会漏。

### 用例 3：追踪接口实现

```typescript
interface PaymentGateway {
  charge(amount: number): Promise<ChargeResult>
}
// 哪些类实现了这个接口？
```

```text
> goToImplementation PaymentGateway
```

返回：`StripeGateway`、`AlipayGateway`、`WechatPayGateway`——直接看到所有实现。

### 用例 4：影响分析

要改 `User` 类型的一个字段从 `name: string` 到 `name: { first: string, last: string }`：

```text
> 1. findReferences User.name — 13 个引用
> 2. incomingCalls 分析哪些函数依赖 User.name 的 string 类型
> 3. 逐个修改，每次改完跑 diagnostics
```

### 用例 5：快速预览大文件

打开一个 800 行的 `OrderService.ts`：

```text
> documentSymbol OrderService.ts
```

LSP 返回这个文件的结构——class、method、property 的树形列表。不用翻 800 行，一眼看到所有方法。

### 用例 6：跨文件导航

看到一个 `formatDate` 调用，但项目里有 3 个 `formatDate`：

```text
> goToDefinition formatDate
```

LSP 根据**类型推断**跳转到正确的那个——不是字符串匹配。grep 会把 3 个都列出来让你猜。

## 配置优化

### `.lsp.json`（项目根目录）

```json
{
  "typescript": {
    "command": "vtsls",
    "args": ["--stdio"],
    "extensionToLanguage": {
      ".ts": "typescript",
      ".tsx": "typescriptreact",
      ".js": "javascript",
      ".jsx": "javascriptreact",
      ".mts": "typescript",
      ".cts": "typescript",
      ".mjs": "javascript",
      ".cjs": "javascript"
    }
  }
}
```

### tsconfig.json 加速

```json
{
  "compilerOptions": {
    "skipLibCheck": true,
    "incremental": true
  },
  "exclude": ["node_modules", "dist", "build", ".next", "coverage"]
}
```

`skipLibCheck: true` 跳过 `node_modules` 的类型检查——大部分项目不需要检查依赖的类型。`incremental: true` 启用增量编译，后续检查更快。

### 为什么用 vtsls 而不是 typescript-language-server

| | vtsls | typescript-language-server |
|---|---|---|
| 维护状态 | 活跃 | 较慢 |
| 速度 | 更快 | 一般 |
| Vue SFC 支持 | 配 `@vue/typescript-plugin` 完美 | 需要额外配置 |
| 内存占用 | 更低 | 略高 |

## Hook 自动化

配置好 LSP 后再加 hook，让 Claude Code 每次改完文件自动检查：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write ${CLAUDE_FILE_PATHS}"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "npx tsc --noEmit 2>&1 | tail -5"
          }
        ]
      }
    ]
  }
}
```

**效果**：每次 Write/Edit 后自动格式化，每次"完成"前自动 typecheck。零人工干预。

## Vue + TypeScript 专项

Vue 单文件组件（`.vue`）需要特殊处理：

### 方案一：vtsls + Vue 插件

```bash
npm install -g @vtsls/language-server @vue/typescript-plugin
```

`.lsp.json` 增加 `.vue` 映射：

```json
{
  "typescript": {
    "command": "vtsls",
    "args": ["--stdio"],
    "extensionToLanguage": {
      ".vue": "typescript",
      ".ts": "typescript"
    }
  }
}
```

### 方案二：vue-ts-lsp（专用代理）

```bash
npx vue-ts-lsp install cc
```

`vue-ts-lsp` 是专门为 Vue + TypeScript 做的 LSP 代理，自动处理 `.vue` 文件的 template 和 script 分离。

### Vue LSP 常见场景

```text
# 在 .vue 文件中查找 ref/reactive 变量的定义
> goToDefinition status
# → 跳转到同一个 <script setup> 里的 const status = ref('')
# → 不跳到其他文件的同名 status

# 查找一个 prop 的所有使用位置
> findReferences props.options
# → 找到 template 里的 v-for="o in options" 和 script 里的 props.options.filter()
# → 覆盖 template 和 script 两个上下文
```

## 故障排除

| 问题 | 原因 | 解决 |
|------|------|------|
| LSP 不启动 | `tsconfig.json` 不存在 | 项目根目录建 `tsconfig.json` |
| 无诊断输出 | `ENABLE_LSP_TOOL` 未设置 | `export ENABLE_LSP_TOOL=1` |
| 响应慢 | `node_modules` 被扫描 | `tsconfig.json` 中 exclude `node_modules` |
| import 后无提示 | 依赖未安装 | `npm install` |
| 切分支后符号过期 | LSP 未感知分支变更 | "Restart the LSP server" |
| Vue 文件无提示 | LSP 未关联 `.vue` | 配置 `extensionToLanguage` 或安装 `vue-ts-lsp` |

## 与 codegraph 互补

LSP 和 codegraph 定位不同，搭配使用：

| | LSP | codegraph |
|---|---|---|
| 数据类型 | 实时语法树 + 类型 | 预建知识图谱 |
| 更新方式 | 文件保存即更新 | 文件变化 ~1 秒后更新 |
| 强项 | 类型推导、诊断、定义跳转 | 调用链追踪、影响分析、跨文件探索 |
| 典型用法 | 改代码时的即时反馈 | 理解架构时的全局检索 |

**最佳组合**：改代码时用 LSP（实时类型检查 + 定义跳转），理解代码架构时用 codegraph（调用链追踪 + 依赖图谱）。

---

## 相关页面

- [Java LSP 配置指南](/tips/java-practices/lsp-setup) — JDTLS 的 Java 专属配置
- [代码图谱](/guide/advanced/code-graph/code-graph-tools) — codegraph 语义级代码分析
- [hooks](/guide/advanced/hooks) — PostToolUse + Stop hook 自动化
- [Serena](/guide/advanced/serena) — 语义级代码检索工具
