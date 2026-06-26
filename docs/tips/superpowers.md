---
title: Superpowers — 工程化开发流程
description: Superpowers 用 5 大核心工作流（头脑风暴→方案设计→TDD→调试→审查）把资深工程师的工作方式固化为 Claude Code 技能库
---

# Superpowers — 工程化开发流程

> 不是零散的提示词——是一套完整的开发闭环。

## 概述

**Superpowers**（`obra/superpowers`，187K GitHub Stars）是 Jesse Vincent 开源的一套 Claude Code 技能库。核心理念：**Process over Prompt**（流程大于提示词）。不靠你每次把需求描述得完美无缺——靠结构化的流程确保每一步都在正确的时间做了正确的事。

普通 Claude Code 的问题是**流程缺失**。你说"加个功能"，AI 直接写代码。没有需求确认、没有方案设计、没有测试、没有审查——代码能跑，但质量和可维护性看运气。

Superpowers 把资深工程师的工作方式拆成 5 个独立工作流，每个都可以单独使用，也可以串联成完整闭环。

**核心数据**：187K Stars、5 大工作流、< 2,000 tokens 核心指令、完整闭环约 100k tokens、降低约 60% 返工率。

## 核心理念：流程大于提示词

```
普通 Claude Code：
  你说需求 → AI 写代码 → 能跑就行

Superpowers：
  /brainstorm     → 理清需求和方向
       ↓
  /write-plan     → 生成详细实施方案
       ↓
  /execute-plan   → 分批执行，每步有审查检查点
       ↓
  TDD（自动激活）  → RED → GREEN → REFACTOR
       ↓
  代码审查（自动）  → 5 维度审查
       ↓
  交付             → 质量稳定，不靠运气
```

## 安装

```bash
/plugin install superpowers@claude-plugins-official
```

或走社区市场：

```bash
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

重启 Claude Code，验证：

```bash
/brainstorm
/write-plan
/execute-plan
```

看到这三个命令就说明安装成功。

## 五大核心工作流

### 1. 头脑风暴（Brainstorming）

**命令**：`/brainstorm`

做什么：拿到需求但不确定技术方案时，AI 用苏格拉底式提问从四个维度分析——业务边界、技术选型、潜在风险、性能考量。输出结构化需求分析。

触发时机：**任何新功能开始前**。

### 2. 方案设计（Write Plan）

**命令**：`/write-plan`

做什么：强制输出完整技术方案——系统架构（Mermaid 图）、模块划分、API 设计、数据库变更、技术选型对比。相当于画施工图。

触发时机：需求确认后，写代码前。

### 3. TDD 开发（Test-Driven Development）

**自动激活**，不手动调用。

严格执行 **RED → GREEN → REFACTOR**：

```
RED:   先写一个会失败的测试，定义期望行为
GREEN: 写最少代码让测试通过
REFACTOR: 优化代码结构，测试保持绿色
```

核心业务逻辑覆盖率 ≥ 80%。会删除在测试之前编写的实现代码。

配套技能：
- `verification-before-completion`：声称修好之前必须验证
- `defense-in-depth`：多层验证防护

### 4. 系统化调试（Systematic Debugging）

**自动激活**，遇到 bug 时触发。

4 阶段根因追溯：

```
1. 复现 —— 明确问题现象，稳定复现步骤
2. 收集证据 —— 系统性收集日志、堆栈、请求上下文
3. 提出假设 —— 按概率排序，逐一排除（不做随机猜测）
4. 验证修复 —— 确认问题解决 + 回归测试
```

配套技能：
- `root-cause-tracing`：沿调用栈逆向追踪（Graphviz DOT 图）
- `reproducible-test-case`：把 bug 转成可复现的测试

### 5. 代码审查（Code Review）

**命令**：`/code-review`

5 维度审查：

| 维度 | 检查什么 |
|------|---------|
| 正确性 | 逻辑有没有漏洞、边界条件覆盖了吗 |
| 可读性 | 命名是否清晰、职责是否单一 |
| 可维护性 | 有没有过度抽象、有没有硬编码 |
| 性能 | N+1 查询、不必要的大循环 |
| 安全性 | SQL 注入、XSS、敏感信息泄露 |

输出分级报告：🔴 严重 / 🟡 建议 / 🟢 表扬。

## 日常使用

### Java 示例

**场景**：给一个 Spring Boot 项目加"用户导出 CSV"功能。

**第 1 步：头脑风暴**

```bash
/brainstorm 后台管理需要导出用户列表为 CSV
```

Superpowers 追问：

```text
Claude: 确认几个点：

