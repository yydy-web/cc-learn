---
title: Agent Browser — AI 原生浏览器自动化
description: agent-browser CLI 为 Claude Code 提供 AI 原生浏览器控制——refs 元素定位、语义查找、会话管理、截图验证，无需手写选择器
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★★★  | ★★★☆☆    |
| 📦 产品 | ★★★☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握 agent-browser 浏览器自动化代理，能独立用 refs 系统和语义查找完成 Web 页面操作和自动化测试

**🚀 AI 能力提升：** 测试生成、自动化工作流
:::

# Agent Browser — AI 原生浏览器自动化

> 不是给人类用的浏览器——是专门给 AI 设计的。用 refs 定位元素，用语义查找代替 CSS 选择器，用 accessibility tree 理解页面。

## 概述

**agent-browser** 是一个为 AI Agent 设计的无头浏览器 CLI 工具。和传统浏览器自动化工具（Playwright、Selenium）的核心区别：

|            | Playwright / Puppeteer        | agent-browser                                        |
| ---------- | ----------------------------- | ---------------------------------------------------- |
| 定位方式   | CSS 选择器、XPath（给人写的） | **refs 系统**（`@e1`, `@e2`——给 AI 读的）            |
| 页面理解   | DOM 树（海量噪音）            | **accessibility tree**（结构化语义）                 |
| 查找元素   | `.btn-primary.submit.large`   | **语义查找**：`find role button click --name "提交"` |
| 会话管理   | 手动                          | `--session` 标志自动隔离 cookie/登录态               |
| 截图为证据 | 需额外代码                    | 内置 `screenshot` 用于视觉确认                       |

**为什么 AI 需要专用浏览器**：AI 不擅长解析海量 DOM 节点和记忆 CSS 选择器。agent-browser 把页面转换成 refs 标注的 accessibility tree，AI 直接看结构化摘要就能理解页面、定位元素。

## 安装

```bash
# 1. 安装 CLI
npm install -g agent-browser

# 2. 下载 Chromium
agent-browser install

# 3. 验证
agent-browser --version
# 输出：0.18.0 或更高
```

Windows 用户如果 `agent-browser` 命令不生效，用 `npx agent-browser` 替代。

## 核心概念：refs 系统

打开页面后，每个可交互元素获得一个**唯一 ref**（`@e1`、`@e2`...）：

```bash
agent-browser open https://example.com/login
agent-browser snapshot -i --json
```

返回：

```json
{
  "elements": [
    { "ref": "@e1", "role": "textbox", "name": "邮箱", "placeholder": "请输入邮箱" },
    { "ref": "@e2", "role": "textbox", "name": "密码", "type": "password" },
    { "ref": "@e3", "role": "button", "name": "登录" }
  ]
}
```

之后的操作都用 ref 引用：

```bash
agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "mypassword"
agent-browser click @e3
```

**不需要 CSS 选择器。不需要 XPath。** AI 读 snapshot → 知道 `@e1` 是邮箱框 → 操作 `@e1`。

## 命令速查

### 导航

```bash
agent-browser open https://example.com          # 打开页面
agent-browser goto https://example.com/dashboard # 跳转
agent-browser back                               # 后退
agent-browser reload                             # 刷新
```

### 获取页面信息

```bash
agent-browser snapshot             # 完整 accessibility tree
agent-browser snapshot -i          # 仅可交互元素
agent-browser snapshot -i --json   # JSON 格式（AI 最常用）
agent-browser screenshot result.png # 截图
agent-browser get text @e1         # 获取元素文本
agent-browser get url              # 获取当前 URL
agent-browser get title            # 获取页面标题
```

### 交互操作

```bash
agent-browser click @e3           # 点击
agent-browser dblclick @e3        # 双击
agent-browser fill @e1 "内容"     # 填充输入框
agent-browser type @e1 "逐字输入" # 逐字符输入
agent-browser press Enter          # 按键
agent-browser check @e4           # 勾选复选框
agent-browser select @e5 "选项"   # 选择下拉项
agent-browser upload @e6 file.pdf # 上传文件
```

### 语义查找（无 ref 时使用）

```bash
agent-browser find role button click --name "提交"
agent-browser find text "注册" click
agent-browser find label "邮箱" fill "user@example.com"
agent-browser find placeholder "搜索…" type "关键词"
```

### 等待

