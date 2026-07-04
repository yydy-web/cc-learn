---
title: UI/UX Pro Max — 设计智能系统
description: UI/UX Pro Max 为 Claude Code 注入 161 套配色、57 组字体、50+ 设计风格，让 AI 一次找对方向不反复试
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★★★☆☆ |
| 🧪 测试 | ★★☆☆☆ | ★★★★☆ |
| 📦 产品 | ★★★★☆ | ★★★☆☆ |

**🎯 学习产出：** 掌握 UI/UX Pro Max 设计检索系统，能独立从 161 套配色和 50+ 风格中快速匹配最适合产品的设计参数

**🚀 AI 能力提升：** 设计→代码
:::

# UI/UX Pro Max — 设计智能系统

> 你不需要反复描述"我想要那种风格"——直接搜，一步到位。

## 概述

**UI/UX Pro Max** 是一个设计知识库 Skill，内置 161 套配色方案、57 组字体配对、50+ 设计风格、99 条 UX 准则、25 种图表类型。不画图，不生成像素——它告诉你**该用什么**。

AI 做 UI 最大的问题是什么？**方向感缺失**。你说"做一个好看的后台"，AI 随机给你一个蓝白配色、`Inter` 字体、Material 卡片。好不好看？看运气。要改？"再现代一点"、"色调整点"——每次都是重新掷骰子。

UI/UX Pro Max 的答案：你描述产品类型，它从索引里检索最佳匹配，返回**有理由**的设计系统。

**核心数据**：161 套色板、57 组字体、50+ 风格、10 个优先级分类、跨 10 个技术栈。

## 核心理念：检索代替猜测

```
你说 "做一个 SaaS 后台" →
  AI 随机选一套 →
    不好看 → "再现代一点" →
      又随机一套 →
        还是不对 →

你说 "做一个 SaaS 后台，modern minimal" →
  UI/UX Pro Max 检索 →
    匹配：Minimalism 风格 + slate/blue 色板 + Inter/JetBrains Mono →
      一次到位。
```

区别不在于 AI 变聪明了——在于**检索代替猜测**。

## 安装

UI/UX Pro Max 是一个 Skill，通过插件市场安装：

```bash
/plugin marketplace add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max
```

### 验证

装完后，在 Claude Code 中试试：

```text
> 帮我设计一个健身 App 的配色方案
```

如果 Claude Code 自动调用了 `search.py` 去检索而不是凭空编，就说明 Skill 生效了。

## 使用方式

### 核心命令

UI/UX Pro Max 通过 Python 脚本检索，不是 slash command：

```bash
# 完整设计系统（推荐起步方式）
python3 skills/ui-ux-pro-max/scripts/search.py "fintech crypto dark" --design-system -p "项目名"

# 查配色
python3 skills/ui-ux-pro-max/scripts/search.py "healthcare calm" --domain color

# 查字体
python3 skills/ui-ux-pro-max/scripts/search.py "modern professional" --domain typography

# 查 UX 准则
python3 skills/ui-ux-pro-max/scripts/search.py "form validation accessibility" --domain ux

# 查技术栈最佳实践
python3 skills/ui-ux-pro-max/scripts/search.py "list performance" --stack react
```

### 检索域一览

| 域 | 用途 | 示例关键词 |
|----|------|-----------|
| `--design-system` | 完整设计系统（风格+配色+字体+效果） | `"beauty spa wellness"` |
| `--domain color` | 按产品/行业搜配色 | `fintech, ecommerce, healthcare` |
| `--domain style` | UI 风格详情 | `glassmorphism, minimalism, brutalism` |
| `--domain typography` | 字体配对 | `elegant, playful, modern` |
| `--domain ux` | 交互/无障碍/动画准则 | `animation, accessibility, touch` |
| `--domain chart` | 图表类型推荐 | `trend, comparison, real-time` |
| `--domain landing` | 落地页结构 | `hero, pricing, social-proof` |
| `--domain product` | 产品类型模式 | `SaaS, e-commerce, entertainment` |
| `--stack react` | React/Next.js 实现建议 | `rerender, suspense, bundle` |
| `--stack react-native` | React Native 组件 | `FlatList, navigation, safe area` |

### 优先级体系

Skill 内置 10 个优先级分类，按重要性从 1 到 10。做 UI 时按顺序检查：

