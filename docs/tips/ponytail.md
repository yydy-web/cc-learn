---
title: Ponytail — 懒惰高级工程师模式
description: Ponytail 让 Claude Code 以"懒惰高级工程师"思维工作，只写必要代码，用效率阶梯砍掉 80-94% 的过度设计
---

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
