---
title: Claude Mem — 持久记忆系统
description: Claude Mem 让 Claude Code 跨会话记住你做过什么，下次启动自动注入上下文，不需要重新解释项目背景
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★☆☆  | ★★★☆☆    |
| 📦 产品 | ★★★☆☆  | ★★★☆☆    |

**🎯 学习产出：** 掌握 Claude Mem 持久记忆配置和团队共享，能独立让 Claude Code 跨会话自动注入项目上下文

**🚀 AI 能力提升：** 上下文管理
:::

# Claude Mem — 持久记忆系统

> 第二天打开 Claude Code，它还记得昨天修的那个 bug。

## 概述

**Claude Mem**（`thedotmack/claude-mem`）是一个持久记忆插件。Claude Code 默认每次会话都是"失忆"状态——关掉窗口，刚才讨论的方案、修的 bug、做的决策全部清零。下次你得重新解释："我们项目用的是 Pinia，那个用户模块在 `src/stores/user.ts`..."

Claude Mem 解决了这个问题。它在后台自动记录每次会话的关键信息，下次启动时注入相关上下文。

**核心数据**：80K GitHub Stars、SQLite + Chroma 向量数据库、5 个生命周期 Hook、支持跨 30+ Agent 平台。

## 核心理念：不是笔记，是自动日志

```
Claude Code 内置记忆：
  CLAUDE.md → 静态指令（每次加载，你手动维护）
  /memory → Claude 自己写笔记（最多 200 行）

Claude Mem：
  你说 "登录接口返回 401" →
    Claude 查到 auth bug → 修了 →
      自动记录：问题、根因、修复方案、涉及文件 →
        下次你提 "登录" → 自动注入这段上下文
```

区别：你不需要手动写任何东西。它自己记。

## 安装

Claude Mem 通过 npm 一键安装：

```bash
npx claude-mem install
```

安装后重启 Claude Code。也可以走插件市场：

```bash
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

### 验证

```bash
# 查看服务是否运行
curl http://localhost:37777/health

# 或在 Claude Code 中搜索
/mem-search test
```

如果返回搜索结果，说明安装成功。

### 系统要求

- Node.js ≥ 18.0.0
- Bun（自动安装）
- uv / Python（自动安装）
- SQLite 3（内置）

## 使用方式

### 核心命令

| 命令                     | 用途                     |
| ------------------------ | ------------------------ |
| `/mem-search <关键词>`   | 搜索历史记忆             |
| `http://localhost:37777` | Web 查看器（实时记忆流） |

### 它自动记什么

Claude Mem 通过 5 个生命周期 Hook 自动捕获：

| Hook               | 触发时机       | 记录内容                 |
| ------------------ | -------------- | ------------------------ |
| `SessionStart`     | 会话开始       | 注入上次会话的关键上下文 |
| `UserPromptSubmit` | 你每次发消息   | 你的需求描述             |
| `PostToolUse`      | 每次工具调用后 | 工具调用 + 结果摘要      |
| `Stop`             | 回答生成完毕   | 最终决策和输出摘要       |
| `SessionEnd`       | 会话结束       | 全文压缩归档             |

### 三层检索（渐进披露）

Claude Mem 的 token 效率设计——不把全部记忆一次倒进去：

```
第 1 层：search("auth bug") → 返回 10 条摘要索引（~500 tokens）
第 2 层：看索引，挑出相关的 #42、#67
第 3 层：get_observations([42, 67]) → 只加载这两条的完整内容
```

只加载你需要的记忆，不加载无关的。

### 隐私控制

用 `<private>` 标签包裹敏感内容：

```text
> API key 是 <private>sk-xxxx</private>，帮我配置到环境变量
```

被 `<private>` 包裹的内容不会写入记忆库。

### 跨团队共享

配合 `claude-mem-sync` 可以把记忆通过 git 同步给团队：

```bash
# 安装同步工具
npx claude-mem-sync init
```

团队成员拉取后，可以直接搜索你的调试记录。

## 日常使用

### Java 示例

