---
title: Ponytail — 懒惰高级工程师模式
description: Ponytail 让 Claude Code 以"懒惰高级工程师"思维工作，通过 7 级效率阶梯砍掉 80-94% 的过度设计，减少代码量、提升开发速度、降低维护成本
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★☆☆☆☆ |
| 🧪 测试 | ★★★★☆ | ★☆☆☆☆ |
| 📦 产品 | ★★★☆☆ | ★★☆☆☆ |

**🎯 学习产出：** 掌握 Ponytail 懒人高效模式，能独立用效率阶梯砍掉项目中 80% 以上的过度设计代码

**🚀 AI 能力提升：** 代码生成、上下文管理
:::

# Ponytail — 懒惰高级工程师模式

> 他不说话。写一行。能跑。

## 概述

**Ponytail** 是一个开发模式插件，让 Claude Code 化身为那位扎马尾、戴椭圆眼镜、在公司待得比版本控制还久的高级工程师——看一眼五十行代码，不说话，一行替换。

AI 编程助手最大的毛病是什么？**过度设计**。你让它加个日期选择器，它装 flatpickr、写 wrapper 组件、加样式表、还开始讨论时区问题。Ponytail 的回答：

```html
<!-- ponytail: 浏览器原生支持 -->
<input type="date">
```

**核心数据**：减少 80-94% 代码量、3-6 倍速度提升、47-77% 成本节省。

## 核心理念：效率阶梯

Ponytail 遵循 7 级效率阶梯。每遇到一个问题，从第一级开始爬，找到能用的那一级就停：

| 级 | 原则 | 示例 |
|----|------|------|
| 1 | 这东西需要存在吗？ | "加个缓存层" → 先确认数据库查询是否真的是瓶颈 |
| 2 | 标准库有吗？ | `functools.lru_cache` 而不是自建缓存类 |
| 3 | 原生平台能力有吗？ | `<input type="date">` 而不是日期选择库 |
| 4 | 已安装依赖能做吗？ | 用已有的 lodash 而不是再装一个 |
| 5 | 一行能搞定吗？ | 一行解决，不加函数包装 |
| 6 | 只有这步才写代码 | 最小可用实现，不预留扩展点 |
| 7 | 写最少代码 | 如果前 6 级都不行，写刚好够用的代码 |

**关键思维**：这不是研究项目，是肌肉记忆。两级都行？选更高的。

## 安装

在 Claude Code 中执行：

```bash
/plugin marketplace add https://github.com/DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

安装后自动注册 SessionStart hook，每次启动 Claude Code 时自动激活 Ponytail（默认 `full` 强度）。

### 验证安装

装完后重启 Claude Code（新会话），然后检查：

```bash
# 方法一：查看可用命令
/ponytail

# 方法二：查看帮助
/ponytail-help
```

如果看到了强度等级信息或帮助文本，说明安装成功。

:::warning
SessionStart hook 依赖 `node` 在非交互 shell 的 PATH 中。如果你用 Nix、nvm 等版本管理器装 node，hook 可能静默失败——**skills 仍然可用**，只是不会在每次启动时自动注入 Ponytail 模式。可以用 `which node` 在 Claude Code 中确认 node 是否可访问。
:::

## 配置

### 强度等级

| 等级 | 行为 |
|------|------|
| `lite` | 仅建议，不强制——Ponytail 给出简化建议但不强制要求 |
| `full` | 强制执行效率阶梯（默认）——每次代码改动都经过阶梯检查 |
| `ultra` | 极致精简——连注释都省，最短路径到能跑 |

### 切换命令

```bash
/ponytail lite     # 切换到建议模式
/ponytail full     # 切换回强制模式（默认）
/ponytail ultra    # 切换到极致精简模式
```

### 关闭和开启

```bash
/ponytail off      # 关闭 Ponytail
/ponytail full     # 重新开启
```

:::tip
不确定该用哪个等级？从 `full` 开始。如果觉得太严格，降到 `lite`；如果项目需要极致效率，升到 `ultra`。
:::

## 日常使用

### ponytail: 注释约定

Ponytail 的刻意简化用 `ponytail:` 注释标记，格式为"简化说明 + 升级路径"：

```python
# ponytail: 全局锁够用，如果吞吐量成瓶颈再换 per-account 锁
lock = threading.Lock()
```

```javascript
// ponytail: O(n²) 扫描在小数据集下足够，数据超 1000 条再换 Map 索引
function findById(list, id) {
  return list.find(item => item.id === id)
}
```

这种注释有两个作用：
1. **表明意图**：这是刻意简化，不是不知道更好的方案
2. **升级线索**：后续需要优化时，注释直接告诉你该怎么做

### Java 示例

**场景**：给用户接口加缓存。

❌ 过度设计的 AI 会写：

```java
// CacheConfig.java + UserCacheService.java + UserCacheKey.java ...
@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("users");
    }
}

@Service
public class UserCacheService {
    @Autowired
    private UserRepository userRepository;

    @Cacheable(value = "users", key = "#id")
    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
```

✅ Ponytail 方式：

```java
// ponytail: ConcurrentHashMap 够用，分布式需求出来再换 Redis
private final Map<Long, User> userCache = new ConcurrentHashMap<>();

public User getUser(Long id) {
    return userCache.computeIfAbsent(id, userRepository::findByIdOrNull);
}
```

**场景**：表单验证。

❌ 引入 Hibernate Validator + 自定义注解 + 错误消息国际化：

```java
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PhoneValidator.class)
public @interface ValidPhone { ... }

public class CreateOrderRequest {
    @NotBlank @ValidPhone private String phone;
    @Min(1) private int quantity;
}
```

✅ Ponytail 方式：

```java
// ponytail: 参数少直接在 Controller 里校验，校验规则超过 5 个再抽 Validator
public ResponseEntity<?> createOrder(CreateOrderRequest req) {
    if (req.phone == null || !req.phone.matches("\\d{11}")) {
        throw new IllegalArgumentException("手机号格式错误");
    }
    if (req.quantity < 1) {
        throw new IllegalArgumentException("数量最小为 1");
    }
    // ...
}
```

### Vue 示例

**场景**：一个简单的下拉筛选器。

❌ 过度设计的 AI 会写：

```vue
<!-- FilterSelect.vue — 50 行 -->
<script setup>
import { ref, computed, watch } from 'vue'
import { useFilterStore } from '@/stores/filter'

const props = defineProps({
  options: Array,
  modelValue: String,
  placeholder: { type: String, default: '请选择' }
})
const emit = defineEmits(['update:modelValue', 'change'])
const store = useFilterStore()
const localValue = ref(props.modelValue)

