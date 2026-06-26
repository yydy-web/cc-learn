---
title: Skill Creator — 构建自定义技能
description: Skill Creator 是 Anthropic 官方元技能，用对话方式引导你创建自己的 Claude Code Skill，从描述到打包全自动
---

# Skill Creator — 构建自定义技能

> 你不需要学 YAML 语法——描述你要什么，它帮你写 SKILL.md。

## 概述

**Skill Creator** 是 Anthropic 官方出品的"元技能"——一个用来创建技能的技能。你描述你想让 Claude Code 掌握什么能力，它引导你产出规范的 `SKILL.md` 文件、测试用例、打包脚本。

手写 Skill 最大的问题：**格式地狱**。YAML frontmatter 的缩进、description 的触发词设计、references 的分层——一个标点符号不对，Skill 触发就不稳定。Skill Creator 把这些格式细节全包了——你只管说"我要一个能把 Markdown 表格转成 SQL 的技能"，它生成所有文件。

**核心数据**：官方维护、7 步工作流（需求→草案→测试→评估→迭代→优化→打包）、支持 SKILL.md + scripts/ + references/ + assets/ 完整目录结构。

## 核心理念：描述需求，自动生成

```
手写 Skill：
  读 SKILL.md 格式文档 → 写 YAML frontmatter → 调试 description 触发词 →
    写到一半发现 references 没分层 → 重构目录结构 → 测了 3 次还是不触发

Skill Creator：
  你说 "做一个 API 测试技能" →
    它追问：输入是什么？输出是什么？什么场景触发？ →
      自动生成 SKILL.md + evals/ + scripts/ →
        跑评估 → 改 description →
          稳定触发 → 打包为 .skill 文件
```

## 安装

```bash
# 添加官方技能市场
/plugin marketplace add anthropics/skills

# 安装（skill-creator 包含在 example-skills 包里）
/plugin install example-skills@anthropic-agent-skills
```

社区增强版（功能相同，更新更快）：

```bash
/plugin marketplace add daymade/claude-code-skills
/plugin install skill-creator@daymade-claude-code-skills
```

重启 Claude Code 后验证：

```text
用 skill-creator 帮我创建一个技能
```

如果 Claude 开始追问你"技能叫什么名字、做什么用"，说明安装成功。

## 使用方式

### 7 步工作流

```
需求捕获 → 编写草案 → 创建测试用例 → 运行评估 → 审查结果 → 迭代优化 → 打包分发
```

### 第一步：描述需求

直接用自然语言描述：

```text
> 用 skill-creator 创建一个技能，功能是把 Java 实体类转成 OpenAPI Schema JSON。
> 输入：Java 源文件路径
> 输出：符合 OpenAPI 3.0 规范的 Schema JSON
> 触发场景：用户说"生成 API 文档"、"导出 Schema"、"实体转 OpenAPI"
```

### Skill Creator 会追问

```text
Claude: 确认几个细节：

1. 需要处理 JPA 注解吗？（@Column, @ManyToOne 等）
2. 嵌套实体（如 Order 包含 List<OrderItem>）怎么处理？
3. 枚举类型映射成什么？（string / enum）
4. 输出格式偏好？（单个 schema 文件 / 按实体拆文件）
```

### 自动生成的目录结构

```
java-to-openapi/
├── SKILL.md                 # 主文件：触发规则 + 转换逻辑
├── scripts/
│   └── convert.py           # 核心转换脚本（沉淀复用）
├── references/
│   ├── openapi-types.md     # OpenAPI 类型映射表（按需加载）
│   └── jpa-mapping.md       # JPA 注解→Schema 映射规则
├── assets/
│   └── template.json        # Schema 输出模板
└── evals/
    └── evals.json           # 测试用例
```

### SKILL.md 自动生成示例

```yaml
---
name: java-to-openapi
description: >
  将 Java 实体类转换为 OpenAPI 3.0 Schema JSON。
  当用户提到"生成 API 文档"、"实体转 OpenAPI"、"导出 Schema"、
  "Java 转 JSON Schema" 时触发。
  支持 JPA 注解识别和嵌套实体处理。
  不要用于非 Java 项目或非 OpenAPI 格式的文档生成。
---

# Java → OpenAPI Schema 转换

## 触发条件
- 用户输入 .java 文件路径
- 提到 OpenAPI / Swagger / Schema 生成
- 需要 API 文档自动生成

## 转换规则
1. Java String → { "type": "string" }
2. Java Integer/Long → { "type": "integer", "format": "int64" }
3. Java BigDecimal → { "type": "number", "format": "double" }
4. Java LocalDate → { "type": "string", "format": "date" }
5. Java LocalDateTime → { "type": "string", "format": "date-time" }
6. Java Enum → { "type": "string", "enum": [...] }
7. JPA @Column(name="X") → Schema property name = X
8. JPA @ManyToOne → { "$ref": "#/components/schemas/..." }

## 输出格式
每个实体输出为 components/schemas/<EntityName> 节点，
所有 schema 合并到一个 JSON 文件。
```

