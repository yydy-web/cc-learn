---
title: 多 Agent 协同工作技巧
description: 从需求到交付的多 Agent 协同实战，覆盖 Workflow 脚本模式、SDD 并行实现、审查验证全流程，含 Java 和 Vue 完整示例
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★★☆    |
| 🧪 测试 | ★★★☆☆  | ★★★★★    |
| 📦 产品 | ★★★☆☆  | ★★★★★    |

**🎯 学习产出：** 掌握多智能体协作技巧，能独立用 parallel/pipeline/judge panel 等模式编排复杂任务

**🚀 AI 能力提升：** 多智能体、项目协作
:::

# 多 Agent 协同工作技巧

> 不是"能并行就并行"——是知道什么时候并行、什么时候串行、什么时候根本不需要多 Agent。

## 流程总览

```text
需求文档
  │
  ▼
┌─────────────────────────────────────────────────┐
│ 阶段 1：需求分析                                  │
│ /brainstorm → 拆解成独立模块                      │
│ 工具：Superpowers brainstorming                  │
├─────────────────────────────────────────────────┤
│ 阶段 2：方案设计                                  │
│ /write-plan → task-brief 列表 + 依赖图            │
│ 工具：Superpowers writing-plans, SDD task-brief  │
├─────────────────────────────────────────────────┤
│ 阶段 3：并行实现                                  │
│ parallel() / pipeline() → 多 Agent 编码           │
│ 工具：Workflow 脚本, agent(), TDD（自动）         │
├─────────────────────────────────────────────────┤
│ 阶段 4：审查验证                                  │
│ task-reviewer → adversarial verify → 全分支终审   │
│ 工具：SDD review, parallel verify                │
├─────────────────────────────────────────────────┤
│ 阶段 5：交付                                      │
│ progress-ledger 核对 → 回归 → 提交                 │
│ 工具：progress-ledger, /code-review               │
├─────────────────────────────────────────────────┤
│ 阶段 6：自检验收（详见 [AI 生成代码自检](/tips/self-check)）     │
│ 端到端 → 交叉验证 → 边界扫射 → AI 盲区 → 抽样                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 阶段 1：需求分析 — 什么时候拆成多 Agent

### 判断标准

| 条件             | 单 Agent                   | 多 Agent                       |
| ---------------- | -------------------------- | ------------------------------ |
| 模块间是否独立   | 模块互相依赖               | 模块可以独立理解               |
| 是否需要并行加速 | 需求简单，3 个问题就搞清楚 | 多子系统，每个都需要深入分析   |
| Token 成本       | 一次对话够用               | 每个子系统值得单独开一个 Agent |

**核心原则**：不是每个 `/brainstorm` 都要并行——大部分需求一个 Agent 追 3-5 个问题就理清了。只有当需求文档里明显包含 **2 个以上独立子系统** 时才拆。

### Java 示例

**场景**：产品给了需求文档——"订单管理后台需要支持数据导出，同时做一个统计面板给运维看最近 7 天数据"。

```text
> /brainstorm 订单管理系统需要加两个功能：
>   1. 订单数据导出 CSV
>   2. 后台数据统计面板
> 这两个模块独立吗？帮我分析一下
```

Superpowers 追问确认后，识别出两个完全独立的模块——可以并行分析：

```text
Claude: 确认——
- 导出 CSV：点击按钮 → 后端生成 → 浏览器下载。纯后端逻辑。
- 统计面板：查数据库 → 返回数字 → 前端渲染表格。前后端都涉及。
结论：两个模块共享同一个数据库，但功能上完全独立。
      建议用两个 Agent 并行分析各自的需求细节。
```

**操作**：手动开两个 `/brainstorm`，一个问导出、一个问面板：

```text
# Agent 1
> /brainstorm 订单导出 CSV 功能：导出字段、触发方式、数据量预估、文件格式

