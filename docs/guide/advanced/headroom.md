---
title: Headroom — 给你的 Claude Code 省 token
description: Headroom 在本地自动压缩发给 LLM 的内容，省 60-95% token，一行命令接入，不影响回答质量
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★★☆☆☆ |
| 🧪 测试 | ★★★☆☆ | ★★★☆☆ |
| 📦 产品 | ★★★☆☆ | ★★★☆☆ |

**🎯 学习产出：** 掌握上下文余量管理，能独立通过 Headroom 压缩 token 消耗 60-95%

**🚀 AI 能力提升：** 上下文管理
:::

# Headroom — 给你的 Claude Code 省 token

> 装完即忘。打开 stats 的时候才发现省了一半。

## 它解决什么问题

用 Claude Code 久了会发现一个现象：

- 让 Claude 搜个东西，grep 哗啦返回 500 行，你只关心其中 3 处匹配
- 让它读个文件，整个 800 行都进上下文了，其实只需要那 2 个函数
- 跑个测试炸了，堆栈 2000 行，根因就藏在最后 10 行

这些"噪音"不帮你解决问题，但照样消耗 token。

**Headroom 做的事很简单**：在 Claude Code 和 LLM 之间当一层过滤器。内容发出去之前自动精简——去掉重复的、无关的、你已经看过的部分，只把真正有用的发给模型。

```text
原来：Claude Code → 5000 tokens 全发 → LLM
现在：Claude Code → Headroom 精简到 800 tokens → LLM
                              ↓
                    完整原文存本地（需要时可以取回）
```

省 60-95% token。压缩只要 1-5 毫秒，你感觉不到。

## 安装

需要 Python 3.10+。一行装好：

```bash
pip install "headroom-ai[all]"
```

验证：

```bash
headroom --version
```

:::warning
完整安装约 2GB（含 PyTorch 等 ML 依赖）。如果在意磁盘空间，用精简版也能满足大部分场景：

```bash
pip install "headroom-ai[proxy]"
```
:::

## 使用

### 最简单的方式

```bash
headroom wrap claude
```

就这一行。Headroom 自动启动、自动配置、自动开始压缩。你正常用 Claude Code 就行，啥也不用管。

### 想看省了多少

在另一个终端：

```bash
curl http://127.0.0.1:8787/stats
```

输出大概长这样：

```json
{
  "requests_compressed": 156,
  "total_tokens_before": 2450000,
  "total_tokens_after": 620000,
  "savings_percent": 74.7
}
```

74.7% — 就是说原本要花 $10 的会话，现在花 $2.5。

### 想关掉

`headroom wrap claude` 开的终端，关掉就行。下次不加 wrap 直接 `claude` 就是没压缩的状态。

### 手动控制（进阶）

如果你不想用 wrap，也可以自己控制：

```bash
# 终端 1：启动代理
headroom proxy --port 8787

# 终端 2：让 Claude Code 走代理
ANTHROPIC_BASE_URL=http://127.0.0.1:8787 claude
```

手动模式的好处：你可以随时停代理、换端口、加参数。

### 配合 CC Switch 使用

CC Switch 和 Headroom 都想控制 `ANTHROPIC_BASE_URL`——CC Switch 通过写入配置文件，Headroom 通过设置环境变量或代理。直接让 CC Switch 改成指向 Headroom 是没用的，因为 CC Switch 下次切换 Provider 又会覆盖掉。

**正确做法**：让 Headroom 的 `headroom wrap` 接管启动，它的环境变量优先级比 CC Switch 的配置文件高。CC Switch 继续管 MCP、Skills、Prompt 这些不需要改 API 地址的功能。

```bash
# 直接用 wrap 启动，env var 会覆盖 CC Switch 的配置文件
headroom wrap claude
```

这样 Claude Code 走 Headroom 代理，CC Switch 的 Provider 设置被忽略（但 MCP、Skills 管理不受影响）。

**如果你确实需要通过 CC Switch 切换后端**，不要用 CC Switch 改 `ANTHROPIC_BASE_URL`，而是改 Headroom 的转发目标：

