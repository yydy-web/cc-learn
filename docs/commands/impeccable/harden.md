---
title: Harden 命令
description: Impeccable Harden 类命令参考，涵盖 harden、onboard、optimize 和 polish 四个命令的完整用法
---

# Harden 命令

Harden 类命令用于加固和完善已有功能，使产品达到生产就绪状态。它们覆盖了错误处理、用户引导、性能优化和最终打磨。

## harden

生产加固 — 添加错误处理、国际化支持和边界情况处理。

### 用法

```bash
/impeccable harden <target>
```

### 适用场景

功能已基本完成，但需要提升健壮性。

### 工作原理

`harden` 专注于生产环境必备的加固工作：

- **错误处理** — 添加 try/catch、错误边界、友好的错误提示
- **国际化** — 提取可翻译的字符串，支持多语言
- **边界情况** — 处理空状态、加载失败、网络异常等场景

### 示例

```bash
/impeccable harden form
/impeccable harden api-client
/impeccable harden checkout-flow
```

### 注意事项

- 不要用于还在开发中的功能 — 先完成基本功能再加固
- 不要替换错误处理逻辑 — 先理清预期行为再添加保护

---

## onboard

首次体验优化 — 改善新用户的引导、空状态和激活路径。

### 用法

```bash
/impeccable onboard <target>
```

### 适用场景

功能需要为新用户提供友好的首次体验。

### 工作原理

`onboard` 优化用户首次接触功能时的体验：

- **首次运行体验** — 添加欢迎流程和功能介绍
- **空状态** — 设计有引导性的空白页面
- **激活路径** — 明确用户的下一步操作

### 示例

```bash
/impeccable onboard dashboard
/impeccable onboard project-setup
/impeccable onboard team-invite
```

### 注意事项

- 不要过度引导 — 新用户需要快速上手，而非冗长教程
- 不要假设用户背景 — 提供足够的上下文信息

---

## optimize

性能优化 — 改善 LCP、减少包体积和提升加载速度。

### 用法

```bash
/impeccable optimize <target>
```

### 适用场景

功能需要提升性能表现。

### 工作原理

`optimize` 关注可衡量的性能指标：

- **LCP（Largest Contentful Paint）** — 优化最大内容绘制时间
- **包体积** — 分析和压缩 JavaScript、CSS 资源
- **加载速度** — 优化关键渲染路径和资源优先级

### 示例

```bash
/impeccable optimize images
/impeccable optimize landing-page
/impeccable optimize bundle
```

### 注意事项

- 不要盲目优化 — 先用性能分析工具定位瓶颈
- 不要牺牲可读性 — 过度压缩的代码难以维护

---

## polish

最终打磨 — 发布前的细节检查和质量提升。

### 用法

```bash
/impeccable polish <target>
```

### 适用场景

功能已完成所有开发，准备发布前的最后检查。

### 工作原理

`polish` 是发布前的最后一道关卡：

- **视觉一致性** — 确保设计系统的一致性
- **交互细节** — 完善微交互和过渡效果
- **可访问性** — 检查键盘导航和屏幕阅读器支持
- **响应式** — 验证不同屏幕尺寸的表现

### 示例

```bash
/impeccable polish all
/impeccable polish hero-section
/impeccable polish navigation
```

:::warning
`polish` 是**最后一步**，不是第一步。不要在功能未完成时运行，也不要把 polish 当作设计重做。
:::

### 注意事项

- 不要在未完成的功能上运行 — polish 只做微调，不做结构改动
- 不要把 polish 当作重做 — 如果需要大幅修改，回到 create 或 refine 阶段
- 不要跳过测试 — polish 前确保功能已经过充分测试

## 下一步

- [Create 命令](/commands/impeccable/create) — 从零开始创建新功能
- [Evaluate 命令](/commands/impeccable/evaluate) — 评估设计质量和一致性
- [Refine 命令](/commands/impeccable/refine) — 优化视觉和交互细节
- [Simplify 命令](/commands/impeccable/simplify) — 简化和澄清设计
- [System 命令](/commands/impeccable/system) — 设计系统级别的自动化支持
