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

## 场景概述

你维护一个 monorepo，里面有 50+ 个 TypeScript 工具库文件，全部使用 CommonJS 的 `require()` 和 `module.exports`。现在团队决定统一迁移到 ES module 的 `import`/`export` 语法。手动改 50 个文件：逐个打开、找 require、改 import、调 exports、检查引用路径是否需要加 `.js` 后缀……一套操作下来至少两小时，还容易漏掉某个深层嵌套的 `require()`，或者某个动态路径忘了补扩展名。

这类"量大、重复、规则明确"的任务，正是 Agent 批量编排的最佳场景。核心模式只有四个阶段：**discover（发现）→ fan-out（分发）→ verify（验证）→ synthesize（汇总）**。一个 Agent 负责扫描全貌，十个 Agent 各领一组文件并行修改，最后汇总报告交给 reviewer 一眼看完。

## 为什么用批量编排

手动逐文件迁移和 Agent 批量编排的差距，不只是"快一点"，而是工作方式完全不同：

| 维度 | 手动逐文件 | Agent 批量编排 |
| --- | --- | --- |
| 耗时 | 50 文件 x 2-3 分钟 ≈ 2 小时 | 10 Agent 并行 ≈ 2 分钟 |
| 一致性 | 靠人工记忆，容易漏或格式不统一 | 同一 prompt 驱动，输出风格一致 |
| 验证 | 改完手动跑一次 lint，容易跳过 | 每个 Agent 自带 eslint + tsc 验证 |
| 可追溯 | 一次大 commit，难以逐文件 review | 每个 Agent 的改动独立可见 |
| 心智负担 | 高，重复劳动让人麻木 | 低，只负责 prompt 和最终 review |

核心思路是"分而治之"：把 50 个文件拆成 10 组，每组 5 个文件，10 个 Agent 同时开工，互不干扰。改完后自动跑 lint 和类型检查，哪个 Agent 出问题就单独重跑，不需要全部重来。

## 前置准备

假设你的 monorepo 结构如下：

```text
packages/
├── utils/
│   ├── src/
│   │   ├── array.ts        # require('lodash') + module.exports
│   │   ├── string.ts       # require('./array') + module.exports
│   │   ├── ...             # 另外 48 个文件
│   │   └── index.ts        # require() 汇总导出
│   └── package.json
├── config/
│   └── ...
└── services/
    └── ...
```

迁移到 ES module 前，需要先在 `packages/utils/package.json` 中加入 `"type": "module"`，或者将所有 `.ts` 文件改为 `.mts`。本文采用加 `"type": "module"` 的方案 —— 改动最少，对 git history 最友好。

```json
{
  "name": "@myrepo/utils",
  "type": "module",
  "main": "./src/index.js"
}
```

:::warning
加 `"type": "module"` 后，该 package 下所有 `.js`/`.ts` 文件都会按 ESM 解析。如果 package 内还有其他子目录不需要 ESM，可以在子目录放一个 `{"type": "commonjs"}` 的 package.json 覆盖。
:::

## 完整交互过程

### Step 1：discover 阶段 —— 扫描所有改动点

不要让 Agent 上来就改代码。先派一个 Agent 做一次全量扫描，搞清楚到底有多少地方要改、分别在哪、是什么类型。

**prompt 要点：**

> 扫描 `packages/utils/src/` 下所有 `.ts` 文件，找出每处 `require()` 调用和 `module.exports` 赋值，输出一个表格：文件路径、require 数量、exports 数量、require 的行号列表。

Agent 扫描后的输出示例：