# Agent 2
> /brainstorm 统计面板：展示哪些指标、刷新频率、是否需要图表交互、数据来源
```

### Vue 示例

**场景**：产品给了用户管理后台原型图——搜索筛选栏 + 用户列表表格 + 导出按钮。

```text
> /brainstorm 用户管理后台有三个区域：
>   1. 顶部搜索筛选栏（姓名、状态、注册时间范围）
>   2. 中间用户列表（分页表格）
>   3. 右上角导出按钮
> 拆开分析还是合在一起？
```

Superpowers 分析：

```text
Claude: 三个区域在 UI 上在一个页面，但功能边界清晰：
- 搜索栏：纯筛选逻辑 + URL query 同步
- 列表：数据获取 + 分页 + 状态展示
- 导出：复用当前筛选条件，调用后端
建议合在一起做一次 brainstorming（组件间有交互），
但后续实现时可以并行开发。
```

**结论**：这里不用拆——三个组件虽然有交互（筛选条件联动导出），但交互边界清晰（筛选条件作为 props 传入），需求分析阶段一个 Agent 就够了。

---

## 阶段 2：方案设计 — write-plan + task-brief 列表

### write-plan 产出结构（v6.0）

`/write-plan` 输出三层内容：

```text
## Global Constraints（全局约束）
- 所有任务共享的规则：命名规范、错误处理模式、日志格式
- 例如："所有 API 返回统一 ResponseWrapper"

## Interfaces（任务间接口）
- 每个任务消耗什么（reads）、产出什么（writes）
- 例如："T1 产出 ExportService，T3 消费 ExportService"

## Task Briefs（任务列表）
- 每个任务一个 brief，标注依赖关系
```

### task-brief 结构

```text
Task: T1-export-csv-service
Depends on: (none)
Reads: OrderRepository
Writes: ExportService.java, ExportServiceTest.java
Description: 实现 CSV 导出逻辑——查询订单、脱敏手机号、流式写入
Acceptance: 单元测试覆盖 3 种状态订单 + 空数据集
```

### Java 示例

```text
> /write-plan 订单管理后台加导出 CSV 和统计面板
```

输出摘要：

```text
## Global Constraints
- 所有 API 统一返回 ResponseEntity<?>
- 导出用 StreamingResponseBody（避免内存加载全量数据）
- 统计查询走只读从库

## Interfaces
- T1（导出 Service）产出：ExportService.java
- T2（统计 Service）产出：StatsService.java
- T3（Controller）消费：ExportService + StatsService

## Task Briefs

Task: T1-export-csv-service
Depends on: (none)
Interface: 消费 OrderRepository, 产出 ExportService
  - exportCsv(filters): byte[]
  - maskPhone(phone): String

Task: T2-stats-service
Depends on: (none)
Interface: 消费 OrderRepository（只读从库）, 产出 StatsService
  - getWeeklyStats(): WeeklyStats
  - WeeklyStats: { date, newOrders, activeUsers }

Task: T3-controller-integration
Depends on: T1, T2
Interface: 消费 ExportService + StatsService, 产出 OrderAdminController
  - GET /api/admin/orders/export/csv
  - GET /api/admin/stats/weekly
```

**依赖图**：

```text
T1 (导出 Service) ──┐
                    ├──→ T3 (Controller 集成)
T2 (统计 Service) ──┘
```

### Vue 示例

```text
> /write-plan 用户管理后台：搜索栏 + 列表 + 导出
```

输出摘要：

```text
## Global Constraints
- 所有组件用 <script setup> + TypeScript
- 筛选条件通过 URL query 持久化
- 导出复用当前筛选条件

## Interfaces
- SearchInput 产出：filters（emit: @filter-change）
- UserTable 消费：filters（prop）
- ExportButton 消费：filters（prop）, 产出：导出请求
- UserManage 消费：三个子组件, 产出：页面布局 + 数据协调

## Task Briefs

Task: T1-search-input
Depends on: (none)
Interface: 消费 route query, 产出 emits('filter-change', filters)
  包含：文本输入（姓名）+ 下拉选择（状态）+ 日期范围（DateRangePicker）

Task: T2-user-table
Depends on: (none)
Interface: 消费 filters（prop）, 调用 /api/users
  包含：分页表格 + loading/empty/error 状态

Task: T3-export-button
Depends on: (none)
Interface: 消费 filters（prop）, 触发 /api/users/export/csv
  包含：loading 状态 + 下载完成提示

Task: T4-user-manage-page
Depends on: T1, T2, T3
Interface: 消费三个子组件, 产出页面布局
  包含：flex 布局 + filters 状态管理 + 刷新协调
