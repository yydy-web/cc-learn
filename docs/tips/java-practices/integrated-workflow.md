---
title: Java 集成工作流详解
description: 从代码探索到发布的五阶段 Java/Spring Boot 开发工作流，深度集成 ECC、Gstack、Superpowers、CodeGraph、Graphify、Serena、Spec-Kit 和 Context7
---

# Java 集成工作流详解

本文档将 Java/Spring Boot 开发拆解为**探索分析、规划规格、TDD 实现、审查测试、发布自动化**五个阶段，完整展示如何将 ECC、Gstack、Superpowers、CodeGraph、Graphify、Serena、Spec-Kit 和 Context7 这 8 个核心工具串联成一条端到端的开发工作流。每个阶段都有明确的输入产出和对应的主力工具，前后阶段通过结构化产物（依赖图、规格文档、测试报告）无缝衔接。

:::info
本文是 [Java 工具链集成全景](/tips/java-practices/) 的子页面。建议先阅读全景概览了解工具矩阵和五阶段划分，再按需深入各阶段的具体操作。
:::

## Phase 1: 探索分析（CodeGraph + Serena + Context7）

在动手写代码之前，花 10–15 分钟理解现有代码结构，可以避免后期大量的返工。对 Java 项目而言尤其重要——Spring Boot 的分层架构（Controller → Service → Repository）意味着一个 Entity 变更可能波及多个层。这个阶段的目标是回答三个关键问题：

1. **代码是怎么组织的？** —— REST API 路由结构、分层架构、模块边界
2. **改一个地方会影响什么？** —— Entity 依赖关系、Service 调用链、Repository 查询
3. **最新的框架 API 怎么用？** —— 避免使用已废弃的 `javax.*` 写法，采纳 `jakarta.*` 最新实践

下面分别用 CodeGraph、Serena、Context7 来回答这三个问题。

### CodeGraph Java 项目探索

CodeGraph 会自动扫描项目，构建 REST API 路由、Service 依赖、Repository 查询之间的依赖图谱。它能识别 Spring 框架注解（`@RestController`、`@RequestMapping`、`@Service` 等），自动构建从 HTTP 端点到数据库层的完整调用链。

#### 操作 1: REST API 路由探索

了解项目的 API 端点组织，是接手任何 Spring Boot 项目的第一步。

```
> 这个 Spring Boot 项目有哪些 REST API 端点？列出所有 Controller 的路由映射
```

CodeGraph 会解析 `@RestController` 和 `@RequestMapping` 注解，输出完整的路由表。对于大型项目，这比逐个读取 Controller 文件高效得多：

```
API 路由结构:
├── /api/auth
│   ├── POST   /api/auth/login        → AuthController.login()
│   ├── POST   /api/auth/register     → AuthController.register()
│   └── POST   /api/auth/refresh      → AuthController.refreshToken()
├── /api/users
│   ├── GET    /api/users              → UserController.list()
│   ├── GET    /api/users/{id}         → UserController.getById()
│   ├── PUT    /api/users/{id}         → UserController.update()
│   └── DELETE /api/users/{id}         → UserController.delete()
├── /api/orders
│   ├── GET    /api/orders             → OrderController.list()
│   ├── POST   /api/orders             → OrderController.create()
│   └── PUT    /api/orders/{id}/status → OrderController.updateStatus()
└── /actuator
    ├── GET    /actuator/health        → 自动配置
    └── GET    /actuator/metrics       → 自动配置
```

#### 操作 2: Entity 依赖分析

在修改任何 JPA Entity 之前，先了解它的影响范围。修改 Entity 字段可能波及 Repository 查询、Service 业务逻辑、DTO 映射和 Controller 参数校验。

```
> 如果我修改 Order.java 的 status 字段类型，会影响哪些 Service、Repository 和测试？
```

CodeGraph 会从 `Order.java` 出发，沿引用链向上追踪，列出所有直接和间接依赖该字段的文件：

- 直接使用 `order.getStatus()` 的 Service 类
- 包含 `status` 条件的 Repository 查询方法
- OrderDTO 中对应的字段映射
- 所有断言 `status` 的测试用例

这个信息直接决定了你需要在哪些层上手动验证修改，也为后续 GStack 的回归测试范围提供了依据。

#### 操作 3: 调用链追踪

当你需要理解一个完整业务流程（如订单创建、支付处理）的数据流时，调用链追踪可以帮你梳理从 Controller 到数据库的完整路径。