**场景**：你昨天花了 2 小时排查一个 Spring Boot 启动慢的问题，最终发现是数据库连接池配置不对。今天你继续在这个项目工作。

❌ 不用 Claude Mem：

```text
> 项目启动还是很慢，帮我看看什么原因

Claude: 需要我帮你检查启动日志吗？可能是依赖注入的问题...
（不知道你昨天已经排查过了，又从头开始查）
```

✅ 用 Claude Mem：

Claude Mem 昨天自动记录了这条观察：

```json
{
  "id": 127,
  "session": "2026-06-23",
  "type": "bugfix",
  "summary": "Spring Boot 启动 45s → 6s。根因：HikariCP connection-timeout 默认 30s，数据库在 VPN 内延迟 200ms。修复：spring.datasource.hikari.connection-timeout=3000",
  "files": ["application.yml", "DataSourceConfig.java"],
  "tags": ["spring-boot", "hikari", "startup", "performance"]
}
```

今天你打开 Claude Code：

```text
> 启动还是有点慢

Claude: （自动注入了昨天的记忆）你昨天已经把 connection-timeout 从 30s 降到 3s，启动从 45s 降到 6s。
现在还是慢吗？要排查的方向可能是：
1. 检查是不是有其他 Bean 初始化慢
2. 看看 actuator/startup 端点
3. 确认昨天的改动还在（application.yml 没有被覆盖）
```

**关键**：你不需要说"还记得昨天修的连接池吗"——它自动检索相关记忆。

### Vue 示例

**场景**：你的 Vue 项目有一个复杂的 Pinia store，三周前你重构过一次，解决了响应式丢失的问题。现在你要在同一个 store 里加新功能。

❌ 不用 Claude Mem：

```text
> 帮我在 userStore 里加一个 updateProfile 方法

Claude: 我看看 userStore...这个 store 的 reactive 嵌套有点复杂，
      可能需要用 toRefs 或者 markRaw...
（踩回你三周前已经踩过的坑）
```

✅ 用 Claude Mem：

三周前的记录：

```json
{
  "id": 89,
  "type": "refactor",
  "summary": "userStore 重构：解决嵌套对象响应式丢失。用 structuredClone 深拷贝 + toRaw 处理 Proxy，不要直接用解构。API 返回的 Date 字段需要用 toRef 包装。",
  "files": ["src/stores/user.ts", "src/composables/useAuth.ts"],
  "pattern": "// ponytail: structuredClone + toRaw, 别直接用解构"
}
```

今天：

```text
> 帮我在 userStore 加 updateProfile 方法

Claude: （自动检索到 #89）
这个 store 上次重构过，要注意：
- 用 structuredClone 深拷贝，不用解构
- Date 字段需要 toRef 包装
- 已经加了 updateProfile：
    async updateProfile(data) {
      const clone = structuredClone(toRaw(this.profile))
      Object.assign(clone, data)
      this.profile = reactive(clone)
      await api.updateProfile(clone)
    }
```

**关键**：它记得这个 store 的"坑"，不会让你再踩一次。

## 实战场景一：多天调试——跨会话接力

### 场景

你正在排查一个偶发的生产环境 bug：用户反馈"订单提交后偶尔不扣库存"。第一天排查到一半下班了，第二天接着查。

### 你怎么操作（对话流程）

**第一天：**

```text
> 生产环境偶发 bug：订单提交后库存不扣减。帮我看 OrderService.submit()

Claude: 检查了 submit() 方法。发现可能是事务隔离级别问题——
      @Transactional 默认 READ_COMMITTED，在高并发下可能读到旧库存值。
      我已经在 OrderService 加了日志埋点，改了隔离级别为 REPEATABLE_READ。
      需要观察一下。
```

Claude Mem 自动记录：

```
[obs-203] bug: 订单提交偶发不扣库存
  排查路径: OrderService.submit() → InventoryService.deduct()
  假设: 事务隔离级别 READ_COMMITTED 导致并发读到旧值
  修复: 改为 REPEATABLE_READ，加了日志
  状态: 待验证
  文件: OrderService.java, InventoryService.java
```