```

**依赖图**：

```text
T1 (搜索栏) ──┐
T2 (列表)   ──┼──→ T4 (页面集成)
T3 (导出)   ──┘
```

---

## 阶段 3：并行实现 — Workflow 脚本

### Core API 速查

| API                          | 用途         | 行为                                                 |
| ---------------------------- | ------------ | ---------------------------------------------------- |
| `agent(prompt, opts)`        | 启动子 Agent | 返回文本或 schema 验证的对象                         |
| `parallel(thunks)`           | 并行执行     | **屏障**——等所有跑完才返回                           |
| `pipeline(items, ...stages)` | 流水线       | **无屏障**——Item A 到 stage 3 时 Item B 才到 stage 1 |
| `phase(title)`               | 分组进度     | 后续 agent() 归入此阶段                              |
| `log(message)`               | 进度输出     | 旁白信息                                             |

### Pattern 1：并行执行（parallel）

**适用**：任务间无依赖，每个都独立可测。

```javascript
export const meta = {
  name: 'parallel-build',
  description: '并行构建无依赖模块',
  phases: [{ title: 'Build' }],
};

phase('Build');
const results = await parallel([
  () => agent('实现 T1：导出 CSV Service，带单元测试', { phase: 'Build' }),
  () => agent('实现 T2：统计面板 Service，带单元测试', { phase: 'Build' }),
]);
// results[0] → T1 产出, results[1] → T2 产出
// 两个 Agent 同时跑，互不阻塞
```

**Java 示例**：

```javascript
export const meta = {
  name: 'build-export-and-stats',
  description: '并行构建导出和统计模块',
  phases: [{ title: 'Build Services' }],
};

phase('Build Services');
await parallel([
  () =>
    agent(
      '实现 T1-export-csv-service：ExportService 类，含 exportCsv() 和 maskPhone()，' +
        '用 StreamingResponseBody 流式输出，写 JUnit 测试覆盖 3 种订单状态',
      { phase: 'Build Services' },
    ),
  () =>
    agent(
      '实现 T2-stats-service：StatsService 类，含 getWeeklyStats()，' +
        '查询最近 7 天数据（读只读从库），返回 WeeklyStats DTO，' +
        '写 JUnit 测试覆盖 0 数据 / 正常数据 / 跨月数据',
      { phase: 'Build Services' },
    ),
]);
```

T1 Agent 产出示例：

```java
@Service
public class ExportService {
    private final OrderRepository orderRepo;

    public byte[] exportCsv(OrderFilter filters) {
        List<Order> orders = orderRepo.findByFilters(filters);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (CSVPrinter printer = new CSVPrinter(
                new OutputStreamWriter(out, StandardCharsets.UTF_8),
                CSVFormat.DEFAULT.withHeader("订单号", "手机号", "金额", "状态", "创建时间"))) {
            for (Order o : orders) {
                printer.printRecord(o.getOrderNo(), maskPhone(o.getPhone()),
                    o.getAmount(), o.getStatus(), o.getCreatedAt());
            }
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
        return out.toByteArray();
    }

    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 7) return phone;
        return phone.substring(0, 3) + "****" + phone.substring(7);
    }
}
```

T2 Agent 产出示例：

```java
@Service
public class StatsService {
    private final ReadOnlyOrderRepo readOnlyRepo;

    public WeeklyStats getWeeklyStats() {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6);
        List<DailyStats> daily = readOnlyRepo.aggregateByDay(start, end);
        return new WeeklyStats(daily, daily.stream().mapToInt(DailyStats::newOrders).sum());
    }
}
```

**Vue 示例**（T1, T2, T3 并行）：

```javascript
export const meta = {
  name: 'build-user-mgmt-components',
  description: '并行构建搜索、列表、导出三个独立组件',
  phases: [{ title: 'Build Components' }],
};

