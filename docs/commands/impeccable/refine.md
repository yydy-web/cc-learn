---
title: Refine 命令
description: Impeccable Refine 系列命令的完整参考，涵盖动画、色彩、布局、排版、微交互和视觉冲击力等优化操作
---

# Refine 命令

Refine 系列命令用于优化现有设计的视觉表现，从动画、色彩到布局和排版，提供全方位的精细化调整。每个命令针对特定维度的优化，你可以单独使用或组合调用以达到最佳效果。

## animate

Purposeful motion — 有目的的动效，用于传达状态而非装饰。

```bash
/impeccable animate <target>
```

`animate` 为目标元素添加有意义的动画和过渡效果，使状态变化更加自然流畅。动效应当服务于用户体验，而非单纯增加视觉吸引力。

**适用场景：**

- 页面加载过渡
- 状态切换反馈
- 导航动效
- 表单交互反馈

## bolder

Push safe designs toward impact — 将保守的设计推向更有冲击力的方向。

```bash
/impeccable bolder <target>
```

`bolder` 增强设计的视觉冲击力和大胆程度，适用于过于保守或缺乏力量感的设计。通过放大关键元素、加强对比度和增加视觉层次，让设计更具吸引力。

**适用场景：**

- Hero 区域需要更强的视觉吸引力
- CTA 按钮需要更突出
- 页面整体缺乏力量感
- 首屏需要更震撼的视觉冲击

## colorize

Strategic coloring — 策略性着色，基于 OKLCH 色彩空间。

```bash
/impeccable colorize <target>
```

`colorize` 使用 OKLCH 色彩空间调整和优化设计的色彩方案。确保色彩的可用性、对比度和视觉和谐，同时保持设计系统的色彩一致性。

**适用场景：**

- 需要优化色彩方案
- 色彩对比度不足
- 想要探索新的色彩组合
- 需要确保色彩无障碍性

## delight

Add delight micro-interactions — 添加令人愉悦的微交互细节。

```bash
/impeccable delight <target>
```

`delight` 为界面添加令人惊喜的微交互和细节，提升用户的愉悦感。这些小而精致的交互能够显著提升产品的整体体验感受。

**适用场景：**

- 悬停状态需要更精致的反馈
- 按钮点击缺少趣味性
- 页面切换需要更流畅的体验
- 希望增加产品的个性和温度

## layout

Fix layout, spacing, visual rhythm — 修复布局、间距和视觉节奏。

```bash
/impeccable layout <target>
```

`layout` 优化元素的布局结构、间距比例和视觉节奏。确保页面具有一致的节奏感和舒适的视觉流，避免元素之间的拥挤或疏离。

**适用场景：**

- 元素间距不一致
- 布局结构混乱
- 视觉节奏不协调
- 响应式布局需要调整

## overdrive

Technically extraordinary effects — 技术层面的极致效果（WebGL、物理模拟、60fps）。

```bash
/impeccable overdrive <target>
```

`overdrive` 引入高级技术效果，包括 WebGL 渲染、物理模拟和高帧率动画。适用于需要突破常规视觉表现的场景，创造真正令人惊叹的交互体验。

**适用场景：**

- 需要 3D 视觉效果
- 物理模拟交互
- 高性能粒子系统
- 复杂的着色器效果

:::warning
`overdrive` 使用高级 WebGL 技术，需确保目标设备具有足够的 GPU 性能。在低端设备上可能影响页面加载速度。
:::

## quieter

Tone down overly bold designs — 降低过于大胆的设计。

```bash
/impeccable quiet <target>
```

`quieter` 与 `bolder` 相反，用于降低过于强烈的视觉表现。当设计过于夸张或分散用户注意力时，`quieter` 可以帮助恢复视觉平衡，让内容成为焦点。

**适用场景：**

- 视觉效果过于强烈
- 设计分散用户注意力
- 需要更内敛的风格
- 希望内容而非形式成为焦点

## typeset

Fix typography hierarchy and layout — 修复排版层级和布局。

```bash
/impeccable typeset <target>
```

`typeset` 优化字体排版的层级关系、行高、字间距和整体布局。确保文本的可读性和视觉层次，让排版成为设计的有力支撑。

**适用场景：**

- 标题层级不清晰
- 行高和字间距需要调整
- 文本可读性不足
- 排版风格需要统一

## 组合使用

Refine 命令可以组合使用以达到全面优化：

```bash
# 全面优化落地页
/impeccable layout landing
/impeccable typeset landing
/impeccable colorize landing

# 增强 Hero 区域
/impeccable bolder hero
/impeccable animate hero
/impeccable delight hero

# 简化过度设计的组件
/impeccable quiet sidebar
/impeccable typeset sidebar
```

## 下一步

- [Create 命令](/commands/impeccable/create) — 详细了解创建类命令
- [Evaluate 命令](/commands/impeccable/evaluate) — 详细了解评估类命令
- [Simplify 命令](/commands/impeccable/simplify) — 详细了解简化类命令
- [Harden 命令](/commands/impeccable/harden) — 详细了解加固类命令
- [System 命令](/commands/impeccable/system) — 详细了解系统类命令