### Description 是关键

description 写得好不好，直接决定 Skill 能不能被触发。Skill Creator 的内置原则：

| 原则 | 示例 |
|------|------|
| **功能描述** | "将 Java 实体类转换为 OpenAPI Schema JSON" |
| **触发场景** | "用户提到'生成 API 文档'、'导出 Schema'时触发" |
| **排除场景** | "不要用于非 Java 项目或非 OpenAPI 格式" |

最常见的坑：description 太模糊（"处理文档"——Claude 不知道什么时候触发）。

### 测试与评估

Skill Creator 会帮你生成测试用例：

```json
{
  "skill_name": "java-to-openapi",
  "evals": [
    {
      "id": 1,
      "prompt": "把 src/model/User.java 转成 OpenAPI Schema",
      "expected_behavior": "触发 skill，输出包含 type: object 的 JSON"
    },
    {
      "id": 2,
      "prompt": "生成 API 文档",
      "expected_behavior": "触发 skill，询问 Java 文件路径"
    },
    {
      "id": 3,
      "prompt": "帮我看下 Order.java 里有什么字段",
      "expected_behavior": "不触发 skill（不是生成 Schema 的需求）"
    }
  ]
}
```

跑评估：

```text
> 用 skill-creator 评估 java-to-openapi
```

输出 A/B 对比（有 Skill vs 无 Skill），量化 Skill 的边际收益。

### 打包分发

```text
> 用 skill-creator 打包 ~/.claude/skills/java-to-openapi
```

生成 `java-to-openapi.skill` 文件，发给同事直接导入。

## 日常使用

### Java 示例

**场景**：你的团队有一套内部的代码规范——Controller 返回值必须用 `Result<T>` 包装，异常必须走 `GlobalExceptionHandler`。新人写代码经常不遵守。你想把这个规范做成 Skill，让 Claude Code 自动遵守。

**用 Skill Creator 创建**：

```text
> 用 skill-creator 创建一个技能：team-code-standards。

> 规则：
> 1. 所有 Controller 方法返回 Result<T>，不用 ResponseEntity
> 2. 所有异常走 GlobalExceptionHandler，Controller 里不 try-catch
> 3. Service 层方法命名：getXxx（单个查询）、listXxx（列表查询）、createXxx、updateXxx、deleteXxx
> 4. 日志用 @Slf4j，不要 System.out.println
> 5. 日期用 LocalDateTime，不用 Date

> 触发：任何时候写 Java 代码都要遵循
```

Skill Creator 生成的 SKILL.md：

```yaml
---
name: team-code-standards
description: >
  团队 Java 代码规范。在任何 Java 代码编写时自动生效。
  包含返回值格式、异常处理、命名规范、日志、日期类型的强制约定。
  这是一个 always-on 类型的技能，不需要特殊触发词。
alwaysApply: true
---

# 团队 Java 代码规范

## Controller 层
- 返回类型：`Result<T>`（统一响应体），不用 `ResponseEntity`
- 异常：抛出自定义业务异常，由 `GlobalExceptionHandler` 统一处理
- 不在 Controller 写 try-catch 包围整个方法体

## Service 层命名
- 查询单个：`getXxx`（如 getOrderById）
- 查询列表：`listXxx`（如 listOrdersByUser）
- 创建：`createXxx`
- 更新：`updateXxx`
- 删除：`deleteXxx`
- 不在 Service 方法名里加 redundant 前缀（不用 doCreate、handleUpdate）

## 日志
- 用 Lombok `@Slf4j`
- 用 `log.info/warn/error`，不用 `System.out.println`
- 异常日志：`log.error("订单创建失败, orderId={}", id, e)`

## 日期
- 全部用 `java.time.LocalDateTime` / `LocalDate` / `LocalTime`
- 不用 `java.util.Date` 或 `java.sql.Timestamp`
- 序列化依赖 Jackson 的 `JavaTimeModule`（项目已配置）
```