watch(() => props.modelValue, (v) => { localValue.value = v })
const filteredOptions = computed(() =>
  props.options.filter(o => o.enabled)
)
function handleChange(v) {
  localValue.value = v
  emit('update:modelValue', v)
  emit('change', v)
  store.setFilter('status', v)
}
</script>
```

✅ Ponytail 方式：

```vue
<!-- ponytail: v-model + 原生 select 够了，需要搜索/多选时再装组件库 -->
<template>
  <select v-model="status" class="border rounded px-2 py-1">
    <option value="">全部</option>
    <option v-for="o in options" :key="o.value" :value="o.value">
      {{ o.label }}
    </option>
  </select>
</template>

<script setup>
import { ref } from 'vue'
const status = ref('')
const props = defineProps({ options: Array })
</script>
```

**场景**：一个"复制到剪贴板"按钮。

❌ 装 `vue-clipboard3` + 写 composable：

```bash
npm install vue-clipboard3
```

```vue
<script setup>
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()
const copy = (text) => toClipboard(text)
</script>
```

✅ Ponytail 方式：

```vue
<!-- ponytail: navigator.clipboard 浏览器原生支持，为 6 行装一个库不值 -->
<script setup>
const copy = (text) => navigator.clipboard.writeText(text)
</script>
```

### React 示例

**场景**：表单提交 loading 状态。

❌ 引入 react-hook-form + zod + @hookform/resolvers：

```bash
npm install react-hook-form zod @hookform/resolvers
```

```tsx
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  title: z.string().min(1, '必填'),
  content: z.string().min(10, '至少 10 个字符')
})

function PostForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      <textarea {...register('content')} />
      {errors.content && <span>{errors.content.message}</span>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '提交中…' : '提交'}
      </button>
    </form>
  )
}
```

✅ Ponytail 方式：

```tsx
// ponytail: 3 个字段用原生 form + useState 够了，
// 字段超 5 个或需要复杂联动再上 react-hook-form
function PostForm() {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const title = fd.get('title'), content = fd.get('content')
    const errs = {}
    if (!title) errs.title = '必填'
    if (!content || content.length < 10) errs.content = '至少 10 个字符'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" />
      {errors.title && <span>{errors.title}</span>}
      <textarea name="content" />
      {errors.content && <span>{errors.content}</span>}
      <button type="submit" disabled={loading}>
        {loading ? '提交中…' : '提交'}
      </button>
    </form>
  )
}
```

**场景**：数据获取。

❌ 引入 TanStack Query + axios：

```tsx
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => axios.get('/api/users').then(r => r.data)
  })
  // ...
}
```

✅ Ponytail 方式：

```tsx
// ponytail: fetch + useState 够用，缓存/重试/分页需求出现再上 TanStack Query
function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>加载中…</div>
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

### 核心命令

| 命令 | 用途 |
|------|------|
| `/ponytail-review` | 审查代码，标记过度抽象、多余依赖、"单实现接口" |
| `/ponytail-audit` | 扫描项目，列出从未调用的函数、从未导入的模块、可合并的文件 |
| `/ponytail-debt` | 管理技术债——记录简化决策和升级条件 |

### 快速上手：第一次使用

安装 Ponytail 后，它默认以 `full` 强度在每个新会话自动激活。你不需要额外操作——**直接开始写需求，Ponytail 会自动用效率阶梯过滤输出**。

用以下方式验证它已生效：

**验证 1：确认模式已激活**

新会话启动时，你会看到系统提示：
```text
PONYTAIL MODE ACTIVE — level: full
```

如果没看到，手动激活：
```bash
/ponytail full
```

**验证 2：看它如何砍掉过度设计**

随便提一个需求，观察 Ponytail 的反应：

```text
> 给用户列表接口加个缓存
```

不用 Ponytail 的 Claude Code 可能会装 Redis、写 CacheManager、加过期策略。Ponytail 模式下的 Claude Code 会直接：

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_users():
    # ponytail: lru_cache 够用，需要分布式缓存再换 Redis
    return db.query("SELECT * FROM users")
```

一行装饰器，没有新依赖。这就是 Ponytail 在 `full` 模式下的默认行为——**你不需要每次都说"简化"或"用最小方案"，它已经默认这么做了**。

**验证 3：用审查命令检查现有代码**

如果你有现成项目，直接跑审查看看 Ponytail 发现了什么：

```bash
/ponytail-review     # 审查当前改动有没有过度设计
/ponytail-audit      # 扫描整个项目找冗余代码和依赖
```

第一次跑 `/ponytail-audit` 通常会让你惊讶——原来有这么多东西可以删。

:::tip
**关键心智转变**：用了 Ponytail 之后，你不再需要说"用最简单的方式"、"不要过度设计"、"一行搞定"——这些已经是默认行为。你只需要正常提需求，Ponytail 负责把 AI 的过度设计冲动按下去。
:::

### 日常操作速查

| 你要做什么 | 你输入什么 | Ponytail 做什么 |
|-----------|-----------|----------------|
| 写新功能 | 正常提需求，如 `> 加个导出 CSV 的功能` | 自动走阶梯，用原生能力而非装库 |
| 审查当前改动 | `/ponytail-review` | 列出过度抽象、多余依赖、可简化的地方 |
| 扫描全项目冗余 | `/ponytail-audit` | 列出死代码、未用依赖、可合并文件 |
| 记录技术债 | `/ponytail-debt` | 汇总所有 `ponytail:` 注释，标记升级条件 |
| 暂时关闭 | `/ponytail off` | 恢复普通 Claude Code 行为 |
| 重新开启 | `/ponytail full` | 恢复阶梯过滤（默认强度） |
| 切换到建议模式 | `/ponytail lite` | 只建议不强制，你自己决定 |
| 切换到极致精简 | `/ponytail ultra` | 连注释都省，最短路径到能跑 |

---

## 全部指令详解

### `/ponytail` — 查看当前状态

不带任何参数，直接看 Ponytail 当前是否激活、什么强度：

```bash
/ponytail
```

输出示例：

```text
PONYTAIL MODE ACTIVE — level: full
```

**什么时候用**：不确定 Ponytail 开着没、什么等级——跑一下确认。新会话开始也会自动提示。

### `/ponytail lite` — 建议模式

只给建议，不强制。Ponytail 会在每次代码改动后提一句"这儿可以更简单"，但不会阻止你写完整实现。

```bash
/ponytail lite
```

**适用场景**：

- 学习 Ponytail 哲学，想看它会给什么建议但不希望被限制
- 代码审查时想得到简化思路，但不确定是否要实施
- 和团队成员协作，对方不习惯 Ponytail 的极简风格

**行为差异**：

```text
full 模式：
  > 给搜索加个缓存
  → @lru_cache(maxsize=128)  # 直接这么写，不解释

lite 模式：
  > 给搜索加个缓存
  → 方案一：@lru_cache(maxsize=128)，一行搞定
    方案二：Redis + CacheManager，支持分布式
    建议：方案一够用，需要分布式时再升级
    你选哪个？
