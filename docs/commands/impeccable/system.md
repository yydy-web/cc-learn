---
title: System 命令
description: Impeccable System 命令参考——从现有代码生成设计系统、提取可复用组件、可视化迭代修改
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★☆☆  | ★★★★☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★★    |

**🎯 学习产出：** 掌握 Impeccable 系统配置，能独立使用 document、extract、live 进行设计系统自动化管理

**🚀 AI 能力提升：** 代码审查
:::

# System 命令

System 命令提供设计系统级别的自动化支持：从已有代码库生成设计规范文档、提取可复用组件和 token、以及在浏览器中进行可视化迭代开发。

## document

从现有代码库自动生成 `DESIGN.md` 设计系统文档。分析项目的样式、组件和设计模式，输出完整的品牌指南和设计 token。

```bash
/impeccable document
```

:::info
生成的 `DESIGN.md` 包含颜色、排版、间距、组件规范等，可作为设计系统的单一事实来源。
:::

## extract

从项目代码中提取可复用组件和设计 token，构建结构化的设计系统。识别重复模式并将其标准化为可引用的组件库。

```bash
/impeccable extract
```

## live

启动可视化迭代模式。打开开发服务器后，直接在浏览器中选中元素、添加评论、获取多种变体方案并应用修改到源码。

```bash
/impeccable live
```

### 工作流程

1. **启动开发服务器** — 自动打开本地预览
2. **选中元素** — 在浏览器中点击选择要修改的 UI 元素
3. **添加评论** — 描述期望的修改方向
4. **获取变体** — 生成 3 种设计变体供选择
5. **确认应用** — 选择一个变体，自动写入源码

:::tip
`live` 命令适合在已有页面上快速迭代样式调整，无需手动切换编辑器和浏览器。
:::

## 下一步

- [Create 命令](/commands/impeccable/create) — 从零开始创建新功能
- [Evaluate 命令](/commands/impeccable/evaluate) — 评估设计质量和一致性
- [Refine 命令](/commands/impeccable/refine) — 优化视觉和交互细节
- [Simplify 命令](/commands/impeccable/simplify) — 简化和澄清设计
- [Harden 命令](/commands/impeccable/harden) — 将功能推向生产就绪状态
