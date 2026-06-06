---
title: Java 场景实战指南
description: Java/Spring Boot 开发实战案例，展示新功能开发、大型重构、遗留项目接管等场景中 ECC、Gstack、Superpowers、CodeGraph、Serena、Spec-Kit、Context7 的深度集成
---

# Java 场景实战指南

本文提供 5 个完整的 Java/Spring Boot 开发实战案例，每个案例包含从需求到上线的完整步骤、具体命令、Prompt 示例和预期输出。案例覆盖 Java 开发中最常见的场景：新功能开发、大型重构、遗留项目接管、性能优化和安全加固。

:::info
本文是 [Java 工具链集成全景](./index) 的实战补充。工作流阶段详解请参考 [集成工作流详解](./integrated-workflow)。
:::

## 场景一：新功能全流程开发（订单模块）

本场景演示从零开发一个 Spring Boot 订单模块的完整流程。模块包含订单创建、状态管理、支付集成和订单查询等核心功能。通过这个场景，你将看到 8 个工具如何在不同阶段协同工作，将一个"实现订单管理"需求转化为高质量的生产代码。

### 预计用时与工具分布

| 阶段     | 预计用时   | 主要工具                            | 产出物                    |
| -------- | ---------- | ----------------------------------- | ------------------------- |
| 分支创建 | 1 分钟     | Git                                 | feature/order-module 分支 |
| 代码探索 | 10-15 分钟 | CodeGraph、Context7                 | 项目结构理解、框架文档    |
| 规格定义 | 20-30 分钟 | Spec-Kit                            | 结构化规格文档            |
| 架构审查 | 10-15 分钟 | Gstack                              | 架构审查报告              |
| TDD 实现 | 2-3 小时   | Superpowers、ECC、CodeGraph、Git    | 通过测试的代码            |
| 审查测试 | 15-20 分钟 | Gstack、Serena、ECC                 | 审查报告、安全扫描        |
| 发布     | 5 分钟     | Gstack                              | PR + 合并                 |

### Step 1：创建功能分支

```bash
git checkout main
git pull origin main
git checkout -b feature/order-module
```

**为什么在这里用 Git：** 在写任何代码之前创建独立分支，是整个工作流的基础。后续所有提交都在这个分支上进行，最终通过 PR 合并回 main。

### Step 2：探索现有代码结构

> 这个 Spring Boot 项目有哪些模块？订单相关的代码已经存在吗？

Claude Code 会调用 CodeGraph 的 `codegraph_explore` 工具，一次性获取项目结构和已有的订单相关代码。对 Java 项目，CodeGraph 能自动识别 Spring 注解（`@RestController`、`@Service`、`@Repository`），输出分层架构的完整视图。

**预期输出：**

- 项目模块划分（单模块 vs 多模块 Maven 项目）
- 已有的 Entity、Repository、Service 和 Controller
- 数据库迁移脚本目录和版本号
- 测试目录结构和基类

### Step 3：查询最新框架文档

> 查询 Spring Boot 3.2 的 @Transactional 最佳实践和 ProblemDetail 错误处理

Context7 确保后续生成的代码使用正确的 Spring Boot 3.x API——比如 `jakarta.*` 命名空间、`ProblemDetail` 响应格式、`@Transactional(readOnly = true)` 优化等。

**预期输出：**

- `@Transactional` 的 propagation 和 isolation 配置建议
- `ProblemDetail` 替代自定义 `ErrorResponse` 的用法
- `@Transactional(readOnly = true)` 在查询方法中的性能优化

### Step 4：编写规格文档

```
> /speckit.specify
> 为订单模块编写规格：
> - 用户可以创建订单（包含多个订单项）
> - 订单支持待支付、已支付、已发货、已完成、已取消五种状态
> - 状态转换有明确的业务规则（如已发货不可取消）
> - 支持按日期范围和状态筛选订单列表
> - 创建订单时校验库存并扣减
```

Spec-Kit 生成结构化规格文档，关注 WHAT + WHY。规格提交到 Git 后成为持久化的项目文档。

**预期输出：** 一份 YAML 格式的规格文档，包含 5+ 个需求条目，每个都有验收标准。

### Step 5：澄清需求

```
> /speckit.clarify
> 澄清订单模块的规格
```

Spec-Kit 通过结构化 Q&A 暴露模糊点：

- 取消已支付的订单是否自动退款？
- 库存扣减使用乐观锁还是悲观锁？
- 订单列表默认分页大小是多少？
- 是否需要幂等性保证（防止重复创建）？

每个回答都会更新规格文档，消除后续实现的歧义。

### Step 6：生成技术方案

