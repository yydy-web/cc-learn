---
title: Impeccable 命令概览
description: Impeccable 技能包含 23 个命令，用于设计系统管理、代码审查和前端开发工作流
---

# Impeccable 命令概览

Impeccable 是一个强大的设计系统技能，包含 23 个命令，通过 `/impeccable <command>` 语法调用。这些命令覆盖了从创建到优化的完整设计工作流。

## 命令分类

Impeccable 的 23 个命令按功能分为 6 个类别：

### Create（创建）

| 命令 | 说明 |
| :--- | :--- |
| [craft](/commands/impeccable/create#craft) | 从零开始创建新的设计组件或页面 |
| [impeccable](/commands/impeccable/create#impeccable) | 创建符合设计系统的完整页面 |
| [shape](/commands/impeccable/create#shape) | 塑造现有元素的设计结构 |

### Evaluate（评估）

| 命令 | 说明 |
| :--- | :--- |
| [audit](/commands/impeccable/evaluate#audit) | 审计设计系统的一致性和质量 |
| [critique](/commands/impeccable/evaluate#critique) | 对设计进行批判性分析和改进建议 |

### Refine（优化）

| 命令 | 说明 |
| :--- | :--- |
| [animate](/commands/impeccable/refine#animate) | 添加动画和过渡效果 |
| [bolder](/commands/impeccable/refine#bolder) | 增强视觉冲击力和大胆程度 |
| [colorize](/commands/impeccable/refine#colorize) | 调整和优化色彩方案 |
| [delight](/commands/impeccable/refine#delight) | 添加愉悦的微交互细节 |
| [layout](/commands/impeccable/refine#layout) | 优化布局结构和间距 |
| [overdrive](/commands/impeccable/refine#overdrive) | 全面提升设计质量 |
| [quieter](/commands/impeccable/refine#quieter) | 降低视觉噪音，简化设计 |
| [typeset](/commands/impeccable/refine#typeset) | 优化排版和字体设置 |

### Simplify（简化）

| 命令 | 说明 |
| :--- | :--- |
| [adapt](/commands/impeccable/simplify#adapt) | 适配不同屏幕尺寸和设备 |
| [clarify](/commands/impeccable/simplify#clarify) | 提升内容的清晰度和可读性 |
| [distill](/commands/impeccable/simplify#distill) | 提炼核心信息，去除冗余 |

### Harden（加固）

| 命令 | 说明 |
| :--- | :--- |
| [harden](/commands/impeccable/harden#harden) | 加强代码的健壮性和错误处理 |
| [onboard](/commands/impeccable/harden#onboard) | 改善新用户的引导体验 |
| [optimize](/commands/impeccable/harden#optimize) | 性能优化和资源压缩 |
| [polish](/commands/impeccable/harden#polish) | 最终细节打磨和质量检查 |

### System（系统）

| 命令 | 说明 |
| :--- | :--- |
| [document](/commands/impeccable/system#document) | 生成设计文档和使用指南 |
| [extract](/commands/impeccable/system#extract) | 从代码中提取设计令牌和组件 |
| [live](/commands/impeccable/system#live) | 启动实时预览开发服务器 |

## Pin 命令

你可以将常用命令固定为快捷方式，避免重复输入完整命令语法。

### 固定命令

```bash
/impeccable pin audit        # 固定 audit 命令
/impeccable pin critique     # 固定 critique 命令
/impeccable pin craft        # 固定 craft 命令
```

### 使用固定命令

固定后，可以直接使用简短语法：

```bash
/impeccable audit blog       # 审计博客页面
/impeccable critique landing # 批判性分析落地页
/impeccable craft hero       # 创建 Hero 组件
```

### 取消固定

```bash
/impeccable unpin audit      # 取消固定 audit 命令
```

## 使用示例

### 评估现有设计

```bash
# 审计整个网站的设计一致性
/impeccable audit website

# 对落地页进行批判性分析
/impeccable critique landing

# 审计博客模块
/impeccable audit blog
```

### 创建新组件

```bash
# 从零创建 Hero 组件
/impeccable craft hero

# 创建符合设计系统的登录页面
/impeccable impeccable login

# 塑造卡片组件的结构
/impeccable shape card
```

### 优化现有设计

```bash
# 添加过渡动画
/impeccable animate button

# 增强视觉冲击力
/impeccable bolder hero

# 优化排版
/impeccable typeset article

# 简化导航设计
/impeccable distill navigation
```

### 加固和优化

```bash
# 加强表单验证
/impeccable harden form

# 优化图片加载
/impeccable optimize images

# 改善移动端适配
/impeccable adapt responsive

# 最终打磨
/impeccable polish all
```

## 下一步

- [Create 命令](/commands/impeccable/create) — 详细了解创建类命令
- [Evaluate 命令](/commands/impeccable/evaluate) — 详细了解评估类命令
- [Refine 命令](/commands/impeccable/refine) — 详细了解优化类命令
- [Simplify 命令](/commands/impeccable/simplify) — 详细了解简化类命令
- [Harden 命令](/commands/impeccable/harden) — 详细了解加固类命令
- [System 命令](/commands/impeccable/system) — 详细了解系统类命令
