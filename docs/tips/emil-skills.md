---
title: Emil Design Skills
description: Emil Kowalski 的设计工程 Skills——让 Claude Code 写出"感觉对"的 UI，不再用 ease-in 和 scale(0)
---

# Emil Design Skills

> 你的动画用 `ease-in`，按钮从 `scale(0)` 弹出来，Toast 用 keyframe 写了 40 行。Emil 看了一眼，全删了。

## 是什么

[emilkowalski/skills](https://github.com/emilkowalski/skills) — Emil Kowalski（Sonner、VAUL 的作者）把十年 UI 打磨直觉编码成 Claude Code 可执行的硬规则。两个 Skill：

| Skill | 一句话 | 什么时候用 |
|---|---|---|
| `emil-design-eng` | 动画决策框架 + 组件原则 + 性能规则 | 写 UI 代码时激活 |
| `review-animations` | 10 条不可协商标准，逐行动效审查 | Code Review / PR 审查 |

## 为什么需要它

Claude Code 默认写的 UI **能跑，但感觉不对**：

```css
/* Claude Code 默认写的 */
.modal {
  animation: popIn 300ms ease-in; /* ease-in 入场 = 迟钝感 */
}
@keyframes popIn {
  from { transform: scale(0); opacity: 0; } /* scale(0) = 从无到有，不自然 */
  to   { transform: scale(1); opacity: 1; }
}

/* Emil Skills 之后 */
.modal {
  animation: popIn 250ms ease-out; /* ease-out 入场 = 利落 */
}
@keyframes popIn {
  from { transform: scale(0.95); opacity: 0; } /* scale(0.95) = 从近到远，自然 */
  to   { transform: scale(1); opacity: 1; }
}
```

两处改动，感觉天差地别。Emil Skills 让这种判断自动化。

## 安装

```bash
npx skills@latest add emilkowalski/skills
```

装完就有 `/emil-design-eng` 和 `/review-animations` 两个命令。

## 核心决策框架

Emil 不鼓励"到处加动画"。每次动效决策走四问：

```text
1. 要动吗？→ 100+/天不动的，几十次/天减动的，偶尔才动的标准，罕见的可惊喜
2. 为什么动？→ 空间一致/状态指示/反馈/防突兀。理由只有"酷"→ 跳过
3. 怎么缓动？→ 入场 ease-out，屏内移动 ease-in-out，悬停 ease。ease-in 永不用
4. 多快？→ 按钮 100-160ms，Tooltip 125-200ms，下拉 150-250ms，弹窗 200-500ms
```

## 三条铁律

```css
/* 铁律一：只动 transform 和 opacity */
/* ✅ GPU 加速，不触发 Layout/Paint */
.element { transition: transform 200ms ease-out, opacity 200ms ease-out; }
/* ❌ 触发布局重排 */
.element { transition: width 200ms, height 200ms; }
/* ❌ 性能黑洞——无界属性 */
.element { transition: all 300ms; }

/* 铁律二：永远不从 scale(0) 开始 */
/* ✅ 从 0.95 + opacity:0 → 1 + opacity:1 */
.modal { transform: scale(0.95); opacity: 0; }
.modal.open { transform: scale(1); opacity: 1; }

/* 铁律三：UI 动画全在 300ms 以内 */
/* ✅ 按钮：160ms，下拉：200ms，弹窗：250ms */
```

## 实战场景

### 场景一：写一个下拉菜单

**你输入**：

```text
/emil-design-eng 帮我写一个下拉菜单组件，点击按钮展开选项列表
```

**不用 Emil Skills，Claude Code 会写**：

```tsx
// ❌ 三个问题：ease-in、scale(0)、transform-origin 默认 center
function Dropdown() {
  return (
    <div className={open ? 'dropdown open' : 'dropdown'}>
      {items.map(i => <div key={i} onClick={select}>{i}</div>)}
    </div>
  )
}
```
```css
.dropdown {
  transform-origin: center;       /* ❌ 从屏幕中心展开，和按钮无关 */
  transform: scale(0);
  transition: all 300ms ease-in;  /* ❌ ease-in + all */
}
.dropdown.open {
  transform: scale(1);
}
```

**用 Emil Skills 之后**：

```tsx
// ✅ transform-origin 从触发点展开，scale(0.95) 起，ease-out
function Dropdown() {
  return (
    <div className={open ? 'dropdown open' : 'dropdown'}>
      {items.map(i => <div key={i} className="dropdown-item" onClick={select}>{i}</div>)}
    </div>
  )
}
```
```css
.dropdown {
  transform-origin: var(--radix-popover-content-transform-origin); /* ✅ 从触发点 */
  transform: scale(0.95);
  opacity: 0;
  transition: transform 200ms ease-out, opacity 150ms ease-out; /* ✅ 只动 GPU 属性 */
}
.dropdown.open {
  transform: scale(1);
  opacity: 1;
}
.dropdown-item:active {
  transform: scale(0.97); /* ✅ 按下反馈 */
  transition: transform 100ms ease-out;
}
```

**差在哪**：三行 CSS 改动，菜单从"飘出来"变成"从按钮展开"。用户感觉不到动画存在——这才是好的动画。

### 场景二：审查 PR 中的动效代码

**你在 PR 页面，输入**：

```text
/review-animations 审查这个 PR 里的所有动画
```

**输出格式是固定三列表格**：

| Before | After | Why |
|---|---|---|
| `transition: all 300ms` L24 | `transition: transform 200ms ease-out, opacity 200ms ease-out` | `all` 触发所有属性动画，Layout/Paint 每帧重算 |
| `@keyframes toastIn` L45-52 | 改用 CSS transition + `@starting-style` | Toast 快速连续触发，keyframe 每次从 0 开始 |
| `ease-in` L18 | `ease-out` | 入场用 ease-in 起始慢，用户感觉响应迟钝 |
| 缺少 `prefers-reduced-motion` | 加 `@media (prefers-reduced-motion: reduce)` | 无障碍要求，动效敏感用户需要关闭移动类动画 |

**然后你说**：

```text
> 帮我处理这四条
```

Claude Code 自动修完，你只需要 review 改动。

### 场景三：Toast 通知组件

Sonner 是 Emil 的代表作。他 Skills 内置了 Sonner 原则，写 Toast 时自动遵守：

**不用 Emil Skills 会写成**：

```tsx
// ❌ hooks + context + keyframe + 40 行
const { toasts, addToast, removeToast } = useToast()

function ToastContainer() {
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.message}
            <button onClick={() => removeToast(t.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
```
```css
.toast {
  animation: slideIn 300ms ease-in; /* ❌ ease-in + keyframe */
}
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
```

**用 Emil Skills 之后**：

```tsx
// ✅ 一个函数调用，transition 而非 keyframe，ease-out 入场
import { toast } from 'sonner'

// 用就行
toast('操作成功')
toast.error('提交失败，请重试')
```
```css
/* Sonner 内部用的方式 */
[data-sonner-toast] {
  transition: transform 200ms ease-out, opacity 200ms ease-out;
  /* ✅ transition 可从当前状态插值，快速连续触发不跳帧 */
}
```

**核心差异**：

| | 普通写法 | Emil 风格 |
|---|---|---|
| DX | hooks + context + provider | `toast('消息')` 一行 |
| 动画 | keyframe，每次从 0 开始 | transition，从当前状态插值 |
| 缓动 | `ease-in` | `ease-out` |
| 依赖 | 自建 40 行 | sonner 零配置 |

### 场景四：拖拽排序

**你输入**：

```text
/emil-design-eng 帮我写一个可拖拽排序的列表
```

**不用 Emil Skills**：

```css
.drag-item {
  transition: transform 300ms ease; /* ❌ CSS transition 跟不上手指 */
}
```

手指拖到哪，元素追到哪——中间永远差一截。CSS transition 有固定时长，不适合实时跟踪。

**用 Emil Skills 之后**：

```jsx
// ✅ 弹簧动画——可中断、跟手、有惯性
import { useSpring, animated } from '@react-spring/web'

function DraggableList({ items }) {
  const [springs, api] = useSprings(items.length, i => ({
    y: i * 60,
    config: { tension: 300, friction: 30 } /* ✅ 模拟物理 */
  }))

  // 拖拽时更新弹簧目标值，自动平滑过渡
  const handleDrag = (index, offset) => {
    api.start(i => {
      if (i === index) return { y: offset, immediate: true } /* 手指下的元素立即跟随 */
      // 其他元素用弹簧推开
      return { y: /* 根据新位置计算 */, config: { tension: 300, friction: 30 } }
    })
  }
}
```

**什么时候用 Spring 什么时候用 CSS transition**：

| 场景 | 用 | 原因 |
|------|-----|------|
| 拖拽、手势 | Spring | 实时跟随，可中断，物理惯性 |
| 按钮按下、弹窗进出 | CSS transition | 预设路径，GPU 加速，主线程外运行 |
| Toast 通知 | CSS transition | 可快速连续触发，从当前状态插值 |
| 开关切换 | CSS transition | 两个状态之间，路径固定 |

## 性能对照

```css
/* ❌ Framer Motion 简写——不是硬件加速 */
<motion.div animate={{ x: 100, y: 50, scale: 1.1 }} />

/* ✅ 完整 transform 字符串——GPU 加速 */
<motion.div animate={{ transform: 'translate(100px, 50px) scale(1.1)' }} />

/* ❌ CSS 变量驱动子元素 transform——更新父级触发全部子元素重算 */
.parent { --child-y: 100px; }
.child { transform: translateY(var(--child-y)); }

/* ✅ 直接更新子元素 transform——只动一个 */
.child { transform: translateY(100px); }
```

**核心原则**：CSS 动画跑在主线程外 → JS 卡了动画不卡。用 CSS transition 做 UI 动效，用 JS Spring 做手势交互。

## `review-animations` 10 条标准速查

审查时逐条对照。命中任一条 → 标记为需修改。

| # | 查什么 | 红线 |
|---|--------|------|
| 1 | 动画有理由吗 | "看起来酷"且高频 → 删 |
| 2 | 频率匹配吗 | 键盘触发 / 100+次/天 → 删 |
| 3 | 缓动对吗 | `ease-in` 在 UI 上 → 拒 |
| 4 | 300ms 以内吗 | 超了且没理由 → 改 |
| 5 | 原点对吗 | 弹窗从 center 展开而非触发点 → 改 |
| 6 | 可中断吗 | keyframe 用在 Toast/Toggle → 改 transition |
| 7 | 只动 GPU 属性吗 | 动了 width/height/margin → 改 |
| 8 | 有无障碍吗 | 缺 `prefers-reduced-motion` → 补 |
| 9 | 进出不对称吗 | 进场慢退场快，反过来是问题 |
| 10 | 整体协调吗 | 不确定 → 删 |

## 和 Ponytail 的关系

Emil Skills 是 **Ponytail 在前端 UI 层的具体化**。Ponytail 的阶梯是"能用原生就别装库"，Emil 的阶梯是：

```text
1. 这个动画需要存在吗？→ 和 Ponytail 第一级一样
2. CSS transition 够吗？→ 能不用 JS 动画就不用
3. 原生 `<dialog>` 够吗？→ 能不装 Radix 就不装
4. 缓动对吗？→ ease-out，不是 ease-in
5. 性能对吗？→ 只动 transform/opacity
```

两者互补：Ponytail 管"少写代码"，Emil 管"写对的代码"。

```text
/ponytail full                  ← 少写
/emil-design-eng 帮我写         ← 写对
/review-animations 审查         ← 确认对
```

## 速查：你输入什么

| 你要做什么 | 你输入什么 |
|-----------|-----------|
| 写 UI 组件，自动遵守动效规则 | `/emil-design-eng 帮我写一个 [组件名]` |
| 审查 PR 的动效代码 | `/review-animations` |
| 检查某个组件的动画有没有问题 | `/review-animations 检查 src/components/Dropdown.tsx` |
| 不确定某个动画要不要加 | `/emil-design-eng 这个按钮点击时要不要加缩放动画？每天点击约 200 次` |

## 延伸

- [emilkowalski/skills](https://github.com/emilkowalski/skills) — 源码
- [animations.dev](https://animations.dev) — Emil 的动效教程
- [Sonner](https://sonner.emilkowal.ski/) — Toast 库，Skills 中原则的来源