1. 导出触发方式？（点击按钮 / 定时任务 / API 调用）
2. 用户量级？（< 1000 条 / 1万 / 10万+）——决定是同步还是异步
3. 导出字段？（全部字段 / 脱敏 / 自定义）
4. 文件存储？（直接下载 / 上传 OSS 后返回链接）
```

你回答：点击按钮、< 5000 用户、姓名+手机号脱敏+注册时间+状态、直接下载。

**第 2 步：方案设计**

```bash
/write-plan
```

输出：

```mermaid
flowchart LR
    A[点击导出按钮] → B[GET /api/users/export/csv]
    B → C[UserController]
    C → D[UserService.exportCsv]
    D → E[查询用户列表]
    E → F[CSV 序列化 + 脱敏]
    F → G[StreamingResponseBody 流式返回]
    G → H[浏览器下载 users.csv]
```

```text
方案：
- 同步导出（< 5000 条，耗时 < 2s）
- 脱敏：手机号 138****1234
- 流式写入，不把全部数据加载到内存
- CSV header：姓名,手机号,注册时间,状态
- 文件名：users_2026-06-24.csv
```

**第 3 步：TDD 实现**

```bash
/execute-plan
```

Superpowers 先写测试：

```java
@Test
void shouldExportUsersAsCsv() throws Exception {
    // Given
    createTestUser("张三", "13812341234", LocalDate.of(2026, 1, 15), "ACTIVE");
    createTestUser("李四", "13956785678", LocalDate.of(2026, 3, 20), "INACTIVE");

    // When
    byte[] csv = userService.exportCsv();

    // Then
    String content = new String(csv, StandardCharsets.UTF_8);
    assertThat(content).contains("张三", "138****1234", "2026-01-15", "ACTIVE");
    assertThat(content).contains("李四", "139****5678", "2026-03-20", "INACTIVE");
}
```

测试先红（还没写实现），然后写最小代码让它绿：

```java
public byte[] exportCsv() {
    List<User> users = userRepo.findAll();
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    try (CSVPrinter printer = new CSVPrinter(
            new OutputStreamWriter(out, StandardCharsets.UTF_8),
            CSVFormat.DEFAULT.withHeader("姓名", "手机号", "注册时间", "状态"))) {
        for (User u : users) {
            printer.printRecord(
                u.getName(),
                maskPhone(u.getPhone()),       // 138****1234
                u.getCreatedAt().toString(),
                u.getStatus()
            );
        }
    }
    return out.toByteArray();
}
```

**第 4 步：审查**

```bash
/code-review
```

```text
🔴 流式导出未实现——当前全部加载到 ByteArrayOutputStream，
    5000 条会占 ~2MB 内存。建议用 StreamingResponseBody。
🟡 maskPhone 假设 11 位中国手机号——国际号码会错。
🟢 测试覆盖了 ACTIVE 和 INACTIVE 两种状态。
```

修复 🔴 问题后交付。

### Vue 示例

**场景**：做一个搜索筛选面板。

```bash
/brainstorm 做一个用户列表的搜索筛选面板，支持姓名、状态、注册时间范围
```

追问后确认：用 URL query params 持久化筛选状态（支持分享链接）、防抖 300ms、筛选条件变化时自动请求。

```bash
/write-plan
```

方案输出：

```text
组件结构：
  UserSearchPanel.vue → emits @filter-change
    包含：SearchInput.vue（姓名）、StatusSelect.vue（状态）、DateRangePicker.vue（时间）

数据流：
  URL query params ←→ reactive filters → watchEffect → API call → user list

路由：
  /users?name=张三&status=active&from=2026-01-01&to=2026-06-01
```

TDD 实现：

```typescript
// __tests__/useUserSearch.spec.ts
import { useUserSearch } from '@/composables/useUserSearch'

it('builds query params from filters', () => {
  const { buildParams } = useUserSearch()
  const params = buildParams({ name: '张', status: 'active' })
  expect(params).toEqual({ name: '张', status: 'active' })
})

it('masks phone in search results', () => {
  const { maskPhone } = useUserSearch()
  expect(maskPhone('13812341234')).toBe('138****1234')
})
```

实现：

```vue
<!-- UserSearchPanel.vue -->
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'

const route = useRoute()
const router = useRouter()

const filters = ref({
  name: (route.query.name as string) || '',
  status: (route.query.status as string) || '',
  from: (route.query.from as string) || '',
  to: (route.query.to as string) || ''
})

// 防抖 300ms，自动同步 URL
const syncUrl = useDebounceFn(() => {
  const q: Record<string, string> = {}
  for (const [k, v] of Object.entries(filters.value)) {
    if (v) q[k] = v
  }
  router.replace({ query: q })
}, 300)

watchEffect(() => {
  syncUrl()
  // 触发父组件重新请求
  emit('filter-change', { ...filters.value })
})

const emit = defineEmits<{ 'filter-change': [filters: Record<string, string>] }>()
</script>
```

审查输出：

```text
🟢 防抖 + URL 同步，交互体验好
🟡 router.replace 在频繁改动时会产生历史记录堆叠——考虑用 router.push 或增加
    版本号