```

### `/ponytail full` — 强制模式（默认）

安装后的默认模式。每次代码改动都经过效率阶梯检查，只出结果不啰嗦。

```bash
/ponytail full
```

**适用场景**：

- 日常开发（默认就是这个，通常不需要手动切）
- 从 `lite` 或 `off` 切换回来
- 确认自己在用默认强度

### `/ponytail ultra` — 极致精简

连 `ponytail:` 注释都省了。只出代码，不解释为什么删、什么时候加回来。

```bash
/ponytail ultra
```

**适用场景**：

- 你已经非常熟悉 Ponytail 哲学，不需要解释
- 快速原型阶段，跑通就行
- "代码库得罪你了"——大量冗余代码需要快速清理

**行为差异**：

```text
full 模式：
  // ponytail: ConcurrentHashMap 够用，需要分布式时再换 Redis
  private final Map<Long, User> cache = new ConcurrentHashMap<>();

ultra 模式：
  private final Map<Long, User> cache = new ConcurrentHashMap<>();
  // 没有注释。不解释。
```

:::warning
`ultra` 模式下 Ponytail 不写注释。后续你或同事可能不知道"为什么这里是 ConcurrentHashMap 而不是 Redis"——升级路径会丢失。**长期维护的项目用 `full`，快速原型用 `ultra`。**
:::

### `/ponytail off` — 关闭

彻底关闭 Ponytail，恢复普通 Claude Code 行为。

```bash
/ponytail off
```

**什么时候关**：

- 写加密/认证代码——安全逻辑不能简化
- 写金融计算——精度不能妥协
- 需要完整的架构设计文档
- AI 过度简化导致功能缺失，你怀疑是 Ponytail 压太狠

**重新开启**：

```bash
/ponytail full    # 回到默认强度
/ponytail lite    # 回到建议模式
```

### `/ponytail-help` — 查看帮助

列出所有可用命令和简短说明：

```bash
/ponytail-help
```

输出示例：

```text
Ponytail — the lazy senior dev who ships less code

Commands:
  /ponytail              Show current level
  /ponytail lite         Suggest only, don't force
  /ponytail full         Enforce the ladder (default)
  /ponytail ultra        Extreme minimalism
  /ponytail off          Turn off ponytail
  /ponytail-review       Review current diff for over-engineering
  /ponytail-audit        Audit whole repo for over-engineering
  /ponytail-debt         Harvest ponytail: shortcuts into a ledger
  /ponytail-gain         Show measured impact scoreboard
  /ponytail-help         Show this help
```

**什么时候用**：忘了某个命令的名字或参数——比翻文档快。

---

## `/ponytail-review` — 审查当前改动

### 概述

聚焦 **git diff**，逐行扫描是否有过度设计。输出一行一发现，而不是一段文字。

### 命令

```bash
/ponytail-review
```

### 输出解读

```text
L42: yagni: factory with one product. Inline it until a second one exists.
L15: native: moment.js imported for one format call. Intl.DateTimeFormat, 0 deps.
L78-95: delete: retry wrapper around an idempotent local call. Nothing replaces it.

net: -47 lines possible.
```

每一行的格式：`位置: 类别: 描述`。

**类别速查**：

| 类别 | 含义 | 示例 |
|------|------|------|
| `yagni` | 当前只有一个使用者的抽象 | 接口只有一个实现类、工厂只产一个产品 |
| `native` | 有原生 API 可以替代 | moment.js → Intl.DateTimeFormat |
| `delete` | 可以安全删除的代码 | 死代码、没用到的导入、永远不会触发的分支 |
| `stdlib` | 标准库能替代 | 自定义排序 → `Array.sort()` |
| `dependency` | 可以去掉的依赖 | 为了一行用的库 |
| `merge` | 可以合并的文件 | 两个文件功能重叠 |

### 实战流程

```text
> /ponytail-review

输出：
  L42: yagni: factory with one product. Inline it until a second one exists.
  L15: native: moment.js imported for one format call. Intl.DateTimeFormat, 0 deps.

> 帮我处理这两条

Ponytail 自动：
  1. 删掉 UserServiceFactory，直接 new UserService()
  2. 删掉 moment 的 import，改用 Intl.DateTimeFormat
  3. npm run test → 全绿
```

### 和 `/code-review` 的区别

| | `/ponytail-review` | `/code-review` |
|---|---|---|
| 角度 | 有没有过度设计 | 有没有 bug |
| 输出 | 一行一发现，位置:类别:描述 | 分级报告：🔴严重/🟡建议/🟢表扬 |
| 检查范围 | diff | diff |
| 关注点 | 抽象层级、依赖、代码量 | 安全、正确性、性能、可维护 |

**组合使用**：先 `/code-review` 找 bug → 修 bug → 再 `/ponytail-review` 砍冗余 → 两轮下来代码又对又简。

---

## `/ponytail-audit` — 全项目冗余扫描

### 概述

和 `/ponytail-review` 的区别：`review` 只看 diff，`audit` 扫描整个项目。适合接手老项目、定期清理。

### 命令

```bash
/ponytail-audit
```

### 输出解读

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

**三类发现**：

| 类别 | 含义 | 处理方式 |
|------|------|---------|
| Dead code | 定义了但从未调用的函数/变量/导入 | 直接删除 |
| Unused dependencies | 可以去掉或用原生 API 替代的依赖 | npm uninstall 或替换 |
| Merge candidates | 两个文件功能重叠，可以合并 | 确认后合并 |

### 实战流程

```bash
# 第一步：扫描
/ponytail-audit

# 第二步：确认（对每条结果追问）
> formatCurrency 具体在哪些地方被引用？确认一下是否真的没有调用方
> uuid 替换成 crypto.randomUUID() 需要改哪些地方？帮我列出来
> users.ts 和 userAdmin.ts 合并后会不会造成循环依赖？

# 第三步：批量处理
> 删掉 formatCurrency 和 useDebounce.ts
> 把 uuid 替换成 crypto.randomUUID()
> 合并 users.ts 和 userAdmin.ts，注意避免循环依赖
```

### 定期审计策略

```bash
# 建议：每次大版本发布前跑一次
/schedule every friday at 5pm,
  run /ponytail-audit, collect findings to docs/reports/audit-YYYY-MM-DD.md,
  open issues for dead code > 50 lines
```

---

## `/ponytail-debt` — 技术债账本

### 概述

代码里的每一个 `ponytail:` 注释都是一条"刻意的简化决策"——知道更好的方案但选择不做。`/ponytail-debt` 把它们汇总成一个可追踪的账本。

### 命令

```bash
/ponytail-debt
```

### 输出解读

```text
📒 Ponytail Debt Ledger

api/UserController.java:
  L34: 全局锁够用，如果吞吐量成瓶颈再换 per-account 锁
  L67: ConcurrentHashMap 缓存，如果需要分布式再换 Redis

frontend/SearchInput.vue:
  L12: 内联 setTimeout 防抖，需要 loading/错误/取消时再换 useDebounce