| 优先级 | 类别 | 必查项 | 常见翻车点 |
|--------|------|--------|-----------|
| 1 | 无障碍 | 对比度 4.5:1、键盘导航、aria-label | 去掉 focus ring、纯图标按钮无标签 |
| 2 | 触控交互 | 44×44px 最小区域、8px 间距、加载反馈 | 依赖 hover、0ms 状态切换 |
| 3 | 性能 | WebP/AVIF、懒加载、预留空间防 CLS | 布局抖动、同步大图 |
| 4 | 风格选择 | 匹配产品类型、一致性、SVG 图标 | 混搭、用 emoji 做图标 |
| 5 | 布局响应式 | 移动优先、viewport meta、无水平滚动 | 固定 px 容器、禁用缩放 |
| 6 | 字体配色 | body 16px、行高 1.5、语义色值 token | 正文小于 12px、硬编码 hex |
| 7 | 动画 | 150-300ms、动画传达含义 | 纯装饰动画、animate width/height |
| 8 | 表单反馈 | 可见 label、错误就近显示 | placeholder 当 label、错误只在顶部 |
| 9 | 导航 | 底部导航 ≤5 项、可预测返回 | 导航过载、无深链 |
| 10 | 图表 | 图例、tooltip、无障碍配色 | 只用颜色区分数据 |

## 日常使用

### Vue 示例

**场景**：做一个 SaaS 后台仪表盘卡片。

❌ 不用 UI/UX Pro Max 的 AI 会写：

```vue
<!-- DashboardCard.vue — 随机配色，灰色卡片配浅蓝文字 -->
<template>
  <div class="card" style="background: #f5f5f5; padding: 24px; border-radius: 12px;">
    <h3 style="color: #b0bec5; font-size: 14px;">总用户数</h3>
    <p style="color: #78909c; font-size: 32px; font-weight: bold;">12,847</p>
  </div>
</template>
```

灰色卡片 + 浅灰蓝文字 + 灰数字——整个卡片毫无层次，数字淹没在背景中。

✅ 用 UI/UX Pro Max：

先检索 SaaS 产品的设计参数：

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard enterprise" --design-system -p "AdminPanel"
```

拿到结果：Minimalism 风格、`#1E293B`（slate-800）底色、`#3B82F6`（blue-500）强调色、`Inter` 字体、24px 间距。

再实现：

```vue
<!-- DashboardCard.vue — 有根据的设计参数 -->
<template>
  <div class="card">
    <h3 class="card-label">总用户数</h3>
    <p class="card-value">12,847</p>
    <span class="card-trend up">↑ 12.5%</span>
  </div>
</template>

<style scoped>
.card {
  background: #1E293B;      /* slate-800 — 来自设计系统 */
  padding: 24px;             /* 来自 spacing scale */
  border-radius: 12px;       /* 来自 effects */
  color: #F8FAFC;            /* slate-50 — 正文色 */
}
.card-label {
  font-size: 14px;
  color: #94A3B8;            /* slate-400 — 次级文字 */
  font-weight: 500;
  margin-bottom: 8px;
}
.card-value {
  font-size: 32px;
  font-weight: 700;
  color: #F8FAFC;            /* 高对比度 */
  margin-bottom: 8px;
}
.card-trend.up {
  color: #22C55E;            /* green-500 — 涨用绿 */
  font-size: 14px;
  font-weight: 600;
}
</style>
```

暗色卡片 + 白色数字 + 灰色标签 + 绿色趋势——每个颜色都有**语义依据**，不是随手写 hex。

**场景**：做一个搜索输入框。

❌ 不用 UI/UX Pro Max：

```vue
<!-- 随手写的，没考虑触控大小、对比度 -->
<template>
  <input v-model="query" placeholder="搜索..." style="padding: 6px 10px; font-size: 13px; border: 1px solid #ccc; border-radius: 4px;" />
</template>
```

✅ 用 UI/UX Pro Max 先查 UX 准则：

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "search input touch form" --domain ux
```

拿到准则：`input-type-keyboard`（语义输入类型触发正确键盘）、`touch-target-size`（最小 44×44px）、`inline-validation`（失焦后校验）、`contrast-readability`（正文 ≥4.5:1 对比度）。

```vue
<!-- SearchInput.vue — UX 准则驱动 -->
<template>
  <div class="search-wrapper">
    <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20">
      <path d="M15.5 14h-.79l-.28-.27A6.471..." fill="currentColor"/>
    </svg>
    <input
      v-model="query"
      type="search"
      autocomplete="off"
      placeholder="搜索用户、订单…"
      class="search-input"
      @blur="validate"
    />
    <span v-if="error" class="search-error" role="alert">{{ error }}</span>
  </div>