phase('Build Components');
await parallel([
  () =>
    agent(
      '实现 T1-search-input：SearchInput.vue，含姓名输入框（v-model + 防抖 300ms）、' +
        '状态下拉（全部/激活/禁用）、DateRangePicker 日期范围选择。' +
        '每个筛选项变化时 emit filter-change 事件。用 vitest + @vue/test-utils 写测试',
      { phase: 'Build Components' },
    ),
  () =>
    agent(
      '实现 T2-user-table：UserTable.vue，接收 filters prop，' +
        'watchEffect 触发 /api/users 请求，展示分页表格。' +
        '含 loading（骨架屏）、empty（"暂无数据"）、error（重试按钮）三个状态。' +
        '用 vitest 写测试——mock fetch 验证三种状态渲染',
      { phase: 'Build Components' },
    ),
  () =>
    agent(
      '实现 T3-export-button：ExportButton.vue，接收 filters prop，' +
        '点击触发 /api/users/export/csv 下载。loading 态显示"导出中…"，' +
        '完成后恢复按钮文字。用 vitest 写测试',
      { phase: 'Build Components' },
    ),
]);
```

T1 Agent 产出示例：

```vue
<!-- SearchInput.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';

const emit = defineEmits<{ 'filter-change': [filters: Record<string, string>] }>();

const filters = ref({ name: '', status: '', from: '', to: '' });

const emitChange = useDebounceFn(() => {
  const q: Record<string, string> = {};
  for (const [k, v] of Object.entries(filters.value)) {
    if (v) q[k] = v;
  }
  emit('filter-change', q);
}, 300);

watch(filters, emitChange, { deep: true });
</script>

<template>
  <div class="flex gap-3 flex-wrap">
    <input v-model="filters.name" placeholder="搜索姓名…" class="border rounded px-3 py-1" />
    <select v-model="filters.status" class="border rounded px-3 py-1">
      <option value="">全部</option>
      <option value="active">激活</option>
      <option value="disabled">禁用</option>
    </select>
    <input type="date" v-model="filters.from" class="border rounded px-3 py-1" />
    <span class="self-center text-gray-400">至</span>
    <input type="date" v-model="filters.to" class="border rounded px-3 py-1" />
  </div>
</template>
```

### Pattern 2：流水线（pipeline）

**适用**：有依赖的任务链。pipeline **无屏障**——前一阶段产出后立刻进入下一阶段。

```javascript
export const meta = {
  name: 'pipeline-build',
  description: '流水线：独立任务完成后立刻集成',
  phases: [{ title: 'Build' }, { title: 'Integrate' }],
};

const tasks = [
  { name: 'T1', prompt: '实现导出 Service…' },
  { name: 'T2', prompt: '实现统计 Service…' },
];

await pipeline(
  tasks,
  // Stage 1：并行编译各任务
  (task) => agent(task.prompt, { label: task.name, phase: 'Build' }),
  // Stage 2：T1/T2 完成后立刻进入集成——不等另一个
  (result, task) =>
    agent(`将 ${task.name} 集成到 T3 Controller…`, { label: `integrate-${task.name}`, phase: 'Integrate' }),
);
```

**Java 示例**：T1 和 T2 各自独立编译后立刻集成到 Controller，互不等。

```javascript
export const meta = {
  name: 'build-and-integrate-orders',
  description: '流水线构建导出和统计后立刻集成',
  phases: [{ title: 'Build Services' }, { title: 'Controller Integration' }],
};

const services = [
  { id: 'export', prompt: '实现 T1-export-csv-service…' },
  { id: 'stats', prompt: '实现 T2-stats-service…' },
];

await pipeline(
  services,
  (svc) => agent(svc.prompt, { label: svc.id, phase: 'Build Services' }),
  (result, svc) =>
    agent(`集成 ${svc.id} 到 OrderAdminController：加对应端点，注入 Service，加集成测试`, {
      label: `integrate-${svc.id}`,
      phase: 'Controller Integration',
    }),
);
```

**Vue 示例**：T1/T2/T3 各自完成后立刻进入页面集成。

```javascript
export const meta = {
  name: 'build-and-integrate-user-mgmt',
  description: '流水线构建三个组件后立刻页面集成',
  phases: [{ title: 'Build Components' }, { title: 'Page Integration' }],
};

const components = [
  { id: 'search', prompt: '实现 T1-search-input…' },
  { id: 'table', prompt: '实现 T2-user-table…' },
  { id: 'export', prompt: '实现 T3-export-button…' },
];