```bash
agent-browser wait @e1                    # 等待元素出现
agent-browser wait --text "加载完成"      # 等待文本出现
agent-browser wait --url /success         # 等待 URL 变化
agent-browser wait --load                  # 等待页面加载完成
```

## 在 Claude Code 中使用

### 方式一：直接调用（零配置）

在 Claude Code 终端中直接用 Bash 调用：

```bash
# Claude Code 会在对话中直接执行这些命令
agent-browser open https://example.com && agent-browser snapshot -i --json
```

Claude 读 JSON 输出 → 理解页面结构 → 决定下一步操作。

### 方式二：安装技能插件

```bash
# 安装 agent-browser 技能（包装了完整工作流）
/plugin marketplace add OWENLEEzy/agent-browser-skill
/plugin install agent-browser-skill@agent-browser-skill
```

安装后 Claude Code 自动知道如何用 4 阶段协议操作浏览器。

### 方式三：MCP 接入（agent-browser-protocol）

```bash
claude mcp add browser -- npx -y agent-browser-protocol --mcp
```

之后 Claude Code 通过 MCP 直接控制浏览器，工具调用更自然。

## 实战用例

### 用例 1：自动填表 + 截图验证

```text
> 打开 https://example.com/register，填注册表单，截图确认：
> 1. 打开页面，snapshot -i --json 看有哪些字段
> 2. fill 每个字段（姓名、邮箱、密码）
> 3. click 注册按钮
> 4. wait --url /welcome 确认跳转到欢迎页
> 5. screenshot welcome.png 截图存证
```

Claude Code 执行流程：

```bash
agent-browser open https://example.com/register
agent-browser snapshot -i --json
# Claude 读 JSON → @e1=姓名框, @e2=邮箱框, @e3=密码框, @e4=注册按钮
agent-browser fill @e1 "张三"
agent-browser fill @e2 "zhangsan@example.com"
agent-browser fill @e3 "securepass123"
agent-browser click @e4
agent-browser wait --url /welcome
agent-browser screenshot welcome.png
```

### 用例 2：数据抓取 + 翻页

```text
> 从 https://example.com/products 抓取前 3 页的产品名称和价格：
> 1. snapshot -i --json 看页面结构
> 2. get text 提取每个产品卡片的信息
> 3. find text "下一页" click 翻页
> 4. 重复直到第 3 页
```

### 用例 3：登录态保持 + 多步骤操作

```bash
# 登录一次，保存状态
agent-browser --session=admin open https://example.com/login
agent-browser snapshot -i --json
agent-browser fill @e1 "admin@example.com"
agent-browser fill @e2 "password"
agent-browser click @e3
agent-browser wait --url /dashboard
agent-browser save-state admin-auth.json

# 后续会话直接加载登录态
agent-browser --session=admin load-state admin-auth.json
agent-browser --session=admin open https://example.com/admin/users
agent-browser snapshot -i --json
```

### 用例 4：并行多会话

```bash
# 两个独立会话同时跑——不同的登录态、互不干扰
# 会话 1：管理员操作后台
agent-browser --session=admin open https://example.com/admin
# 会话 2：普通用户测试前端
agent-browser --session=user open https://example.com/dashboard
```

### 用例 5：E2E 测试的一次性脚本

```text
> 写一个 E2E 验证流程：
> 1. 打开首页 → screenshot 确认渲染正常
> 2. 点击"登录" → fill 账号密码 → click 提交
> 3. wait --url /dashboard 确认登录成功
> 4. 点击"我的订单" → 确认列表页有数据
> 5. 如果任何一步失败，screenshot 当时的状态，报告原因
```

### 用例 6：API Mock + 前端验证

```bash
# 拦截 API 请求，返回 mock 数据
agent-browser route --mock /api/users '[{"id":1,"name":"测试用户"}]'

# 打开页面，验证 mock 数据正确渲染
agent-browser open https://example.com/users
agent-browser snapshot -i --json
# 检查页面上是否出现了"测试用户"
agent-browser get text @e1
```

## 会话管理

```bash
agent-browser session list                    # 列出所有活跃会话
agent-browser session close admin             # 关闭指定会话
agent-browser session close-all               # 关闭全部会话
```

每个 `--session` 有独立的：

- cookie 和 localStorage
- 登录状态
- 导航历史

适合同时跑多个测试、不同角色登录、或 A/B 对比。

## 网络拦截

