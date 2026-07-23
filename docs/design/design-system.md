---
title: 设计系统维护
description: 用 Claude Code 管理设计 Token、维护组件库、保障多平台一致性——让产品在持续迭代中保持统一的设计语言
pageType: doc
---

# 设计系统维护

> 产品长到 10 个页面以后，最大的成本不是开发新功能，是修正不一致。设计系统就是解决这个问题的——而 Claude Code 是维护它的最佳工具。

## 为什么设计系统需要 Claude Code

传统设计系统的问题：

1. 设计 Token 在 Figma 里，前端代码硬编码色值——改一个主题色要改 50 个地方
2. 组件库文档靠人维护——人一懒文档就过期
3. 一致性检查靠 Code Review——人眼看不到第 3 个页面和第 15 个页面用了不同的阴影

Claude Code 不替你做设计决策——它替你执行、检查、同步设计规则。人做决策，AI 做执行。

## Step 1：建立设计 Token

设计 Token 是设计系统的原子单位。**一份 JSON 源文件，生成多端代码。**

创建 token 源文件 `design-tokens.json`：

```json
{
  "colors": {
    "primary": { "500": "#3B82F6", "600": "#2563EB" },
    "danger": { "500": "#EF4444" },
    "success": { "500": "#10B981" }
  },
  "spacing": { "sm": "8px", "md": "16px", "lg": "24px" },
  "borderRadius": { "sm": "4px", "md": "6px", "lg": "8px" },
  "fontSize": { "sm": "14px", "md": "16px", "lg": "18px" }
}
```

让 Claude Code 自动生成各平台代码：

```text
根据 design-tokens.json，生成对应的 Tailwind 配置、CSS 变量、TypeScript 常量。
命名用 --color-primary-500 格式，保持和 JSON 一致。
```

三个产出物示例：

**Tailwind 配置：**

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { 500: '#3B82F6', 600: '#2563EB' },
        danger: { 500: '#EF4444' },
        success: { 500: '#10B981' },
      },
      borderRadius: { sm: '4px', md: '6px', lg: '8px' },
    },
  },
}
```

**CSS 变量：**

```css
:root {
  --color-primary-500: #3B82F6;
  --color-primary-600: #2563EB;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --radius-sm: 4px;
  --radius-md: 6px;
}
```

**TypeScript 常量：**

```ts
export const colors = {
  primary: { 500: '#3B82F6', 600: '#2563EB' },
  danger: { 500: '#EF4444' },
} as const
```

:::tip
改 Token 的工作流：改 `design-tokens.json` -> Claude Code 自动更新三份导出 -> Git diff 复核。不需要手动同步。
:::

## Step 2：组件一致性检查

设计 Token 解决值的统一，组件一致性解决行为的统一。

```text
扫描 src/components/ 下所有文件，检查：

1. 是否有硬编码的颜色值（应该用 Tailwind class 或 CSS 变量）
2. 同一个交互在不同组件中是否一致
3. 是否有组件重复实现了已有基础组件
```

**实践：统一 TaskBoard 的按钮组件**

```text
分析 TaskBoard 项目中所有用到按钮的地方：
1. 列出所有按钮变体（颜色、大小、状态）
2. 设计一个统一 Button 组件
3. 把现有代码替换成新组件
```

Claude Code 生成的基础 Button 组件：

```tsx
type Variant = 'primary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  danger: 'bg-danger-500 hover:bg-danger-600 text-white',
  ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-900',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variantStyles[variant]} ${sizeStyles[size]}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? '加载中...' : children}
    </button>
  )
}
```

然后批量替换：

```text
把 src/ 下所有直接使用 <button> 的地方替换成 <Button>。
根据上下文推断 variant（创建=primary, 删除=danger, 取消=ghost）。
替换后跑 npm run build 确认。
```

## Step 3：自动化设计文档

组件库文档过期就失去价值。用 Claude Code 自动生成，确保和代码同步：

```text
扫描 src/components/ui/ 下所有组件，生成使用文档。每个组件包含：
- Props 表格（从 TypeScript 类型自动提取）
- 使用示例（从项目中找真实场景）
- 变体展示

写入 docs/components/ 目录。
```

:::tip
让文档生成成为 CI 的一部分：PR 合并时自动检查组件 Props 是否变化，变了但文档没更新则报警。
:::

## Step 4：迭代中的设计守护

最大挑战不是建立设计系统，是在迭代中不破坏它。

**策略 1：Git Hook 检查**

```json
{
  "hooks": {
    "PreCommit": [{
      "matcher": "*.{tsx,jsx,css}",
      "command": "claude '检查改动中是否有不使用 design-tokens.json 的硬编码值'"
    }]
  }
}
```

**策略 2：定期全量审计**

```text
对全项目做设计系统审计：
1. 列出所有硬编码颜色值，按出现次数排序
2. 检查是否有新增 variant 未记录
3. 找出样式重复的组件
4. 生成审计报告写入 docs/design-audit-YYYY-MM-DD.md
```

审计报告示例：

| 颜色 | 出现次数 | 建议 |
|------|----------|------|
| #3B82F6 | 12 | 已存在于 Token |
| #FB923C | 5 | 未在 Token 中，建议添加为 accent.500 |
| #000000 | 4 | 用 neutral.900 替代 |

## 设计 Token 演化策略

Token 不是一成不变的，但改动影响面大：

```
修改 Token 工作流：
1. 先在 design-tokens.json 中改值
2. 让 Claude Code 列出所有受影响的文件
3. 逐个确认改动是否符合预期
4. 重新生成所有导出文件
5. Git diff 复核 -> 提交
```

```text
我要把 primary-500 从 #3B82F6 改成 #4F46E5（Indigo）。
先列出所有受影响的文件和位置，不要直接改代码。
```

确认影响范围后再执行。注意：有些 `#3B82F6` 可能不是主题色而是独立蓝色元素（如信息提示框），Claude Code 在替换时需要区分。

## 常见问题

### 设计 Token 应该多细？

够用就好。实用标准：**你能用自然语言描述出来的设计变量，就值得放进 Token**。如果你需要说"第三个页面上那个稍微偏蓝的灰色"——说明这个值没有 Token，该加了。

### 组件优先级怎么排？

从高频开始：Button -> Input -> Card -> Modal -> Toast -> Dropdown -> Table -> Form -> Tabs。一个组件被超过 3 个页面使用就该收进组件库。

### Figma 和代码的 Token 怎么同步？

用 Figma MCP 读取 Figma 的 Design Token，和代码中 Token 做对比。参见 [Figma MCP 集成](/guide/advanced/figma-mcp)。

---

**返回：** [设计实战概述](./index) —— 查看完整教程地图。
