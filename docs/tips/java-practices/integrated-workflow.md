---
title: Java 集成工作流详解
description: 从代码探索到发布的五阶段 Java/Spring Boot 开发工作流，深度集成 ECC、Gstack、Superpowers、CodeGraph、Graphify、Serena、Spec-Kit 和 Context7
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★★★☆☆ |
| 🧪 测试 | ★★★★☆ | ★★★☆☆ |
| 📦 产品 | ★★☆☆☆ | ★★★★☆ |

**🎯 学习产出：** 掌握 Java 集成工作流，能独立完成从代码探索到发布的五阶段全流程开发

**🚀 AI 能力提升：** 自动化工作流、调试诊断
:::

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

:::tip
探索阶段的效率取决于代码理解的精度。建议先完成 [Java LSP 配置](./lsp-setup)，让 Claude Code 具备语义级代码理解能力——后续的 CodeGraph 探索和 Serena 符号分析都会因此受益。
:::

下面分别用 CodeGraph、Serena、Context7 来回答这三个问题。

#### 操作 0: 验证 LSP 是否生效

在开始探索之前，先确认 LSP 已正常工作——这是后续所有语义操作的基础。

```
> UserService 在哪里定义？
```

如果秒返回精确的文件路径和行号定位（而不是 grep 搜索多个候选结果），说明 LSP 已正常工作。如果 LSP 未生效，请先完成 [Java LSP 配置](./lsp-setup)。

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

| 产出物       | 内容                               | 下游消费者    |
| ------------ | ---------------------------------- | ------------- |
| API 路由图   | 所有 REST 端点及其 Controller 映射 | Spec-Kit 规格 |
| 依赖影响分析 | Entity/Service 修改的影响范围      | TDD 测试计划  |
| 调用链       | 核心业务流程的完整数据流           | Gstack 审查   |
| 符号概览     | 核心类的公开 API 列表              | Serena 重构   |
| 框架文档     | 最新 Spring Boot API 用法          | 代码生成      |

## Phase 2: 规划规格（Spec-Kit + Gstack）

对 Java 企业项目而言，清晰的规格文档是避免返工的关键。Spring Boot 的分层架构意味着一个模糊的需求（如"实现用户管理"）可能产生 6–8 个类文件——如果没有明确的规格，容易遗漏边界条件或产生不一致的 API 设计。这个阶段使用 Spec-Kit 进行结构化规格编写，Gstack 进行架构审查。

### Spec-Kit 规格驱动

[Spec-Kit](/guide/advanced/sdd/spec-kit) 是 GitHub 官方的规格驱动开发工具。对 Java 企业项目，它通过结构化的规格文档消除需求歧义，并内置 Constitution 机制确保团队遵循统一的开发原则。

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

| 规格需求     | 技术选择                   | 理由                                 |
| ------------ | -------------------------- | ------------------------------------ |
| 订单状态管理 | 状态机模式（StateMachine） | 5 种状态、复杂转换规则适合显式状态机 |
| 库存扣减     | 乐观锁（@Version）         | 高并发场景避免锁竞争，失败可重试     |
| 订单项关联   | JPA @OneToMany             | 与现有 JPA 技术栈一致，级联操作方便  |
| 列表筛选     | JPA Specification          | 多条件动态查询，比 JPQL 拼接更安全   |
| API 响应     | 统一 ApiResponse<T>        | 遵循 Constitution 的统一异常处理原则 |

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

| 产出物       | 内容                             | 下游消费者       |
| ------------ | -------------------------------- | ---------------- |
| Constitution | 项目开发原则                     | 所有后续规格     |
| 功能规格     | WHAT + WHY，含验收标准           | TDD 测试用例     |
| 澄清记录     | 边界条件和异常场景的决策         | Service 实现逻辑 |
| 技术方案     | 每个需求的技术选择和理由         | 代码结构设计     |
| 一致性报告   | 规格、数据模型、API 的一致性检查 | 实现前修正       |
| 架构审查报告 | 技术风险和改进建议               | 实现时参考       |

