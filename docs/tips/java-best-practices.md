---
title: Java 开发最佳实践
description: 使用 Claude Code 进行 Java 开发的完整指南，涵盖项目配置、提示词策略、测试、构建工具和自动化工作流
---

# Java 开发最佳实践

Claude Code 对 Java 生态（Spring Boot、Maven、Gradle、JUnit 等）有良好的支持。本文介绍如何在 Java 项目中高效使用 Claude Code，从项目配置到自动化工作流的最佳实践。

## 项目结构配置

### 标准 Maven 项目结构

Claude Code 通过文件系统理解项目。清晰的目录结构能帮助 Claude 更准确地定位代码：

```
my-spring-app/
├── CLAUDE.md                    ← 项目约定和上下文
├── pom.xml                      ← Maven 构建配置
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/app/
│   │   │       ├── Application.java
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       ├── model/
│   │   │       ├── dto/
│   │   │       ├── config/
│   │   │       └── exception/
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/
│   └── test/
│       └── java/
│           └── com/example/app/
└── docs/
```

:::tip
在 CLAUDE.md 中明确说明你的分层架构约定（Controller → Service → Repository），Claude Code 会自动遵循这个模式生成代码。
:::

### 标准 Gradle 项目结构

```
my-spring-app/
├── CLAUDE.md
├── build.gradle.kts
├── settings.gradle.kts
├── src/
│   ├── main/
│   │   ├── java/          ← 同 Maven 结构
│   │   └── resources/
│   └── test/
│       └── java/
└── gradle/
```

## 配置 CLAUDE.md

`CLAUDE.md` 是 Claude Code 理解项目的关键。以下是 Java/Spring Boot 项目的推荐配置：

````markdown title="CLAUDE.md"
# 项目概述

基于 Spring Boot 3.x 的 REST API 服务，使用 Java 21 + Maven 构建。

## 构建与测试

```bash
mvn clean compile          # 编译
mvn test                   # 运行全部测试
mvn test -pl module-name   # 运行单模块测试
mvn spring-boot:run        # 启动应用
mvn verify                 # 完整验证（含集成测试）
```

## 架构约定

- 分层架构：Controller → Service → Repository
- Controller 只做参数校验和路由，业务逻辑在 Service 层
- 使用 DTO 隔离 API 和内部模型，不在 Controller 中直接暴露 Entity
- 统一异常处理：通过 @RestControllerAdvice + 自定义 BusinessException
- 使用 MapStruct 进行 DTO ↔ Entity 转换

## 代码规范

- 使用 Google Java Style Guide
- 所有 public 方法必须有 Javadoc
- 使用 Lombok 减少样板代码（@Getter, @Builder, @Slf4j）
- 日志使用 SLF4J + Logback，不用 System.out

## 数据库

- 使用 Flyway 管理数据库迁移
- 迁移脚本放在 src/main/resources/db/migration/
- 命名规范：V{版本号}__{描述}.sql（如 V1__create_user_table.sql）

## 测试约定

- 单元测试：JUnit 5 + Mockito，类名以 Test 结尾
- 集成测试：@SpringBootTest + Testcontainers，类名以 IT 结尾
- 测试放在 src/test/java/ 对应包下
- Controller 测试使用 @WebMvcTest + MockMvc
````

:::warning
不同项目的 CLAUDE.md 差异很大。上面的模板需要根据你的实际技术栈调整——比如用 MyBatis 替代 JPA，用 Liquibase 替代 Flyway 等。
:::

## 提示词策略

### 通用原则

与 TypeScript 项目相比，Java 项目需要更多上下文。Claude Code 的训练数据中 Java 代码风格差异较大，因此明确指定框架版本和代码规范尤为重要。

```
❌ "帮我写一个用户接口"
✅ "使用 Spring Boot 3.2 + JPA 实现用户 CRUD REST API：
   - UserRepository 继承 JpaRepository
   - UserService 包含分页查询
   - UserController 使用 @RestController
   - 使用 UserDTO 隔离 Entity
   - 遵循现有 src/main/java/com/example/app/service/OrderService.java 的代码风格"
```