</template>

<style scoped>
.search-wrapper {
  position: relative;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94A3B8;
  /* SVG 矢量图标，不是 emoji 🔍 */
}
.search-input {
  width: 100%;
  height: 44px;              /* 最小触控目标 */
  padding: 0 16px 0 40px;    /* 给左侧图标留空间 */
  font-size: 16px;            /* 避免 iOS 自动缩放 */
  color: #1E293B;             /* 正文对比度 >4.5:1 */
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  background: #FFFFFF;
  outline: none;
  transition: border-color 200ms ease;
}
.search-input:focus {
  border-color: #3B82F6;     /* 聚焦状态可见 */
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.search-error {
  font-size: 13px;
  color: #DC2626;             /* 错误色 — 对比度达标 */
  margin-top: 4px;
}
</style>
```

### Java 示例

**场景**：做一个管理后台的导航侧边栏。

❌ 不用 UI/UX Pro Max：

```java
// 随手写的颜色常量
public class ThemeConstants {
    public static final String SIDEBAR_BG = "#2C3E50";
    public static final String MENU_ACTIVE = "#3498DB";
    public static final String MENU_TEXT = "#ECF0F1";
    // ... 硬编码一堆 hex，没有语义
}
```

✅ 用 UI/UX Pro Max 先检索：

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "admin panel enterprise dark sidebar" --design-system -p "AdminConsole"
```

拿到：Dark mode Minimalism、Slate 系列色板（surface/surface-variant/on-surface）、Inter 字体。

然后在代码中建立语义色值 token——而不是散落 hex：

```java
/**
 * 语义化设计 Token — 来自 UI/UX Pro Max 设计系统
 * 配色方案：Dark Minimalism / Slate scale
 */
public enum DesignToken {
    // Surface 层级
    COLOR_SURFACE_DEFAULT("#0F172A"),        // slate-900 — 侧边栏底色
    COLOR_SURFACE_VARIANT("#1E293B"),        // slate-800 — 菜单项 hover
    COLOR_SURFACE_ELEVATED("#334155"),       // slate-700 — 弹出层

    // On-surface 层级
    COLOR_ON_SURFACE_PRIMARY("#F8FAFC"),     // slate-50 — 菜单文字
    COLOR_ON_SURFACE_SECONDARY("#94A3B8"),   // slate-400 — 次级文字/图标

    // 交互
    COLOR_PRIMARY("#3B82F6"),                // blue-500 — 选中态/CTA
    COLOR_ERROR("#EF4444"),                  // red-500 — 错误/删除
    COLOR_SUCCESS("#22C55E"),                // green-500 — 成功/在线

    // 排版
    FONT_FAMILY("Inter, system-ui, sans-serif"),
    FONT_SIZE_BASE(16),                      // body
    FONT_SIZE_SM(14),                        // 次级文字
    FONT_SIZE_LG(18),                        // 标题

    // 间距 (4pt 递增)
    SPACING_XS(4),
    SPACING_SM(8),
    SPACING_MD(16),
    SPACING_LG(24),
    SPACING_XL(32),

    // 动效
    DURATION_FAST(150),                      // hover 反馈
    DURATION_NORMAL(250),                    // 展开/收起
    BORDER_RADIUS(8);

    private final Object value;

    DesignToken(Object value) { this.value = value; }

    public String str() { return (String) value; }
    public int num() { return (Integer) value; }
}
```

现在写 CSS 或 Thymeleaf 模板时直接用 token，不会出现"随手写一个 `#2C3E50`"：

```css
.admin-sidebar {
  background: var(--surface-default);      /* #0F172A — 固定语义 */
  color: var(--on-surface-primary);        /* #F8FAFC */
  font-family: var(--font-family);
  padding: var(--spacing-lg);              /* 24px */
}
.menu-item {
  height: 44px;                           /* 满足触控最小尺寸 */
  padding: 0 var(--spacing-md);            /* 16px */
  font-size: var(--font-size-sm);          /* 14px */
  color: var(--on-surface-secondary);      /* #94A3B8 */
  border-radius: var(--border-radius);     /* 8px */
  transition: background var(--duration-fast) ease;
}
.menu-item:hover {
  background: var(--surface-variant);      /* #1E293B */
}
.menu-item.active {
  background: var(--color-primary);        /* #3B82F6 */
  color: #FFFFFF;
}
```

**场景**：做一个表单验证页面。

❌ 不用 UI/UX Pro Max 的 AI 会写：

```java
// Controller 直接返回，没有错误码设计
@PostMapping("/users")
public ResponseEntity<?> createUser(@RequestBody CreateUserRequest req) {
    if (req.getName() == null || req.getName().isEmpty()) {
        return ResponseEntity.badRequest().body("名称错误");
    }
    // 错误信息不明确，前端不知道怎么展示
}
```

✅ 用 UI/UX Pro Max 先查 UX 准则：

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "error clarity recovery placement" --domain ux
```

准则：错误信息必须说明**原因 + 怎么修**、就近显示（不是只在顶部汇总）、聚焦第一个错误字段。

```java
@PostMapping("/users")
public ResponseEntity<ApiResponse> createUser(@RequestBody @Valid CreateUserRequest req) {
    // Spring Validation 已处理字段校验
    // 业务层校验
    if (userService.existsByName(req.getName())) {
        // 错误信息：原因 + 修复路径
        throw new BusinessException(
            ErrorCode.USER_NAME_DUPLICATE,
            "用户名「%s」已被占用，请换一个用户名".formatted(req.getName())
        );
    }

    User user = userService.create(req);
    return ResponseEntity.ok(ApiResponse.success(user));
}

// 全局异常处理 — 统一错误格式
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidation(MethodArgumentNotValidException ex) {
        List<FieldError> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(e -> new FieldError(
                e.getField(),                     // 字段名 — 前端定位用
                e.getDefaultMessage()              // "手机号格式错误" — 原因 + 修复
            ))
            .toList();

        return ResponseEntity.badRequest()
            .body(ApiResponse.error(ErrorCode.VALIDATION_FAILED, "请检查表单中的错误", errors));
    }
}