现在你团队的新人开 Claude Code 写 Java——自动遵循这套规范，不需要你每次 CR 都标"返回值不对"。

### Vue 示例

**场景**：你的 Vue 项目用了 Pinia + Vue Router + Element Plus，你想让 Claude Code 自动遵从这些约定。

```text
> 用 skill-creator 创建 vue-project-conventions 技能：

> 规则：
> 1. 状态管理用 Pinia（不用 Vuex）
> 2. 路由用 Vue Router 4，页面组件放 src/views/，公共组件放 src/components/
> 3. UI 组件用 Element Plus，前缀 el-
> 4. API 请求统一用 src/api/ 下的模块
> 5. 组合式 API（<script setup>），不用 Options API
> 6. TypeScript strict mode
> 7. 样式用 scoped + CSS 变量，不用 ::v-deep
```

Skill Creator 生成的 SKILL.md 关键部分：

```yaml
---
name: vue-project-conventions
description: >
  Vue 3 项目约定。编写 Vue 代码时自动应用。
  alwaysApply: true
---

## 状态管理
- 用 Pinia。定义 store：`src/stores/<name>.ts`
- 使用 `storeToRefs` 解构响应式属性
- Actions 用 async/await

## 路由
- 页面路由：`src/router/routes.ts`
- 页面组件放 `src/views/<PageName>.vue`
- 路由 meta 包含 title 字段

## UI 组件
- 优先用 Element Plus 内置组件（el-button、el-table、el-dialog...）
- 不要用原生 button/input 替代
- 自定义组件放 `src/components/`

## 组合式 API
- `<script setup lang="ts">`，不用 `export default`
- 用 `defineProps<T>()` 泛型语法
- 用 `defineEmits<T>()` 泛型语法
- Composable 抽到 `src/composables/useXxx.ts`
```

## 实战场景：把重复的提示词变成 Skill

### 场景

你发现自己每次都跟 Claude Code 说同样的话："用 scoped 样式、不要直接改 props、错误信息用 ElMessage 弹出..."——这些指令每次都要手动说一遍。

### 你怎么操作（对话流程）

```text
> 用 skill-creator 创建一个 always-on 技能，把我项目中重复说的要求固化下来
```

Skill Creator 会：

1. 让你列出每次重复说的要求
2. 帮你整理成规范条目
3. 检查和其他 Skill 有没有冲突
4. 生成 SKILL.md
5. 建议你跑一次评估，确认触发稳定

**结果**：你不再说"别忘了 scoped 样式"——Skill 替你说了。

## 最佳实践

### 什么时候自己写 Skill

| 场景 | 用 Skill Creator | 手写 |
|------|-----------------|------|
| 团队规范（always-on） | ✅ | — |
| 特定工具流程（如 API 测试） | ✅ | — |
| 简单的触发→动作类 | ✅ | — |
| 非常简单的规则（3-5 条） | — | ✅ 手写更快 |

### 7 大设计原则

Skill Creator 内置的设计约束——生成时就遵循：

| 原则 | 说明 |
|------|------|
| **渐进披露** | SKILL.md ≤ 500 行，大段参考放 `references/` |
| **解释 Why** | "用 UTF-8 因为中文其他编码乱码" 优于 "必须用 UTF-8" |
| **识别重复** | 同一脚本被反复生成 → 沉淀到 `scripts/` |
| **Description 三层** | 功能 + 场景 + 关键词 |
| **创建即测试** | 至少 3 个用例：典型、边界、容易出错 |
| **A/B 基线** | 对比有/无 Skill 两次结果，量化收益 |
| **定期做减法** | 删掉 LLM 不会犯错的部分 |

## 常见问题

### 我做的 Skill 触发不稳定怎么办？

90% 是 description 的问题。用 Skill Creator 的评估功能跑一次，看哪些场景没触发，补上触发词。最常见的坑：
- description 太泛（"处理文件"）
- 没加排除场景（触发太多反而被忽略）
- 触发词太生僻（你叫它"实体转换器"，用户说"帮我转一下这个类"就匹配不上）

### always-on Skill 会影响其他 Skill 吗？

不会冲突。always-on Skill 在每次会话注入基础规则，其他 Skill 按需触发。但别建太多 always-on Skill——每个都占上下文窗口。

### 和 CLAUDE.md 有什么区别？

CLAUDE.md 是你手动维护的静态文件。Skill 有 description 路由机制——只在匹配场景时加载完整内容，不匹配时只占 ~100 tokens 的元数据。规则多了以后，Skill 比 CLAUDE.md 更 token 友好。
