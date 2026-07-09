---
title: 审查验证与交付 — 交付前的最后一道防线
description: 安全+性能+代码质量三维 Agent 全面审查数据导出功能，端到端验证边界和异常场景，交付前 checklist 确保文档/监控/回滚方案不遗漏
pageType: doc
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★★★  | ★★★★☆    |
| 📦 产品 | ★★★★☆  | ★★★☆☆    |

**🎯 学习产出：** 掌握多维度交付前审查流程，能独立用 Security/Performance/Code Quality Agent 做全面验证，执行交付 checklist 防止遗漏

**🚀 AI 能力提升：** 交付审查、质量门禁
:::

## 场景概述

数据导出功能开发完成、前后端集成测试已通过，代码合并到主分支，离上线只差最后一步。但越是这个节点，越容易出问题——一个没处理的 SQL 注入、一条没加索引的查询、一个边界条件下的内存泄漏，都可能在上线后引爆。我们需要的不是再次跑一遍单元测试，而是一次**覆盖安全、性能、代码质量多维度的交付前审查**，配合端到端验证和交付 checklist，确保功能"可上线"不仅是能跑通，更是经得起生产环境的考验。

本场景中，你将用三个专项 Agent 并行审查：Security Agent 盯攻击面（SQL 注入、文件路径遍历、CSV 注入、权限校验）、Performance Agent 盯吞吐量（大数据量内存、队列背压、查询索引）、Code Quality Agent 盯工程健壮性（错误处理、类型安全、代码重复）。审查通过后，再用一个 Agent 执行端到端验证，最后逐项过交付 checklist，配合灰度策略稳妥上线。

## 为什么需要多维度审查

单个审查者的盲区是真实存在的。开发者审查自己的代码时，关注点在功能逻辑是否正确——按钮点下去变量对不对、报错有没有 catch。安全工程师关注攻击面——输入在哪、信任边界在哪。性能工程师关注吞吐量和延迟——SQL 走了索引没有、内存曲线是否平稳。三种视角互不重叠，缺一不可。

更棘手的是"修复副作用"：修复一个安全问题后，可能引入性能退化（比如加了参数校验但触发 N+1 查询）；优化一个慢查询后，可能暴露错误处理的缺陷（原来那条慢查询掩盖了下游服务超时）。三个 Agent 同时审查，聚合结果后交叉验证，才能管住这种连锁风险。在实际项目中，建议将这种多维度审查做成**周期性门禁**——每个 feature 合入主分支前跑一次，每次发版前跑一次。

## 前置准备

在启动审查前，确保以下就绪：

- **完整源码**：数据导出模块的所有源代码（含路由、Service 层、队列 Consumer、前端组件）位于同一分支
- **测试环境**：可独立部署的 staging 环境，数据库有 10 万+ 测试数据，Redis 和 BullMQ 已配置
- **监控工具就绪**：Prometheus 指标端点已接入，可观察导出队列长度、API 响应时间、内存占用
- **CC 配置文件**：仓库根目录有 `.claude/agents/` 下的 Agent 定义，或直接在对话中使用 `--agent` 参数

:::tip
如果你还没有配置 Agent 文件，可以在 `.claude/agents/security-review.md`、`performance-review.md`、`code-review.md` 中分别定义专项 Agent 的系统提示词，让它们带着领域视角审查。
:::

## 完整交互过程

### Step 1：Security Agent 审查

首先启动安全审查 Agent，扫描导出模块的四个高危攻击面。输入清晰的任务指令，让 Agent 按维度逐一检查：

```text
使用 security-reviewer agent 审查 src/modules/export/ 目录的安全问题，
重点检查：
1. SQL 注入 —— 导出查询是否使用参数化
2. 文件路径遍历 —— 下载端点是否校验路径
3. CSV 注入 —— cell 内容是否转义公式前缀（=、+、-、@）
4. 权限校验 —— 导出 API 是否验证用户对该数据的访问权限

对每个发现给出：代码位置、攻击向量、严重级别、修复建议
```

Agent 审查输出示例：