// 统一错误响应体
public record ApiResponse(
    boolean success,
    String message,                               // 面向用户的摘要
    String errorCode,                             // 程序定位用
    List<FieldError> fieldErrors                  // 前端就近展示
) {
    // 字段级错误 — 前端在对应字段下方展示
    public record FieldError(String field, String message) {}
}
```

关键设计决策来自 UX 准则：
- 错误响应体包含 `field` 和 `message`——前端可以在每个输入框下方就近显示
- 业务错误包含原因 + 修复路径（"已被占用，请换一个"），而不只是"名称错误"
- 校验失败后前端可以 `focus` 到第一个错误字段（WCAG 规范）

## 实战场景一：新项目——从"没有方向"到"有设计系统"

### 场景

你接到一个新项目：做一个医疗健康 SaaS 平台。产品经理说"要专业、值得信赖"，设计师还没到位。你要先出第一版界面的代码。

最大的问题不是"怎么画"，而是"用什么颜色、什么风格、什么字体"——每次你问 AI，它都随机给一套。

### 你怎么操作（对话流程）

**第一步：生成完整设计系统**

在 Claude Code 中直接运行：

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "healthcare medical SaaS professional trustworthy" --design-system -p "MediCloud"
```

### 不用 UI/UX Pro Max 的 AI 会怎么做

1. 随机选蓝白配色（因为"医疗 = 蓝色"，训练数据里最多）
2. 随便配一个 Inter 字体（什么场景都用 Inter）
3. 间距、字号、动画都凭感觉
4. 你连改三次"再专业一点"、"色调整点"、"按钮大一点"——每次都重来一遍

**结果**：3 轮对话还在调配色，代码一行没写。

### UI/UX Pro Max 方式

**第一步：检索匹配**

脚本并行搜索 `product`、`style`、`color`、`typography`、`landing` 五个域，用推理规则选出最佳匹配：

