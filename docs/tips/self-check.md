---
title: AI 生成代码自检 — 把准确率从 70% 推到 90%
description: AI 生成的代码普遍只有 70-80% 正确率，靠五步自检法 + 7 个工具 + 5 套提示词模板把准确率稳定推到 90% 以上
---

# AI 生成代码自检

> AI 生成的代码普遍能到 70-80% 正确率——剩下的 10-20% 靠自己补齐。

## 为什么需要自检

不管是单 Agent 还是多 Agent，AI 生成的代码都有一个被低估的问题：**组件之间的"缝隙"**。

- Agent A 实现了导出功能，Agent B 实现了统计功能，Agent C 做了集成——但没有人验证"导出 + 统计同时调用时会不会抢数据库连接"
- 每个 Agent 的单元测试都绿了，但**没有人跑过端到端**的完整用户路径
- SDD 审查者只读了 diff，**不读未修改的代码**——如果一个 Agent 的改动破坏了另一个 Agent 的隐式约定，审查者看不出来
- AI 倾向于实现"正常路径"，边界条件静默遗漏

## 自检五步法

```text
1. 端到端跑通核心路径     → 确保用户实际能用的流程是完整的
2. 交叉验证模块边界        → 检查模块之间的接口约定是否被遵守
3. 边界条件扫射           → 空数据、极端值、并发、网络失败
4. 让 AI 自审自己的盲区    → 问"你最不确定哪部分"、"哪两个模块的协作最脆弱"
5. 抽样手工验证           → 挑 3-5 个关键点人肉检查，不被全绿测试骗了
```

### 第 1 步：端到端跑通核心路径

不要只看单元测试——跑一遍用户实际会用到的完整操作链。

**Java 示例**：

```bash
# ponytail: 脚本化端到端——一条命令验证整个用户路径
# 1. 导出 CSV
curl -s "http://localhost:8080/api/admin/orders/export/csv?from=2026-06-01&to=2026-06-26" \
  -H "Authorization: Bearer $TOKEN" \
  | head -3
# 预期输出：订单号,手机号,金额,状态,创建时间
#           ORD-001,138****1234,99.00,ACTIVE,2026-06-15

# 2. 统计面板
curl -s "http://localhost:8080/api/admin/stats/weekly" \
  -H "Authorization: Bearer $TOKEN"
# 预期输出：{"daily":[{"date":"2026-06-20","newOrders":12},...],"totalNewOrders":87}

# 3. 无权限用户被拒绝
curl -s -o /dev/null -w "%{http_code}" \
  "http://localhost:8080/api/admin/orders/export/csv"
# 预期输出：403
```

```text
> 这段端到端脚本跑通了吗？如果任何一个步骤输出不符合预期，告诉我具体卡在哪。
```

**Vue 示例**：

```text
> 帮我自检用户管理页面的完整流程：
> 1. 打开 /users 页面，确认搜索栏、表格、导出按钮都渲染了
> 2. 输入搜索条件"张"，确认表格数据更新
> 3. 切换状态下拉为"激活"，确认 URL query 同步变化
> 4. 点击导出按钮，确认触发了下载请求
> 5. 清空搜索条件，确认恢复到全部数据
> 
> 每一步如果挂了，告诉我具体原因和修复方案。
```

### 第 2 步：交叉验证模块边界

**这是自检最关键的一步**——模块各自独立工作时，最容易出问题的就是边界。

```text
> 检查模块之间的接口约定是否被遵守：
> 
> 已知约定：
> - SearchInput emit('filter-change', filters) — filters 的字段名是 name/status/from/to
> - UserTable 接收 :filters prop，期望的字段名必须匹配
> - ExportButton 接收 :filters prop，触发 /api/users/export/csv?name=...&status=...
> 
> 逐条验证：
> 1. SearchInput emit 的字段名是否和 UserTable 期望的一致？
> 2. ExportButton 发请求时是否把 filters 正确地拼到了 URL query？
> 3. 有没有字段名不匹配导致的静默失败（比如传了 'userName' 但接收方期望 'name'）？
```

**Java 示例**：

```text
> 检查模块之间的接口约定：
> 
> ExportService 产出方法：exportCsv(filters) → byte[]
> StatsService 产出方法：getWeeklyStats() → WeeklyStats
> OrderAdminController 消费上面两个
> 
> 验证：
> 1. Controller 注入的 Service 接口是否匹配？有没有拼写错误导致 @Autowired 失败？
> 2. ExportService.exportCsv 的参数类型和 Controller 传入的一致吗？
> 3. WeeklyStats 的 JSON 序列化字段名是否和 Controller 返回的一致？
> 4. 两个 Service 都标记了 @Transactional 吗——会不会互相影响事务边界？
```