```text
=== 导出模块安全审查报告 ===

[CRITICAL] SQL 注入 — src/modules/export/export.service.ts:47
  攻击向量：导出查询使用字符串拼接构建 WHERE 条件
    const query = `SELECT * FROM orders WHERE status = '${filter.status}'`
  修复建议：改用参数化查询
    const query = `SELECT * FROM orders WHERE status = $1`

[HIGH] CSV 注入 — src/modules/export/formatters/csv.ts:89
  攻击向量：cell 内容未转义公式前缀，
  用户输入 "=cmd|'/C calc'!A0" 可触发 Excel 命令执行
  修复建议：cell 开头为 =、+、-、@ 时添加单引号前缀

[HIGH] 文件路径遍历 — src/modules/export/download.controller.ts:34
  攻击向量：下载端点直接拼接用户传入的 filename 参数
    res.download(path.join(EXPORT_DIR, req.query.filename))
  修复建议：使用 path.basename() 或白名单校验文件名

[MEDIUM] 权限不足 — src/modules/export/export.controller.ts:22
  攻击向量：导出端点仅校验登录态，未校验用户对该数据范围的访问权限
  用户 A 可通过修改 organizationId 参数导出用户 B 的数据
  修复建议：从 JWT 中提取可访问的组织列表，校验请求的 orgId 在列表中
```

:::warning
安全审查发现的 CRITICAL/HIGH 级别问题，必须在交付前修复并重新审查通过。不能带着已知漏洞上线。
:::

### Step 2：Performance Agent 审查

安全审查跑完后，第二步启动性能审查 Agent，模拟大数据量导出场景下的瓶颈分析：

```text
使用 performance-reviewer agent 审查 src/modules/export/ 的性能风险，
典型场景：单次导出 10 万行数据为 Excel/CSV。
请分析：
1. 大数据量时内存占用是否线性增长（是否存在全量加载）
2. BullMQ 队列背压处理 —— 并发导出请求时队列会不会堆积
3. 导出查询是否有索引覆盖
4. 文件生成是否阻塞事件循环（同步 I/O vs stream）
```

Agent 输出示例：

```text
=== 导出模块性能分析报告 ===

[CRITICAL] 全量加载导致 OOM 风险 — src/modules/export/export.service.ts:72
  问题：导出 10 万行时先执行 SELECT * 加载全部行到内存，
  预计内存占用 >500MB，并发 3-4 个导出即 OOM
  建议：改用数据库 cursor/stream 逐批读取（每批 1000 行）

[WARNING] 缺失数据库索引 — prisma/schema.prisma:15
  导出查询 WHERE 条件为 status + created_at 范围，
  但 orders 表仅对 id 有主键索引，查 10 万行全表扫描 ~3s
  建议：CREATE INDEX idx_orders_status_created ON orders(status, created_at)

[WARNING] 队列背压无上限 — src/modules/export/queue.ts:12
  BullMQ 队列 concurrency 设为 10，但没有 max limiter，
  生产环境同时 10 个导出可能打满 CPU 和数据库连接池
  建议：设置 group limiter max=3，超出排队

[INFO] 文件生成流式写入 — src/modules/export/formatters/excel.ts:45
  已使用 stream 方式写入 Excel，事件循环未被阻塞，此项通过 ✓
```

:::info
性能审查中的 INFO 级别标记了"已经做对的事"，这部分不要忽略——它建立了现有实现的基线，后续优化时可以参考"哪些已经做对了"。
:::

### Step 3：Code Quality Agent 审查

安全洞和性能瓶颈都找到了，最后用 Code Quality Agent 做工程层面的代码健康检查：

```text
使用 code-reviewer agent 审查 src/modules/export/ 的代码质量，
关注：
1. 错误处理完整性 —— API 失败、队列失败、磁盘满场景
2. TypeScript 类型安全 —— 是否存在 any 逸出、类型断言滥用
3. 代码重复 —— 前端和后端是否有重复的类型定义或校验逻辑
4. 日志和监控埋点 —— 关键路径是否可追踪
```

Agent 输出示例：