```
Style: Minimalism + Soft Professional
Color Palette: Calm Clinical
  Surface:  #F8FAFC (slate-50)
  Card:     #FFFFFF
  Primary:  #0891B2 (cyan-600) — 冷静可靠，不死板
  Accent:   #059669 (emerald-600) — 健康/正向联想
Typography: Inter (heading) + Source Sans 3 (body)
  — Inter 现代几何感；Source Sans 3 屏显可读性高
Effects: subtle shadow, 8px radius
Anti-patterns: 避免纯白+纯黑强对比（太重），不要用粉/红强调色（患者焦虑联想）
```

**第二步：写代码**

拿到参数后直接让 AI 实现——先给参数再要代码：

```text
> 风格：Minimalism + Soft Professional
> 主色：#0891B2，强调色：#059669
> 字体：Inter + Source Sans 3
> 帮我做登录页：左侧品牌区 + 右侧登录表单
```

```html
<!-- Login.vue — 设计参数驱动的实现 -->
<template>
  <div class="login-page">
    <!-- 左侧品牌区 -->
    <aside class="brand-panel">
      <img src="/logo.svg" alt="MediCloud" class="logo" />
      <h1 class="brand-title">智能医疗管理平台</h1>
      <p class="brand-desc">安全、高效、值得信赖的临床数据管理</p>
    </aside>

    <!-- 右侧登录表单 -->
    <main class="form-panel">
      <form @submit.prevent="login" class="login-form">
        <h2 class="form-title">登录</h2>

        <label class="field-label" for="email">邮箱</label>
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          class="field-input"
          placeholder="name@hospital.com"
        />

        <label class="field-label" for="password">密码</label>
        <div class="password-wrapper">
          <input
            id="password"
            v-model="password"
            :type="showPwd ? 'text' : 'password'"
            autocomplete="current-password"
            class="field-input"
          />
          <button type="button" class="toggle-pwd" @click="showPwd = !showPwd">
            {{ showPwd ? '隐藏' : '显示' }}
          </button>
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? '登录中…' : '登录' }}
        </button>
      </form>
    </main>
  </div>
</template>

<style scoped>
.login-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}
.brand-panel {
  background: #0891B2;         /* primary — 来自设计系统 */
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 48px;
}
.form-panel {
  background: #F8FAFC;          /* surface — 来自设计系统 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
}
.login-form {
  width: 100%;
  max-width: 400px;
}
.form-title {
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 32px;
}
.field-label {
  display: block;               /* 可见 label — UX 准则 */
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 6px;
}
.field-input {
  width: 100%;
  height: 44px;                 /* ≥44px 触控目标 */
  padding: 0 12px;
  font-size: 16px;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  background: #FFFFFF;
  margin-bottom: 20px;
}
.field-input:focus {
  border-color: #0891B2;        /* 聚焦可见 — 无障碍 */
  box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.15);
}
.btn-primary {
  width: 100%;
  height: 44px;
  background: #0891B2;          /* primary */
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 150ms ease;
}
.btn-primary:hover { background: #0E7490; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary:focus-visible {     /* focus ring — 不删 */
  outline: 2px solid #0891B2;
  outline-offset: 2px;
}
.password-wrapper { position: relative; }
.toggle-pwd {
  position: absolute;
  right: 12px;
  top: 12px;
  background: none;
  border: none;
  font-size: 14px;
  color: #64748B;
  cursor: pointer;
}
</style>
```

**第三步：交付前检查**

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "touch target contrast form error accessibility" --domain ux
```

逐条对照：所有输入框 ≥44px ✓、label 可见 ✓、密码可切换可见 ✓、focus ring 存在 ✓、对比度达标 ✓。

**结果**：一次检索拿到全套设计参数，一次对话写完登录页。没有"色调整点"的反复。

## 实战场景二：改一个反例页面——把"不好看"修成"专业"

### 场景

你接手一个运行半年的 Vue 后台项目，用户反馈"界面看起来业余"。打开一看：emoji 当图标用、灰色字在白色背景上、按钮连 30px 都不到——典型的"随便写的 UI"。

### 你怎么操作（对话流程）

**第一步：检索 UX 准则做审查**

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "icon contrast touch-target form-label" --domain ux
```

拿到准则后逐条对照当前代码。

**第二步：逐条修复**

**反例 1 — emoji 当图标**

当前代码：
```vue
<!-- ❌ emoji 在不同 OS 上显示完全不同 -->
<button @click="exportCSV">📥 导出</button>
```