## Phase 3: TDD 实现（Superpowers + ECC + CodeGraph）

进入编码阶段。Superpowers 强制执行 RED-GREEN-REFACTOR 循环，ECC 提供 Java 专属的开发 Skill，CodeGraph 帮助在实现过程中快速参考现有代码。对 Java/Spring Boot 项目，TDD 的分层顺序通常是：**Entity → Repository → Service → Controller**。

### Superpowers TDD 循环

[Superpowers](/guide/advanced/superpowers) 的 TDD Skill 强制执行严格的测试先行规则。对 Java 项目，这意味着每个 Spring Boot 分层组件都必须先有对应的 JUnit 5 测试。

#### 操作 1: 头脑风暴确认需求

在写任何代码之前，先用 Superpowers 的头脑风暴阶段理清需求歧义。

```
> /superpowers:brainstorming
> 设计订单状态机，支持待支付、已支付、发货中、已完成、已取消状态转换
```

头脑风暴会探索：

- 状态转换规则矩阵（哪些转换合法、哪些需要权限）
- 边界场景（支付超时自动取消？重复发货？）
- 并发场景（同时触发状态变更如何处理）

:::tip
在 Java 项目中，头脑风暴阶段的决策直接影响 Entity 设计和数据库 Schema。比如"是否支持订单回退"这个需求，决定了状态机是用枚举 + switch 还是专用的状态机框架。值得花时间在这个阶段想清楚。
:::

#### 操作 2: 创建 Git Worktree 隔离开发

```
> 创建 Git Worktree 隔离订单模块开发
```

Superpowers 会在 `.claude/worktrees/` 下创建独立的工作目录和分支，后续所有 TDD 提交都在 Worktree 中进行，不影响 main 分支。

#### 操作 3: 编写计划

```
> /superpowers:writing-plans
> 基于订单模块的规格文档，拆分实现步骤：
> 1. Order Entity + OrderItem Entity（JPA 映射）
> 2. OrderRepository + 自定义查询方法
> 3. OrderService（状态机 + 业务逻辑）
> 4. OrderController（REST API）
> 5. DTO + MapStruct Mapper
> 6. 异常处理（BusinessException + ErrorCode）
> 7. 集成测试（@SpringBootTest + Testcontainers）
```

Superpowers 会生成分步计划，每个步骤都是一个完整的 RED-GREEN-REFACTOR 循环。

#### 操作 4: TDD 驱动——Entity 层

🔴 **RED**：先写 Entity 测试

```java title="src/test/java/com/example/app/model/OrderTest.java"
@ExtendWith(MockitoExtension.class)
class OrderTest {

    @Test
    @DisplayName("新订单默认状态为待支付")
    void newOrder_shouldHavePendingStatus() {
        Order order = new Order();
        assertEquals(OrderStatus.PENDING, order.getStatus());
    }

    @Test
    @DisplayName("待支付订单可以转换为已支付")
    void pendingOrder_canTransitionToPaid() {
        Order order = Order.builder().status(OrderStatus.PENDING).build();
        order.transitionTo(OrderStatus.PAID);
        assertEquals(OrderStatus.PAID, order.getStatus());
    }

    @Test
    @DisplayName("已发货订单不能取消")
    void shippedOrder_cannotBeCancelled() {
        Order order = Order.builder().status(OrderStatus.SHIPPED).build();
        assertThrows(InvalidOrderStateException.class,
                () -> order.transitionTo(OrderStatus.CANCELLED));
    }
}
```

运行测试确认失败：`mvn test -Dtest=OrderTest -q`

🟢 **GREEN**：写最小实现

```java title="src/main/java/com/example/app/model/Order.java"
@Entity
@Table(name = "orders")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public void transitionTo(OrderStatus newStatus) {
        if (!this.status.canTransitionTo(newStatus)) {
            throw new InvalidOrderStateException(
                String.format("Cannot transition from %s to %s", this.status, newStatus));
        }
        this.status = newStatus;
    }
}
```