### 第 3 步：边界条件扫射

AI 倾向于实现"正常路径"，边界条件最容易遗漏。让 AI 自己列出它可能漏掉的边界条件：

```text
> 这个功能最容易在哪些边界条件上出 bug？列一个清单，然后一个一个验证。
> 常见的：
> - 空数据（搜索无结果、订单表为空）
> - 极端值（日期范围跨多年、单页 10000 条）
> - 并发（导出时有人在下单）
> - 网络失败（API 挂了、超时）
> - 权限（普通用户调了管理员接口）
```

**Java 边界自检脚本**：

```bash
# ponytail: 边界条件快速扫射——一条命令跑完
echo "=== 空数据 ==="
curl -s "http://localhost:8080/api/admin/stats/weekly" | grep -q '"totalNewOrders":0' && echo "PASS" || echo "FAIL: 空数据返回异常"

echo "=== 极端日期范围 ==="
curl -s "http://localhost:8080/api/admin/orders/export/csv?from=2020-01-01&to=2026-12-31" | head -1 | grep -q "订单号" && echo "PASS" || echo "FAIL"

echo "=== SQL 注入 ==="
curl -s "http://localhost:8080/api/admin/users?name=张%27%20OR%201=1--" | grep -q "error" && echo "PASS（有防护）" || echo "CHECK: 需人工确认"

echo "=== 无权限 ==="
curl -s -o /dev/null -w "%{http_code}" "http://localhost:8080/api/admin/orders/export/csv" | grep -q "403" && echo "PASS" || echo "FAIL: 权限校验缺失"
```

**Vue 边界自检**：

```text
> 用 vitest 写一个集中测试，覆盖以下边界条件：
> 1. filters 为空对象 {} 时，UserTable 和 ExportButton 能否正常渲染？
> 2. API 返回空数组 [] 时，UserTable 是否显示"暂无数据"？
> 3. API 返回 500 时，UserTable 是否显示错误 + 重试按钮？
> 4. 快速连续修改筛选条件 5 次，是否只发了最后一次请求？
> 5. ExportButton 在 filters 为空时点击，是否给出提示而不是发空请求？
> 
> 跑完把结果告诉我。
```

### 第 4 步：让 AI 自审盲区

AI 知道自己哪里不自信。直接问：

```text
> 坦白说，这次实现中你最不确定的 3 个地方是什么？
> 哪两个模块之间的协作最脆弱？
> 如果这个功能上线后出 bug，最可能崩在哪？
```

**实际对话示例**：

```text
Claude: 坦白说——
1. T1 和 T2 的接口约定我是"假设"的——SearchInput emit 的字段名我写了 name/status/from/to。
   如果 UserTable 那边用了不同的命名（比如 userName/statusFilter），会静默失败。
   这种跨组件的名称对齐，我没办法在实现 T1 时确认 T2 会用什么名字。
2. ExportButton 的下载逻辑我没有真正测试——我只 mock 了 fetch。浏览器的实际下载触发
   （Content-Disposition header、blob 处理）在 jsdom 环境下没法验证。
3. 如果筛选条件里 date from > date to，后端会怎么样我不知道——T2 只管展示，没做校验。
```

**针对盲区修复**：

```text
> 针对第 1 点：检查 T1 emit 的字段名和 T2/T3 接收的字段名，不一致的立即修。
> 针对第 2 点：追加一个 E2E 测试，验证下载文件的 Content-Type 是 text/csv。
> 针对第 3 点：在 SearchInput 加一个 from <= to 的校验，不合法时 disabled 掉查询。
```

### 第 5 步：抽样手工验证

AI 不太擅长"直觉判断"——比如"这个 UI 是不是真的好看"、"这个交互顺不顺畅"。挑 3-5 个关键点人肉确认：

```text
自检抽样清单（挑 5 个点人肉跑一遍）：
□ 1. 真实浏览器打开页面，搜索"张三"→ 确认结果准确
□ 2. 点击导出 → 确认下载的文件能正常用 Excel 打开
□ 3. 断网状态下点导出 → 确认有错误提示，不是白屏
□ 4. 手机号脱敏后的导出文件 → 确认中间四位是 ****
□ 5. 从日期选择器跨越 2 个月 → 确认统计数据正确
```

### 自检结果评估

跑完五步后，自己打分：

| 评级 | 标准 | 下一步 |
|------|------|--------|
| 🟢 90%+ | 端到端通、边界条件 ok、AI 自曝的盲区已修复 | 提交 |
| 🟡 70-89% | 核心路径通，但有已知隐患 | 记录技术债，标升级条件 |
| 🔴 < 70% | 集成点有阻塞 bug | 回到审查，重新审查 + 修复 |