修复：
```vue
<!-- ✅ SVG 图标，跨平台一致 -->
<button @click="exportCSV" class="btn-secondary">
  <DownloadIcon class="btn-icon" />
  导出
</button>
```

准则依据：`no-emoji-icons` — emoji 是字体依赖的，不可控。用 SVG 图标（Lucide / Heroicons）。

**反例 2 — 按钮太小**

当前代码：
```vue
<!-- ❌ 高度 28px，手机上根本点不到 -->
<button style="padding: 2px 8px; font-size: 12px;">删除</button>
```

修复：
```vue
<!-- ✅ 最小 44px 触控区域 -->
<style>
.btn-danger-sm {
  min-height: 44px;         /* iOS HIG 标准 */
  min-width: 44px;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
}
</style>
```

准则依据：`touch-target-size` — 最小 44×44pt（iOS）/ 48×48dp（Android）。

**反例 3 — 低对比度文字**

当前代码：
```html
<!-- ❌ 次级文字 #999 在白色背景上对比度 2.85:1，不达标 -->
<p style="color: #999;">最后更新：2024-01-15</p>
```

修复：
```html
<!-- ✅ #64748B (slate-500) 对比度 4.6:1，达标 -->
<p class="text-secondary">最后更新：2024-01-15</p>

<style>
.text-secondary { color: #64748B; }  /* 来自设计系统的语义 token */
</style>
```

准则依据：`contrast-readability` — 正文 ≥4.5:1，次级文字 ≥3:1。

**第三步：生成完整设计系统固化**

修完反例后，把整套参数持久化：

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "admin panel enterprise dark" --design-system --persist -p "AdminReboot"
```

之后所有新页面都从 `design-system/MASTER.md` 读参数，不会再回到"随手写 hex"的状态。

## 实战场景三：端到端——从需求到交付一个数据仪表盘

### 场景

需求："运营后台需要一个数据仪表盘，展示最近 30 天的注册量、活跃用户、收入趋势。"

### 你怎么操作（对话流程）

**第 1 步：生成设计系统（先有方向再写代码）**

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "analytics dashboard data-dense enterprise" --design-system -p "DataBoard"
```

输出：
```
Style: Data-Dense Minimalism
  — 信息优先，装饰最小化
Color: Cool Professional
  Surface:  #0F172A (dark bg — 长时间盯屏不刺眼)
  Card:     #1E293B
  Primary:  #3B82F6 (blue — 数据强调)
  Success:  #22C55E (green — 增长)
  Warning:  #F59E0B (amber — 警示)
Typography: Inter (data labels) + JetBrains Mono (numbers)
  — tabular figures 防止数字抖动
Chart: line (trend) + bar (comparison)
Effects: no decoration, minimal shadow
```

**第 2 步：查图表最佳实践**

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "trend comparison real-time dashboard" --domain chart
```

拿到准则：
- 趋势 → 折线图，时间 → 横轴
- 对比 → 柱状图，同色系变体
- 图例必须可见且可交互
- tooltip 在 hover 和 tap 都能触发
- 配色不依赖红/绿唯一区分（色盲友好）

**第 3 步：查 Java 后端数据聚合**

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "number formatting locale" --domain ux
```

准则提醒：数字要本地化格式化（`12,847` 不是 `12847`）。

```java
// DashboardService.java
@Service
public class DashboardService {

    public DashboardVO getDashboard(LocalDate from, LocalDate to) {
        List<DailyStats> stats = statsRepository.findByDateRange(from, to);

        return new DashboardVO(
            formatNumber(stats.stream().mapToLong(DailyStats::getRegistrations).sum()),
            formatNumber(stats.stream().mapToLong(DailyStats::getActiveUsers).sum()),
            formatCurrency(stats.stream().mapToDouble(DailyStats::getRevenue).sum()),
            stats.stream().map(this::toTrendPoint).toList()   // 给图表用
        );
    }

    // 数字格式化 — 来自 UX 准则 number-formatting
    private String formatNumber(long n) {
        return NumberFormat.getIntegerInstance(Locale.CHINA).format(n);
        // 输出：12,847 而不是 12847
    }

    private String formatCurrency(double n) {
        return NumberFormat.getCurrencyInstance(Locale.CHINA).format(n);
        // 输出：¥128,470.00
    }

    public record DashboardVO(
        String totalRegistrations,
        String activeUsers,
        String totalRevenue,
        List<TrendPoint> trend
    ) {}
}
```