```
> 追踪从 POST /api/orders 到数据库 INSERT 的完整调用链
```

CodeGraph 会输出类似以下的调用链：

```
OrderController.create()
  └─ @Valid CreateOrderRequest
  └─ OrderService.createOrder(request)
       └─ ProductService.checkStock(productId, quantity)
       │    └─ ProductRepository.findById(productId)
       └─ OrderMapper.toEntity(request)           // MapStruct
       └─ OrderRepository.save(order)             // JPA → INSERT
       └─ PaymentService.initiatePayment(order)
            └─ PaymentGatewayClient.charge(...)
```

### Serena 符号级分析

[Serena](/guide/advanced/serena) 通过 LSP 为 Java 项目提供 IDE 级的符号操作能力。在探索阶段，它的核心价值是**快速获取类的结构概览**和**追踪符号引用**。

#### 操作 4: 类符号概览

快速了解一个 Service 类有哪些公开方法、字段和注解，无需打开 IDE。

```
> 查看 OrderService.java 的符号大纲，有哪些公开方法？
```

Serena 通过 `get_symbols_overview` 返回类的结构化概览，包括方法签名、注解（如 `@Transactional`、`@Service`）和访问修饰符。

#### 操作 5: 引用追踪

在修改一个方法签名之前，先查看所有调用者。

```
> 哪些地方调用了 PaymentService.processPayment？
```

Serena 通过 `find_referencing_symbols` 返回所有引用点，包括 Service 调用、测试断言和 Controller 注入。对 Java 项目，这意味着你可以精确评估一个 API 变更的波及范围。

### Context7 文档注入

[Context7](/guide/advanced/context7) 为 Claude Code 注入最新的 Spring Boot 文档，确保生成的代码使用正确的 API 版本。

#### 操作 6: 查询最新框架文档

```
> 查询 Spring Boot 3.2 的 ProblemDetail 错误处理最佳实践
```

:::warning
Claude Code 的训练数据可能不包含最新的 Spring Boot 版本变更。如果你使用 Spring Boot 3.2+，务必通过 Context7 查询最新文档——特别是 `jakarta.*` 命名空间、ProblemDetail API、Virtual Threads 等新特性。
:::

### Phase 1 产出物

完成探索分析后，你应该掌握：

| 产出物         | 内容                                 | 下游消费者     |
| -------------- | ------------------------------------ | -------------- |
| API 路由图     | 所有 REST 端点及其 Controller 映射   | Spec-Kit 规格  |
| 依赖影响分析   | Entity/Service 修改的影响范围        | TDD 测试计划   |
| 调用链         | 核心业务流程的完整数据流             | Gstack 审查    |
| 符号概览       | 核心类的公开 API 列表                | Serena 重构    |
| 框架文档       | 最新 Spring Boot API 用法            | 代码生成       |

## Phase 2: 规划规格（Spec-Kit + Gstack）

对 Java 企业项目而言，清晰的规格文档是避免返工的关键。Spring Boot 的分层架构意味着一个模糊的需求（如"实现用户管理"）可能产生 6–8 个类文件——如果没有明确的规格，容易遗漏边界条件或产生不一致的 API 设计。这个阶段使用 Spec-Kit 进行结构化规格编写，Gstack 进行架构审查。

### Spec-Kit 规格驱动

[Spec-Kit](/guide/advanced/spec-kit) 是 GitHub 官方的规格驱动开发工具。对 Java 企业项目，它通过结构化的规格文档消除需求歧义，并内置 Constitution 机制确保团队遵循统一的开发原则。

#### 操作 1: 建立项目 Constitution

Constitution 是项目的"宪法"——一组所有开发者（包括 Claude Code）都必须遵守的原则。

```
> /speckit.constitution
> 为这个 Spring Boot 项目建立开发原则：
> - Library-First：业务逻辑封装为独立的 Service Bean
> - Test-First：所有功能先写测试再实现
> - Anti-Abstraction：不过度抽象，除非有 3 个以上使用场景
> - DTO Isolation：API 层使用 DTO，不直接暴露 Entity
> - 统一异常处理：通过 @RestControllerAdvice 统一错误格式
```

Constitution 文档提交到 Git 后，后续所有 Spec-Kit 规格都会自动检查是否符合这些原则。

#### 操作 2: 编写功能规格