**90% 的定义**：核心用户路径无阻塞 bug，已知边界条件有处理（不一定是完美方案，但不能静默失败），模块间接口约定有交叉验证。剩下 10% 是"真实环境才能暴露的问题"——接受这个不完美，记录在技术债里。

---

## 自检工具速查

五步自检法可以纯手工跑，但以下工具能让大部分步骤自动化。按场景选用：

### 工具 1：`/ponytail-review` — 检查过度设计

```bash
/ponytail-review
```

输出示例：

```text
L42: yagni: factory with one product. Inline it until a second one exists.
L15: native: moment.js imported for one format call. Intl.DateTimeFormat, 0 deps.
L78-95: delete: retry wrapper around an idempotent local call. Nothing replaces it.

net: -47 lines possible.
```

**适用**：代码写完后，快速扫一遍有没有过度抽象、多余依赖、可以合并的重复代码。

### 工具 2：`/ponytail-audit` — 全项目冗余扫描

```bash
/ponytail-audit
```

输出示例：

```text
🔍 Ponytail Audit Results

Dead code:
  - src/utils/formatters.ts:45 — formatCurrency() 从未调用
  - src/hooks/useDebounce.ts — 项目已有 lodash.debounce

Unused dependencies:
  - moment (2 处引用，可替换为原生 Intl.DateTimeFormat)
  - uuid (1 处引用，可替换为 crypto.randomUUID())

Merge candidates:
  - src/api/users.ts + src/api/userAdmin.ts → 合并为用户 API 模块
```

**适用**：接手现有代码或较大改动完成后的全面清理。

### 工具 3：`/code-review` — Superpowers 五维度审查

```bash
/code-review
```

5 维度：正确性 / 可读性 / 可维护性 / 性能 / 安全性。输出分级报告：🔴 严重 → 必须修 / 🟡 建议 → 修不修都行 / 🟢 表扬 → 写得好的地方。

**适用**：替代五步法中的"边界条件扫射"环节——审查者会检查边界处理。

### 工具 4：`/simplify` — 专注代码质量，不查 bug

```bash
/simplify
```

和 `/code-review` 的区别：`/simplify` 只做质量简化（复用、精简、效率），不找 bug。适合"我觉得写得太啰嗦了但不确定哪里能删"。

### 工具 5：Stop hook 三层验证

在 `.claude/settings.json` 中加 Stop hook，让 Claude Code 每次"说完成"前自动跑验证：

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "npm run build 2>&1 | tail -1" },
          { "type": "command", "command": "npm run lint 2>&1 | tail -3" }
        ]
      }
    ]
  }
}
```

**效果**：零人工干预——Claude Code 每次停之前自动 build + lint，不通过就不让停。

### 工具 6：verification-before-completion — Superpowers 验证技能

Superpowers 内置的 `verification-before-completion` 技能会在代码完成前自动激活，强制 Claude 先验证再声称完成：

```text
# 自动激活，不需要手动调用
# 规则：
# 1. 声称"修好了"之前必须跑测试确认
# 2. 测试不通过 → 不能声称完成
# 3. 验证证据必须是实际运行的输出，不是"应该没问题"
```

### 工具 7：forgen — 让 AI 自证"真的做完了"

[forgen](https://www.npmjs.com/package/@wooojin/forgen) 是一个 npm 包，安装后拦截 Stop hook，用三个元守卫检查 Claude 的输出：

| 守卫 | 检查什么 |
|------|---------|
| TEST-1 | 声称事实但没有代码引用 → 阻截 |
| TEST-2 | 高置信度但没有测量数据 → 阻截 |
| TEST-3 | 一大堆结论但没有验证过程 → 阻截 |

```bash
npm install -g @wooojin/forgen
# 然后 forgen 自动 hook 进 Claude Code
```

### 工具组合速查

| 你要检查什么 | 用的工具 | 怎么触发 |
|------------|---------|---------|
| 有没有过度设计 | `/ponytail-review` | 手动 |
| 有没有死代码/多余依赖 | `/ponytail-audit` | 手动 |
| 逻辑有没有 bug | `/code-review` | 手动 |
| 代码太啰嗦想精简 | `/simplify` | 手动 |
| build/lint 不通过不让停 | Stop hook | 自动 |
| 修完 bug 真的修好了吗 | `verification-before-completion` | 自动 |
| AI 是不是在糊弄我 | forgen | 自动 |

**组合拳推荐**：Stop hook（自动） + `/ponytail-review`（手动扫一遍） + `/code-review`（手动，只跑 🔴 严重）。三分钟走完，准确率稳定在 90% 以上。

---

## 自检提示词模板

以下提示词可以直接复制到 Claude Code 中使用。核心思路：**反复对照需求文档逐条核对，每次只聚焦一个维度，10 轮下来覆盖所有盲区**。

### 模板 1：需求文档逐条核对

```text
> 对照需求文档，逐条检查当前代码是否完整实现。不要跳过任何一条。
> 
> 需求文档：
> [贴入你的需求文档或 PRD]
> 
> 检查方式：
> 1. 把需求文档拆成逐条 checklist
> 2. 每一条去代码里找对应的实现——找不到就标记 ❌
> 3. 找到了但有偏差的标记 ⚠️ 并说明差在哪
> 4. 完全匹配的标记 ✅
> 
> 输出格式：
> | # | 需求条目 | 状态 | 证据（文件:行号 或 缺失原因） |
> 
> 不要总结、不要评价——只要逐条核对的事实。
```

**为什么有效**：AI 默认会概括性地"看起来都实现了"。强制逐条核对，每一条都必须给出文件:行号证据，糊弄不过去。

### 模板 2：10 轮分维度反复检查

**核心技巧**：不要一次让 AI 检查所有维度——它会漏。拆成 10 个独立维度，每轮只聚焦一个。

```text
> 对当前代码做 10 轮检查，每轮只聚焦一个维度。每轮输出维度名 + 发现的问题 + 证据（文件:行号）。

