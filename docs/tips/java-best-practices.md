---
title: Java 开发最佳实践
description: 使用 Claude Code 进行 Java 开发的完整指南，涵盖项目配置、提示词策略、测试、构建工具、工具链集成（ECC、GStack、Superpowers、CodeGraph、Serena）和自动化工作流
---

# Java 开发最佳实践

Claude Code 对 Java 生态（Spring Boot、Maven、Gradle、JUnit 等）有良好的支持。本文介绍如何在 Java 项目中高效使用 Claude Code，从项目配置到自动化工作流的最佳实践。

## Skills：Java 开发的效率倍增器

**Skills**（技能）是 Claude Code 的核心增强机制——每个 Skill 是一个 `SKILL.md` 文件，包含结构化的提示词、工作流步骤和工具组合策略。你可以将 Skills 理解为 Claude Code 的"自动化脚本"：它告诉 Claude Code 在特定场景下应该遵循什么步骤、使用什么工具、按什么顺序执行。

### Skills 对 Java 开发者意味着什么

| 维度 | 没有 Skills | 使用 Skills |
|------|------------|-------------|
| 任务理解 | 直接写代码，容易遗漏分层步骤 | SKILL.md 强制定义完整工作流 |
| 代码质量 | 依赖 Claude 的训练数据风格 | SKILL.md 统一代码风格和命名规范 |
| 测试覆盖 | 测试是可选的 | SKILL.md 可以强制 TDD（先写测试） |
| 工具协同 | 各工具独立使用 | SKILL.md 编排工具链（ECC → Superpowers → Gstack） |
| 知识传递 | 每次对话都要重新说明 | SKILL.md 持久化项目约定 |

### Java 生态中的三类 Skills

1. **ECC 内置 Java Skills**：`springboot-patterns`（Spring Boot 项目结构规范）、`springboot-tdd`（Spring Boot TDD 工作流）、`tdd-workflow`（通用 TDD 流程）、`database-migrations`（数据库迁移最佳实践）、`security-review`（安全审查工作流）
2. **Superpowers 管道 Skills**：`brainstorming`（需求探索）、`writing-plans`（计划编写）、`test-driven-development`（TDD 执行）、`systematic-debugging`（系统化调试）、`requesting-code-review`（代码审查请求）
3. **自定义 Java Skills**：团队根据自身技术栈创建的专属 Skills，如 API 端点生成、数据库迁移审查、统一异常处理等

