---
title: Java 自定义 Skills 参考
description: Java/Spring Boot 项目的自定义 Skills（SKILL.md）编写指南，包含 API 端点生成、Service 审查、数据库迁移审查等多个完整示例
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★★★★☆ |
| 🧪 测试 | ★★★☆☆ | ★★★★★ |
| 📦 产品 | ★★☆☆☆ | ★★★★★ |

**🎯 学习产出：** 掌握 Java 自定义 Skills 编写方法，能独立创建团队专属的 SKILL.md 实现开发规范自动化

**🚀 AI 能力提升：** 技能扩展
:::

# Java 自定义 Skills 参考

自定义 Skills 是将团队的 Java 开发知识沉淀为可复用 SKILL.md 文件的最佳方式。本文提供多个完整的 Java/Spring Boot Skills 示例，可直接复制使用或根据团队约定修改。

:::info
Skills 的基础知识请参考[自定义技能](/skills/overview/custom-skills)。本文专注于 Java/Spring Boot 场景的 Skills 实战示例。Java 开发的综合最佳实践请参阅 [Java 开发最佳实践](/tips/java-best-practices)。
:::

## SKILL.md 编写最佳实践

### 原则

1. **具体而非抽象**：SKILL.md 应该包含明确的步骤和约束，而不是笼统的"按最佳实践做"
2. **项目特定**：引用项目中实际存在的文件路径、命名约定、技术栈版本
3. **工具编排**：明确指定在哪些步骤使用哪些工具（ECC Agent、CodeGraph、Serena 等）
4. **质量门控**：在关键步骤设置检查点（运行测试、验证编译等）

### 结构模板

```markdown title="SKILL.md 基本结构"
# Skill 名称

一句话描述这个 Skill 做什么。

## 前置条件

- 列出使用这个 Skill 之前需要满足的条件

## 步骤

1. 第一步：具体操作
2. 第二步：具体操作
3. ...

## 约束

- 列出 Claude Code 必须遵守的规则

## 输出格式（可选）

- 描述期望的输出格式
```

## Skills 示例

### create-api-endpoint（创建 REST API 端点）

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
7. 在 `src/test/java/` 对应包下创建单元测试和集成测试
8. 运行 `mvn test` 确认通过

## 约定

- 遵循项目现有的代码风格
- 使用 Lombok 减少样板代码（`@Getter`, `@Builder`, `@Slf4j`）
- Controller 只做参数校验和路由，业务逻辑在 Service 层
- 不在 Controller 中直接暴露 Entity，必须使用 DTO
- 集成测试使用 Testcontainers + PostgreSQL
```

### service-review（Service 层代码审查）

```markdown title=".claude/skills/service-review/SKILL.md"
# Service 层代码审查

对指定的 Service 类进行全面的代码审查。

## 检查清单

### 事务安全

- [ ] 写操作是否标注了 `@Transactional`
- [ ] 查询方法是否使用了 `@Transactional(readOnly = true)`
- [ ] 同类方法调用是否存在事务失效风险（Spring AOP 代理限制）
- [ ] `rollbackFor` 是否指定了 `Exception.class`

### 异常处理

- [ ] 是否吞掉了应该抛出的异常
- [ ] 是否使用了统一的 `BusinessException` + `ErrorCode` 体系

### 并发安全

- [ ] 是否存在共享可变状态
- [ ] 乐观锁（`@Version`）是否正确使用

### 性能

- [ ] 是否存在 N+1 查询
- [ ] 批量操作是否逐条执行
- [ ] 高频查询是否需要缓存

### 代码质量

- [ ] 方法是否过长（超过 50 行）
- [ ] 是否有硬编码的魔法值
- [ ] 日志是否使用了 SLF4J

## 输出格式

按严重程度排序：

- 🔴 **高**：数据丢失、安全漏洞、生产崩溃
- 🟡 **中**：性能问题、维护困难
- 🟢 **低**：代码风格、最佳实践
```

### flyway-migration（Flyway 迁移审查）

```markdown title=".claude/skills/flyway-migration/SKILL.md"
# Flyway 迁移审查

审查 Flyway 数据库迁移脚本的正确性和安全性。