第 1 轮：需求完整性 — 对照需求文档，有没有漏掉的功能点？
第 2 轮：边界条件 — 空数据、null、空字符串、0、负数、超长输入是否都处理了？
第 3 轮：错误处理 — 网络失败、超时、后端 500、权限不足是否都有处理？
第 4 轮：类型安全 — 有没有 any 类型？有没有不安全的类型断言？
第 5 轮：命名一致性 — 同一个概念在不同文件里的命名是否一致？
第 6 轮：死代码 — 有没有定义了但从未调用的函数/变量/导入？
第 7 轮：硬编码 — 有没有写死的 URL、密钥、魔法数字？
第 8 轮：并发安全 — 有没有竞态条件（两个请求同时改同一条数据）？
第 9 轮：日志和可观测性 — 关键路径有没有日志？出错时能不能快速定位？
第 10 轮：文档和注释 — 对外接口有没有注释？复杂逻辑有没有解释？

每轮汇报格式：
### 第 N 轮：维度名
| 问题 | 严重度 | 位置 | 修复建议 |
```

**Java 版**（把维度替换成 Java 项目常见问题）：

```text
> 对当前代码做 10 轮检查，每轮只聚焦一个维度：

第 1 轮：需求完整性 — 对照 PRD 逐条核对，有没有漏掉的接口/字段？
第 2 轮：空指针 — 所有方法参数、返回值、集合操作有没有 NPE 风险？
第 3 轮：事务边界 — @Transactional 标注是否正确？有没有跨 Service 的事务问题？
第 4 轮：SQL 注入 — 所有拼 SQL 的地方是否都用了参数化查询？
第 5 轮：序列化 — Controller 返回的 DTO 有没有循环引用？日期格式是否统一？
第 6 轮：资源释放 — 流、连接、文件句柄是否都在 finally/try-with-resources 中关闭？
第 7 轮：并发安全 — 有没有共享可变状态未加锁？HashMap 是否该用 ConcurrentHashMap？
第 8 轮：日志 — 关键路径有没有 log.info/error？异常是否记录了完整堆栈？
第 9 轮：配置外部化 — 有没有硬编码的 URL、端口、密钥？
第 10 轮：测试覆盖 — 核心逻辑的单元测试覆盖率够吗？异常路径测了吗？
```

**Vue 版**：

```text
> 对当前代码做 10 轮检查，每轮只聚焦一个维度：

第 1 轮：需求完整性 — 对照原型图/PRD，有没有漏掉的组件/交互/状态？
第 2 轮：组件边界 — 每个组件的 props/emits 接口是否明确？有没有跨组件直接操作 DOM？
第 3 轮：响应式陷阱 — ref/reactive 使用是否正确？有没有解构丢失响应式的问题？
第 4 轮：异步状态 — 每个有异步请求的组件是否覆盖了 loading/empty/error 三种状态？
第 5 轮：内存泄漏 — watch/event listener/timer/observer 是否在 onUnmounted 中清理？
第 6 轮：性能 — 有没有不必要的重渲染？大列表是否用了虚拟滚动？计算属性是否该用 computed？
第 7 轮：无障碍 — form 有没有 label？button 有没有 aria-label？颜色对比度够吗？
第 8 轮：TypeScript — 有没有 any 类型？emit 类型定义是否准确？API 返回值有没有类型？
第 9 轮：错误处理 — API 失败有没有用户提示？try-catch 是否覆盖了所有 await？
第 10 轮：兼容性 — 用到的 API（IntersectionObserver/dialog/structuredClone）目标浏览器都支持吗？
```

### 模板 3：对抗式自审

```text
> 假设你是一个专门找茬的 QA，任务就是挑当前代码的毛病。不要客气，不要留情面。