utils/DateFormatter.java:
  L23: O(n²) 日期范围扫描，数据超 5000 条再换 TreeMap 索引

Summary:
  4 条技术债，0 条过期（升级条件已触发），2 条超过 3 个月
```

**每条记录包含**：

| 字段 | 含义 |
|------|------|
| 文件:行号 | 简化代码的位置 |
| 简化说明 | 做了什么简化 |
| 升级条件 | 什么时候该升级 |
| 年龄 | 这条债欠了多久了 |

### 手动添加技术债

不是所有技术债都有 `ponytail:` 注释——有些是架构层面的决策。可以手动加：

```text
> 记录一条技术债：所有 Service 用 synchronized 做并发控制，
> 如果以后同一行数据有多个写入方，需要升级到分布式锁。
> 关联文件：OrderService.java, UserService.java
```

### 定期审查

```bash
# 每月 1 号：检查技术债账本，清理过期的
/schedule every month on the 1st at 9am,
  run /ponytail-debt, flag any debt older than 6 months,
  check if any upgrade condition has been met,
  open issues for debt that needs to be addressed
```

---

## `/ponytail-gain` — 效率收益报告

### 概述

查看 Ponytail 帮你省了多少代码、多少依赖、多少时间。基于历史数据量化 Ponytail 的实际效果。

### 命令

```bash
/ponytail-gain
```

### 输出解读

```text
📊 Ponytail Impact Report — 最近 30 天

代码量：
  已阻止过度设计：47 次
  累计少写代码：~1,230 行
  少装的依赖：12 个

效率阶梯命中分布：
  L1（这东西不需要）：   8 次 (17%)  ← 砍需求
  L2（标准库有）：      12 次 (26%)  ← 用内置
  L3（原生平台有）：     10 次 (21%)  ← 用平台
  L4（已安装依赖有）：    6 次 (13%)  ← 复用
  L5（一行搞定）：       7 次 (15%)  ← 最简
  L6（最少代码）：       4 次 (8%)

最常被拦住的依赖：
  moment.js      4 次 → Intl.DateTimeFormat
  lodash         3 次 → 原生 Array/Object 方法
  axios          2 次 → fetch
  echarts        2 次 → HTML <table>

📈 趋势：上周单次会话平均拦截 3.2 次，本周 4.1 次（↑28%）
  说明 Ponytail 在越来越熟悉你的代码风格。
```

### 查看历史数据

```bash
/ponytail-gain --history
```

输出最近 10 次会话的每次收益，按日期排列——看趋势是上升还是平稳。

### 实战用法

```text
# 周一早会，给团队看数据
> /ponytail-gain
> "上周 Ponytail 帮我们少写了 230 行代码、少装了 3 个依赖。
>  最常被拦的是 moment.js（4 次）——建议大家之后直接用 Intl.DateTimeFormat。"

# 月底复盘
> /ponytail-gain --history
> "这个月累计减少 ~1,200 行代码，平均每天挡 2 个不必要的依赖。"
```

---

## 高级配置

### 环境变量：设置默认模式

如果你希望每个新会话自动用某个强度，不需要每次手动切：

```bash
# 加到 ~/.bashrc 或 ~/.zshrc
export PONYTAIL_DEFAULT_MODE=ultra
```

| 值 | 效果 |
|----|------|
| `lite` | 新会话默认建议模式 |
| `full` | 新会话默认强制模式（不设时的默认值） |
| `ultra` | 新会话默认极致精简 |
| `off` | 新会话默认关闭 Ponytail |

**什么时候用**：

- **全团队统一**：在团队的开发环境初始化脚本里设 `PONYTAIL_DEFAULT_MODE=full`，保证每个人都用同样的强度
- **个人偏好**：你喜欢极致精简 → `ultra`，你只想听建议 → `lite`
- **临时关闭**：不要用环境变量关——在会话里 `/ponytail off` 更灵活

### 配置文件

Windows：`%APPDATA%\ponytail\config.json`
macOS/Linux：`~/.config/ponytail/config.json`

```json
{
  "defaultMode": "full"
}
```

**优先级**：环境变量 `PONYTAIL_DEFAULT_MODE` > 配置文件 `defaultMode` > 内置默认值 `full`。

### 更新

两种方式保持 Ponytail 版本最新：

**自动更新（推荐）**：

```bash
# 打开插件面板 → 找到 ponytail → 启用 Auto-update
/plugin
```

在 Marketplace 里找到 ponytail，打开 Auto-update。之后每次启动 Claude Code 时自动拉最新版本（有新版本时提示 `/reload-plugins`）。

**手动更新**：

```bash
/plugin marketplace update ponytail
/reload-plugins
```

### 卸载

```bash
# Claude Code
/plugin remove ponytail