🔵 **REFACTOR**：运行 `mvn test -Dtest=OrderTest -q` 确认通过，提交。

#### 操作 5: TDD 驱动——Repository 层

🔴 **RED**：

```java title="src/test/java/com/example/app/repository/OrderRepositoryTest.java"
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class OrderRepositoryTest {

    @Autowired
    private OrderRepository orderRepository;

    @Test
    @DisplayName("按状态筛选订单")
    void findByStatus_shouldReturnMatchingOrders() {
        // Given
        Order pending = Order.builder().status(OrderStatus.PENDING).build();
        Order paid = Order.builder().status(OrderStatus.PAID).build();
        orderRepository.saveAll(List.of(pending, paid));

        // When
        List<Order> result = orderRepository.findByStatus(OrderStatus.PENDING);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(OrderStatus.PENDING);
    }
}
```

🟢 **GREEN**：

```java title="src/main/java/com/example/app/repository/OrderRepository.java"
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(OrderStatus status);
}
```

🔵 **REFACTOR**：确认测试通过，提交。

#### 操作 6: TDD 驱动——Service 层

🔴 **RED**：先写 Service 测试，Mock Repository

```java title="src/test/java/com/example/app/service/OrderServiceTest.java"
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private ProductService productService;
    @Mock private OrderMapper orderMapper;
    @InjectMocks private OrderService orderService;

    @Test
    @DisplayName("创建订单 - 库存不足时应抛出异常")
    void createOrder_shouldThrowWhenInsufficientStock() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setProductId(1L);
        request.setQuantity(100);

        when(productService.checkStock(1L, 100))
            .thenThrow(new InsufficientStockException("库存不足"));

        assertThrows(InsufficientStockException.class,
                () -> orderService.createOrder(request));
        verify(orderRepository, never()).save(any());
    }
}
```

🟢 **GREEN**：实现 Service 层，注入 Repository 和 ProductService。

🔵 **REFACTOR**：提取状态机逻辑到独立的 `OrderStateMachine` 类（如果转换规则复杂），确认测试通过，提交。

#### 操作 7: TDD 驱动——Controller 层

🔴 **RED**：使用 `@WebMvcTest` + MockMvc

```java title="src/test/java/com/example/app/controller/OrderControllerTest.java"
@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private OrderService orderService;

    @Test
    @DisplayName("POST /api/orders - 正常创建返回 201")
    void createOrder_shouldReturn201() throws Exception {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setProductId(1L);
        request.setQuantity(2);

        OrderResponse response = OrderResponse.builder()
            .id(1L).status("PENDING").build();

        when(orderService.createOrder(any())).thenReturn(response);

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.status").value("PENDING"));
    }
}
```

🟢 **GREEN**：实现 Controller，使用 `@RestController` + `@RequestMapping`。

🔵 **REFACTOR**：确认所有测试通过，提交。

### ECC Java 专项 Skill

在 TDD 实现的每个阶段，ECC 的 Java 专项 Skill 可以提供额外的质量保障。

#### 操作 8: Spring Boot TDD 指导

```
> 使用 springboot-tdd skill 实现支付模块：
> 先写测试，再实现 PaymentService → PaymentController
```

ECC 的 `springboot-tdd` Skill 会指导完整的 TDD 流程，包括测试命名约定、Mock 策略和测试覆盖率检查。

#### 操作 9: 实时代码审查

```
> 使用 ECC 的 java-reviewer 审查 OrderService.java：
> 检查 @Transactional 边界、异常处理、线程安全
```

`java-reviewer` Agent 会检查 Java 代码中的常见陷阱：

- `@Transactional` 的 propagation 和 rollbackFor 配置
- 是否吞掉了应该抛出的异常
- 资源泄漏（数据库连接、流、锁）
- 线程安全问题（共享可变状态）

### Phase 3 产出物

完成 TDD 实现后，你应该拥有：