```text
# CJS → ESM 迁移扫描报告

扫描范围：packages/utils/src/**/*.ts
共计文件：52 个（有 require/exports 命中）

| #  | 文件路径                             | require 数 | exports 数 |
| -- | ------------------------------------ | ---------- | ---------- |
| 1  | packages/utils/src/array.ts          | 3          | 1          |
| 2  | packages/utils/src/string.ts         | 2          | 1          |
| 3  | packages/utils/src/object.ts         | 4          | 2          |
| 4  | packages/utils/src/function.ts       | 1          | 1          |
| 5  | packages/utils/src/promise.ts        | 2          | 1          |
| ...| ...                                  | ...        | ...        |
| 50 | packages/utils/src/validators.ts     | 5          | 3          |
| 51 | packages/utils/src/formatters.ts     | 2          | 1          |
| 52 | packages/utils/src/index.ts          | 15         | 1          |

共计 require() 调用：187 处
共计 module.exports：63 处
```

有了这张表，你就对工作量有了全局把握。其中 `index.ts` 有 15 个 require —— 这是汇总导出文件，转换逻辑与普通文件不同，可以单独分给一个 Agent 处理。

### Step 2：fan-out 阶段 —— 分组并并行分发

接下来写一个编排脚本，把 52 个文件均分成 10 组，每组 5-6 个文件，每组交给一个 Agent。

```bash
# 用 jq 将文件清单从 discover 报告里提取出来，按 5 个一组分片
cat discover-report.json | jq -r '.files[].path' | split -l 5 - groups/group_

# 对每个分组启动一个 agent task
for group in groups/group_*; do
  claude "将以下文件中的 require() 转为 import，module.exports 转为 export：
$(cat $group)

规则：
1. require('builtin-module') → import ... from 'builtin-module'
2. require('./relative') → import ... from './relative.js'（注意补 .js 后缀）
3. module.exports = X → export default X
4. module.exports = { a, b } → export { a, b }
5. 改完后运行 eslint --fix && tsc --noEmit 验证
6. 最终输出 JSON：{ file, changes[], lintPass, typecheckPass }" &
done
wait
```

分组策略要点：

- **均匀分组**：每组文件数差别不超过 1 个，保证 Agent 完成时间接近
- **特殊处理**：把 `index.ts`（require 最多）单独或放在文件数少的一组
- **按模块粒度**：如果有相互引用的文件，尽量放在同一组，避免跨组依赖

### Step 3：verify 阶段 —— 自动 lint + 类型检查

每个 Agent 改完后必须跑验证。这是整个流程的安全网 —— 如果你的 prompt 里没写"改完后跑 eslint + tsc"，Agent 可能不会主动做。

单个 Agent 的验证输出示例：

```text
## 验证结果：group_03（文件 5/5）

### eslint --fix
✓ array.ts       0 errors, 0 warnings
✓ string.ts      0 errors, 0 warnings
✓ object.ts      0 errors, 0 warnings
✓ function.ts    0 errors, 0 warnings
✓ promise.ts     0 errors, 0 warnings
通过率：5/5

### tsc --noEmit
✓ 类型检查通过，无错误
```

如果某个 Agent 验证没通过，单独重跑那一组即可：

```bash
# 只重跑 group_03
claude "group_03 的 eslint 报了两个 error：object.ts 第 12 行 import 路径未补 .js，promise.ts 第 8 行 default export 与命名导出混用。请修复这两个文件后重新验证。"
```

:::tip
在 prompt 里让 Agent 输出结构化的验证结果（JSON 格式），方便后续 synthesize 阶段自动汇总。
:::

### Step 4：synthesize 阶段 —— 汇总迁移报告

10 个 Agent 全部跑完后，派一个汇总 Agent 收集所有 Agent 的输出，生成一份迁移总报告：

**prompt 要点：**

> 读取 `results/` 目录下所有 group_*.json 文件，汇总输出迁移报告：总改动文件数、require 转 import 数量、exports 转 export 数量、lint 通过率、typecheck 通过率、异常文件清单。

汇总 Agent 输出示例：