await pipeline(
  components,
  (comp) => agent(comp.prompt, { label: comp.id, phase: 'Build Components' }),
  (result, comp) =>
    agent(`在 UserManage.vue 中引入 ${comp.id} 组件，带交互测试`, {
      label: `integrate-${comp.id}`,
      phase: 'Page Integration',
    }),
);
```

T4 页面集成 Agent 产出示例：

```vue
<!-- UserManage.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import SearchInput from '@/components/SearchInput.vue';
import UserTable from '@/components/UserTable.vue';
import ExportButton from '@/components/ExportButton.vue';

const filters = ref<Record<string, string>>({});
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex justify-between items-start">
      <SearchInput @filter-change="filters = $event" />
      <ExportButton :filters="filters" />
    </div>
    <UserTable :filters="filters" />
  </div>
</template>
```

### barrier 何时需要 / 不需要

```text
❌ 错误：不需要 barrier 时用了 parallel
  const a = await parallel([buildT1, buildT2])
  const b = a.map(transform)               // 纯 transform，不需要等全部完成
  const c = await parallel(b.map(integrate))

✅ 正确：用 pipeline，transform 在 stage 2 里自然处理
  await pipeline(tasks, buildOne, transformAndIntegrate)

✅ barrier 正确的场景：
  - 所有任务跑完后需要去重（dedup）
  - 需要"0 个发现就跳过后续"（early exit）
  - 阶段 N 的 prompt 引用了"其他所有结果"做交叉比较
```

### Pattern 3：循环发现（loop-until-dry）

**适用**：发现型任务，数量未知，需要一直找到"没有新东西"为止。

```javascript
export const meta = {
  name: 'find-all-issues',
  description: '循环发现代码问题，直到连续 2 轮无新发现',
  phases: [{ title: 'Find' }],
};

const seen = new Set();
let dry = 0;
const issues = [];

while (dry < 2) {
  const result = await agent(`扫描代码库找问题（排除已发现的：${[...seen].join(', ')}），返回新问题列表`, {
    phase: 'Find',
    schema: {
      type: 'object',
      properties: {
        issues: {
          type: 'array',
          items: { type: 'object', properties: { id: { type: 'string' }, desc: { type: 'string' } } },
        },
      },
    },
  });
  if (!result || !result.issues.length) {
    dry++;
    continue;
  }
  dry = 0;
  for (const issue of result.issues) {
    if (!seen.has(issue.id)) {
      seen.add(issue.id);
      issues.push(issue);
    }
  }
}
log(`发现 ${issues.length} 个问题，扫描完成`);
```

**Java 示例**：扫描所有 Controller 找缺失的标准端点。

```javascript
// ponytail: 循环发现比"列清单—逐一检查"更适合"不确定有多少"的场景
let dry = 0;
const found = [];

while (dry < 2) {
  const result = await agent(
    `扫描 src/** /controller/ 下的所有 Controller，找出缺少标准 CRUD 端点的类` +
      `（已发现：${found.map((f) => f.file).join(', ')}），返回新发现`,
    { phase: 'Find', schema: MISSING_ENDPOINT_SCHEMA },
  );
  if (!result || !result.endpoints.length) {
    dry++;
    continue;
  }
  dry = 0;
  found.push(...result.endpoints);
}
log(`${found.length} 个 Controller 缺少端点：${found.map((f) => f.file + ':' + f.missing).join(', ')}`);
```

**Vue 示例**：扫描所有组件找缺失的 loading 状态。

```javascript
let dry = 0;
const found = [];

while (dry < 2) {
  const result = await agent(
    `扫描 src/components/ 下的所有 Vue 组件，找出有异步请求但没有 loading 状态的` +
      `（已发现：${found.map((f) => f.file).join(', ')}），返回新发现的`,
    { phase: 'Find', schema: MISSING_LOADING_SCHEMA },
  );
  if (!result || !result.components.length) {
    dry++;
    continue;
  }
  dry = 0;
  found.push(...result.components);
}
log(`${found.length} 个组件缺 loading 状态`);
```

### Pattern 4：评审团（judge panel）

**适用**：需要多个独立角度评估方案质量。

```javascript
export const meta = {
  name: 'judge-design',
  description: '多角度独立评审 + 综合打分',
  phases: [{ title: 'Judge' }, { title: 'Synthesize' }],
};