```
> /speckit.plan
> 生成 Spring Boot 技术方案
```

Spec-Kit 基于规格生成技术方案，包含 Entity 设计、Repository 接口、Service 层状态机、Controller 路由等。每个技术选择都有理由追溯到规格需求。

### Step 7：架构审查

```
> /plan-eng-review
> 审查订单模块的技术方案，重点关注：
> - 状态机实现方式的选择
> - 事务边界和并发安全
> - 库存扣减的锁策略
```

Gstack 的工程经理视角审查方案的技术风险和可扩展性。

### Step 8：TDD 驱动实现

Superpowers 的 TDD 循环按照 **Entity → Repository → Service → Controller** 的分层顺序逐步实现：

```
1. 🔴 RED    — 先写 OrderEntity 的单元测试
2. 🟢 GREEN  — 实现 Order Entity + OrderStatus 枚举 + 状态转换逻辑
3. 🔵 REFACTOR — 确认测试通过，提交
4. 🔴 RED    — 写 OrderRepositoryTest
5. 🟢 GREEN  — 实现 OrderRepository
6. 🔵 REFACTOR — 确认测试通过，提交
7. 🔴 RED    — 写 OrderServiceTest（Mock Repository 和 ProductService）
8. 🟢 GREEN  — 实现 OrderService（含状态机、库存校验）
9. 🔵 REFACTOR — 提取 PricingStrategy，确认测试通过，提交
10. 🔴 RED   — 写 OrderControllerTest（@WebMvcTest + MockMvc）
11. 🟢 GREEN — 实现 OrderController（REST API + 参数校验）
12. 🔵 REFACTOR — 确认测试通过，提交
```

每完成一个分层，Claude Code 会自动用 ECC 的 `java-reviewer` 审查代码质量。

### Step 9：集成测试

```
> 为订单模块编写集成测试：
> - @SpringBootTest + Testcontainers PostgreSQL
> - 测试完整的创建订单流程（API → Service → Repository → 数据库）
> - 测试库存不足的异常处理
> - 测试状态转换的业务规则
```

集成测试使用 Testcontainers 启动真实的 PostgreSQL 数据库，确保在 CI 环境中也能通过。

### Step 10：安全审查和代码审查

```
> /cso
> 审查订单模块的安全性：
> - SQL 注入风险（检查原生 SQL 查询和 JPQL 拼接）
> - 认证授权（检查订单操作的权限配置）
> - 敏感数据（订单金额、用户信息的处理方式）
```

```
> /review
> 在 feature/order-module 分支上审查代码变更
```

Gstack 的 `/cso` + `/review` 双重审查，确保代码质量和安全性。

### Step 11：发布

```
> /ship
> 运行 mvn verify，确认所有测试通过后推送到远程并创建 PR
```

Gstack 的 `/ship` 自动运行 `mvn verify`（含集成测试），审计测试覆盖率，推送代码并创建 PR。

### 场景一总结

| 阶段     | 使用工具                                    | 产出                                  |
| -------- | ------------------------------------------- | ------------------------------------- |
| 探索     | CodeGraph、Context7                         | 项目结构理解 + 框架文档               |
| 规划     | Spec-Kit、Gstack                            | 规格文档 + 技术方案 + 架构审查        |
| 实现     | Superpowers、ECC、Git                       | Entity + Repository + Service + Controller + 测试 |
| 审查     | Gstack、ECC                                 | 安全审查 + 代码审查通过               |
| 发布     | Gstack                                      | PR 创建并推送                         |

## 场景二：大型重构（单体服务拆分微服务准备）

本场景演示对一个 Spring Boot 单体应用进行重构，为后续拆分微服务做准备。重构目标是：将紧耦合的 Service 层解耦、将共享的 God Class 拆分为职责单一的类、优化 N+1 查询。这个场景展示了 CodeGraph 和 Serena 在语义驱动重构中的核心价值。

### 预计用时与工具分布

| 阶段       | 预计用时   | 主要工具                    | 产出物               |
| ---------- | ---------- | --------------------------- | -------------------- |
| 影响分析   | 15-20 分钟 | CodeGraph                   | 依赖关系图 + 影响范围 |
| 符号分析   | 10-15 分钟 | Serena                      | 类结构概览 + 引用链  |
| 方案设计   | 15-20 分钟 | Gstack                      | 重构方案 + 风险评估  |
| TDD 重构   | 3-4 小时   | Superpowers、Serena、Git    | 重构后的代码 + 测试  |
| 验证审查   | 20-30 分钟 | Gstack、CodeGraph、ECC      | 审查报告 + 回归确认  |

### Step 1：代码影响分析