规则：
1. 只找问题，不说优点——"这里写得不错"这种话不要说
2. 每个问题必须有代码位置（文件:行号）和复现条件
3. 按严重度排序：🔴 线上必崩 > 🟡 可能崩 > 🟢 小瑕疵
4. 如果一条都找不出来，输出"我没找到问题"——不要硬编

提问角度：
- 如果我传入 null，会崩吗？
- 如果网络断了，用户看到什么？
- 如果同时 100 个人点这个按钮，会怎样？
- 如果数据库里这条数据被删了，页面会白屏吗？
- 如果用户手机号是 +1 (555) 123-4567 这种格式，脱敏逻辑还对吗？
```

### 模板 4：需求文档逐条回归

```text
> 拿着需求文档，逐条做回归确认。每一条分配一个测试用例，跑完告诉我结果。

需求文档：
[贴入需求]

对每一条需求：
1. 设计最小测试步骤（不超过 3 步操作）
2. 实际执行或模拟执行
3. 记录结果：PASS / FAIL（附截图或日志）
4. FAIL 的条目标注根因和修复建议

不要跳过任何一条"看起来简单"的需求——越简单的越容易被忽略。
```

### 模板 5：Git diff 盲区扫描

```text
> 读当前分支的 git diff，找出以下三类问题：

1. 改了但没有覆盖到的关联代码
   - 改了 A 函数的签名 → 搜索所有调用方，有没有漏改的？
   - 改了 B 接口的返回字段 → 前端消费方有没有同步更新？

2. 不该出现但出现了的改动
   - 有没有空白行/格式变化（不是逻辑改动）？
   - 有没有 debug 用的 console.log / System.out.println 残留？
   - 有没有临时注释掉的代码？

3. diff 看起来没问题但实际有隐患的
   - 新增的依赖是否引入了已知漏洞？
   - 新增的 API 调用有没有鉴权？
   - 新增的数据库查询有没有索引？
```

### 使用建议

| 场景 | 用什么模板 | 耗时 |
|------|-----------|------|
| 刚写完功能，需求文档在手边 | 模板 1（逐条核对） | 3-5 分钟 |
| 功能比较复杂，想全面检查 | 模板 2（10 轮分维度） | 10-15 分钟 |
| 感觉代码没问题但心虚 | 模板 3（对抗式自审） | 2-3 分钟 |
| 上线前最终确认 | 模板 4（逐条回归） | 5-10 分钟 |
| Review PR / 合并前 | 模板 5（diff 盲区扫描） | 2-3 分钟 |

**防漏核心技巧**：不要让 AI 一次检查所有东西——人的注意力有限，AI 的也是。**拆成 10 个窄维度，一次只检查一个**，命中率远高于"帮我全面检查一下"。

---

## 自主增强：让自检越用越聪明

> 每次修 bug、每次审查发现的问题，沉淀到经验库。下一次自检自动加载——AI 从"每次从零开始检查"变成"带着历史教训检查"。

### 核心思路

```text
传统自检：每次从零开始，靠提示词覆盖 → 命中率 70-80%
增强自检：每次修完沉淀经验 → 下次自检先读经验库 → 命中率逐步逼近 95%+
```

**类比**：就像新员工入职 vs 老员工——新员工靠 checklist 检查，老员工知道"上次这儿出过事，多看一眼"。

### 经验库结构

在项目根目录建 `.claude/lessons/`，按模块分类存储：

```text
.claude/lessons/
├── README.md                  # 经验库说明 + 使用规则
├── api/                       # 按模块分目录
│   ├── order-service.md       # 订单模块的经验
│   └── user-service.md
├── frontend/
│   ├── user-management.md     # 用户管理页面的经验
│   └── form-components.md     # 表单组件的经验
├── patterns/                  # 跨模块的通用模式
│   ├── npe-pitfalls.md        # NPE 常见陷阱
│   ├── vue-reactivity.md      # Vue 响应式常见坑
│   └── transaction-issues.md  # 事务相关坑
└── .index.json                # 索引文件，快速匹配相关经验
```

### 经验文件模板

每个经验文件记录：什么时候、什么场景、什么问题、怎么修的、怎么预防。

```markdown
# 订单模块 — 历史经验