### 分层生成策略

对 Java 项目，建议按分层逐个生成，而非一次性生成所有层：

```
> 第一步：先帮我创建 User 实体类和 DTO，放在 model/ 和 dto/ 包下
> 第二步：创建 UserRepository 接口
> 第三步：实现 UserService，包含 CRUD 和分页查询
> 第四步：创建 UserController，使用 @Validated 校验参数
> 第五步：编写单元测试和集成测试
```

:::tip
分步生成的好处：每一步你都可以审查和调整，避免一步出错导致后续全部返工。对 Spring Boot 项目尤其有效，因为各层之间的依赖关系清晰。
:::

### 引用现有代码风格

Claude Code 会自动参考项目中的已有代码。但主动指出参考对象效果更好：

```
> 参考 src/main/java/com/example/app/service/OrderService.java 的代码风格，
> 创建 ProductService，包含：
> - 分页查询所有商品
> - 按分类筛选
> - 库存扣减（需要 @Transactional）
```

### Spring Boot 特定提示词

````markdown title="常用提示词模板"
# Controller 生成
> 创建 ProductController，使用 @RestController + @RequestMapping("/api/products")，
> 包含 GET（分页列表）、GET/{id}、POST、PUT/{id}、DELETE/{id}，
> 使用 @Validated 校验请求体，返回统一响应格式 ApiResponse<T>

# Service 生成
> 创建 ProductService，注入 ProductRepository，
> 实现分页查询（Pageable）、按名称模糊搜索、
> 库存扣减方法（需要 @Transactional + 乐观锁）

# 异常处理
> 创建全局异常处理器 GlobalExceptionHandler，
> 使用 @RestControllerAdvice，处理：
> - MethodArgumentNotValidException → 400
> - EntityNotFoundException → 404
> - BusinessException → 自定义错误码
> 返回 ErrorResponse 格式 {code, message, timestamp}

# 测试生成
> 为 UserService 编写单元测试，使用：
> - @ExtendWith(MockitoExtension.class)
> - @Mock UserRepository
> - @InjectMocks UserService
> - 测试正常流程和异常情况
````

## 测试最佳实践

### TDD 工作流

Claude Code 完美支持 Java 的 TDD 工作流。以下是一个典型的对话：

```
> 用 TDD 方式实现邮箱验证服务：
> 1. 先写 EmailValidationService 的单元测试，覆盖以下场景：
>    - 合法邮箱返回 true
>    - 空字符串抛出 IllegalArgumentException
>    - 无 @ 符号返回 false
>    - 包含特殊字符的边界情况
> 2. 运行测试确认失败
> 3. 写最小实现让测试通过
> 4. 重构优化
```

### 单元测试生成

让 Claude Code 为现有代码生成测试：

```
> 为 src/main/java/com/example/app/service/OrderService.java 编写单元测试：
> - 使用 JUnit 5 + Mockito
> - Mock OrderRepository 和 PaymentService
> - 测试 createOrder 的正常流程
> - 测试库存不足时抛出 InsufficientStockException
> - 测试分页查询参数传递正确
> - 使用 @DisplayName 注解描述每个测试用例
```

Claude Code 会生成类似如下的测试：

```java title="OrderServiceTest.java"
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private OrderService orderService;

    @Test
    @DisplayName("创建订单 - 正常流程")
    void createOrder_shouldSucceed() {
        // Given
        CreateOrderRequest request = new CreateOrderRequest();
        request.setProductId(1L);
        request.setQuantity(2);

        Product product = Product.builder()
                .id(1L)
                .stock(10)
                .price(new BigDecimal("99.90"))
                .build();

        when(orderRepository.save(any(Order.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        // When
        Order result = orderService.createOrder(request);

        // Then
        assertNotNull(result);
        verify(orderRepository).save(any(Order.class));
        verify(paymentService).processPayment(any(Order.class));
    }

    @Test
    @DisplayName("创建订单 - 库存不足应抛出异常")
    void createOrder_shouldThrowWhenInsufficientStock() {
        // Given
        CreateOrderRequest request = new CreateOrderRequest();
        request.setProductId(1L);
        request.setQuantity(100);

        // When & Then
        assertThrows(InsufficientStockException.class,
                () -> orderService.createOrder(request));
    }
}
```