# 清理残留（配置文件、模式标记、状态栏条目）
node ~/.claude/plugins/cache/claude-plugins-official/ponytail/*/scripts/uninstall.js
```

---

## 在其他编辑器中使用

Ponytail 不仅能在 Claude Code 中用，大部分 AI 编码工具都有适配：

| 编辑器 | 安装方式 | 命令前缀 |
|--------|---------|---------|
| **Claude Code** | `/plugin install ponytail@ponytail` | `/ponytail` |
| **Codex** | `codex plugin install ponytail@ponytail` | `@ponytail`（注意用 `@` 不是 `/`） |
| **Gemini CLI** | `gemini extensions install https://github.com/DietrichGebert/ponytail` | `/ponytail` |
| **Copilot CLI** | `copilot plugin install ponytail@ponytail` | `/ponytail:ponytail` |
| **Cursor / Windsurf / Aider** | 无需安装，手动加到 rules | 无命令，纯规则模式 |

### 无命令模式的编辑器（Cursor / Windsurf / Aider / Cline）

这些编辑器不支持插件 slash 命令，但可以手动把 Ponytail 的效率阶梯规则加到项目规则中。

在项目根目录创建 `.cursorrules` 或 `.windsurfrules`：

```text
# Ponytail 规则（手动版）

你是一个懒惰的高级工程师。写代码前先爬效率阶梯：

1. 这东西需要存在吗？不需要就跳过。
2. 标准库有吗？用标准库。
3. 原生平台 API 有吗？用原生 API。
4. 已安装的依赖有吗？复用。
5. 一行能搞定吗？一行搞定。
6. 只有这步才写最少代码。

禁止：
- 为一个实现写接口
- 为一个产品写工厂
- 为一个固定值写配置
- 为"以后可能需要"写代码

简化用 `ponytail:` 注释标记，格式：
// ponytail: 做了什么简化，升级条件是什么
```

把这段贴到项目根目录的规则文件里，效果接近插件模式（但没有 `/ponytail-review` 等审查命令）。

---

## 安全护栏

Ponytail 永远不会简化以下内容——在任何模式下（lite/full/ultra）都不会碰：

| 保护项 | 示例 | 为什么 |
|--------|------|--------|
| **输入验证** | 用户输入的校验和清洗 | 安全边界不能省 |
| **错误处理** | 防止数据丢失的 try-catch | 数据丢了比代码多了严重 100 倍 |
| **安全措施** | 加密、认证、授权逻辑 | 安全不能妥协 |
| **无障碍** | aria-label、键盘导航 | 基本可用性 |

```text
❌ Ponytail 不会建议："把密码哈希去掉，明文存就完了"
❌ Ponytail 不会建议："删掉 SQL 参数化，直接拼字符串"
❌ Ponytail 不会建议："异常直接吞掉，不用处理"

这些是信任边界——Ponytail 设计之初就写死了不能碰。
```

---

## 实战场景一：日常开发——砍掉过度设计

### 场景

你在开发一个 SaaS 项目，需求是"给后台加数据统计面板"。

### 你怎么操作（对话流程）

**第一步：确认 Ponytail 已激活**

```bash
/ponytail
```
看到 `PONYTAIL MODE ACTIVE — level: full` 就可以开始了。

**第二步：提需求**

在 Claude Code 中直接说：

```text
> 后台管理需要加一个数据统计面板，展示最近 7 天的新增用户和活跃用户数。
> 运维人员每周一看，不需要图表交互。
```

关键：**多说了后半句"运维人员每周一看，不需要图表交互"**。这给了 Ponytail 足够信息在阶梯第一级就砍掉 ECharts。

**第三步：看 Ponytail 怎么回应**

### 不用 Ponytail 的 AI 会怎么做

1. 引入 ECharts/Chart.js 图表库
2. 写 DashboardLayout 组件、ChartContainer 组件、DataFetcher hook
3. 设计数据聚合层、缓存策略、时间范围选择器
4. 加 loading skeleton、空状态、错误边界

**结果**：200+ 行代码，3 个新依赖，1 天工作量。

### Ponytail 方式

**第一步：质疑需求**

```
> 数据统计面板真的需要实时图表吗？
> 先确认：用户是谁？多久看一次？是否需要交互式筛选？
```

假设答案是"运维人员每周看一下最近 7 天新增用户数"。

**第二步：走阶梯**

1. 这东西需要存在吗？→ 需要，运维确实要看
2. 标准库有吗？→ 没有直接的"仪表盘"标准库
3. 原生平台能力有吗？→ HTML `<table>` 就能展示数字
4. 已安装依赖能做吗？→ 项目已有 Tailwind CSS，可以直接用
5. 一行能搞定吗？→ 后端返回 JSON，前端 `<pre>` 格式化输出

**第三步：最简实现**

```html
<!-- ponytail: 运维每周看一次的数据，<table> 够用，
     如果后续需要交互式图表再引入 Chart.js -->
<table class="min-w-full divide-y divide-gray-200">
  <thead>
    <tr>
      <th>日期</th>
      <th>新增用户</th>
      <th>活跃用户</th>
    </tr>
  </thead>
  <tbody>
    {stats.map(row => (
      <tr key={row.date}>
        <td>{row.date}</td>
        <td>{row.newUsers}</td>
        <td>{row.activeUsers}</td>
      </tr>
    ))}
  </tbody>
</table>
```

**第四步：工具链配合（在 Superpowers 工作流中）**

| 阶段 | Ponytail 的作用 |
|------|----------------|
| 头脑风暴 | 砍需求——"真的需要交互式图表吗？" |
| 实现 | 阶梯筛选——`<table>` 而不是图表库 |
| 审查 | `/ponytail-review` 验证没有过度设计 |

**结果**：20 行代码，0 个新依赖，30 分钟完成。运维看了一眼说"够用，谢谢"。

## 实战场景二：代码审查——精简审计

### 场景

你接手一个运行了半年的项目，感觉里面有很多死代码。或者你要审查同事的 PR，怀疑引入了不必要的抽象。

### 你怎么操作（对话流程）

**第一步：全项目冗余扫描**

在 Claude Code 中输入：

```bash
/ponytail-audit
```

Ponytail 会自动扫描当前项目，逐文件分析。根据项目大小，通常 10-30 秒完成。输出类似：

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

**第二步：针对结果显示更多信息**

看到可疑条目后，你可以追问：

```text
> formatCurrency 具体在哪些地方被引用？确认一下是否真的没有调用方
> moment 替换成 Intl.DateTimeFormat 需要改哪些地方？帮我列出来
```

Ponytail 模式下的 Claude Code 会给出精确的修改方案，不会建议"先建个工具函数封装一下"。

**第三步：审查当前改动（PR 场景）**

如果你在审查 PR，切到对应分支后：

```bash
/ponytail-review
```

Ponytail 聚焦 diff，输出一行一发现：

```text
L42: yagni: factory with one product. Inline it until a second one exists.
L15: native: moment.js imported for one format call. Intl.DateTimeFormat, 0 deps.
L78-95: delete: retry wrapper around an idempotent local call. Nothing replaces it.

net: -47 lines possible.
```

**第四步：处理发现的问题**

你可以直接用自然语言让 Claude Code 处理：

```text
> 把 audit 发现的 moment 替换成 Intl.DateTimeFormat
> 合并 users.ts 和 userAdmin.ts
> 删除 useDebounce.ts，改用 lodash.debounce
```

Ponytail 会确保替换方案也是最简的——不会在替换 moment 的时候顺手"优化"成 dayjs。

**第五步：记录无法立即处理的技术债**

```bash
/ponytail-debt
```

Ponytail 会汇总代码中所有 `ponytail:` 注释，帮你把刻意推迟的决策写进一个可追踪的账本。你也可以手动添加条目：

```text
> 记录一条技术债：queryCache 目前用 Map 做内存缓存，日活超 1000 后需要迁移到 Redis
```

**审查原则**：

- 不要因为"将来可能需要"保留代码——YAGNI
- 删除代码不是危险行为，保留死代码才是
- 每条技术债都要写清楚"什么时候升级"，否则就是永远的"以后再说"

## 实战场景三：端到端——从需求到交付

### 场景

需求："搜索接口太慢了，加个缓存吧。"

### 你怎么操作（对话流程）

**第 1 步：先测量，别急着加缓存**

Ponytail 模式下的 Claude Code 会让你先验证，而不是直接动手。但你可以更主动——在提需求之前自己先测：

```bash
# 直接在 Claude Code 终端里跑
> time curl -s "http://localhost:3000/api/search?q=test"

# 输出: 0.15s — 根本不慢
```

然后在对话中说：

```text
> 搜索接口实际只花了 0.15s，瓶颈可能是数据库连接池。帮我检查一下连接池配置。
```

Ponytail 在第一级就拦住了缓存需求：**确认瓶颈是连接池，不是搜索本身**。改一个连接数配置就解决了，缓存根本不需要。

---

换个场景：假设测量后发现搜索确实慢（2.3s），真的需要缓存。

**第 1 步：让 Ponytail 设计方案**

```text
> 搜索接口 /api/search 目前 2.3s，帮我加缓存。单机部署，数据量不到 1 万条。
```

不提"用什么方案"——让 Ponytail 自己爬阶梯。

**第 2 步：看 Ponytail 的回应**

Ponytail 模式下的 Claude Code 会自动走阶梯：

| 级 | 检查 | 结论 |
|----|------|------|
| 1 | 需要存在吗？ | ✅ 确认瓶颈：2.3s 不可接受 |
| 2 | 标准库有吗？ | ✅ Python `functools.lru_cache` |
| 3 | 原生能力有吗？ | N/A |
| 4 | 已安装依赖？ | N/A |
| 5 | 一行能搞定？ | ✅ 装饰器一行即可 |

然后直接给出：

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def search(query: str) -> list[dict]:
    # ponytail: lru_cache 够用，如果需要分布式缓存再换 Redis
    return db.execute("SELECT * FROM items WHERE title LIKE ?", (f"%{query}%",))
```

**第 3 步：审查 + 记录技术债**

改完后跑审查确认没有多余改动：

```bash
/ponytail-review
```

确认输出是 `Lean already. Ship.` 或只有少量可接受条目。然后记录技术债：

```bash
/ponytail-debt
```

Ponytail 会自动抓取刚才加的 `ponytail:` 注释生成条目。

**第 4 步：三个月后回头看**

数据量涨到 8 万条，缓存命中率仍 > 85%。那条"分布式需求出来再换 Redis"的技术债从未触发——**你省下了 200 行 Redis 集成代码的编写、测试、维护成本**。

## 最佳实践

### 什么时候用 Ponytail

| 场景 | 适合 | 不适合 |
|------|------|--------|
| 新功能开发 | ✅ 默认开启 | — |
| Bug 修复 | ✅ 找最简修复方案 | — |
| 代码审查 | ✅ `/ponytail-review` | — |
| 重构 | ✅ 先删再改 | — |
| 安全敏感代码 | — | ❌ 加密逻辑不能简化 |
| 金融计算 | — | ❌ 精度不能妥协 |
| 复杂算法 | — | ⚠️ 先验证正确性，再简化 |

### Ponytail 与 Superpowers/ECC 的关系

Ponytail 不是替代 Superpowers 或 ECC，而是**叠加一层效率过滤**：

```text
Superpowers 工作流 + Ponytail:

头脑风暴 →  Ponytail 砍掉不必要的需求
  ↓
TDD     →  Ponytail 确保实现是最简方案
  ↓
审查    →  /ponytail-review 双重检查（设计 + 质量）
  ↓
验证    →  确认最简方案确实能跑
```

Ponytail 覆盖"效率维度"（够不够简），Superpowers 覆盖"纪律维度"（对不对、有没有测）。

## 常见问题

### Ponytail 会让 Claude Code 变"笨"吗？

不会。Ponytail 影响的是**产出策略**而非**理解能力**。Claude Code 仍然理解你的需求，只是会选择最简方案。如果最简方案不够，你可以说"我需要完整实现"——Ponytail 不会阻止你。

### 什么时候该关闭 Ponytail？

- 写安全相关代码（加密、认证）时
- 写金融/计费逻辑时
- 需要完整架构设计文档时
- AI 过度简化导致功能缺失时

关掉很简单：`/ponytail off`，完成后 `/ponytail full` 重新开启。

### full 和 ultra 有什么区别？

`full` 仍然会写注释和 `ponytail:` 标记，`ultra` 连这些都省——只出代码，不解释。日常开发用 `full` 就够了，`ultra` 适合你已经很熟悉 Ponytail 哲学后的快速迭代。

---

## 基准对比示例

以下示例来自 Ponytail 基准测试的**真实模型输出**——同一个任务，同一个模型（Claude Haiku 4.5, temperature 1），唯一的区别是有没有启用 Ponytail。

> 复现命令：`npx promptfoo@latest eval -c benchmarks/promptfooconfig.yaml`

### CSV 求和

**任务**："写一个函数，计算 CSV 字符串中某列的总和。"

**不用 Ponytail**（~45 行）：

```python
import csv
import io
from typing import Optional

class CSVSumCalculator:
    """A calculator for summing numeric columns in CSV data."""
    
    def __init__(self, csv_string: str):
        self.csv_string = csv_string.strip()
        self._reader = None
    
    @property
    def reader(self):
        if self._reader is None:
            self._reader = csv.reader(io.StringIO(self.csv_string))
        return self._reader
    
    def has_header(self) -> bool:
        """Detect if the CSV has a header row."""
        rows = list(csv.reader(io.StringIO(self.csv_string)))
        if not rows:
            return False
        return any(not self._is_numeric(cell) for cell in rows[0])
    
    @staticmethod
    def _is_numeric(value: str) -> bool:
        try:
            float(value)
            return True
        except ValueError:
            return False
    
    def sum_column(self, column_index: int, has_header: Optional[bool] = None) -> float:
        """Sum values in a column by index."""
        if has_header is None:
            has_header = self.has_header()
        
        total = 0.0
        rows = list(self.reader)
        start = 1 if has_header else 0
        
        for row in rows[start:]:
            if column_index < len(row):
                try:
                    total += float(row[column_index])
                except (ValueError, IndexError):
                    pass
        return total
```

**用 Ponytail**（3 行）：

```python
# ponytail: csv + sum 够用，需要类型推断/跳过空行时再加逻辑
def csv_sum(csv_str, col=0):
    return sum(float(r[col]) for r in csv.reader(io.StringIO(csv_str)) if r)
```

**结果**：45 → 3 行代码，同一个模型，同一个提示词。

---

### 防抖

**任务**："给搜索输入框加防抖。"

**不用 Ponytail**（116 行）：

```javascript
// debounce 工具函数
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// 基础用法
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', debounce(async (e) => {
  const query = e.target.value;
  const res = await fetch(`/api/search?q=${query}`);
  const data = await res.json();
  renderResults(data);
}, 300));

// 增强版：loading 状态 + 错误处理
searchInput.addEventListener('input', debounce(async (e) => {
  const query = e.target.value.trim();
  if (!query) return;
  
  const resultsDiv = document.getElementById('results');
  const loadingDiv = document.getElementById('loading');
  
  resultsDiv.innerHTML = '';
  loadingDiv.style.display = 'block';
  
  try {
    const res = await fetch(`/api/search?q=${query}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderResults(data);
  } catch (err) {
    resultsDiv.innerHTML = `<p class="error">搜索失败: ${err.message}</p>`;
  } finally {
    loadingDiv.style.display = 'none';
  }
}, 300));

// 高级版：immediate + cancel
function advancedDebounce(func, delay, options = {}) {
  let timeoutId, lastArgs;
  const { immediate = false } = options;
  
  const debounced = function (...args) {
    lastArgs = args;
    const callNow = immediate && !timeoutId;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) func.apply(this, lastArgs);
    }, delay);
    if (callNow) func.apply(this, args);
  };
  
  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
  };
  
  return debounced;
}
```

**用 Ponytail**（10 行）：

```javascript
// ponytail: 内联 setTimeout 够了，需要 loading/错误/取消时再加
document.querySelector('input[type="search"]').addEventListener('input', (e) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    fetch(`/api/search?q=${e.target.value}`)
      .then(r => r.json())
      .then(data => console.log(data)) // 替换为实际的渲染函数
  }, 300)
})
```

**结果**：116 → 10 行。跳过：工具函数、类包装、配置对象。

---

### 深拷贝

**任务**："深拷贝这个对象。"

**不用 Ponytail**（2 种方案）：

```bash
npm install lodash
```

```javascript
import cloneDeep from 'lodash/cloneDeep'
const copy = cloneDeep(original)
```

或者常见的"脆弱 hack"：

```javascript
const copy = JSON.parse(JSON.stringify(original))
// 问题：丢失 Date、undefined、Map、Set、循环引用、函数
```

**用 Ponytail**（1 行）：

```javascript
// ponytail: structuredClone 原生支持，所有浏览器/Node 17+ 都可用
const copy = structuredClone(original)
```

**结果**：1 个依赖（或脆弱 hack）→ 1 个内置 API。`structuredClone` 支持 Date、Map、Set、ArrayBuffer、RegExp、循环引用——这些 `JSON.parse/stringify` 都会静默丢失。所有浏览器 2022+、Node.js 17+ 都支持。

---

### 邮箱验证

**任务**："写一个 Python 函数验证邮箱地址。"

**不用 Ponytail**（75 行）：

```python
import re
from email_validator import validate_email, EmailNotValidError

# 方案一：简单正则
def validate_email_simple(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

# 方案二：高级验证
def validate_email_advanced(email: str) -> tuple[bool, str]:
    """返回 (是否合法, 错误信息)"""
    if len(email) > 254:
        return False, "邮箱总长度不能超过 254 个字符"
    
    local_part = email.split('@')[0] if '@' in email else email
    if len(local_part) > 64:
        return False, "本地部分不能超过 64 个字符"
    if local_part.startswith('.') or local_part.endswith('.'):
        return False, "本地部分不能以点开头或结尾"
    if '..' in local_part:
        return False, "本地部分不能包含连续的点"
    
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        return False, "邮箱格式不正确"
    
    return True, ""

# 方案三：用库
def validate_email_library(email: str) -> bool:
    try:
        validate_email(email)
        return True
    except EmailNotValidError:
        return False

# 对比表
"""
方法          | 优点           | 缺点
简单正则      | 快、无依赖     | 漏掉很多非法情况
高级验证      | 更严格         | 代码复杂、仍不够全面
email-validator | 最准确       | 需要额外依赖
"""

# 测试用例
test_emails = [
    "user@example.com",
    "invalid-email",
    "user@domain..com",
    "a" * 100 + "@example.com"
]
```

**用 Ponytail**（3 行）：

```python
# ponytail: 一行正则挡住 99% 的 typo，需要 RFC 5322 解析/DNS 检查时再加
import re
def is_valid_email(email: str) -> bool:
    return bool(re.match(r'^[^@]+@[^@]+\.[^@]+$', email))
```

**结果**：75 → 3 行。挡住"手滑打错了"的 99% 情况。

---

### 数组分组

**任务**："按某个字段把对象数组分组。"

**不用 Ponytail**（2 种方案）：

```bash
npm install lodash
```

```javascript
import groupBy from 'lodash/groupBy'
const grouped = groupBy(orders, 'status')
// { pending: [...], shipped: [...], delivered: [...] }
```

或手写 reduce：

```javascript
const grouped = orders.reduce((acc, order) => {
  (acc[order.status] ??= []).push(order)
  return acc
}, {})
```

**用 Ponytail**（1 行）：

```javascript
// ponytail: Object.groupBy 原生支持，Chrome 117+ / Firefox 119+ / Node 21+
const grouped = Object.groupBy(orders, order => order.status)
```

**结果**：1 个依赖（或 reduce）→ 1 个内置。需要兼容旧环境时用 reduce 一行，不要装 lodash 只为这一个函数。

---

### 无限滚动

**任务**："用户滚到底部时加载更多内容。"

**不用 Ponytail**（~30 行 + 1 依赖）：

```bash
npm install react-infinite-scroll-component
```

```tsx
import InfiniteScroll from 'react-infinite-scroll-component'

function Feed() {
  const [items, setItems] = useState([])
  const [hasMore, setHasMore] = useState(true)

  const fetchMore = async () => {
    const newItems = await fetch('/api/items?offset=' + items.length)
      .then(r => r.json())
    setItems(prev => [...prev, ...newItems])
    if (newItems.length === 0) setHasMore(false)
  }

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={<h4>加载中…</h4>}
      endMessage={<p>没有更多了</p>}
    >
      {items.map(item => <ItemCard key={item.id} item={item} />)}
    </InfiniteScroll>
  )
}
```

**用 Ponytail**（0 依赖）：

```tsx
// ponytail: IntersectionObserver 原生支持，不需要滚动监听、不需要节流
function Feed() {
  const [items, setItems] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) {
        fetch('/api/items?offset=' + items.length)
          .then(r => r.json())
          .then(newItems => {
            setItems(prev => [...prev, ...newItems])
            if (newItems.length === 0) setHasMore(false)
          })
      }
    })
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, items.length])

  return (
    <div>
      {items.map(item => <ItemCard key={item.id} item={item} />)}
      <div ref={sentinelRef} />
    </div>
  )
}
```

**结果**：1 依赖 → 0 依赖。`IntersectionObserver` 只在哨兵元素进入视口时触发——没有滚动事件、不用节流、不卡顿。所有浏览器都支持。那个库包装的就是这个 API。

---

### 模态对话框

**任务**："给删除操作加个确认弹窗。"

**不用 Ponytail**（~30 行 + 1 依赖）：

```bash
npm install @radix-ui/react-dialog
```

```tsx
import * as Dialog from '@radix-ui/react-dialog'

function DeleteModal({ onConfirm }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="btn-danger">删除</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title>确认删除</Dialog.Title>
          <Dialog.Description>
            此操作不可撤销，确定要继续吗？
          </Dialog.Description>
          <div className="dialog-actions">
            <Dialog.Close asChild>
              <button>取消</button>
            </Dialog.Close>
            <button onClick={() => { onConfirm(); }}>
              删除
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

**用 Ponytail**（8 行，0 依赖）：

```html
<!-- ponytail: <dialog> 原生支持，自动聚焦/ESC 关闭/背投/无障碍 -->
<dialog id="confirm-delete">
  <p>此操作不可撤销，确定要继续吗？</p>
  <button onclick="this.closest('dialog').close()">取消</button>
  <button onclick="onConfirm(); this.closest('dialog').close()">删除</button>
</dialog>
```

```javascript
const dialog = document.getElementById('confirm-delete')
dialog.showModal()  // 打开
```

**结果**：1 依赖 + 30 行 → 0 依赖 + 8 行。`<dialog>` 自动处理焦点、ESC 关闭、`::backdrop` 背投和无障碍——2022 年起所有浏览器都支持。那个库解决的问题，平台已经解决了。

---

### 数字格式化

**任务**："把数字格式化成货币和千位分隔。"

**不用 Ponytail**（1 依赖）：

```bash
npm install numeral
```

```javascript
import numeral from 'numeral'

numeral(1234567.89).format('$0,0.00')   // "$1,234,567.89"
numeral(0.745).format('0.0%')           // "74.5%"
numeral(1500).format('0.0a')            // "1.5k"
```

**用 Ponytail**（0 依赖）：

```javascript
// ponytail: Intl.NumberFormat 内置，自动处理每一种 locale、每一种货币
new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(1234567.89)
// "¥1,234,567.89"

new Intl.NumberFormat('zh-CN', { style: 'percent' }).format(0.745)
// "74%"

new Intl.NumberFormat('zh-CN', { notation: 'compact' }).format(1500)
// "1500"
```

**结果**：1 依赖 → 0 依赖。`Intl.NumberFormat` 内置于所有 JS 运行时，自动处理每种语言的千位分隔符、货币符号和分组规则。一个硬编码格式的库对某些用户永远是错的。

---

### 频率限制

**任务**："给 FastAPI 接口加频率限制，防止用户刷接口。"

**不用 Ponytail**（128 行，6 种方案对比）：

```python
# 方案一：slowapi
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/api/data")
@limiter.limit("10/minute")
async def get_data(request: Request):
    return {"data": "..."}

# 方案二：limits 库
# 方案三：自定义中间件
# 方案四：按用户限制
# 方案五：Redis 分布式限流
# 方案六：多接口限流 + 测试代码
# ...（共 128 行，含对比表和测试用例）
```

**用 Ponytail**（10 行）：

```python
# ponytail: slowapi 够了，自定义逻辑/Redis/滑动窗口需求出现时再加
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/api/data")
@limiter.limit("10/minute")
async def get_data(request: Request):
    return {"data": "..."}
```

**结果**：128 → 10 行。就一个装饰器，slowapi 已经处理了所有细节。

---

### React 倒计时

**任务**："写一个 React 倒计时组件，从指定秒数开始倒数。"

**不用 Ponytail**（267 行，5 种变体）：

```tsx
// 变体一：基础 CountdownTimer（start/pause/reset）
// 变体二：AdvancedCountdownTimer（HH:MM:SS + 进度条 + onComplete 回调）
// 变体三：useCountdown 自定义 hook（start/pause/reset/setSeconds）
// 变体四：StyledCountdownTimer（styled-components + 渐变背景 + <10s 脉冲动画）
// 变体五：配套 CSS + 使用示例
// ...（共 267 行）
```

**用 Ponytail**（9 行）：

```tsx
// ponytail: 自动倒数 + 显示秒数够了，需要暂停/格式化/音效/样式时再加
function Countdown({ seconds }) {
  const [remaining, setRemaining] = useState(seconds)
  
  useEffect(() => {
    const id = setInterval(() => setRemaining(r => r > 0 ? r - 1 : 0), 1000)
    return () => clearInterval(id)
  }, [])
  
  return <span>{remaining}</span>
}
```

**结果**：267 → 9 行。跳过：暂停/恢复、格式化显示（mm:ss）、零值音效、样式——需要时再加。

---

### URL 参数

**任务**："解析和构建 URL 查询字符串。"

**不用 Ponytail**（1 依赖）：

```bash
npm install query-string  # 4.5 kB gzipped, 3.5M 周下载量
```

```javascript
import qs from 'query-string'

// 解析
const params = qs.parse(location.search)
// { page: "2", sort: "name", tags: ["js", "css"] }

// 构建
const url = qs.stringify({ page: 2, sort: 'name', tags: ['js', 'css'] })
// "page=2&sort=name&tags=js&tags=css"
```

**用 Ponytail**（0 依赖）：

```javascript
// ponytail: URLSearchParams 内置，所有浏览器 + Node 10+ 都支持
const params = new URLSearchParams(location.search)

// 读取
params.get('page')          // "2"
params.getAll('tags')       // ["js", "css"]

// 构建
const out = new URLSearchParams({ page: 2, sort: 'name' })
out.append('tags', 'js')
out.append('tags', 'css')
out.toString()              // "page=2&sort=name&tags=js&tags=css"
```

**结果**：1 依赖 → 0 依赖。`URLSearchParams` 存在于所有浏览器和 Node.js 10+，自动处理编码、重复键和遍历。那个包是一个已经到处发货的 API 的 polyfill。

---

### 总结：代码量对比

| 示例 | 不用 Ponytail | 用 Ponytail | 减少 |
|------|-------------|-----------|------|
| CSV 求和 | ~45 行 | 3 行 | 93% |
| 防抖 | 116 行 | 10 行 | 91% |
| 深拷贝 | 1 依赖 | 1 内置 | — |
| 邮箱验证 | 75 行 | 3 行 | 96% |
| 数组分组 | 1 依赖 | 1 内置 | — |
| 无限滚动 | 1 依赖 | 0 依赖 | — |
| 模态弹窗 | 30 行 + 1 依赖 | 8 行 | — |
| 数字格式化 | 1 依赖 | 0 依赖 | — |
| 频率限制 | 128 行 | 10 行 | 92% |
| React 倒计时 | 267 行 | 9 行 | 97% |
| URL 参数 | 1 依赖 | 0 依赖 | — |

**核心规律**：大多数任务的标准库/原生平台方案就足够了。AI 默认输出的是"过度设计的安全版本"——把所有可能需要的都写上了。Ponytail 把这层剥掉，留下刚好能跑的部分。

---

## 相关页面

- [Caveman — 极致 Token 省流模式](/tips/caveman) — Ponytail + Caveman 组合拳
- [最佳实践](/tips/best-practices) — 日常开发技巧和四阶段工作流
- [AI 生成代码自检](/tips/self-check) — 用 `/ponytail-review` 检查过度设计
- [Feature Dev — 7 阶段引导式功能开发](/tips/feature-dev) — 官方功能开发流程
- [Superpowers](/tips/superpowers) — 工程化开发流程

:::tip 功能串联
Ponytail 关注**代码效率**——只写必要的代码。它覆盖工作效率维度，与 [Superpowers](/tips/superpowers)（工程纪律维度）和 [ECC](/tips/ecc)（企业级全家桶）互补叠加。日常组合推荐：Ponytail `full`（效率过滤） + Superpowers TDD（纪律约束） + `/ponytail-review`（交付前检查）。
:::