## 2026-06-26 — NPE：导出时金额字段为 null
- **场景**：订单 CSV 导出，buildRow() 直接调 order.getAmount().toPlainString()
- **根因**：amount 字段数据库可为 null，但代码未处理 Optional
- **修复**：Optional.ofNullable(order.getAmount()).map(BigDecimal::toPlainString).orElse("0.00")
- **检查规则**：所有 BigDecimal 字段在序列化前必须做 null guard
- **关联文件**：OrderExportService.java:47 → Optional<BigDecimal> null check
- **标签**：`npe` `export` `bigdecimal`

## 2026-06-20 — 性能：N+1 查询导致导出超时
- **场景**：导出 500 条订单，每条查一次用户表 → 501 次 SQL
- **根因**：for 循环内调 userRepository.findById()
- **修复**：批量查用户，Map<Long, User> 缓存
- **检查规则**：任何循环内的数据库调用 → 批量查询
- **关联文件**：OrderExportService.java → buildRow() 循环
- **标签**：`n+1` `performance` `export`
```

### 何时写经验

**触发条件**（满足任一即写）：

| 触发条件 | 优先级 | 示例 |
|---------|--------|------|
| Bug 修复完成 | 必须写 | NPE 修完 → 写经验 |
| Code review 发现严重问题 | 必须写 | 发现 SQL 注入 → 写经验 |
| 自检五步法发现遗漏 | 必须写 | 边界条件漏了 → 写经验 |
| 踩到第三方库的坑 | 建议写 | 某版本有 bug → 写经验 |
| 优化了一段低效代码 | 建议写 | N+1 → 批量查询 → 写经验 |

**写经验的提示词**：

```text
> 把这次修复的经验沉淀到 .claude/lessons/<module>/<topic>.md：
> 
> 1. 判断这个修复涉及哪个模块——选对目录，新建或在已有文件追加
> 2. 按模板格式写：日期、场景、根因、修复、检查规则、标签
> 3. 如果已有类似经验，标注"这是第 N 次出现此问题"
> 4. 更新 .claude/lessons/.index.json 索引文件
```

### 索引文件

`.claude/lessons/.index.json` 让 Claude Code 快速定位相关经验，不用遍历所有文件：

```json
{
  "tags": {
    "npe": [
      "api/order-service.md#2026-06-26",
      "api/user-service.md#2026-06-15",
      "patterns/npe-pitfalls.md"
    ],
    "n+1": [
      "api/order-service.md#2026-06-20",
      "patterns/performance-pitfalls.md"
    ],
    "vue-reactivity": [
      "frontend/user-management.md#2026-06-22",
      "patterns/vue-reactivity.md"
    ]
  },
  "files": {
    "OrderExportService.java": ["api/order-service.md"],
    "UserManagement.vue": ["frontend/user-management.md"]
  },
  "lastUpdated": "2026-06-26T15:30:00"
}
```

### 集成到自检流程：第 0 步

在五步自检之前，加一个**第 0 步**——先加载历史经验：

```text
自检增强流程：
  第 0 步：加载经验库           ← 新增！从 .claude/lessons/ 读取相关经验
  第 1 步：端到端跑通核心路径
  第 2 步：交叉验证模块边界
  第 3 步：边界条件扫射
  第 4 步：让 AI 自审盲区
  第 5 步：抽样手工验证
```

**第 0 步提示词**：

```text
> 在开始自检之前，先做"第 0 步"——加载历史经验：
> 
> 1. 读 .claude/lessons/.index.json，找到本次改动涉及的文件/模块
> 2. 根据索引加载对应的经验文件（最多 3 个文件，防止上下文溢出）
> 3. 提取与本次改动相关的检查规则，整理成"本次自检重点关注"清单
> 4. 把这张清单带到后续 5 步自检中——检查点是普通步骤的 3 倍深度
> 
> 输出格式：
> ### 本次自检历史经验加载
> - 涉及模块：OrderExportService.java, UserManagement.vue
> - 加载经验文件：api/order-service.md, frontend/user-management.md, patterns/npe-pitfalls.md
> - 重点关注：
>   □ BigDecimal null guard（第 3 次出现，高频！）
>   □ 循环内数据库调用 → 批量查询
>   □ watchEffect → watch({ deep: true }) 响应式陷阱
```

### Java 完整示例

**场景**：第一次写订单导出，自检发现 NPE + N+1 两个问题，修复后沉淀经验。第二次写统计导出时，先加载经验库，直接避开这两个坑。

```text
=== 第 1 次：订单导出 ===