### 集成测试生成

```
> 为 UserController 编写集成测试：
> - 使用 @SpringBootTest + @AutoConfigureMockMvc
> - 使用 Testcontainers 启动 PostgreSQL
> - 测试完整的 HTTP 请求/响应流程
> - 验证 JSON 响应格式和状态码
```

:::info
**单元测试 vs 集成测试命名约定：**
- 单元测试：`XxxServiceTest.java`、`XxxControllerTest.java`
- 集成测试：`XxxServiceIT.java`、`XxxControllerIT.java`

在 CLAUDE.md 中约定命名规则，Claude Code 会自动遵循。
:::

### Mock 策略建议

| 层级 | 测试类型 | Mock 策略 |
|------|----------|-----------|
| Controller | `@WebMvcTest` | Mock Service 层 |
| Service | `@ExtendWith(MockitoExtension.class)` | Mock Repository 和外部依赖 |
| Repository | `@DataJpaTest` | 使用嵌入式数据库或 Testcontainers |
| 完整流程 | `@SpringBootTest` | 使用 Testcontainers 启动真实依赖 |

:::tip
使用 Testcontainers 时，让 Claude Code 生成一个共享的 `BaseIntegrationTest` 基类，所有集成测试继承它，避免重复配置数据库容器。
:::

## 构建工具集成

### Maven 项目

Claude Code 可以直接读取和修改 `pom.xml`。常用操作：

```
> 在 pom.xml 中添加 Spring Security 依赖，版本使用 Spring Boot BOM 管理
```

```
> 分析 pom.xml 中的依赖冲突，找出哪些依赖版本不一致
```

```
> 为项目配置 Maven Wrapper（mvnw），确保团队使用统一的 Maven 版本
```

:::details Maven 常用提示词模板

````markdown
# 添加依赖
> 在 pom.xml 中添加以下依赖：
> - spring-boot-starter-data-redis
> - spring-boot-starter-validation
> - org.mapstruct:mapstruct:1.5.5.Final
> - org.mapstruct:mapstruct-processor（注解处理器放在 maven-compiler-plugin 中）

# 多模块项目
> 将当前项目改造为 Maven 多模块结构：
> - app-common：公共工具类和异常定义
> - app-service：业务逻辑层
> - app-web：Controller 和配置
> 创建父 pom.xml 管理依赖版本

# 构建优化
> 优化 pom.xml 的构建配置：
> - 配置 spring-boot-maven-plugin 分层构建
> - 添加 maven-surefire-plugin 排除集成测试
> - 配置 maven-failsafe-plugin 运行 *IT.java 集成测试
````

:::

### Gradle 项目

```
> 在 build.gradle.kts 中添加 Spring Security 依赖
```

```
> 配置 Gradle 的依赖版本目录（libs.versions.toml），统一管理第三方库版本
```

:::info
Claude Code 对 Maven（pom.xml）和 Gradle（build.gradle.kts）都支持良好。如果你的项目使用 Gradle Kotlin DSL，在 CLAUDE.md 中注明——Claude 默认可能生成 Groovy DSL。
:::

### 使用 MCP 增强构建体验

