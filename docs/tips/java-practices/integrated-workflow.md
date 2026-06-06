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