🟢 组件拆分合理（3 个子组件各司其职）
```

## 实战场景：完整功能闭环

### 场景

需求："用户反馈订单列表加载太慢，优化一下。"

### 你怎么操作（对话流程）

**第 1 步：头脑风暴——先确认问题**

```bash
/brainstorm 订单列表加载慢，需要优化
```

Superpowers 不直接动手，先追问：

```text
Claude: 确认几个点：
1. 慢在哪个环节？（首屏加载 / 翻页 / 筛选）
2. 数据量？（总订单数 / 每页条数）
3. 有没有监控数据？（APM / 慢查询日志）
```

你回答后在订单表上发现了一个缺失索引的慢查询。

**第 2 步：方案设计**

```bash
/write-plan
```

```text
根因：orders 表的 user_id + created_at 联合索引缺失。
     用户查自己的历史订单走全表扫描，10 万行数据查 2.3s。

方案：
1. 加索引：CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC)
2. 后端加缓存：Redis 缓存用户最近 100 条订单（TTL 5min）
3. 前端加虚拟滚动：超过 50 条时用 vue-virtual-scroller

优先级：1 > 2 > 3
```

**第 3 步：TDD 实现**

先写测试——确认索引生效：

```java
@Test
void orderQueryShouldUseIndex() {
    // 执行 EXPLAIN 验证索引命中
    List<Order> orders = orderService.listByUser(testUserId, PageRequest.of(0, 20));
    // 验证查询耗时 < 200ms
    assertThat(orders).hasSizeLessThanOrEqualTo(20);
}
```

然后加索引：

```sql
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
```

测试通过。查询从 2.3s → 80ms。

**第 4 步：审查**

```bash
/code-review
```

```text
🔴 索引只在 PostgreSQL 生效——如果测试环境用 H2，EXPLAIN 语法不同。
    建议：生产环境跑 EXPLAIN 确认。
🟢 索引设计合理（user_id + created_at DESC，覆盖查询模式）
🟢 缓存策略保守（TTL 5min），不会暴露数据一致性问题
```

修复 🔴：测试跳过 EXPLAIN（只在生产手动验证）。

**结果**：不是「AI 帮你写了个索引」——是「AI 帮你走完了确认根因 → 设计 → 测试 → 实现 → 审查」的全流程。

## 完整命令速查

| 命令 | 阶段 | 做什么 |
|------|------|--------|
| `/brainstorm` | 需求分析 | 苏格拉底式提问，理清方向 |
| `/write-plan` | 方案设计 | 架构图 + 模块拆解 + 接口设计 |
| `/execute-plan` | 实现 | 分批执行，自动 TDD |
| `/code-review` | 审查 | 5 维度分级审查 |
| TDD（自动） | 实现中 | RED → GREEN → REFACTOR |
| 调试（自动） | 遇到 bug | 4 阶段根因追溯 |

## 最佳实践

### 什么时候用

| 场景 | 适合 | 不适合 |
|------|------|--------|
| 中大型功能（多文件） | ✅ 完整闭环 | — |
| 需求不明确 | ✅ `/brainstorm` 理清 | — |
| 需要方案评审 | ✅ `/write-plan` 出图 | — |
| 单行修 bug | — | ❌ 别走流程 |
| 配置变更 | — | ❌ 直接改 |
| 紧急热修复 | — | ⚠️ 修复后补审查 |

### Token 效率

Superpowers 的核心指令 < 2,000 tokens——不膨胀你的上下文窗口。实际实施通过 subagent 完成。一个完整的规划→实施→审查闭环约 100k tokens。

### 与其他工具的配合

```text
/brainstorm（Superpowers）→ 理清方向
       ↓
/feature-dev（官方）→ 7 阶段结构化实现
       ↓
TDD（Superpowers）→ RED → GREEN → REFACTOR
       ↓
/code-review（Superpowers）→ 5 维度审查
       ↓
  交付
```

Superpowers 管"工程纪律"，Feature Dev 管"功能开发流程"，两者覆盖不同维度。

## 常见问题

### 和 ECC 有什么区别？

ECC 是一个更庞大的框架（63 Agent、249 Skill），Superpowers 是更聚焦的工程流程（5 个核心工作流）。Superpowers 更轻量，更适合个人开发者；ECC 更适合团队级、多语言、多工具链的复杂场景。

### 小功能走完整流程会不会太重？

Superpowers 有判断机制——单文件改动、改配置、简单 bug 修会自动跳过完整流程。你不需要手动判断"这个功能值不值得走流程"。

### TDD 严格到必须红→绿→重构吗？

对核心业务逻辑——是的。你可以在写之前关掉（需要显式确认"这个功能不写测试"）。建议至少保留关键路径的测试。

### /brainstorm 和 Feature Dev 的 Phase 1 有什么区别？

`/brainstorm` 更偏"这个需求到底要做什么"——业务级。Feature Dev Phase 1 更偏"这个功能在代码层面怎么落"——技术级。两者可以串联：`/brainstorm` 确认方向 → Feature Dev 实现。