> 分析 UserService.java 的修改会影响哪些 Service、Controller 和测试？

CodeGraph 的 `codegraph_impact` 从 `UserService` 出发，追踪所有直接和间接依赖关系。对 Java 单体项目，一个 Service 往往被多个 Controller 和其他 Service 调用，影响分析的结果直接决定了重构的范围和风险。

**预期输出：**

- 直接调用 UserService 的 Controller 列表
- 间接依赖 UserService 的其他 Service
- 所有引用 UserService 的测试文件
- 受影响的数据库查询（通过 Repository 间接关联）

### Step 2：符号级依赖追踪

> 哪些地方调用了 UserService.findUserByEmail？如果将此方法移到 UserQueryService 会影响什么？

Serena 的 `find_referencing_symbols` 精确列出所有调用点，包括方法调用、构造函数注入和测试断言。对大型 Java 项目，这比 Grep 搜索更准确——它理解 Java 的类型系统，不会误匹配同名方法。

**预期输出：**

- 所有 `userService.findUserByEmail(...)` 调用点（含行号和文件路径）
- 通过 `@Autowired` 注入 UserService 的类列表
- 测试中 Mock UserService 的地方

### Step 3：类结构概览

> 查看 UserService.java 的符号大纲，有哪些公开方法？哪些方法是查询、哪些是命令？

Serena 的 `get_symbols_overview` 返回类的结构化视图。对重构而言，这一步帮你识别：

- **查询方法**（只读，可以提取到 QueryService）
- **命令方法**（修改状态，保留在主 Service）
- **混合方法**（既有查询又有命令，需要拆分）

### Step 4：重构方案设计

```
> /plan-eng-review
> 审查 UserService 拆分方案：
> 1. 查询方法提取到 UserQueryService（只读事务优化）
> 2. 命令方法保留在 UserCommandService
> 3. 共享的工具方法提取到 UserUtils
> 4. 评估对现有 Controller 和测试的影响
```

Gstack 的架构审查会评估拆分方案的合理性，检查是否存在循环依赖风险。

### Step 5：TDD 驱动重构

Superpowers 的 TDD 规则在重构场景中尤为重要——**重构前先补充缺失的测试**。

```
1. 🔴 RED    — 为现有的 UserService 编写行为测试（确认基线）
2. 🟢 GREEN  — 运行测试确认全部通过（建立安全网）
3. 🔵 REFACTOR — 提交基线测试
4. 🔴 RED    — 创建 UserQueryService 的测试（从 UserServiceTest 复制并调整）
5. 🟢 GREEN  — 实现 UserQueryService，将查询方法从 UserService 迁移
6. 🔵 REFACTOR — 更新所有调用方的 import，确认测试通过，提交
7. 🔴 RED    — 创建 UserCommandService 的测试
8. 🟢 GREEN  — 将命令方法迁移到 UserCommandService
9. 🔵 REFACTOR — 更新调用方，删除 UserService，确认测试通过，提交
```

:::warning
重构过程中每完成一个步骤都要运行 `mvn test` 确认没有回归。Serena 的 `rename_symbol` 和 `move_symbol` 会自动更新 import 和引用，但合并后的逻辑正确性只能靠测试保证。
:::

### Step 6：N+1 查询优化

> 分析 OrderService 中的 N+1 查询问题，优化 fetch 策略

```
> 检查 OrderService.getOrdersWithItems() 的查询性能：
> 1. 是否存在 N+1 查询（检查 @OneToMany 的 fetch 类型）
> 2. 是否可以使用 @EntityGraph 或 JOIN FETCH 优化
> 3. 分页查询是否使用了正确的索引
```

CodeGraph 的调用链追踪 + Serena 的符号分析，帮你精确定位 N+1 问题的根源。

### Step 7：验证重构完整性

```
> /review
> 审查重构变更，确认：
> - 所有旧 UserService 的调用方已更新
> - 没有遗漏的 import 或方法引用
> - 事务边界在拆分后仍然正确
> - 查询方法使用了 @Transactional(readOnly = true)
```

```
> 运行 mvn verify 确认所有单元测试和集成测试通过
```

### 场景二总结

| 阶段     | 使用工具                       | 产出                            |
| -------- | ------------------------------ | ------------------------------- |
| 影响分析 | CodeGraph、Serena              | 依赖图 + 符号引用 + 影响范围    |
| 方案设计 | Gstack                         | 拆分方案 + 风险评估             |
| 重构实现 | Superpowers、Serena、Git       | 拆分后的 Service + 测试         |
| 验证     | Gstack、CodeGraph              | 审查通过 + 回归测试全绿         |