## 审查步骤

1. 确认命名规范：`V{版本号}__{描述}.sql`
2. 确认版本号递增且不冲突
3. 审查 SQL 内容：

### DDL 审查

- [ ] 字段类型合理（VARCHAR 长度、DECIMAL 精度）
- [ ] NOT NULL 约束完整
- [ ] 外键的 ON DELETE 行为正确
- [ ] 默认值合理

### 索引审查

- [ ] 主键和外键有索引
- [ ] WHERE 条件常用字段有索引
- [ ] 复合索引字段顺序正确

### DML 审查

- [ ] UPDATE/DELETE 有 WHERE 条件
- [ ] 大表迁移分批执行

### 兼容性

- [ ] 是否向后兼容
- [ ] 回滚方案
```

### spring-security-setup（Spring Security 配置）

```markdown title=".claude/skills/spring-security-setup/SKILL.md"
# Spring Security 配置

配置 Spring Security + JWT 认证，遵循安全最佳实践。

## 步骤

1. 创建 `JwtTokenProvider`：Token 生成和验证
2. 创建 `JwtAuthenticationFilter`（继承 `OncePerRequestFilter`）
3. 创建 `SecurityConfig`：
   - 放行：`/api/auth/**`, `/actuator/health`
   - 保护：`/api/**` 其他所有接口
   - 配置 CORS 允许前端域名
4. 创建 `AuthController`：登录、注册、刷新 Token
5. 配置 `BCryptPasswordEncoder`

## 安全约束

- JWT 密钥从环境变量读取，不硬编码
- Token 过期时间不超过 24 小时
- Refresh Token 和 Access Token 分开
- 密码使用 BCrypt 加密，不使用 MD5/SHA1
- 登录失败有速率限制（防暴力破解）

## 测试

- 单元测试：Token 生成/验证、过期处理
- 集成测试：登录流程、Token 刷新、权限校验
```

### performance-audit（性能审计）

```markdown title=".claude/skills/performance-audit/SKILL.md"
# 性能审计

系统性排查 Spring Boot 项目的性能问题。

## 审计维度

### 数据库层

1. 扫描所有 `@OneToMany`、`@ManyToOne` 关联，检查 fetch 类型
2. 找出缺少 `@EntityGraph` 或 `JOIN FETCH` 的查询
3. 检查分页查询是否使用了正确的索引
4. 检查是否存在不必要的数据库调用（可以用批量操作替代）

### 缓存层

1. 找出高频调用但没有缓存的查询
2. 检查缓存过期策略是否合理
3. 检查缓存穿透/击穿/雪崩的防护

### 连接池

1. 检查 HikariCP 配置（最大连接数、超时时间）
2. 检查是否有连接泄漏（未关闭的连接）

### JVM 层

1. 检查是否有大对象分配（频繁 Full GC）
2. 检查线程池配置是否合理

## 输出格式

按性能影响排序，每个问题附带：

- 问题描述
- 影响范围（影响哪些接口、影响多大 QPS）
- 修复方案（含代码改动）
- 预期收益
```

## Skills 与 ECC 内置 Skills 的协作

自定义 Skills 和 ECC 内置 Skills 可以同时使用：

| 场景            | 推荐组合                                                       |
| --------------- | -------------------------------------------------------------- |
| 创建新 REST API | `/create-api-endpoint`（自定义）+ `springboot-patterns`（ECC） |
| 实现新功能      | `/superpowers:brainstorming` + `/springboot-tdd`（ECC）        |
| 代码审查        | `/service-review`（自定义）+ `java-reviewer`（ECC Agent）      |
| 数据库迁移      | `/flyway-migration`（自定义）+ `database-migrations`（ECC）    |
| 安全加固        | `/spring-security-setup`（自定义）+ `security-review`（ECC）   |
| 性能优化        | `/performance-audit`（自定义）+ CodeGraph 探索                 |

:::tip
自定义 Skills 可以在 SKILL.md 中显式引用 ECC 的 Agent 和 Skill，例如在步骤中写"使用 ECC 的 java-reviewer 审查生成的代码"。这样 Claude Code 会在执行自定义 Skill 时自动调用 ECC 的能力。
:::