| 产出物                | 内容                                 | 下游消费者    |
| --------------------- | ------------------------------------ | ------------- |
| 通过测试的 Entity     | JPA 映射 + 单元测试                  | Repository 层 |
| 通过测试的 Repository | 数据访问 + 查询测试                  | Service 层    |
| 通过测试的 Service    | 业务逻辑 + 状态机 + Mock 测试        | Controller 层 |
| 通过测试的 Controller | REST API + MockMvc 测试              | Gstack 审查   |
| DTO + Mapper          | 请求/响应 DTO + MapStruct            | API 文档      |
| Git 提交历史          | 每个 RED-GREEN-REFACTOR 循环一个提交 | PR 审查       |

## Phase 4: 审查测试（Gstack + Serena + ECC）

代码实现完成后，进入多维度审查阶段。Gstack 提供 Staff 级代码审查和安全审计，Serena 处理精确重构，ECC 补充 Java 专项审查。

### Gstack 多角色审查

#### 操作 1: Staff 级代码审查

```
> /review
> 在 feature/order-module 分支上审查代码变更
```

Gstack 的 `/review` 以 Staff Engineer 的视角审查代码变更，聚焦"能通过 CI 的生产 Bug"。对 Java 项目，它会特别关注：

| 审查维度   | Java 重点                                   |
| ---------- | ------------------------------------------- |
| 空指针安全 | Optional 使用、null 检查、返回值校验        |
| 资源管理   | try-with-resources、连接池配置、流关闭      |
| 事务边界   | @Transactional 传播级别、只读事务优化       |
| 并发安全   | 共享可变状态、synchronized 误用、线程池配置 |
| N+1 查询   | @OneToMany fetch 策略、批量查询优化         |
| 异常处理   | 吞异常、泛化 catch、异常信息泄露            |

#### 操作 2: 安全审计

```
> /cso
> 审查 Spring Security 配置和 JWT 实现，检查 OWASP Top 10 漏洞
```

Gstack 的 `/cso`（Chief Security Officer）执行 OWASP Top 10 安全审计：

- **SQL 注入**：检查原生 SQL 查询、JPQL 拼接
- **XSS**：检查返回给前端的数据是否转义
- **认证绕过**：检查 SecurityConfig 的路由权限配置
- **敏感数据**：检查密码、Token、密钥的存储方式
- **依赖安全**：检查已知漏洞的依赖版本（CVE）

#### 操作 3: 架构一致性检查

```
> /plan-eng-review
> 审查订单模块的实现是否符合技术方案：
> - 是否遵循了 Constitution 中的 DTO Isolation 原则
> - 状态机实现是否与规格文档中的转换规则一致
> - 异常处理是否使用了统一的 ErrorCode 体系
```

### Serena 精确重构

根据审查结果，使用 Serena 进行精确的符号级重构。

#### 操作 4: 重命名不符合规范的方法

```
> 把 OrderService.createOrder 重命名为 placeOrder，
> 包括所有 Controller、测试和 Spec 文档中的引用
```

Serena 通过 `rename_symbol` 一次调用完成——LSP 精确找到所有引用，原子化替换。对 Java 项目，这意味着同时更新 Service 接口、实现类、Controller 注入和测试中的所有调用点。

#### 操作 5: 提取重复逻辑

```
> 把 OrderService 中的价格计算逻辑提取到 PricingStrategy 类中
```

Serena 的 `move_symbol`（JetBrains 后端）会自动处理 import 更新和旧文件清理。

### ECC Java 专项审查

#### 操作 6: 数据库迁移审查

```
> 使用 ECC 的 database-reviewer 审查 Flyway 迁移脚本：
> - V2__add_order_tables.sql 的字段类型和约束
> - 索引是否覆盖了高频查询
> - 外键约束是否正确
```

#### 操作 7: 构建验证

```
> 运行 mvn verify 确认所有测试和集成测试通过
```

:::warning
不要跳过 `mvn verify` 直接推代码——`mvn test` 只运行单元测试，集成测试（`*IT.java`）需要 `mvn verify` 才会执行。特别是使用 Testcontainers 的测试，本地通过不代表 CI 环境也通过。
:::

