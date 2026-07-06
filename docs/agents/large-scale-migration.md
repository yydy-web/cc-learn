---
title: 大规模代码迁移 — discover→fan-out→verify→synthesize
description: 将 monorepo 中 50+ 文件的 require 改为 import，10 个 Agent 分工每人 5 个文件并行迁移，自动 lint+typecheck 验证，最终汇总迁移报告
pageType: doc
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★★☆    |
| 🧪 测试 | ★★★★☆  | ★★★★☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握大规模代码迁移的 discover→fan-out→verify→synthesize 全流程，能独立编排 10+ Agent 的批量代码修改

**🚀 AI 能力提升：** 批量操作、大规模编排
:::