```bash
# 阻止图片和字体加载（加速页面）
agent-browser route --block "*.png" --block "*.jpg" --block "*.woff2"

# Mock API 响应
agent-browser route --mock /api/status '{"ok":true}'

# 拦截所有分析请求
agent-browser route --block "*google-analytics*" --block "*facebook.com/tr*"
```

## 调试技巧

```bash
# 启用控制台日志
agent-browser open https://example.com --console

# 高亮当前操作的元素（方便截图确认）
agent-browser click @e3 --highlight

# 开启 trace（记录每一步）
agent-browser open https://example.com --trace

# 每步操作后自动截图
agent-browser click @e4 && agent-browser screenshot step1.png
```

## AI 工作流最佳实践

```text
1. 先 snapshot -i --json → 理解页面有什么
2. 用 refs 操作元素 → 不写选择器
3. 操作后等一等 → wait --load 或 wait @target
4. 截图确认 → screenshot 作为视觉证据
5. 语义查找做兜底 → 当 refs 不可用时用 find 命令
6. 保存登录态 → save-state / load-state 避免反复登录
7. 用完关会话 → session close 释放资源
```

## 故障排除

| 问题                               | 原因                    | 解决                                       |
| ---------------------------------- | ----------------------- | ------------------------------------------ |
| `agent-browser: command not found` | 全局安装未生效          | 用 `npx agent-browser` 或检查 PATH         |
| `snapshot 后 ref 变化`             | 页面动态渲染            | 在 `wait --load` 之后再 snapshot           |
| `click @e3 没反应`                 | ref 已过期              | 重新 snapshot 获取新 ref                   |
| `find 命令找不到元素`              | 页面未加载完成          | 先 `wait --load` 或 `wait --text "关键词"` |
| `--session 隔离失效`               | 忘记加 `--session` 标志 | 每个并行任务加不同的 `--session=名称`      |
| Windows 报错 `/bin/sh`             | PowerShell 语法冲突     | 用 `npx agent-browser` 并注意引号          |
| Linux 缺少依赖                     | Playwright 系统库不足   | `agent-browser install --with-deps`        |

## 与 Chrome DevTools MCP 的选择

| 场景                                     | 推荐工具                                                   |
| ---------------------------------------- | ---------------------------------------------------------- |
| AI 驱动的自动化（Claude 自己操作浏览器） | **agent-browser**（AI 原生 refs 系统）                     |
| 人工调试前端（CSS/JS/性能/网络）         | [Chrome DevTools MCP](/guide/advanced/chrome-devtools-mcp) |
| 传统 E2E 测试脚本（人写代码）            | Playwright / Cypress                                       |
| 受 Cloudflare/Bot 保护的站点             | pluckor（用真实 Chrome 绕检测）                            |
| 全自动测试 + 生成 + 自愈                 | vigilis-mcp                                                |

**简单判断**：如果是你在 Claude Code 里说"帮我去这个网站看看/填个表/抓点数据" → agent-browser。如果你是前端开发在调 CSS/看网络请求/测性能 → Chrome DevTools MCP。

## 与其他浏览器工具对比

|               | agent-browser     | Playwright MCP        | ABP (agent-browser-protocol) |
| ------------- | ----------------- | --------------------- | ---------------------------- |
| CLI 工具      | `agent-browser`   | `npx @playwright/mcp` | `npx agent-browser-protocol` |
| 定位方式      | refs + 语义查找   | CSS/XPath/text        | refs + 确定性步骤            |
| AI 原生       | ✅                | 中等                  | ✅                           |
| 冻结 JS       | ❌                | ❌                    | ✅（步骤间暂停 JS）          |
| Mind2Web 得分 | —                 | —                     | 90.53%                       |
| 接入方式      | 直接 Bash / Skill | MCP                   | MCP + REST                   |

---

## 相关页面

- [Chrome DevTools MCP](/guide/advanced/chrome-devtools-mcp) — Google 官方 Chrome DevTools 调试工具
- [Loop 工程](/tips/loop-engineering) — 用 `/goal` + agent-browser 做全自动 E2E 验证
- [AI 生成代码自检](/tips/self-check) — 端到端验证的五步法
- [agent-browser-skill (GitHub)](https://github.com/OWENLEEzy/agent-browser-skill) — 4 阶段协议技能
- [agent-browser-protocol (GitHub)](https://github.com/theredsix/agent-browser-protocol) — 90%+ Mind2Web 的 Chromium 分支