通过 [Spring Boot MCP 服务器](https://github.com/spring-projects/spring-ai-mcp) 可以让 Claude Code 直接查询 Spring 官方文档，避免生成过时的 API：

```bash
# 安装 Spring Boot MCP 服务器
claude mcp add spring-boot -- npx -y @anthropic-ai/spring-boot-mcp-server
```

安装后，Claude Code 可以：
- 查询 Spring Boot 最新文档
- 获取正确的注解用法
- 验证 API 兼容性

:::warning
Claude Code 的训练数据可能不包含最新的 Spring Boot 版本变更。如果你使用 Spring Boot 3.2+，建议安装 MCP 服务器或 [Context7](/guide/advanced/context7) 注入最新文档。
:::

## 工具链集成

除了上述构建工具外，Claude Code 生态还提供了多个辅助工具，可以在 Java 开发的不同阶段发挥作用。以下介绍五个核心工具在 Java/Spring Boot 项目中的集成方式和典型用法。

| 工具 | 定位 | Java 核心价值 | 安装依赖 |
|------|------|--------------|---------|
| [ECC](/tips/ecc) | 全能增强系统 | Java 专属 Agent 和 Spring Boot Skills | Node.js |
| [Gstack](/guide/advanced/gstack) | 虚拟工程团队 | Staff 级代码审查 + QA + 安全审计 | Bun |
| [Superpowers](/guide/advanced/superpowers) | 结构化开发方法论 | 强制 TDD + 计划驱动开发 | 无（插件） |
| [CodeGraph](/guide/advanced/codegraph) | 代码知识图谱 | 快速探索 Java 代码结构 + 影响分析 | Node.js |
| [Serena](/guide/advanced/serena) | 代码语义工具 | 符号级精确重构（JetBrains 增强） | Python (uv) |

:::tip
这五个工具可以组合使用——ECC 提供流程编排，Superpowers 保证开发纪律，CodeGraph 和 Serena 提供代码智能，Gstack 负责审查和发布。详见[最佳实践](/tips/best-practices)中的四阶段工作流。
:::

### ECC：Java 专属增强

[ECC](/tips/ecc)（Enhanced Claude Code）内置了 Java 语言专属的 Agent 和 Spring Boot 专项 Skill，无需额外配置即可为 Java 项目提供专业级的代码审查和开发流程支持。

#### Java 专属 Agent

| Agent | 用途 | 典型场景 |
|-------|------|---------|
| `java-reviewer` | Java 代码审查，检查并发安全、资源泄漏、异常处理 | 审查 Service 层实现 |
| `java-build-resolver` | 诊断 Maven/Gradle 构建错误并自动修复 | 依赖冲突、编译失败 |
| `security-reviewer` | 安全漏洞审查（SQL 注入、XSS、硬编码密钥等） | 安全配置审查 |
| `database-reviewer` | 数据库迁移和查询审查 | Flyway 脚本、N+1 查询 |

#### Spring Boot 专项 Skill

| Skill | 用途 |
|-------|------|
| `springboot-patterns` | Spring Boot 项目结构和编码规范 |
| `springboot-tdd` | Spring Boot 项目的 TDD 工作流指导 |
| `tdd-workflow` | 通用 TDD 工作流，适用于 Java 单元测试 |
| `security-review` | 安全审查工作流 |
| `database-migrations` | 数据库迁移最佳实践 |

#### 使用示例

```
> 使用 ECC 的 java-reviewer 审查 PaymentService.java：
> 检查 @Transactional 边界、异常处理、线程安全问题
```

```
> 使用 springboot-tdd skill 实现订单模块：
> 先写测试，再实现 Repository → Service → Controller
```

```
> java-build-resolver：pom.xml 报依赖冲突，帮我分析并解决
```

#### 安装 ECC（Java 项目）

```bash
# Plugin 安装
/plugin marketplace add https://github.com/affaan-m/ECC
/plugin install ecc@ecc
```

安装后复制 Java Rules：

```bash
git clone https://github.com/affaan-m/ECC.git && cd ECC
mkdir -p ~/.claude/rules/ecc
cp -R rules/common ~/.claude/rules/ecc/
```

:::tip
ECC 的 `java-reviewer` 会自动检查常见的 Java 陷阱（如 javax vs jakarta、@Transactional 传播级别、Lombok 注解处理器配置）。配合 `springboot-patterns` Skill 使用效果最佳。
:::

## 常见场景

### Spring Boot REST API 全栈生成

```
> 基于现有的 User 实体类，生成完整的 REST API：
> 1. UserDTO（请求和响应分开：CreateUserRequest, UpdateUserRequest, UserResponse）
> 2. MapStruct 转换器 UserMapper
> 3. UserRepository（继承 JpaRepository）
> 4. UserService（CRUD + 分页 + 按用户名搜索）
> 5. UserController（RESTful 路由 + 参数校验）
> 6. 全局异常处理器
> 7. 对应的单元测试和集成测试
>
> 参考项目中 Order 模块的代码风格
```

### 数据库迁移脚本

```
> 创建 Flyway 迁移脚本，添加 product 表：
> - id: BIGSERIAL 主键
> - name: VARCHAR(100) 非空
> - price: DECIMAL(10,2) 非空
> - stock: INTEGER 默认 0
> - category_id: BIGINT 外键关联 category 表
> - created_at, updated_at: TIMESTAMP
> 添加索引：category_id 和 name
```

### DTO 与 Entity 转换

```
> 创建 OrderMapper（MapStruct），实现：
> - Order → OrderResponse 转换
> - CreateOrderRequest → Order 转换
> - List<Order> → List<OrderResponse> 批量转换
> - 嵌套对象：OrderItem → OrderItemResponse
> 使用 @Mapper(componentModel = "spring")
```

### 统一响应格式

```
> 创建统一 API 响应包装：
> 1. ApiResponse<T> 泛型类：code, message, data, timestamp
> 2. PageResponse<T> 分页响应：content, totalElements, totalPages, currentPage
> 3. 创建 ApiResponseHelper 工具类：
>    - success(T data) → ApiResponse
>    - success(Page<T>) → PageResponse
>    - error(ErrorCode) → ApiResponse
>    - error(int code, String message) → ApiResponse
```

### 异常处理体系

```
> 创建统一异常处理体系：
> 1. ErrorCode 枚举：定义业务错误码（USER_NOT_FOUND, ORDER_ALREADY_PAID 等）
> 2. BusinessException 继承 RuntimeException，包含 ErrorCode
> 3. GlobalExceptionHandler 使用 @RestControllerAdvice：
>    - BusinessException → 对应错误码和消息
>    - MethodArgumentNotValidException → 400 + 字段错误列表
>    - AccessDeniedException → 403
>    - Exception → 500 + 通用错误消息
> 4. ErrorResponse DTO：code, message, errors, timestamp
```

### 安全配置

```
> 配置 Spring Security：
> 1. SecurityConfig 类，使用 @Configuration
> 2. 配置 JWT 认证过滤器
> 3. 放行公开接口：/api/auth/login, /api/auth/register, /actuator/health
> 4. 其他接口需要认证
> 5. 配置 CORS 允许前端域名
> 6. 配置密码编码器 BCryptPasswordEncoder
```

:::danger
生成安全相关代码后务必审查。Claude Code 生成的安全配置可能需要根据你的具体需求调整——特别是 CORS 策略、JWT 密钥管理和权限规则。不要直接将生成的安全配置用于生产环境。
:::

### MyBatis / MyBatis-Plus 场景

如果你的项目使用 MyBatis 而非 JPA：

```
> 使用 MyBatis-Plus 实现用户模块：
> 1. UserMapper 继承 BaseMapper<User>
> 2. UserServiceImpl 实现 IService<User>
> 3. 自定义查询使用 @Select 注解或 XML Mapper
> 4. 分页使用 MybatisPlusInterceptor + PaginationInnerInterceptor
```

:::info
在 CLAUDE.md 中明确指定 ORM 框架（JPA / MyBatis / MyBatis-Plus），这会显著影响 Claude Code 生成的代码风格。
:::

## 代码审查与重构

### 代码审查

Claude Code 可以作为代码审查助手：

```
> 审查 src/main/java/com/example/app/service/PaymentService.java：
> 1. 检查线程安全问题
> 2. 检查异常处理是否完善
> 3. 检查是否有资源泄漏（数据库连接、流等）
> 4. 检查事务边界是否正确
> 5. 检查是否有 N+1 查询问题
```

```
> 扫描整个 service/ 包，找出：
> - 缺少 @Transactional 的方法
> - 硬编码的魔法值
> - 过长的方法（超过 50 行）
> - 不一致的异常处理方式
```

### 重构策略

```
> 重构 src/main/java/com/example/app/service/OrderService.java：
> 1. 提取订单状态机逻辑到 OrderStateMachine 类
> 2. 将金额计算逻辑抽取到 PricingStrategy 接口
> 3. 使用策略模式替代 if-else 的支付方式选择
> 4. 保持所有现有测试通过
```

:::tip
重构时，让 Claude Code 先运行现有测试确认基线，重构后再运行确认没有回归。使用 `/plan` 命令让 Claude Code 先规划重构步骤，确认后再执行。
:::

### 遗留代码现代化

```
> 分析 src/main/java/com/example/app/legacy/ 目录：
> 1. 找出使用的过时 API（如 javax.* → jakarta.*）
> 2. 识别可以使用 Java 21 新特性的代码（record, sealed class, pattern matching）
> 3. 标记可以使用 Stream API 替代 for 循环的地方
> 4. 列出 Lombok 可以消除的样板代码
> 生成重构计划，按风险从低到高排序
```

### 性能优化

```
> 分析 ProductService 的性能问题：
> 1. 找出 N+1 查询（检查 @OneToMany, @ManyToOne 的 fetch 类型）
> 2. 检查是否有不必要的数据库调用可以批量处理
> 3. 分析是否需要添加缓存（@Cacheable）
> 4. 检查分页查询是否使用了正确的索引
> 给出优化建议和具体代码改动
```

## 自动化与 CI/CD

### Hooks 集成

使用 [Hooks](/guide/advanced/hooks) 在 Claude Code 操作前后自动执行 Java 项目任务：

````json title=".claude/settings.json"
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
````

这个 Hook 在 Claude Code 修改 `.java` 文件后自动运行 Spotless 格式化。

:::details 更多 Java Hooks 示例

````json title=".claude/settings.json"
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_FILE_PATHS\" | grep -q '\\.java$'; then mvn checkstyle:check -q 2>/dev/null; fi"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "mvn test -pl $(git diff --name-only HEAD | grep -oP 'src/main/java/\\K[^/]+' | head -1) -q 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
````

- `PostToolUse` Hook：修改 Java 文件后运行 Checkstyle 检查
- `Stop` Hook：Claude Code 完成任务后运行相关模块的测试

:::

### 集成到 CI/CD

在 CI 流水线中使用 Claude Code 进行代码审查：

````yaml title=".github/workflows/ai-review.yml"
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
````

### 自定义 Skills

:::tip
创建自定义 Skills 的基础知识请参考[自定义技能](/skills/overview/custom-skills)。
:::

为 Java 项目创建专用 Skill，标准化常见操作：

````markdown title=".claude/skills/create-api-endpoint/SKILL.md"
# 创建 API 端点

根据需求创建完整的 Spring Boot REST API 端点。

## 步骤

1. 在 model/ 包下创建 Entity 类（使用 JPA 注解）
2. 在 dto/ 包下创建请求和响应 DTO
3. 创建 MapStruct Mapper 接口
4. 在 repository/ 包下创建 Repository 接口
5. 在 service/ 包下创建 Service 类（包含业务逻辑）
6. 在 controller/ 包下创建 Controller（使用 @RestController）
7. 在 src/test/java/ 对应包下创建单元测试
8. 运行测试确认通过

## 约定

- 遵循项目现有的代码风格
- 使用 Lombok 减少样板代码
- 所有 Controller 方法需要参数校验
- Service 层需要处理业务异常
````

使用时只需：

```
> /create-api-endpoint
> 创建商品管理 API，包含 CRUD、分页查询和按分类筛选
```

## 注意事项

### Java 版本兼容性

Claude Code 的训练数据可能偏向 Java 8/11 的写法。如果你使用 Java 17+ 或 21，在 CLAUDE.md 中明确标注：

````markdown title="CLAUDE.md（片段）"
## Java 版本

本项目使用 Java 21，请使用以下现代特性：
- 使用 record 定义 DTO（替代 Lombok @Data）
- 使用 sealed class 定义状态机
- 使用 pattern matching（switch with ->）
- 使用 Text Blocks（"""）编写 SQL
- 不要使用已废弃的 SecurityManager
````

:::warning
如果你不指定 Java 版本，Claude 可能生成 Java 8 风格的代码（如使用 `new ArrayList<>()` 而不是 `List.of()`），或者使用已废弃的 `javax.*` 包而非 `jakarta.*`。
:::

### 常见陷阱

| 陷阱 | 说明 | 解决方案 |
|------|------|----------|
| javax vs jakarta | Spring Boot 3.x 使用 `jakarta.*` 命名空间 | 在 CLAUDE.md 中注明 Spring Boot 版本 |
| Lombok 注解处理器 | IDE 可能提示找不到 Lombok 生成的方法 | 确保 pom.xml 中配置了 annotation processor |
| @Transactional 传播 | 嵌套事务行为可能不符合预期 | 让 Claude 明确指定 propagation 属性 |
| 测试上下文加载 | 集成测试启动慢 | 使用 `@SpringBootTest(properties = "...")` 减少不必要的自动配置 |
| MapStruct 版本 | 不同版本的 MapStruct API 有差异 | 在 CLAUDE.md 中注明使用的 MapStruct 版本 |

### 效率提示

```
# 使用 /compact 压缩上下文
> /compact 保留 Spring Boot 和 Maven 相关的上下文

# 使用 /clear 重新开始
> 当切换到不相关的功能模块时，用 /clear 清除上下文避免干扰

# 使用 Context7 获取最新文档
> 查询 Spring Data JPA 3.2 的 findBy 方法命名规范
```

## 提示词模板库

以下是 Java 开发常用场景的提示词模板，可直接复制使用：

:::details REST API 开发

```
> 基于 [Entity 名称] 创建完整的 REST API 模块：
> - Entity: [字段列表]
> - 包含 CRUD + 分页查询 + 按 [字段] 搜索
> - 使用 DTO 隔离（CreateRequest, UpdateRequest, Response）
> - MapStruct 转换
> - 统一异常处理
> - 单元测试 + 集成测试
> 参考项目中 [现有模块] 的代码风格
```

:::

:::details 数据库迁移

```
> 创建 Flyway 迁移脚本：
> - 表名: [名称]
> - 字段: [字段定义]
> - 索引: [索引定义]
> - 外键: [外键关系]
> 命名规范: V{下一个版本号}__{描述}.sql
```

:::

:::details 安全配置

```
> 配置 Spring Security + JWT 认证：
> - JwtAuthenticationFilter 继承 OncePerRequestFilter
> - JwtTokenProvider 负责 token 生成和验证
> - SecurityConfig 配置路由权限
> - 放行: /api/auth/**, /actuator/health
> - 保护: /api/** 其他所有接口
> - 配置 CORS 允许 [前端域名]
```

:::

:::details 缓存配置

```
> 为 [Service 名称] 添加 Redis 缓存：
> - 使用 Spring Cache + Redis
> - @Cacheable 缓存查询结果
> - @CachePut 更新缓存
> - @CacheEvict 删除缓存
> - 配置缓存过期时间
> - 添加缓存命中率日志
```

:::

:::details 消息队列集成

```
> 集成 RabbitMQ/Kafka：
> - 创建消息生产者 [ProducerName]
> - 创建消息消费者 [ConsumerName]
> - 配置死信队列处理失败消息
> - 消息序列化使用 JSON
> - 添加消费失败重试机制（3次重试，指数退避）
```

:::