### Phase 4 产出物

| 产出物       | 内容                               | 下游消费者 |
| ------------ | ---------------------------------- | ---------- |
| 审查报告     | 代码问题列表、安全漏洞、架构偏离   | 重构任务   |
| 重构后的代码 | 方法重命名、逻辑提取、异常处理修复 | 发布阶段   |
| 安全修复     | SQL 注入修复、认证加强、依赖升级   | 发布阶段   |
| 通过的测试   | `mvn verify` 全绿                  | PR 合并    |

## Phase 5: 发布自动化（Gstack + CI/CD + Hooks）

最后阶段：通过 Gstack 推送代码并创建 PR，配置 Hooks 自动化日常任务，设置 CI/CD 流水线。

### Gstack 发布

#### 操作 1: 一键发布

```
> /ship
> 运行 mvn verify，确认测试通过后推送到远程并创建 PR
```

Gstack 的 `/ship` 会：

1. 运行 `mvn verify` 确认所有测试通过
2. 检查测试覆盖率是否达标
3. 推送代码到远程分支
4. 创建 PR，自动生成变更摘要

### Hooks 自动化

使用 [Hooks](/guide/advanced/hooks) 在 Claude Code 操作前后自动执行 Java 项目任务。

#### 操作 2: 配置自动格式化

```json title=".claude/settings.json"
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_FILE_PATHS\" | grep -q '\\.java$'; then mvn spotless:apply -q 2>/dev/null || true; fi"
          }
        ]
      }
    ]
  }
}
```

这个 Hook 在 Claude Code 修改 `.java` 文件后自动运行 Spotless 格式化，确保代码风格一致。

#### 操作 3: 配置自动类型检查

```json title=".claude/settings.json"
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "mvn compile -q 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

这个 Hook 在 Claude Code 完成任务后自动运行编译检查，及时发现编译错误。

### CI/CD 集成

#### 操作 4: GitHub Actions AI Code Review

```yaml title=".github/workflows/ai-review.yml"
name: AI Code Review
on:
  pull_request:
    paths:
      - '**/*.java'

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          review_path: src/main/java
          prompt: |
            审查这个 PR 中的 Java 代码变更：
            1. 检查是否遵循项目的分层架构（Controller → Service → Repository）
            2. 检查异常处理是否完善
            3. 检查是否有潜在的 N+1 查询
            4. 检查测试覆盖是否充分
            5. 检查是否有安全隐患（SQL 注入、硬编码密钥等）
```

### Phase 5 产出物

| 产出物     | 内容                                    | 后续操作         |
| ---------- | --------------------------------------- | ---------------- |
| PR         | 含变更摘要和自动审查结果的 Pull Request | 团队 Code Review |
| CI 流水线  | 自动编译、测试、安全扫描                | 持续运行         |
| Hooks 配置 | 自动格式化和编译检查                    | 日常开发使用     |

## 五阶段总结

| 阶段       | 主力工具                    | 核心产出                | 典型用时   |
| ---------- | --------------------------- | ----------------------- | ---------- |
| 探索分析   | CodeGraph、Serena、Context7 | 代码结构理解 + 影响分析 | 10–15 分钟 |
| 规划规格   | Spec-Kit、Gstack            | 规格文档 + 技术方案     | 20–30 分钟 |
| TDD 实现   | Superpowers、ECC、CodeGraph | 通过测试的代码          | 2–4 小时   |
| 审查测试   | Gstack、Serena、ECC         | 审查报告 + 重构         | 15–30 分钟 |
| 发布自动化 | Gstack、CI/CD、Hooks        | PR + 流水线             | 5–10 分钟  |

:::tip
小型功能可以跳过规划阶段直接 TDD，大型重构则需要完整的 CodeGraph 影响分析 + Gstack 架构审查 + Spec-Kit 规格文档。根据项目规模灵活调整各阶段的深度。
:::