```
> /speckit.specify
> 为订单模块编写规格：
> - 用户可以创建订单（包含多个订单项）
> - 订单支持待支付、已支付、已发货、已完成、已取消五种状态
> - 状态转换有明确的业务规则（如已发货不可取消）
> - 支持按日期范围和状态筛选订单列表
> - 创建订单时校验库存并扣减
```

Spec-Kit 生成的规格文档关注 **WHAT + WHY**，不涉及 Controller 怎么写、Entity 有几个字段：

```yaml
spec:
  name: order-module
  description: 订单管理模块
  requirements:
    - id: REQ-001
      title: 创建订单
      description: 用户可以创建包含多个订单项的订单
      acceptance:
        - 订单包含至少一个订单项
        - 每个订单项关联一个商品和数量
        - 创建时校验商品库存，库存不足时拒绝
        - 创建成功后扣减对应商品库存
        - 订单初始状态为"待支付"
```

#### 操作 3: 澄清需求

```
> /speckit.clarify
> 澄清订单模块的规格
```

Spec-Kit 会通过结构化 Q&A 暴露规格中的模糊点：

- 订单项是否可以为空？最少几个？
- 取消已支付的订单是否自动退款？
- "已发货"状态是否需要物流单号？
- 库存扣减是乐观锁还是悲观锁？
- 订单列表的分页默认每页多少条？

每个回答都会更新规格文档，消除后续实现的歧义。

#### 操作 4: 生成技术方案

```
> /speckit.plan
> 生成 Spring Boot 技术方案
```

Spec-Kit 基于规格和 Constitution 生成技术方案，每个技术选择都追溯到规格需求：

| 规格需求         | 技术选择                   | 理由                                     |
| ---------------- | -------------------------- | ---------------------------------------- |
| 订单状态管理     | 状态机模式（StateMachine） | 5 种状态、复杂转换规则适合显式状态机     |
| 库存扣减         | 乐观锁（@Version）         | 高并发场景避免锁竞争，失败可重试         |
| 订单项关联       | JPA @OneToMany             | 与现有 JPA 技术栈一致，级联操作方便     |
| 列表筛选         | JPA Specification          | 多条件动态查询，比 JPQL 拼接更安全       |
| API 响应         | 统一 ApiResponse<T>        | 遵循 Constitution 的统一异常处理原则     |

#### 操作 5: 一致性分析

```
> /speckit.analyze
> 检查规格、数据模型和 API 设计的一致性
```

Spec-Kit 的 `/speckit.analyze` 会跨工件审计：

- Entity 字段是否覆盖了规格中的所有验收条件
- API 端点是否支持规格中描述的所有操作
- 错误码是否覆盖了规格中的异常场景
- 分页参数是否与规格中的列表需求一致

:::tip
对 Java 企业项目，`/speckit.analyze` 能在写代码之前发现 Entity 定义与 API 规格不匹配、缺少必要的字段约束等问题。这比写完代码再发现需求遗漏要高效得多。
:::

### Gstack 架构审查

在技术方案确定后、编码开始前，用 Gstack 进行架构层面的审查。

#### 操作 6: 架构方案审查

```
> /plan-eng-review
> 审查订单模块的技术方案：
> - 状态机模式 vs 枚举 + switch 的取舍
> - 乐观锁 vs 悲观锁对高并发场景的影响
> - JPA cascade 配置是否会导致意外的级联删除
```

Gstack 的 `/plan-eng-review` 以工程经理的视角审查方案的技术风险、可扩展性和维护成本。对 Java 项目，它会特别关注：

- **事务边界**：哪些操作应该在同一个事务内
- **并发安全**：共享资源的访问策略
- **N+1 查询**：关联查询的 fetch 策略
- **异常传播**：跨层异常的处理方式

### Phase 2 产出物

完成规划规格后，你应该拥有：

| 产出物         | 内容                                   | 下游消费者       |
| -------------- | -------------------------------------- | ---------------- |
| Constitution   | 项目开发原则                           | 所有后续规格     |
| 功能规格       | WHAT + WHY，含验收标准                 | TDD 测试用例     |
| 澄清记录       | 边界条件和异常场景的决策               | Service 实现逻辑 |
| 技术方案       | 每个需求的技术选择和理由               | 代码结构设计     |
| 一致性报告     | 规格、数据模型、API 的一致性检查       | 实现前修正       |
| 架构审查报告   | 技术风险和改进建议                     | 实现时参考       |
