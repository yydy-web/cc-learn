---
title: Simplify 命令
description: Impeccable 的 Simplify 类命令参考，涵盖 adapt、clarify 和 distill 三个命令的完整用法
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★★☆  | ★★★☆☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握 Impeccable 简化阶段，能独立使用 adapt、clarify、distill 进行跨设备适配、文案优化和极简提炼

**🚀 AI 能力提升：** 代码审查
:::

# Simplify 命令

Simplify 类命令用于简化和优化已有内容。它们聚焦于适应性、清晰度和本质提炼，让设计更加精炼。

## adapt

跨屏幕、跨设备、跨场景适配 — 确保内容在所有环境中都能良好呈现。

### 用法

```bash
/impeccable adapt <target>
```

### 适用场景

- 需要响应式布局适配
- 内容需要在不同设备上保持一致性
- 特定组件需要跨场景复用

### 工作原理

`adapt` 分析目标内容的当前状态，识别在不同屏幕尺寸、设备类型或使用场景下的问题，然后生成适配方案。

### 示例

```bash
/impeccable adapt the hero section for mobile
/impeccable adapt the navigation for tablet
/impeccable adapt this card for both light and dark themes
```

### 注意事项

- 不要一次适配太多目标 — 逐个处理确保质量
- 适配时保持核心功能不变 — 只调整布局和呈现方式

---

## clarify

改善不清晰的 UX 文案 — 让用户一眼就能理解界面意图。

### 用法

```bash
/impeccable clarify <target>
```

### 适用场景

- 按钮文案含糊不清
- 错误信息让用户困惑
- 提示文本难以理解

### 工作原理

`clarify` 审查目标内容中的文案，识别歧义、冗余或过于技术化的表达，然后提供更清晰、更直观的替代方案。

### 示例

```bash
/impeccable clarify the error messages
/impeccable clarify this onboarding tooltip
/impeccable clarify the empty state copy
```

### 注意事项

- 不要为了简洁而牺牲信息量 — 清晰度优先
- 考虑目标用户的技术水平 — 避免不必要的专业术语

---

## distill

无情减法 — 剥离到本质，只保留真正必要的内容。

### 用法

```bash
/impeccable distill <target>
```

### 适用场景

- 界面元素过于复杂
- 页面信息过载
- 需要极简化设计

### 工作原理

`distill` 分析目标内容的每个元素，评估其必要性和价值，然后移除所有非核心内容，只保留最小化但完整的表达。

### 示例

```bash
/impeccable distill this settings page
/impeccable distill the dashboard layout
/impeccable distill this feature to its MVP
```

### 注意事项

- 不要害怕大幅删减 — 简化的本质是做减法
- 保留核心用户流程 — 功能完整性不能受损

## 下一步

- [Create 命令](/commands/impeccable/create) — 从零构建新功能
- [Evaluate 命令](/commands/impeccable/evaluate) — 审查和诊断设计问题
- [Refine 命令](/commands/impeccable/refine) — 微调和优化细节
- [Harden 命令](/commands/impeccable/harden) — 将功能推向生产就绪状态
- [System 命令](/commands/impeccable/system) — 设计系统级别的自动化支持