:::tip
ECC 的 Java Skills 无需额外配置，安装 ECC 后即可使用。Superpowers Skills 需要安装 Superpowers 插件。自定义 Skills 则需要在项目的 `.claude/skills/` 目录下创建 SKILL.md 文件——详见下方 [自定义 Java Skills](#自定义-java-skills) 章节。
:::

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
- 命名规范：V{版本号}**{描述}.sql（如 V1**create_user_table.sql）

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

```markdown title="常用提示词模板"
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
>
> - MethodArgumentNotValidException → 400
> - EntityNotFoundException → 404
> - BusinessException → 自定义错误码
>   返回 ErrorResponse 格式 {code, message, timestamp}

# 测试生成

> 为 UserService 编写单元测试，使用：
>
> - @ExtendWith(MockitoExtension.class)
> - @Mock UserRepository
> - @InjectMocks UserService
> - 测试正常流程和异常情况
```

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

| 层级       | 测试类型                              | Mock 策略                         |
| ---------- | ------------------------------------- | --------------------------------- |
| Controller | `@WebMvcTest`                         | Mock Service 层                   |
| Service    | `@ExtendWith(MockitoExtension.class)` | Mock Repository 和外部依赖        |
| Repository | `@DataJpaTest`                        | 使用嵌入式数据库或 Testcontainers |
| 完整流程   | `@SpringBootTest`                     | 使用 Testcontainers 启动真实依赖  |

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

```markdown
# 添加依赖

> 在 pom.xml 中添加以下依赖：
>
> - spring-boot-starter-data-redis
> - spring-boot-starter-validation
> - org.mapstruct:mapstruct:1.5.5.Final
> - org.mapstruct:mapstruct-processor（注解处理器放在 maven-compiler-plugin 中）

# 多模块项目

> 将当前项目改造为 Maven 多模块结构：
>
> - app-common：公共工具类和异常定义
> - app-service：业务逻辑层
> - app-web：Controller 和配置
>   创建父 pom.xml 管理依赖版本

# 构建优化

> 优化 pom.xml 的构建配置：
>
> - 配置 spring-boot-maven-plugin 分层构建
> - 添加 maven-surefire-plugin 排除集成测试
> - 配置 maven-failsafe-plugin 运行 \*IT.java 集成测试
```

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

除了上述构建工具外，Claude Code 生态还提供了多个辅助工具，可以在 Java 开发的不同阶段发挥作用。以下介绍六个核心工具在 Java/Spring Boot 项目中的集成方式和典型用法。

:::tip
在使用以下工具之前，建议先配置 [Java LSP](/tips/java-practices/lsp-setup)（jdtls）。LSP 为 Claude Code 提供被动诊断和主动查询能力，是所有工具链的语义基础——没有 LSP，Claude Code 只能用 grep 搜索代码，后续的 CodeGraph 探索和 Serena 重构都会受限于文本搜索的精度。
:::

| 工具                                          | 定位             | Java 核心价值                           | 安装依赖    |
| --------------------------------------------- | ---------------- | --------------------------------------- | ----------- |
| [LSP (jdtls)](/tips/java-practices/lsp-setup) | 代码语义基础     | 被动诊断 + 主动查询，Claude Code 内置   | 无（插件）  |
| [ECC](/tips/ecc)                              | 全能增强系统     | Java 专属 Agent 和 Spring Boot Skills   | Node.js     |
| [Gstack](/guide/advanced/gstack)              | 虚拟工程团队     | Staff 级代码审查 + QA + 安全审计        | Bun         |
| [Superpowers](/guide/advanced/superpowers)    | 结构化开发方法论 | 强制 TDD + 计划驱动开发                 | 无（插件）  |
| [CodeGraph](/guide/advanced/codegraph)        | 代码知识图谱     | 快速探索 Java 代码结构 + 影响分析       | Node.js     |
| [Graphify](/guide/advanced/graphify)          | 多模态知识图谱   | Java 代码 + 架构文档 + 设计图的统一图谱 | Python      |
| [Serena](/guide/advanced/serena)              | 代码语义工具     | 符号级精确重构（JetBrains 增强）        | Python (uv) |

:::tip
这七个工具可以组合使用——LSP 提供语义基础，ECC 提供流程编排，Superpowers 保证开发纪律，CodeGraph 和 Serena 提供代码智能，Graphify 适合架构文档与代码的关联分析，Gstack 负责审查和发布。详见[最佳实践](/tips/best-practices)中的四阶段工作流。完整的工具链协同工作流和实战案例，请参阅 [Java 工具链集成](/tips/java-practices/) 系列。
:::

### ECC：Java 专属增强

[ECC](/tips/ecc)（Enhanced Claude Code）内置了 Java 语言专属的 Agent 和 Spring Boot 专项 Skill，无需额外配置即可为 Java 项目提供专业级的代码审查和开发流程支持。

#### Java 专属 Agent

| Agent                 | 用途                                            | 触发场景                                    |
| --------------------- | ----------------------------------------------- | ------------------------------------------- |
| `java-reviewer`       | Java 代码审查，检查并发安全、资源泄漏、异常处理 | 每次提交前审查 Service 层实现               |
| `java-build-resolver` | 诊断 Maven/Gradle 构建错误并自动修复            | CI 失败、本地编译报错、依赖冲突             |
| `security-reviewer`   | 安全漏洞审查（SQL 注入、XSS、硬编码密钥等）     | PR 审查阶段、安全加固任务                   |
| `database-reviewer`   | 数据库迁移和查询审查                            | Flyway 迁移脚本提交前、N+1 查询排查         |

#### Spring Boot 专项 Skill

| Skill                 | 用途                                  | 典型使用方式                          |
| --------------------- | ------------------------------------- | ------------------------------------- |
| `springboot-patterns` | Spring Boot 项目结构和编码规范        | 创建新模块时自动应用分层架构约定      |
| `springboot-tdd`      | Spring Boot 项目的 TDD 工作流指导     | 实现新功能时驱动 RED-GREEN-REFACTOR   |
| `tdd-workflow`        | 通用 TDD 工作流，适用于 Java 单元测试 | 为现有代码补充测试覆盖                |
| `security-review`     | 安全审查工作流                        | PR 审查前的安全检查                   |
| `database-migrations` | 数据库迁移最佳实践                    | 编写或审查 Flyway 迁移脚本            |

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

:::info
ECC 的 Skills 位于 Skills 标签页中的"Java"分类下。安装 ECC 后，可以在 Claude Code 对话中通过 `/springboot-tdd`、`/security-review` 等斜杠命令直接调用。如果找不到 Java Skills，确保 ECC 的 rules 文件已正确复制到 `~/.claude/rules/ecc/` 目录。
:::

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

### Superpowers：结构化 Java 开发

[Superpowers](/guide/advanced/superpowers) 为 Java 开发提供严格的 TDD 纪律和计划驱动的开发流程。对 Spring Boot 项目尤其有价值——它确保每一层（Controller、Service、Repository）都有测试覆盖。

#### Java TDD 工作流

Superpowers 的 TDD Skill 会强制执行 RED-GREEN-REFACTOR 循环。对 Java 项目，这意味着：

```
1. 🔴 RED    — 先写 JUnit 5 测试，运行 mvn test 确认失败
2. 🟢 GREEN  — 写最小实现让测试通过
3. 🔵 REFACTOR — 重构优化，运行 mvn test 确认无回归
```

#### 使用示例

```
> 使用 Superpowers 工作流，实现用户注册功能：
> 1. 头脑风暴确认需求（邮箱验证？手机验证？密码强度规则？）
> 2. 创建 Git Worktree 隔离开发
> 3. 编写计划：拆分为 Entity → DTO → Repository → Service → Controller → 测试
> 4. TDD 驱动：每个组件先写测试再实现
> 5. 代码审查：检查异常处理、事务边界、安全性
```

```
> /superpowers:brainstorming
> 设计一个订单状态机，支持待支付、已支付、发货中、已完成、已取消状态转换
```

```
> /superpowers:systematic-debugging
> 集成测试在 CI 上间歇性失败，本地无法复现，帮我排查
```

#### Java 调试实战

````text
```text
> /superpowers:systematic-debugging
> @Transactional 注解的方法中调用了同类的另一个 @Transactional 方法，
> 内层方法的事务没有生效，导致数据不一致
```
````

Superpowers 四阶段排查：

1. **复现**：编写测试验证事务传播行为
2. **根因**：Spring AOP 代理机制——同类方法调用不经过代理，@Transactional 失效
3. **修复**：注入自身代理或使用 `AopContext.currentProxy()`
4. **防护**：添加事务边界测试，防止回归

:::warning
Superpowers 严格执行"先测试后代码"规则。如果代码在测试之前写好，会被要求删除重来。这对习惯了"先写实现后补测试"的 Java 开发者可能需要适应。
:::

:::tip
Superpowers 的头脑风暴阶段会帮你理清需求中的歧义——比如"用户注册"是否需要邮箱验证、密码策略是什么。在 Java 项目中，这些前期决策直接影响 Entity 设计和数据库 Schema，值得花时间在头脑风暴阶段想清楚。
:::

### Gstack：Java 项目的工程团队

[Gstack](/guide/advanced/gstack) 将 Claude Code 变成虚拟工程团队，为 Java/Spring Boot 项目提供 Staff 级代码审查、QA 测试和安全审计。

#### Java 项目常用命令

| 命令               | 角色           | Java 场景                                         |
| ------------------ | -------------- | ------------------------------------------------- |
| `/plan-eng-review` | 工程经理       | 审查 Spring Boot 架构方案、数据库设计             |
| `/review`          | Staff Engineer | 审查 Java 代码变更，聚焦生产 Bug                  |
| `/cso`             | 安全负责人     | OWASP Top 10 安全审计，检查 SQL 注入、XSS         |
| `/qa`              | QA Lead        | 在浏览器中测试 Spring Boot 应用的 API 和 Web 界面 |
| `/ship`            | 发布工程师     | 运行 `mvn test`，审计覆盖率，推送并创建 PR        |
| `/investigate`     | 调试专家       | 系统性排查 Java 异常和性能问题                    |

#### 使用示例

```
> /plan-eng-review
> 审查多租户 SaaS 的架构方案：每个租户独立 Schema 还是共享 Schema + tenant_id？
```

```
> /review
> 在 feature/order-state-machine 分支上审查代码变更
```

```
> /cso
> 审查 Spring Security 配置和 JWT 实现，检查 OWASP Top 10 漏洞
```

```
> /ship
> 运行 mvn verify，确认测试通过后推送到远程并创建 PR
```

:::info
Gstack 的 `/review` 会聚焦"能通过 CI 的生产 Bug"——对 Java 项目，它会特别关注空指针异常、资源未关闭、事务边界错误、并发安全等常见问题。配合 `/cso` 安全审查，可以在合并前捕获大部分问题。
:::

### CodeGraph：Java 代码探索

[CodeGraph](/guide/advanced/codegraph) 为 Java 项目构建本地代码知识图谱，一次 MCP 调用即可获取完整的类关系和调用链，避免 Claude Code 反复读取大型 Java 文件浪费 Token。

#### Java 项目核心能力

| 能力       | 说明                                  | Java 场景                                 |
| ---------- | ------------------------------------- | ----------------------------------------- |
| 代码探索   | `codegraph_explore` 一次调用回答问题  | "这个项目怎么处理事务管理？"              |
| 影响分析   | `codegraph_impact` 分析修改影响范围   | "改了 User Entity 会影响哪些 Service？"   |
| 调用链追踪 | `codegraph_trace` 追踪完整调用路径    | "从 Controller 到数据库的调用链"          |
| 调用者查找 | `codegraph_callers` 查找所有调用者    | "哪些地方调用了 PaymentService.process？" |
| 受影响测试 | `codegraph affected` 找出受影响的测试 | CI 中只运行受影响的测试                   |

#### 使用示例

```
> 这个 Spring Boot 项目的认证流程是什么？从登录接口到 JWT 生成的完整链路
```

CodeGraph 会通过 `codegraph_explore` 一次调用获取认证相关的 Controller、Service、Filter 和配置类的完整上下文。

```
> 如果我修改 Order.java 的状态字段，会影响哪些 Service 和测试？
```

```
> 追踪从 POST /api/orders 到数据库 INSERT 的完整调用链
```

#### 安装 CodeGraph

```bash
# 独立安装（自带 Node 运行时）
# Windows PowerShell
irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex

# 初始化项目
cd your-java-project
codegraph init -i
```

:::tip
CodeGraph 支持 Spring 框架路由识别——它能自动解析 `@RestController`、`@RequestMapping` 等注解，构建从 HTTP 端点到 Service 层的完整路由图。对大型 Spring Boot 项目，这比 Claude Code 逐个读取 Controller 文件高效得多。
:::

:::info
CodeGraph 的所有处理都在本地完成——源代码不会发送到外部服务。对安全敏感的企业 Java 项目，这是一个重要优势。
:::

### Serena：Java 符号级重构

[Serena](/guide/advanced/serena) 通过 LSP 为 Java 项目提供 IDE 级的符号操作能力。对 Java 项目而言，Serena 最大的价值在于**精确重构**——重命名跨文件的类和方法、移动符号到新模块、安全删除废弃代码，这些操作通过 LSP 保证原子化和精确性。

:::info
Claude Code 内置了 [Java LSP 集成](/tips/java-practices/lsp-setup)（基于 jdtls），提供被动诊断和代码导航能力。Serena 的 LSP 侧重于**符号级重构**（重命名、移动、安全删除），两者互补而非替代。推荐同时启用：内置 LSP 处理诊断和导航，Serena 处理精确重构。
:::

#### LSP 后端 vs JetBrains 后端

| 能力          | LSP 后端（免费）              | JetBrains 后端（付费）                     |
| ------------- | ----------------------------- | ------------------------------------------ |
| 符号查找      | ✅ `find_symbol`              | ✅                                         |
| 符号大纲      | ✅ `get_symbols_overview`     | ✅                                         |
| 引用查找      | ✅ `find_referencing_symbols` | ✅                                         |
| 精确重命名    | ✅ `rename_symbol`            | ✅                                         |
| 符号体替换    | ✅ `replace_symbol_body`      | ✅                                         |
| 类型层次      | ❌                            | ✅ `type_hierarchy`                        |
| 移动符号/文件 | ❌                            | ✅ `move_symbol`, `move_file`              |
| 内联重构      | ❌                            | ✅ `inline_refactoring`                    |
| 安全删除      | ❌                            | ✅ `safe_delete`                           |
| 交互式调试    | ❌                            | ✅ `set_breakpoint`, `evaluate_expression` |

:::info
如果你使用 IntelliJ IDEA 进行 Java 开发，推荐使用 JetBrains 后端——它能利用 IDEA 的分析引擎，获得类型层次、移动重构和调试能力。
:::

#### 使用示例

```
> 把 UserService.authenticate() 重命名为 verifyCredentials()，包括所有 Controller 和测试中的调用
```

Serena 通过 `rename_symbol` 一次调用完成——LSP 精确找到所有引用，原子化替换。

```
> 哪些地方调用了 OrderRepository.findByStatus？如果删除这个方法会影响什么？
```

```
> 把 PaymentService 中的 calculateTotal 方法提取到 PricingStrategy 类中
```

JetBrains 后端的 `move_symbol` 会自动处理 import 更新和旧文件清理。

```
> 查看 OrderService.java 的符号大纲，有哪些公开方法？
```

#### 安装 Serena

```bash
# 安装
uv tool install -p 3.13 serena-agent

# 初始化项目
serena init

# 注册到 Claude Code
claude mcp add --scope user serena -- serena
```

如果你使用 IntelliJ IDEA，可以启用 JetBrains 后端获得更强的重构能力：

```bash
serena init -b JetBrains
```

#### Java 推荐配置

```yaml title=".serena/config.yaml"
backend: lsp # 或 "JetBrains"（如果使用 IntelliJ IDEA）

tools:
  find_symbol: true
  get_symbols_overview: true
  find_referencing_symbols: true
  rename_symbol: true
  replace_symbol_body: true
  # JetBrains 后端额外可用
  # move_symbol: true
  # safe_delete: true
  # type_hierarchy: true
  # 禁用基础工具（Claude Code 已提供）
  read_file: false
  list_dir: false
  execute_shell: false
```

:::tip
Serena + CodeGraph 是 Java 大型项目的黄金组合：用 CodeGraph 快速探索代码结构和调用链，用 Serena 进行精确的符号级重构。两者通过 MCP 并行运行，互不冲突。
:::

### Spec-Kit：Java 规格驱动开发

[Spec-Kit](/guide/advanced/spec-kit) 是 GitHub 官方的规格驱动开发工具，特别适合 Java/Spring Boot 企业项目——它通过结构化的规格文档消除需求歧义，内置 Constitution 机制确保团队遵循统一的开发原则（如 Library-First、Test-First、Anti-Abstraction）。

#### Java/Spring Boot 项目核心价值

| 阶段         | Spec-Kit 能力                      | Java 场景                                        |
| ------------ | ---------------------------------- | ------------------------------------------------ |
| 规格编写     | `/speckit.specify` 关注 WHAT + WHY | 定义 REST API 的行为规格，不涉及 Controller 写法 |
| 需求澄清     | `/speckit.clarify` 结构化 Q&A      | 澄清 API 的分页策略、异常处理、事务边界          |
| 技术方案     | `/speckit.plan` 含技术选型理由     | 选择 JPA vs MyBatis、Flyway vs Liquibase         |
| 一致性分析   | `/speckit.analyze` 跨工件审计      | 检查规格、数据模型、API 契约是否一致             |
| 任务转 Issue | `/speckit.taskstoissues`           | 自动将 Spring Boot 模块任务同步到 GitHub Issues  |

#### 使用示例

```
> /speckit.specify
> 为订单模块编写规格：
> - 用户可以创建订单（包含多个订单项）
> - 订单支持待支付、已支付、已发货、已完成、已取消五种状态
> - 状态转换有明确的业务规则（如已发货不可取消）
> - 支持按日期范围和状态筛选订单列表
```

```
> /speckit.clarify
> 澄清订单模块的规格
```

Spec-Kit 会提问：订单项是否可以为空？状态转换是否需要审批？取消已支付的订单是否自动退款？

```
> /speckit.plan
> 生成 Spring Boot 技术方案
```

生成的技术方案会包含 JPA Entity 设计、Repository 接口、Service 层状态机、Controller 路由等，每个技术选择都有理由追溯到规格需求。

#### 安装 Spec-Kit

```bash
# 安装
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@latest

# 在 Java 项目中初始化
cd your-spring-boot-project
specify init . --integration claude
```

:::tip
对 Java/Spring Boot 企业项目，Spec-Kit + Superpowers 是强力组合：Spec-Kit 负责规格和任务拆分（WHAT），Superpowers 负责 TDD 执行和代码审查（HOW）。Spec-Kit 的 Constitution 中的 Test-First 原则与 Superpowers 的 TDD 纪律天然对齐。
:::

### 工具链组合实战

以下是 Java/Spring Boot 项目中常见的工具组合场景：

#### 场景一：新功能开发（完整流程）

```
1. Superpowers: /superpowers:brainstorming 探索需求（邮箱验证？密码策略？）
2. Gstack: /plan-eng-review 审查架构方案
3. CodeGraph: codegraph_explore 理解现有代码结构
4. Superpowers: TDD 驱动实现 → 每层先写 JUnit 5 测试
5. ECC: java-reviewer 审查代码 → security-reviewer 安全审查
6. Gstack: /ship 运行 mvn verify → 推送并创建 PR
```

#### 场景二：大型重构（语义驱动）

```
1. CodeGraph: codegraph_impact 分析重构影响范围
2. Serena: find_referencing_symbols 追踪所有引用
3. Gstack: /plan-eng-review 审查重构方案
4. Serena: rename_symbol / move_symbol 精确重构
5. CodeGraph: codegraph_impact 验证变更完整性
6. Gstack: /review 审查 → /cso 安全审计
```

#### 场景三：遗留 Spring Boot 项目接管

```
1. CodeGraph: codegraph_explore 快速理解项目架构和路由
2. Serena: get_symbols_overview 梳理核心类的公开 API
3. Gstack: /office-hours 梳理业务需求
4. ECC: java-reviewer 识别代码问题 → security-reviewer 安全扫描
5. Superpowers: TDD 驱动渐进式重构，每步都有测试覆盖
```

#### 场景四：安全加固

```
1. ECC AgentShield: npx ecc-agentshield scan --opus --stream 深度安全扫描
2. CodeGraph: codegraph_trace 追踪敏感数据流向（用户密码、支付信息）
3. Gstack: /cso OWASP Top 10 + STRIDE 威胁建模
4. ECC: security-reviewer 逐模块审查
5. Superpowers: TDD 驱动安全修复 → 回归测试
```

#### 场景五：企业级新模块开发（规格驱动）

```
1. Gstack: /office-hours 探索业务需求 → /plan-eng-review 审查架构
2. Spec-Kit: /speckit.constitution 建立 Java 项目原则（Library-First、Test-First）
3. Spec-Kit: /speckit.specify 编写功能规格 → /speckit.clarify 澄清边界情况
4. Spec-Kit: /speckit.plan 生成 Spring Boot 技术方案 → /speckit.analyze 验证一致性
5. Superpowers: TDD 驱动实现 → 每层先写 JUnit 5 测试
6. Spec-Kit: /speckit.taskstoissues 同步任务到 GitHub Issues → 团队协作开发
```

:::info
Spec-Kit 的 `/speckit.analyze` 会检查规格、数据模型和 API 契约之间的一致性——对 Java 企业项目，这意味着在写代码之前就能发现 Entity 定义与 API 规格不匹配、缺少必要的字段约束等问题。
:::

:::info
工具组合的核心原则：**CodeGraph / Serena 提供代码智能 → Superpowers / ECC 保证开发纪律 → Gstack 负责审查和发布**。根据项目规模灵活组合，小型功能可以跳过 Gstack 的规划阶段直接 TDD，大型重构则需要完整的 CodeGraph 影响分析 + Gstack 架构审查。
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

这个 Hook 在 Claude Code 修改 `.java` 文件后自动运行 Spotless 格式化。

:::details 更多 Java Hooks 示例

```json title=".claude/settings.json"
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
```

- `PostToolUse` Hook：修改 Java 文件后运行 Checkstyle 检查
- `Stop` Hook：Claude Code 完成任务后运行相关模块的测试

:::

### 集成到 CI/CD

在 CI 流水线中使用 Claude Code 进行代码审查：

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

### 自定义 Java Skills

Custom Skills 是团队知识沉淀的最佳方式。当一个 Java 开发流程被反复执行（如创建 REST API、编写 Flyway 迁移、配置 Spring Security），将其封装为 SKILL.md 可以让 Claude Code 每次都按照团队约定的步骤和标准执行，无需重复说明。

#### SKILL.md 文件结构

每个 Skill 是一个 Markdown 文件，放在项目的 `.claude/skills/<skill-name>/SKILL.md`：

```
.claude/skills/
├── create-api-endpoint/
│   └── SKILL.md          ← 创建 REST API 端点的标准流程
├── flyway-migration/
│   └── SKILL.md          ← Flyway 迁移脚本审查流程
└── service-review/
    └── SKILL.md          ← Service 层代码审查检查清单
```

SKILL.md 由 Claude Code 在 `/skill-name` 斜杠命令调用时加载，其内容直接作为 Claude 的指令上下文。

:::tip
创建自定义 Skills 的基础知识请参考[自定义技能](/skills/overview/custom-skills)。
:::

#### 示例一：create-api-endpoint（创建 REST API 端点）

这是 Java 最常用的 Skill——标准化 Entity → DTO → Repository → Service → Controller 的完整创建流程：

```markdown title=".claude/skills/create-api-endpoint/SKILL.md"
# 创建 API 端点

根据需求创建完整的 Spring Boot REST API 端点。遵循项目的分层架构约定。

## 步骤

1. 在 `model/` 包下创建 Entity 类（使用 JPA 注解、Lombok 注解）
2. 在 `dto/` 包下创建请求和响应 DTO：
   - `Create{Entity}Request`：创建请求（含 `@Valid` 校验注解）
   - `Update{Entity}Request`：更新请求
   - `{Entity}Response`：响应（不暴露内部字段）
3. 创建 MapStruct Mapper 接口（`@Mapper(componentModel = "spring")`）
4. 在 `repository/` 包下创建 Repository 接口（继承 `JpaRepository`）
5. 在 `service/` 包下创建 Service 类：
   - 查询方法使用 `@Transactional(readOnly = true)`
   - 写操作使用 `@Transactional`，显式指定 `rollbackFor = Exception.class`
6. 在 `controller/` 包下创建 Controller（`@RestController` + `@RequestMapping`）
7. 在 `src/test/java/` 对应包下创建单元测试（Mockito）和集成测试
8. 运行 `mvn test` 确认通过

## 约定

- 遵循项目现有的代码风格（参考 {参考模块} 的实现）
- 使用 Lombok 减少样板代码（`@Getter`, `@Builder`, `@Slf4j`）
- Controller 只做参数校验和路由，业务逻辑在 Service 层
- 不在 Controller 中直接暴露 Entity，必须使用 DTO
- 所有写操作需要显式事务注解
- 集成测试使用 Testcontainers + PostgreSQL
```

#### 示例二：service-review（Service 层代码审查）

```markdown title=".claude/skills/service-review/SKILL.md"
# Service 层代码审查

对指定的 Service 类进行全面的代码审查，聚焦生产环境中的常见问题。

## 检查清单

### 事务安全
- [ ] 写操作是否标注了 `@Transactional`
- [ ] 查询方法是否使用了 `@Transactional(readOnly = true)`
- [ ] 同类方法之间的调用是否存在事务失效风险（Spring AOP 代理限制）
- [ ] `rollbackFor` 是否指定了 `Exception.class`（默认只回滚 RuntimeException）

### 异常处理
- [ ] 是否吞掉了应该抛出的异常（catch 块为空或仅打印日志）
- [ ] 是否使用了统一的 `BusinessException` + `ErrorCode` 体系
- [ ] 异常信息是否对调试友好（包含足够的上下文）

### 并发安全
- [ ] 是否存在共享可变状态（成员变量被多个线程访问）
- [ ] 乐观锁（`@Version`）是否正确使用
- [ ] 数据库操作是否有竞态条件

### 性能
- [ ] 是否存在 N+1 查询（检查 `@OneToMany` 的 fetch 类型）
- [ ] 批量操作是否逐条执行（应使用 `saveAll`、`batch` 操作）
- [ ] 高频查询是否需要缓存（`@Cacheable`）

### 代码质量
- [ ] 方法是否过长（超过 50 行建议拆分）
- [ ] 是否有硬编码的魔法值（应提取为常量或配置）
- [ ] 日志是否使用了 SLF4J（不用 `System.out`）
- [ ] 日志是否输出了敏感信息（密码、Token、身份证号）

## 输出格式

按严重程度排序输出问题列表：
- 🔴 **高**：会导致数据丢失、安全漏洞或生产崩溃
- 🟡 **中**：会导致性能问题或维护困难
- 🟢 **低**：代码风格或最佳实践建议
```

#### 示例三：flyway-migration（Flyway 迁移脚本审查）

```markdown title=".claude/skills/flyway-migration/SKILL.md"
# Flyway 迁移审查

审查 Flyway 数据库迁移脚本的正确性、安全性和性能影响。

## 审查步骤

1. 确认迁移脚本命名符合规范：`V{版本号}__{描述}.sql`
2. 确认版本号递增且不与已有迁移冲突
3. 审查 SQL 内容：

### 数据定义（DDL）
- [ ] 字段类型是否合理（VARCHAR 长度、DECIMAL 精度）
- [ ] 是否添加了 NOT NULL 约束（避免意外 null 值）
- [ ] 外键约束是否正确（ON DELETE 行为）
- [ ] 默认值是否合理

### 索引
- [ ] 主键和外键是否有索引
- [ ] WHERE 条件中常用字段是否有索引
- [ ] 复合索引的字段顺序是否正确（高选择性字段在前）

### 数据迁移（DML）
- [ ] UPDATE/DELETE 是否有 WHERE 条件（防止全表操作）
- [ ] 大表数据迁移是否分批执行
- [ ] 是否需要在事务内执行

### 兼容性
- [ ] 是否向后兼容（蓝绿部署场景）
- [ ] 是否需要停机维护
- [ ] 回滚方案是什么

## 输出格式

对每个问题标注风险级别和修复建议，附带修正后的 SQL。
```

#### 使用自定义 Skills

创建 SKILL.md 后，在 Claude Code 中通过斜杠命令调用：

```
> /create-api-endpoint
> 创建商品管理 API，包含 CRUD、分页查询和按分类筛选
```

```
> /service-review
> 审查 OrderService.java
```

```
> /flyway-migration
> 审查 V3__add_payment_table.sql
```

:::tip
自定义 Skills 的核心价值在于**一致性**——无论哪个开发者使用 Claude Code，只要调用同一个 Skill，得到的结果都遵循相同的标准和步骤。建议团队将 SKILL.md 文件纳入版本控制（Git），作为项目编码规范的一部分。
:::

## 注意事项

### Java 版本兼容性

Claude Code 的训练数据可能偏向 Java 8/11 的写法。如果你使用 Java 17+ 或 21，在 CLAUDE.md 中明确标注：

```markdown title="CLAUDE.md（片段）"
## Java 版本

本项目使用 Java 21，请使用以下现代特性：

- 使用 record 定义 DTO（替代 Lombok @Data）
- 使用 sealed class 定义状态机
- 使用 pattern matching（switch with ->）
- 使用 Text Blocks（"""）编写 SQL
- 不要使用已废弃的 SecurityManager
```

:::warning
如果你不指定 Java 版本，Claude 可能生成 Java 8 风格的代码（如使用 `new ArrayList<>()` 而不是 `List.of()`），或者使用已废弃的 `javax.*` 包而非 `jakarta.*`。
:::

### 常见陷阱

| 陷阱                | 说明                                      | 解决方案                                                        |
| ------------------- | ----------------------------------------- | --------------------------------------------------------------- |
| javax vs jakarta    | Spring Boot 3.x 使用 `jakarta.*` 命名空间 | 在 CLAUDE.md 中注明 Spring Boot 版本                            |
| Lombok 注解处理器   | IDE 可能提示找不到 Lombok 生成的方法      | 确保 pom.xml 中配置了 annotation processor                      |
| @Transactional 传播 | 嵌套事务行为可能不符合预期                | 让 Claude 明确指定 propagation 属性                             |
| 测试上下文加载      | 集成测试启动慢                            | 使用 `@SpringBootTest(properties = "...")` 减少不必要的自动配置 |
| MapStruct 版本      | 不同版本的 MapStruct API 有差异           | 在 CLAUDE.md 中注明使用的 MapStruct 版本                        |

### 效率提示

```
# 使用 /compact 压缩上下文
> /compact 保留 Spring Boot 和 Maven 相关的上下文

# 使用 /clear 重新开始
> 当切换到不相关的功能模块时，用 /clear 清除上下文避免干扰

# 使用 Context7 获取最新文档
> 查询 Spring Data JPA 3.2 的 findBy 方法命名规范

# 使用 CodeGraph 快速探索代码
> codegraph_explore 这个项目的权限控制是怎么实现的？

# 使用 Serena 精确重构
> 把 UserService.authenticate 重命名为 verifyCredentials，包括所有引用
```

:::tip
在大型 Java 项目中，CodeGraph 可以显著减少 Claude Code 的 Token 消耗——一次 `codegraph_explore` 调用替代多次 `Grep` + `Read`，Token 节省可达 57%。详见 [CodeGraph 代码智能](/guide/advanced/codegraph)。
:::

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

:::details ECC 代码审查

```
> 使用 ECC 的 java-reviewer 审查 [ServiceName].java：
> 1. 检查 @Transactional 注解的 propagation 和 rollbackFor 配置
> 2. 检查异常处理是否吞掉了应该抛出的异常
> 3. 检查资源泄漏（数据库连接、流、锁）
> 4. 检查线程安全问题（共享可变状态）
> 5. 检查是否有硬编码的魔法值
```

:::

:::details CodeGraph 影响分析

```
> 我要修改 [EntityName].java 的 [字段名] 字段：
> 1. 用 codegraph_impact 分析影响范围
> 2. 列出所有受影响的 Service、Repository、Controller
> 3. 列出所有受影响的测试
> 4. 给出安全修改的步骤建议
```

:::

:::details Serena 精确重构

```
> 重构 [PackageName] 包：
> 1. 用 find_referencing_symbols 找出 [OldMethodName] 的所有调用者
> 2. 将 [OldMethodName] 重命名为 [NewMethodName]
> 3. 将 [ClassName] 中的 [extractedMethod] 提取到 [TargetClass]
> 4. 验证所有测试仍然通过
```

:::

:::details Superpowers TDD 任务

```
> /superpowers:test-driven-development
> 实现 [FeatureName] 功能：
> 1. 先写 [EntityName] 的单元测试
> 2. 运行 mvn test 确认失败
> 3. 实现 Entity 和 Repository
> 4. 写 Service 层测试（Mock Repository）
> 5. 实现 Service 层
> 6. 写 Controller 集成测试（@WebMvcTest + MockMvc）
> 7. 实现 Controller
> 8. 运行 mvn test 确认全部通过
```

:::

:::details Gstack 安全审计

```
> /cso
> 审查 [ModuleName] 模块的安全性：
> - SQL 注入风险（检查原生 SQL 查询）
> - XSS 风险（检查返回给前端的数据）
> - 认证/授权配置（检查 SecurityConfig）
> - 敏感数据处理（密码、Token、支付信息）
> - 依赖安全（检查已知漏洞的依赖版本）
```

:::

:::details Spec-Kit 规格编写

```
> /speckit.specify
> 为 [模块名称] 编写规格文档：
> - 用户故事：[描述用户角色和目标]
> - 行为规格：[列出功能行为，关注 WHAT 不涉及技术实现]
> - 边界条件：[列出需要澄清的模糊点]
> - 验收标准：[每个功能的可测试验收条件]
```

:::

:::details Spec-Kit 需求澄清

```
> /speckit.clarify
> 澄清 [模块名称] 的规格文档，重点关注：
> - 边界条件和异常场景
> - 与现有模块的交互方式
> - 性能和安全要求
> - 数据一致性约束
```

:::