## 实现完成后的自检

> 第 0 步：加载经验库
> .claude/lessons/.index.json → 首次开发，经验库为空 → 跳过

> 第 1-5 步：五步自检
> 第 3 步发现：金额为 null 时 NPE
> 第 3 步又发现：导出 500 条数据，501 次 SQL

> 修复后沉淀：
> 把这次修复的经验沉淀到 .claude/lessons/api/order-service.md 和 .claude/lessons/patterns/npe-pitfalls.md

Claude Code 写入：

  .claude/lessons/api/order-service.md:
    ## 2026-06-20 — NPE：导出时金额字段为 null
    - 检查规则：所有 BigDecimal 字段在序列化前必须做 null guard
    - 标签：npe export bigdecimal

    ## 2026-06-20 — N+1：导出循环内查用户表
    - 检查规则：任何循环内的数据库调用 → 批量查询
    - 标签：n+1 performance export

  .claude/lessons/.index.json 更新：
    tags.npe: ["api/order-service.md#2026-06-20"]
    tags.n+1: ["api/order-service.md#2026-06-20"]
    files.OrderExportService.java: ["api/order-service.md"]


=== 第 2 次：统计导出（3 天后） ===

## 实现完成后的自检

> 第 0 步：加载经验库
> 读 .claude/lessons/.index.json
> → 匹配文件：StatsExportService.java（不在索引中）
> → 匹配标签：export → 加载 api/order-service.md
> → 匹配模式：npe + n+1 → 加载 patterns/npe-pitfalls.md
> 
> ### 本次自检重点关注：
> □ BigDecimal null guard — 上次订单导出踩过（标签: npe export）
>   → 检查 StatsExportService 里所有 BigDecimal 字段序列化
> □ 循环内DB调用 — 上次 N+1 问题（标签: n+1 export）
>   → 检查统计数据是否批量查询

> 第 1-5 步自检：
> ✅ BigDecimal null guard：已用 Optional.ofNullable（经验生效！）
> ✅ 批量查询：statsRepository.aggregate() 已是单次 SQL（经验生效！）
> ✅ 新发现：统计日期范围未校验 → 写新的经验

> 自检耗时：上次 8 分钟，这次 3 分钟（2 个历史坑直接避过）
> 自检命中率：上次发现 2 个问题，这次发现 1 个新问题（历史经验覆盖了 2 个）
```

### Vue 完整示例

**场景**：用户管理页面，第一次遇到响应式陷阱 + 空状态遗漏。沉淀后，后续页面自动避坑。

```text
=== 第 1 次：用户管理页 ===

> 第 0 步：经验库为空 → 跳过

> 第 1-5 步自检发现：
> 1. watchEffect 依赖 filters 对象，深层属性变化不触发 → 改用 watch(filters, ..., { deep: true })
> 2. 列表为空时没显示"暂无数据" → 补 v-if="users.length === 0"

> 修复后沉淀：

  .claude/lessons/frontend/user-management.md:
    ## 2026-06-22 — 响应式陷阱：watchEffect 不触发深层变化
    - 检查规则：监听 reactive 对象时用 watch + { deep: true }，不用 watchEffect
    - 标签：vue-reactivity watchEffect deep-watch

    ## 2026-06-22 — 状态遗漏：列表空状态未处理
    - 检查规则：任何列表组件必须覆盖 loading/empty/error/data 四种状态
    - 标签：ui-states empty-state

  .claude/lessons/patterns/vue-reactivity.md:
    ## watchEffect vs watch 选择规则
    - 监听对象属性变化 → watch(..., { deep: true })
    - 只依赖简单 ref → watchEffect 可以
    - 标签：vue-reactivity decision-rule


=== 第 2 次：订单管理页（1 周后） ===

> 第 0 步：加载经验库
> → 匹配模式：vue-reactivity / ui-states
> → 加载 patterns/vue-reactivity.md + frontend/user-management.md
> 
> ### 重点关注：
> □ watchEffect vs watch 选择 → 检查所有数据监听
> □ 四状态 loading/empty/error/data → 检查所有列表

> 第 1-5 步自检：
> ✅ 数据监听：已用 watch + { deep: true }（经验生效！）
> ⚠️ 四状态：loading + data 有，error 有，缺 empty → 补上
> 
> 自检耗时：上次 10 分钟，这次 4 分钟
```

### 经验的生命周期

经验不是写了就永远在那——会过时、会被覆盖、需要维护：

| 阶段 | 操作 | 何时 |
|------|------|------|
| 写入 | 按模板记录 | 每次修复后 |
| 命中 | 自检时加载相关经验 | 每次自检前 |
| 验证 | 确认经验仍然有效 | 相关代码重构后 |
| 升级 | 同类问题出现 3 次 → 升级为"团队规范" | 第 3 次出现时 |
| 淘汰 | 代码已删除 / 架构已变更 → 归档 | 确认不再适用时 |

**升级规则**：

```text
> 检查 .claude/lessons/ 中，有没有标签出现 >= 3 次的？
> 如果有，这条经验应该升级为"必须检查规则"——不再依赖经验库加载，直接写进自检提示词里。