const ANGLES = [
  { key: 'perf', prompt: '从性能角度评审…' },
  { key: 'security', prompt: '从安全角度评审…' },
  { key: 'maintainability', prompt: '从可维护性角度评审…' },
];

phase('Judge');
const verdicts = await parallel(ANGLES.map((a) => () => agent(a.prompt, { label: a.key, schema: VERDICT_SCHEMA })));

phase('Synthesize');
const report = await agent(`综合以下三个角度的评审结果，给出最终建议：\n${JSON.stringify(verdicts.filter(Boolean))}`, {
  label: 'synthesize',
});
```

**Java 示例**：评审导出方案。

```javascript
const ANGLES = [
  {
    key: 'perf',
    prompt:
      '从性能角度评审 ExportService：CSVPrinter + StreamingResponseBody 在 5000 条订单时会不会阻塞？有没有内存隐患？',
  },
  { key: 'security', prompt: '从安全角度评审：maskPhone 脱敏是否充分？导出有没有越权风险？CSV 注入防护做了吗？' },
  {
    key: 'maint',
    prompt: '从可维护性评审：ExportService 的职责是否单一？如果将来要加 Excel/PDF 导出，现在的结构好扩展吗？',
  },
];

phase('Judge');
const verdicts = await parallel(ANGLES.map((a) => () => agent(a.prompt, { label: a.key })));
```

**Vue 示例**：评审组件方案。

```javascript
const ANGLES = [
  {
    key: 'ux',
    prompt:
      '从 UX 角度评审三个组件：防抖 300ms 合适吗？loading/empty/error 三个状态都覆盖了吗？键盘导航和焦点管理考虑了吗？',
  },
  { key: 'perf', prompt: '从性能角度评审：watchEffect 在筛选条件快速变化时会不会频繁请求？组件有没有不必要的重渲染？' },
  { key: 'maint', prompt: '从可维护性评审：三个组件的职责边界清晰吗？filters 作为 props 的接口设计够不够稳？' },
];

phase('Judge');
const verdicts = await parallel(ANGLES.map((a) => () => agent(a.prompt, { label: a.key })));
```

### 常见错误

| 错误                       | 后果                            | 纠正                                                      |
| -------------------------- | ------------------------------- | --------------------------------------------------------- |
| barrier 滥用               | 快任务空等慢任务                | 改用 pipeline，只在真正需要 cross-item 时用 parallel      |
| 模型未声明                 | v6.0 SDD 中审查者默认用最贵模型 | 每次 agent() 调用的 prompt 中声明模型（或在 opts 中设置） |
| 上下文塞太多               | Agent 推理质量下降              | 每个 Agent 只传它需要的信息，不传整个项目上下文           |
| 任务粒度太大               | 单个 Agent 超时或产出质量差     | 把大任务拆成 < 30 分钟能完成的小任务                      |
| 没写 task-brief 就直接实现 | 依赖关系乱了，Agent 互相等      | 阶段 2 产出 task-brief 列表后再写 Workflow 脚本           |

---

## 阶段 4：审查验证

### SDD 审查流程（v6.0）

v6.0 重写了审查系统：**一个审查者替代两个，一次性返回 spec 合规 + 代码质量两份判定**。

```text
task-brief → 实现 → review-package → 审查者读 diff
                                        │
                     ┌──────────────────┴──────────────────┐
                     │                                      │
              规格合规判定                           代码质量判定
              (spec pass/fail)                     (quality pass/fail)
                     │                                      │
                     └──────────────────┬──────────────────┘
                                        │
                                  全分支终审（最强模型）
```

**关键规则**（v6.0 硬性约束）：

- 审查者**只读**，不能修改代码
- 控制器**不能告诉审查者忽略什么**——禁止压制发现
- 实现者的辩解**不能让审查者撤销有效发现**
- 每个判定附带**文件 + 行号**证据

### adversarial verify

对于审查发现的问题，发动 N 个独立 Agent 尝试**证伪**——多数认为真实才保留。

```javascript
export const meta = {
  name: 'verify-findings',
  description: '对抗验证：3 个 Agent 独立尝试证伪每个发现',
  phases: [{ title: 'Verify' }],
};

const confirmed = [];