```text
=== 导出模块代码质量报告 ===

[ISSUE] 错误处理不完整 — src/modules/export/queue.consumer.ts:28
  队列 consumer 只在 try 块内处理导出逻辑，catch 仅 console.error
  未做：重试次数限制、死信队列投递、告警通知
  建议：使用 BullMQ 的 attempts + backoff 配置，catch 中发送 Sentry 告警

[ISSUE] 类型重复定义 — 发现 3 处重复
  - src/modules/export/types.ts: ExportParams { format, filters, columns }
  - src/client/pages/export/types.ts: ExportRequest { format, filters, columns }
  两处定义完全一致，修改一端容易遗漏另一端
  建议：将共享类型提取到 packages/shared-types/export.ts

[ISSUE] 缺少关键日志 — 以下路径无日志埋点
  - 导出请求开始/结束（src/modules/export/export.controller.ts）
  - 队列 job 完成/失败（src/modules/export/queue.consumer.ts）
  - 文件清理（src/modules/export/cleanup.ts）
  建议：关键节点至少打 info 日志，含 traceId + userId + exportJobId

[PASS] TypeScript 类型安全 ✓
  未发现 any 类型逸出，strict 模式通过，类型推断合理
```

对比三种审查结果，可以按下面这张表衡量修复的优先级和排期：

| 审查维度 | 发现数 | CRITICAL | HIGH | WARNING/ISSUE | 必须在交付前修复    |
| -------- | ------ | -------- | ---- | ------------- | ------------------- |
| 安全审查 | 4      | 1        | 2    | 1             | 1 CRITICAL + 2 HIGH |
| 性能审查 | 3      | 1        | 0    | 2             | 1 CRITICAL          |
| 代码质量 | 3      | 0        | 0    | 3             | 0（可迭代修复）     |

汇总：**3 个必须在交付前修复（1 SQL 注入 + 2 CSV/路径安全 + 1 OOM 风险）**，其余 5 个可通过后续 issue 跟踪。

### Step 4：端到端验证

修复完上述问题后，启动端到端验证 Agent，确保修复没有破坏功能，且边界情况都能正确处理。将验证任务分场景逐步执行：

```text
使用 e2e-testing agent 对导出模块执行端到端验证，按以下顺序：

1. 小数据量 CSV 导出：导出 1000 行，验证格式正确、中文不乱码、表头正确
2. 大数据量 Excel 导出：导出 10 万行，验证：
   - 内存占用 < 300MB
   - 导出耗时 < 30s
   - 文件可正常打开
3. API 格式导出：分别请求 CSV/Excel/JSON 三种格式，
   验证 Content-Type 和文件内容匹配
4. CLI 批量导出：用 --format csv --output /tmp/ 导出 3 个文件，
   验证并发限流生效（同时最多 2 个导出）
5. 异常场景：模拟数据库断连、磁盘空间不足、非法参数
```

验证结果汇总：

```text
=== 端到端验证报告 ===

| 场景              | 结果   | 耗时   | 关键指标                       |
|-------------------|--------|--------|-------------------------------|
| CSV 1000 行导出   | ✓ 通过 | 1.2s   | 格式正确，UTF-8 BOM 正常       |
| Excel 10 万行导出  | ✓ 通过 | 22.4s  | 峰值内存 287MB，文件 14.2MB    |
| API JSON 导出     | ✓ 通过 | 0.8s   | Content-Type: application/json |
| API CSV 导出      | ✓ 通过 | 1.1s   | Content-Type: text/csv         |
| API Excel 导出    | ✓ 通过 | 3.2s   | Content-Type 正确              |
| CLI 批量导出      | ✓ 通过 | —      | 并发限流正确（max=2）          |
| 数据库断连        | ✓ 通过 | —      | 返回 503 + 重试提示            |
| 磁盘空间不足      | ✓ 通过 | —      | 返回 507 + 清理临时文件        |
| 非法参数          | ✓ 通过 | —      | 返回 400 + 参数说明            |
```

### Step 5：Deliver checklist + 部署

验证全部通过，进入交付环节。使用 deliver checklist 逐项确认，防止遗漏运维和回滚准备：

```text
使用交付检查 agent 生成导出模块的交付 checklist，
按：文档 / 监控 / 回滚 / 灰度 四个维度
```