**第 4 步：写前端 Vue 组件**

```vue
<!-- Dashboard.vue -->
<template>
  <div class="dashboard">
    <!-- 指标卡片 -->
    <div class="kpi-grid">
      <KpiCard label="注册用户" :value="data.totalRegistrations" trend="↑ 12.5%" />
      <KpiCard label="活跃用户" :value="data.activeUsers" trend="↑ 8.3%" />
      <KpiCard label="总收入" :value="data.totalRevenue" trend="↑ 15.7%" />
    </div>

    <!-- 趋势图 -->
    <div class="chart-card">
      <h3 class="chart-title">30 天趋势</h3>
      <LineChart :data="data.trend" aria-label="注册用户和收入 30 天变化趋势" />
      <!-- aria-label — chart 无障碍 -->
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 24px;              /* 4pt scale */
  background: #0F172A;        /* surface — 来自设计系统 */
  min-height: 100vh;
}
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;                  /* 8dp spacing rhythm */
  margin-bottom: 24px;
}
.chart-card {
  background: #1E293B;        /* card — 来自设计系统 */
  border-radius: 12px;
  padding: 24px;
}
.chart-title {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #F8FAFC;
  margin-bottom: 20px;
}
</style>
```

**第 5 步：交付前检查**

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "animation reduced-motion contrast data-table chart-accessibility" --domain ux
```

确认：
- 图表有 `aria-label` 摘要
- 数字用 tabular figures 防止刷新抖动
- 折线图颜色不依赖红/绿唯一区分
- prefers-reduced-motion 时禁用图表入场动画

**结果**：一套从配色到图表到后端格式化的完整仪表盘。0 次"色调整点"。

## 最佳实践

### 什么时候用

| 场景 | 适合 | 不适合 |
|------|------|--------|
| 新项目/新页面 | ✅ 先 `--design-system` | — |
| 改配色/改风格 | ✅ 重新检索对应域 | — |
| 组件开发 | ✅ 配合 UX 准则 | — |
| 交付前检查 | ✅ 全量 UX 查询 | — |
| 修 bug | — | ❌ 跟设计无关 |
| 后端逻辑 | — | ❌ 纯 API/数据库 |
| 写测试 | — | ❌ 不涉及界面 |

### 设计系统持久化

一次 `--design-system` 的结果只在当前对话有效。跨会话复用，加 `--persist`：

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "..." --design-system --persist -p "项目名"
```

会在项目根目录创建 `design-system/MASTER.md`，后续对话直接读这个文件获取设计参数。

### 检索技巧

- **多维度关键词**：不只是 `"app"`，用 `"entertainment social vibrant"` 更精准
- **不确定时换关键词**: `"playful neon"` 不理想 → 换 `"vibrant dark"` 再搜
- **设计系统先行**：先 `--design-system` 拿到全局参数，再用 `--domain` 深挖细节
- **每次交付前跑 UX 检查**：`--domain ux "animation accessibility touch"` 作为最后一道关

### 与 Ponytail 的配合

Ponytail 管"代码够不够简"，UI/UX Pro Max 管"设计够不够对"：

```text
UI/UX Pro Max → 确定设计方向（风格、配色、字体）
       ↓
   Ponytail  → 确保实现是最简方案（原生控件、无过度封装）
       ↓
   交付      → 又对又简
```

## 常见问题

### UI/UX Pro Max 会画设计稿吗？

不会。它不生成像素、不画图。它输出的是**设计参数**——配色 hex、字体名、间距值、动画时长——这些参数喂给 AI 写代码。

### 和直接描述"我要现代风格"有什么区别？

你描述"现代风格"，AI 从训练数据里随机采样。UI/UX Pro Max 是从 50+ 风格索引里**精确匹配**，每次结果一致，且有理由（为什么这个风格适合这类产品）。

### 设计参数不满意怎么办？

换关键词重新搜。`"fintech serious"` 太沉闷 → `"fintech modern approachable"`。索引固定，关键词决定匹配结果。

### 支持本地持久化吗？

支持。`--persist` 生成 `design-system/MASTER.md`，后续会话直接读。也可以 `--page "dashboard"` 生成页面级覆写文件。