for (const finding of reviewFindings) {
  const votes = await parallel(
    Array.from(
      { length: 3 },
      () => () =>
        agent(
          `尝试证伪这个审查发现——默认判定为"不真实"，除非代码中确实存在：\n${finding.desc}\n文件：${finding.file}:${finding.line}`,
          { label: `verify:${finding.file}:${finding.line}`, schema: VERDICT_SCHEMA },
        ),
    ),
  );
  const realVotes = votes.filter(Boolean).filter((v) => v.isReal).length;
  if (realVotes >= 2) confirmed.push(finding);
  else log(`❌ 证伪：${finding.file}:${finding.line} — ${finding.desc}（${realVotes}/3 确认真实）`);
}

log(`审查发现 ${reviewFindings.length} 个问题，${confirmed.length} 个确认真实`);
```

### Java 示例

```text
审查流程：
1. T1 → task-reviewer 审查 ExportService：spec pass + quality pass
2. T2 → task-reviewer 审查 StatsService：spec pass, quality fail —— 未处理跨月周
3. T3 → task-reviewer 审查 Controller：spec pass + quality pass
4. 修复 T2 quality fail
5. 全分支终审 → sprint-review Agent 用最强模型审整个 diff
6. adversarial verify → 3 Agent 验证终审发现的 2 个问题 → 1 个确认，1 个证伪
```

```javascript
// 全分支终审
phase('Final Review');
const finalFindings = await agent('审查整个分支的 diff，返回所有问题（按严重度排序）', {
  label: 'sprint-review',
  model: 'opus',
  schema: FINDINGS_SCHEMA,
});

// adversarial verify
phase('Verify');
const confirmed = [];
for (const f of finalFindings.findings) {
  const votes = await parallel(
    Array.from(
      { length: 3 },
      () => () =>
        agent(`尝试证伪：代码中真的存在这个问题吗？\n${f.desc}\n${f.file}:${f.line}`, {
          label: `verify:${f.file}`,
          schema: VERDICT_SCHEMA,
        }),
    ),
  );
  if (votes.filter(Boolean).filter((v) => v.isReal).length >= 2) confirmed.push(f);
}
```

### Vue 示例

```text
审查流程：
1. T1 → task-reviewer 审查 SearchInput：spec pass, quality pass
2. T2 → task-reviewer 审查 UserTable：spec pass, quality fail —— empty 和 error 状态未实现
3. T3 → task-reviewer 审查 ExportButton：spec pass + quality pass
4. T4 → task-reviewer 审查 UserManage：spec pass + quality pass
5. 修复 T2 quality fail → 加 empty/error 状态
6. 全分支终审 → 发现 1 个问题：T2 的 error 重试按钮没有防抖
7. adversarial verify → 3 Agent 确认真实 → 修复
```

---

## 阶段 5：交付

### progress-ledger 检查

v6.0 的进度账本（`.superpowers/sdd/progress-ledger.md`）记录每条 task-brief 的状态：

```text
Task T1-export-csv-service   [✅ done]  2026-06-26 10:23
Task T2-stats-service        [✅ done]  2026-06-26 10:25
Task T3-controller-integration [✅ done] 2026-06-26 11:02
Final Review                 [✅ done]  2026-06-26 11:30
Adversarial Verify           [✅ done]  2026-06-26 11:45
```

**交付前检查清单**：

```text
> 检查进度账本
□ 所有 task-brief 都标记 done？
□ 所有审查发现都处理了？
□ 全分支终审通过？
□ 回归测试全绿？
```

### Java 示例

```bash
# 1. 核对进度账本
> 读 .superpowers/sdd/progress-ledger.md，列出所有未完成项

# 2. 跑回归
> mvn test

# 3. 确认核心路径
> 用 curl 验证两个端点：
>   curl -s "http://localhost:8080/api/admin/orders/export/csv" | head -5
>   curl -s "http://localhost:8080/api/admin/stats/weekly"
```

### Vue 示例

```bash
# 1. 核对进度账本
> 读 .superpowers/sdd/progress-ledger.md，列出所有未完成项

# 2. 跑回归
> npm run test