```text
# CJS → ESM 迁移完成报告

| 指标                     | 数值            |
| ------------------------ | --------------- |
| 改动文件数               | 52 / 52         |
| require → import 转换    | 187             |
| exports → export 转换    | 63              |
| eslint 通过率            | 52 / 52 (100%)  |
| tsc 类型检查             | 通过             |
| 异常文件                 | 0               |
| 总耗时（Agent 并行）     | ~2 分钟          |

分组详情：
- group_01 ~ group_10：全部通过
- index.ts：单独处理，15 个 import 重组完成
```

这张表给 reviewer 看，三秒就能判断这次迁移是否靠谱。

### Step 5：人工抽样 review

Agent 改完、验证通过、报告漂亮 —— 还差最后一步：人工抽样。

从 52 个文件中随机挑 3-5 个，按以下 checklist 快速过一遍：

1. **import 路径是否补了 `.js` 后缀** —— 这是 ESM 迁移最容易漏的点
2. **默认导出和命名导出是否混淆** —— `module.exports = X` 和 `module.exports = { a, b }` 转换方式不同
3. **动态 require 是否被错误转换** —— `const x = require(computePath())` 不能直接改成静态 import
4. **类型导入是否用了 `import type`** —— TypeScript 中有类型专用的导入语法
5. **git diff 看一眼文件数量** —— 确认没有多改或少改

确认无误后，一个 commit 提交：

```bash
git add packages/utils/src/
git commit -m "refactor(utils): migrate 52 files from CJS to ESM

- Convert require() to import syntax
- Convert module.exports to export syntax
- Add .js extension to relative import paths
- All files pass eslint and tsc --noEmit

Co-Authored-By: Claude Code Agents"
```

:::info
如果团队要求每个文件单独 commit（便于 blame），可以让 Agent 分组提交，每组一个 commit。但 52 个 commit 对 git log 不太友好，建议按 package 或功能模块合并。
:::

## 要点总结

1. **discover 要精确，不能漏文件。** 扫描范围用 glob 覆盖全量（`**/*.ts`），且要同时扫 `require()` 和 `module.exports`。漏掉一个文件就会在 CI 上爆红。
2. **fan-out 分组要均匀，特殊文件单独处理。** 按文件数均分、按模块粒度分组、把 require 特别密集的文件（如 `index.ts`）单独分给一个 Agent。
3. **verify 是安全网，绝对不能跳过。** 每个 Agent 的输出 prompt 里必须包含"改完后跑 eslint + tsc"。没有验证的批量修改等于盲飞。
4. **synthesize 让 reviewer 一眼看全貌。** 汇总报告用一张统计表回答三个核心问题：改了多少、有没有出错、哪些文件有问题。
5. **人工 review 不能省，但只需抽样。** Agent 负责"量"，人负责"判断"。抽 5-10% 的文件过一遍关键检查项，既有安全感又不浪费时间。

## 变体与延伸

discover → fan-out → verify → synthesize 这个模式不只适用于 CJS 到 ESM 迁移，任何"量大、规则明确、可拆分"的任务都能套用：

| 场景 | discover | fan-out 分组依据 | verify 方式 |
| --- | --- | --- | --- |
| CSS 类名迁移（BEM → Tailwind） | 扫描所有 className/class 使用点 | 按组件文件分组 | visual regression + lint |
| API 端点迁移（REST → GraphQL） | 扫描所有 fetch/axios 调用 | 按业务模块分组 | TypeScript 类型检查 + 接口测试 |
| 数据库字段重命名 | 扫描所有 ORM 模型和查询 | 按表/领域分组 | 迁移脚本 dry-run + 查询测试 |
| 框架版本升级（Vue 2 → Vue 3） | 扫描已废弃 API 使用点 | 按组件文件分组 | vue-tsc + 单元测试 |
| i18n 文案提取 | 扫描所有硬编码中文字符串 | 按页面/模块分组 | lint + 构建验证 |

核心不变：一个 Agent 看清全局，多个 Agent 分头执行，每个 Agent 自带验证，最后汇总成一张表。掌握了这个模式，遇到 100 个文件、500 个文件的迁移任务，思路完全一样 —— 只是分组数量不同而已。