Agent 输出的 checklist：

```text
=== 导出模块交付 Checklist ===

## 文档
| 检查项                   | 状态 |
|--------------------------|------|
| API 文档（Swagger 更新）  | ✓    |
| CLI 使用文档              | ✓    |
| 运维手册（环境变量说明）   | ✓    |

## 监控
| 检查项                       | 状态 | 备注                     |
|------------------------------|------|--------------------------|
| 导出队列长度告警（>50 触发）  | ✓    | Prometheus alert 已配置  |
| 导出失败率告警（>5% 触发）    | ✓    | 按 5min 窗口统计          |
| 导出耗时 p95 告警（>60s）    | ✓    | 仅统计 1 万行以上导出     |
| 大盘仪表盘已创建              | ✓    | Grafana dashboard         |

## 回滚方案
| 步骤                        | 说明                              |
|-----------------------------|-----------------------------------|
| 1. 关闭导出功能开关         | 配置中心 FEATURE_EXPORT_ENABLED   |
| 2. 回滚 deployment 镜像     | kubectl rollout undo              |
| 3. 清理积压队列             | BullMQ drain() 清除待处理 jobs     |
| 4. 通知受影响用户           | 公告 + 站内信                     |

## 灰度策略
| 阶段 | 流量  | 时长 | 观察指标                              |
|------|-------|------|--------------------------------------|
| 1    | 10%  | 24h  | 错误率 < 0.1%、p95 < 30s、无队列积压 |
| 2    | 50%  | 24h  | 同上 + 用户反馈无异常                 |
| 3    | 100% | —    | 常态化监控                            |
```

:::tip
灰度发布是最低成本的保险策略。即使审查和验证都通过，生产环境的流量模式和数据分布总有无法完全模拟的部分。逐步放量能在真正影响全局前拦住问题。
:::

## 要点总结

1. **审查维度要全覆盖**：安全 + 性能 + 代码质量三个视角一个都不能少。安全管攻击面，性能管吞吐量，代码质量管工程健壮性，三份报告交叉验证才能发现"修 A 坏 B"的连锁问题。
2. **端到端验证的重点在边界和异常**：正常路径跑通了不说明问题，数据库断连、磁盘满、超大文件、非法参数这些异常场景才是线上的真实风险。验证报告里的异常场景通过率比正常场景更有价值。
3. **Deliver checklist 防止上线遗漏**：代码写好只是 50%，文档、监控、回滚方案、灰度策略各占 12.5%。缺少任何一个，出了问题都是事故响应而非从容回滚。
4. **灰度发布降低风险**：10% → 50% → 100% 的三段式放量，配合监控指标观察，是性价比最高的风险控制手段。不要因为"着急上线"跳过灰度。
5. **审查修复要在验证之前完成**：顺序不能乱——先审查发现 → 先修复 → 再验证。如果在验证过程中发现新问题再回去修，容易陷入"修一个引入另一个"的循环。

## 变体与延伸

- **CI 中集成自动审查门禁**：将 Security / Performance / Code Quality 三个 Agent 的审查逻辑封装为 GitHub Actions 或 GitLab CI job，PR 合并前自动触发，审查未通过则阻止合并。配合 `--json` 输出模式，将审查结果结构化存入 CI artifacts。
- **上线后监控告警配置**：将 deliver checklist 中的监控指标落地为告警规则（Prometheus AlertManager 或 Grafana Alerting），接入 on-call 系统（PagerDuty / 飞书通知），确保第一个异常就在第一时间被感知。
- **定期安全扫描**：即使是已上线的功能，也建议每月跑一次安全审查 Agent 扫描全仓库。依赖库可能爆出新 CVE，业务逻辑可能因新增功能而产生新的数据泄露路径。
- **性能回归基准建立**：将端到端验证中"10 万行 Excel 导出 < 30s / 内存 < 300MB"固化为性能基线，每次 PR 自动跑性能验证，超出阈值即报警。随着数据量增长，阈值也需要动态调整。

### 相关场景

- [并行审查](./parallel-review) — 多维度并行审查工作流
- [自愈循环](./self-healing-loop) — 自动修复 + 审查的闭环