**第二天（新会话）：**

```text
> 昨天的库存 bug 还在，看一下日志

Claude: （自动注入 obs-203）
  昨天你把隔离级别改成了 REPEATABLE_READ，日志显示：
  [2026-06-24 10:23:15] Thread-42: SELECT stock WHERE sku='A001' → 5
  [2026-06-24 10:23:15] Thread-43: SELECT stock WHERE sku='A001' → 5  ← 还是读到 5

  问题不在隔离级别——REPEATABLE_READ 已经生效了。两个线程同时读了 5，
  都以为有库存。你说"偶发"，这像是 SELECT ... FOR UPDATE 缺失。
  让我检查 deduct 方法...
```

**关键**：第二天打开 Claude Code，不需要重复"这个 bug 昨天查到哪了"——Claude Mem 自动接上。

## 实战场景二：新人上手——把别人的记忆变成你的

### 场景

你接手一个同事的项目。项目有 CLAUDE.md 但只覆盖了基础命令和风格——那些"走过弯路才知道"的知识不在里面。

### 你怎么操作（对话流程）

**第一步：安装 claude-mem-sync**

```bash
npx claude-mem-sync init
# 拉取团队共享的记忆库
```

**第二步：搜索关键模块**

```text
> 帮我搜一下 team-memory 里关于 payment 模块的所有记忆
```

Claude Mem 返回：

```
[obs-156] payment 回调验签：微信用的是 RSA，支付宝用 RSA2。
          混用会导致验签失败。验签公钥在 config/payment/pubkeys/
[obs-178] 退款不要直接调 payment.refund(), 要走 RefundService.createRefundTicket()
          审批流，否则财务对不上账
[obs-201] payment 模块的单元测试依赖 localstack 模拟支付回调，
          启动命令: docker-compose -f docker-compose.test.yml up payment-mock
```

**第三步：照着记忆开工**

你用这些记忆直接写代码——不会踩"用错验签方式"、"绕过退款审批流"、"本地测试不知道怎么启动"这些坑。

## 最佳实践

### 什么时候用

| 场景                | 适合                      | 不适合                         |
| ------------------- | ------------------------- | ------------------------------ |
| 多天开发同一项目    | ✅ 默认开启               | —                              |
| 复杂 bug 跨会话排查 | ✅ 自动记录排查路径       | —                              |
| 团队协作            | ✅ 配合 `claude-mem-sync` | —                              |
| 单次简单查询        | —                         | ⚠️ 用 `/memory` 够用           |
| 敏感项目            | —                         | ❌ 或严格使用 `<private>` 标签 |

### 记忆管理

- **定期清噪音**：`/mem-search` 搜一下旧记忆，删掉已经过时的
- **隐私优先**：API key、密码、内部 URL 用 `<private>` 包裹
- **不要手动记**：让 Claude Mem 自动捕获就够了，刻意记录反而有噪音

### 与 CLAUDE.md 的分工

|      | CLAUDE.md                    | Claude Mem                     |
| ---- | ---------------------------- | ------------------------------ |
| 内容 | 静态指令（风格、架构、命令） | 动态历史（做了什么、修了什么） |
| 更新 | 你手动维护                   | 自动捕获                       |
| 时机 | 每次会话加载                 | 按需检索注入                   |

两者互补，不替代。

## 常见问题

### 和 Claude Code 自带的 /memory 有什么区别？

`/memory` 是你主动让 Claude 记一句话。Claude Mem 是自动记录"发生了什么"——工具调用、决策、修复——不需要你手动触发。前者是便签，后者是日志。

### 会占用很多 token 吗？

不会。它用渐进披露——先返回摘要索引（~50 tokens/条），你挑出相关的才加载完整内容。不把整个记忆库倒进上下文。

### 隐私安全吗？

所有数据在本地 SQLite 数据库。用 `<private>` 标签的内容不会写入。不上传任何数据到外部服务。

### cookie/API key 会被记录吗？

如果你在对话中暴露了敏感信息且没用 `<private>` 包裹——会。养成习惯：敏感信息始终用 `<private>` 标签。