```bash
# 用 Anthropic
headroom wrap claude

# 换 DeepSeek —— 改 Headroom 的转发目标，不改 CC Switch
ANTHROPIC_TARGET_API_URL=https://api.deepseek.com/anthropic headroom wrap claude

# 换其他兼容后端
ANTHROPIC_TARGET_API_URL=https://your-endpoint headroom wrap claude
```

换后端时改 `ANTHROPIC_TARGET_API_URL`，不改 `ANTHROPIC_BASE_URL`。CC Switch 的 Provider 切换功能暂时不用——等 Headroom 关了再恢复。

:::tip
**一句话总结**：CC Switch 管 MCP 和 Skills，Headroom 接管 API 转发。Provider 切换通过 Headroom 的 `ANTHROPIC_TARGET_API_URL` 来换。
:::

## 实际效果

用具体例子感受一下压缩做了什么：

### 搜索代码

```
没开 Headroom：
grep 返回 600 行匹配结果 → 全发给 LLM → 12000 tokens

开了 Headroom：
grep 返回 600 行 → 保留匹配行 + 前后 2 行 → 800 tokens
```

模型看到的内容从 600 行缩减到 20 行关键匹配，但判断能力完全不受影响——剩下的 580 行本来就是重复模板。

### 读文件

```
没开 Headroom：
Read UserService.java → 整个 400 行文件进上下文 → 8000 tokens

开了 Headroom：
Read UserService.java → 保留 import + 方法签名 + 你关注的函数体 → 1200 tokens
```

### 测试报错

```
没开 Headroom：
跑测试炸了 → 2000 行输出全发 → 40000 tokens

开了 Headroom：
跑测试炸了 → 只保留失败的用例 + 错误栈关键帧 → 1500 tokens
```

## 实战：日常开发全流程

### 场景

工作日早上，打开项目开始写一个用户列表分页功能。

### 怎么用

```bash
# 1. 启动
headroom wrap claude

# 2. 正常开发
> 给用户列表接口加分页，一页 20 条，按注册时间倒序
```

然后该怎么用怎么用——让 Claude 搜代码、读文件、写代码、跑测试。Headroom 在后台默默压缩。

一上午下来，查一下：

```bash
curl http://127.0.0.1:8787/stats
# savings_percent: 71.3
```

跟平时一样的开发体验，token 消耗少了七成。

### 什么时候开、什么时候关

| 开 | 关 |
|----|-----|
| 日常开发，读写多个文件 | 改一行配置就完事 |
| 跑全量测试、看日志 | 调试诡异 bug（需要完整上下文） |
| CI 自动脚本 | 快速原型，几句话就结束的会话 |
| 和 Codex 一起用 | — |

简单判断：**会话超过 10 轮就开，5 轮以内的小改动不用开**。

## 常见问题

### 压缩后 Claude 会变笨吗？

不会。Headroom 精简的是"噪音"（重复日志、无关代码、冗余堆栈），不是"信息"。关键的错误消息、函数签名、匹配上下文都保留了。而且被删掉的内容存在本地，模型真需要时可以取回。

实际上，去掉噪音后 Claude 更容易聚焦在关键信息上。

### 装完就能用吗？要不要配置？

`headroom wrap claude` 零配置。装上就能用。

### 和 CC Switch 会冲突吗？

两者都想改 `ANTHROPIC_BASE_URL`，直接一起用会冲突。解决方法见上面 [配合 CC Switch 使用](#配合-cc-switch-使用)——让 CC Switch 指向 Headroom 代理，Headroom 再转发到真正的后端。

### 对电脑性能有影响吗？

代理本身很轻：50-100MB 内存，压缩一次 1-5 毫秒。日常使用感觉不到它的存在。

### 我怎么知道真的省了？

两个方法：
1. `curl http://127.0.0.1:8787/stats` 看实时统计
2. 月底对比 Anthropic 账单（开了 Headroom 的月份 vs 没开的月份）

## 下一步

- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理多工具环境变量和 MCP 配置
- [上下文管理](/guide/intermediate/context-management) — Token 管理与上下文优化策略
- [Claude-Mem 持久记忆](/guide/advanced/claude-mem) — 跨会话的自动化记忆系统
- [技巧与最佳实践](/tips/best-practices) — 更多高效使用技巧