# 3. 确认核心路径
> 用 vitest 验证三个组件 + 页面集成测试全绿
```

---

## 阶段 6：自检验收

> 完整自检教程已独立为 [AI 生成代码自检](/tips/self-check) 页面，包含五步自检法、7 个工具速查、5 套提示词模板。

**快速摘要**：

| 步骤 | 做什么             | 关键动作                            |
| ---- | ------------------ | ----------------------------------- |
| 1    | 端到端跑通核心路径 | 脚本化验证完整用户操作链            |
| 2    | 交叉验证模块边界   | 检查 Agent 间接口字段名和类型一致性 |
| 3    | 边界条件扫射       | 空数据、极端值、注入、权限、并发    |
| 4    | 让 AI 自审盲区     | "你最不确定哪部分" → 针对性修复     |
| 5    | 抽样手工验证       | 挑 5 个关键点浏览器/终端实际跑一遍  |

**工具三件套**：Stop hook（自动 build+ lint） + `/ponytail-review`（扫过度设计） + `/code-review`（五维度审查）。三分钟走完，准确率稳定在 90% 以上。

详见 → [AI 生成代码自检完整教程](/tips/self-check)

---

## 速查矩阵

| 你在做什么          | 用什么               | 关键命令/模式                         |
| ------------------- | -------------------- | ------------------------------------- |
| 需求拆解            | brainstorming        | `/brainstorm` → 手动并行 Agent        |
| 方案设计 + 任务拆分 | writing-plans + SDD  | `/write-plan` → task-brief 列表       |
| 无依赖任务并行实现  | parallel()           | `parallel([buildT1, buildT2])`        |
| 有依赖任务实现      | pipeline()           | `pipeline(tasks, build, integrate)`   |
| 找未知数量的问题    | loop-until-dry       | `while (dry < 2) { ... }`             |
| 方案多角度评审      | judge panel          | `parallel(angles) → synthesize`       |
| 单任务审查          | SDD task-reviewer    | 1 审查者 → spec + quality 双判定      |
| 审查发现验证        | adversarial verify   | 3 Agent 证伪 → 多数确认才保留         |
| 全分支终审          | sprint-review        | 最强模型，审整个 diff                 |
| 端到端自检          | 手动 + curl / vitest | 跑完整用户路径，验证 Agent 间集成     |
| 交叉边界验证        | AI 自审              | 检查 Agent 间接口字段名和类型一致性   |
| 边界条件扫射        | 脚本化边界测试       | 空数据、极端值、注入、权限、并发      |
| AI 盲区坦白         | 直接问 AI            | "你最不确定哪部分" → 针对性修复       |
| 抽样人肉验证        | 手工                 | 挑 5 个关键点浏览器/终端实际跑一遍    |
| 过度设计检查        | `/ponytail-review`   | 快速扫 diff，标记 yagni/native/delete |
| 全项目冗余扫描      | `/ponytail-audit`    | 死代码、多余依赖、可合并文件          |
| 五维度代码审查      | `/code-review`       | 正确性/可读性/可维护性/性能/安全      |
| 代码精简            | `/simplify`          | 只做质量简化，不查 bug                |
| 自动 build + lint   | Stop hook            | 零人工——每次完成前自动验证            |
| 防 AI 糊弄          | forgen               | 三守卫：无证据/无量测/无验证 → 阻截   |
| 交付前检查          | progress-ledger      | 逐条核对 → 回归 → 提交                |

---

## 相关页面

- [多智能体工作流](/guide/advanced/multi-agent) — 基础概念和 API 参考
- [AGENTS 全局路由协议](/guide/advanced/agents-routing) — 多框架冲突时的路由
- [Superpowers](/tips/superpowers) — Superpowers 完整指南（v6.0 更新日志）
- [CC-Switch](/guide/advanced/cc-switch) — Claude Code 多实例切换

:::tip 功能串联
多 Agent 协同的起点是 [Superpowers](/tips/superpowers) 的 `/brainstorm`（需求分析）和 `/write-plan`（方案设计），中间靠 [SDD](/guide/advanced/sdd/sdd-guide) 的 task-brief 驱动并行实现，终点是 [AI 生成代码自检](/tips/self-check) 的阶段 6 验收。注意阶段 6 的多 Agent "缝隙"验证——Agent 各自的单元测试全绿不代表集成没问题。
:::