示例：
  npe 标签出现 5 次 → 升级为：每次自检第 3 步默认加 "所有方法参数/返回值是否有 NPE 风险？"
  n+1 标签出现 3 次 → 升级为：每次自检第 3 步默认加 "是否有循环内数据库调用？"
```

### 组合拳：经验库 + 五步自检 + 10 轮检查

最完整的自检流程——经验驱动 + 结构覆盖：

```text
> 对当前改动做增强自检：
> 
> 第 0 步：加载 .claude/lessons/ 中相关经验，整理"重点关注清单"
> 第 1 步：端到端跑通（优先验证经验清单中的检查点）
> 第 2 步：交叉验证模块边界
> 第 3 步：边界条件扫射（结合历史经验 + 默认覆盖）
> 第 4 步：AI 自审盲区（有经验库时 AI 的盲区判断更准）
> 第 5 步：抽样手工验证
> 
> 第 6 步：如果有新发现 → 沉淀到经验库
> 第 7 步：如果有标签出现 >= 3 次 → 输出升级建议
```

### 效果度量

用几个硬指标衡量经验库是否在发挥作用：

```text
每次自检完成后记录：
  .claude/lessons/.stats.json
  {
    "2026-06-26": {
      "selfCheckDuration": "3min",         // 自检耗时
      "issuesFound": 1,                    // 发现的问题数
      "issuesPrevented": 2,                // 经验库提醒避过的坑
      "lessonsLoaded": 3,                  // 加载的经验文件数
      "lessonsWritten": 1,                 // 新沉淀的经验数
      "historicalHitRate": "67%"           // 经验命中率 = prevented / (prevented + found)
    }
  }

趋势（理想）：
  第 1 周：自检 8min / 发现 5 个问题 / 经验库命中 0%
  第 2 周：自检 5min / 发现 3 个问题 / 经验库命中 40%
  第 4 周：自检 3min / 发现 1 个问题 / 经验库命中 75%
  第 8 周：自检 2min / 发现 0-1 个问题 / 经验库命中 85%+
```

### 快速启动

在项目中一键初始化经验库：

```bash
# 创建目录结构
mkdir -p .claude/lessons/{api,frontend,patterns}

# 创建索引文件
cat > .claude/lessons/.index.json << 'EOF'
{
  "tags": {},
  "files": {},
  "lastUpdated": "$(date -Iseconds)"
}
EOF

# 创建 README
cat > .claude/lessons/README.md << 'EOF'
# 经验库

每次修 bug、审查发现问题后，沉淀到这里。下次自检自动加载。

## 使用方式

在自检提示词前加：
> 第 0 步：读 .claude/lessons/.index.json，加载相关经验作为本次自检的检查点

## 文件命名

- 按模块：api/<service-name>.md
- 按页面：frontend/<page-name>.md
- 通用模式：patterns/<topic>.md

## 经验模板

## YYYY-MM-DD — 简短标题
- **场景**：在做什么操作时出现的
- **根因**：真正的原因，不是表象
- **修复**：具体的代码改动
- **检查规则**：一句话，下次自检可以直接用的检查点
- **标签**：`tag1` `tag2`
EOF

# 创建统计文件
cat > .claude/lessons/.stats.json << 'EOF'
{ "entries": [] }
EOF

echo "✅ 经验库初始化完成：.claude/lessons/"
```

然后第一次自检时：

```text
> 做增强自检：
> 1. 先初始化经验库：mkdir -p .claude/lessons/{api,frontend,patterns}
> 2. 第 0 步：加载经验（首次为空，跳过）
> 3. 第 1-5 步：正常五步自检
> 4. 如果发现任何问题：沉淀到 .claude/lessons/
> 5. 更新 .index.json 和 .stats.json
```

---

## 相关页面

- [多 Agent 协同工作技巧](/tips/multi-agent-tips) — 从需求到交付的完整流程
- [Ponytail](/tips/ponytail) — 懒惰高级工程师模式，减少 80-94% 过度设计
- [Superpowers](/tips/superpowers) — 5 大核心工作流（含 verification-before-completion）
- [代码审查](/skills/workflow/superpowers) — 5 维度分级审查
