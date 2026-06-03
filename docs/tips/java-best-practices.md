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
