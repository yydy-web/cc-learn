---
title: Frontend Design — 有审美的主设计师
description: Frontend Design 让 Claude Code 化身设计工作室主理人，做有观点的配色、排版和布局，产出不撞脸的页面
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★★★☆☆ |
| 🧪 测试 | ★★☆☆☆ | ★★★★☆ |
| 📦 产品 | ★★★★☆ | ★★★☆☆ |

**🎯 学习产出：** 掌握 Frontend Design 五步设计法，能独立从产品主体世界提取独特视觉语言，产出不撞脸的设计系统

**🚀 AI 能力提升：** 设计→代码
:::

# Frontend Design — 有审美的主设计师

> 你的页面长什么样子，不应该取决于 AI 今天随机到什么训练数据。

## 概述

**Frontend Design** 是一个设计方法 Skill，它不给你配色库、不给你字体表——它给你**方法**。像一个挑剔的设计工作室主理人，让你在做每个设计决策时都有理由，而不是在三个模板之间选一个。

AI 生成的前端页面有个通病：**撞脸**。不管做什么产品，配色永远是 #F4F1EA 暖奶油底色 + 衬线标题 + 陶土色强调，或者深黑底色 + 荧光绿/朱红单色点缀。三个模板轮着用，每个页面长得都差不多——不是不好看，是**没有区分度**。

Frontend Design 不给你新模板。它改变你做设计决策的方式：先选一个具象主题，从主题的世界里提取视觉语言，然后做**一个**真正冒险的选择。

**核心原则**：一次只在一个地方花光你的大胆。

## 核心理念：设计五步法

```
普通 AI 设计流程：
  收到需求 → 匹配模板 → 输出页面 → "这个风格我之前见过"

Frontend Design 流程：
  收到需求 → 锁定主体 → 
    配色：不是"好看"，是"为什么这个颜色在这"
    排版：不是 Inter+随便配对，是"这对字体承载什么性格"
    布局：不是分栏卡片，是"结构本身在说什么"
    签名：只做一处记忆点，其他地方安静
  → 自我质疑：同样的 prompt 换个项目，会不会给出一样的结果？
  → 只有确认 "这个页面只有这个项目能长这样" 才开始写代码
```

## 安装

通过插件市场安装：

```bash
/plugin marketplace add https://github.com/nextlevelbuilder/frontend-design-skill
/plugin install frontend-design@frontend-design
```

### 验证

```text
> 帮我设计一个独立书店的首页
```

如果 Claude Code 先跟你确认"书店的名字、定位、受众"，而不是直接甩一套配色，就说明 Skill 生效了。

## 使用方式

### 不是 slash command，是工作流

Frontend Design 不是一个命令，而是一套 Claude Code 遵循的**设计流程**。安装后，每次你提页面设计需求时，它会自动：

1. **锁定主体** — 如果 brief 没有明确产品/主体，先帮你锁定
2. **生成 token 系统** — 配色 4-6 个 hex + 2+ 套字体角色 + 布局概念
3. **自我质疑** — 这个方案换个项目也能用吗？能 → 推翻重来
4. **写代码** — 每个颜色、每个字号都从 token 系统派生

### 核心设计原则

| 原则 | 含义 | 反例 |
|------|------|------|
| **落地到主体** | 从产品的世界提取视觉语言 | 做瑜伽 App 用金融蓝 |
| **排版承载性格** | 显示字体和正文字体是刻意配对，不是默认 | 所有项目都用 Inter |
| **结构即信息** | 编号、分割线、标签必须有语义原因 | 随手加 01/02/03 却不代表顺序 |
| **一处大胆** | 只在一个地方冒险，其他地方安静 | 渐变+动画+特殊字体一起上 |
| **动效克制** | 编排好的动效时刻 > 散落的效果 | 每个 hover 都加动画 |
| **文案即设计** | 文案服务于导航和理解，不是装饰 | "Submit" 替代 "保存修改" |
| **质量底线不炫耀** | 响应式、键盘 focus、reduced-motion 默认做好 | 为"酷"牺牲可访问性 |

## 日常使用

### Vue 示例

**场景**：做一个独立陶艺工作室的官网。

❌ 不用 Frontend Design 的 AI 会写：

```vue
<!-- 模板化输出：暖奶油底色 + 衬线标题 + 陶土色 CTA -->
<template>
  <div class="hero" style="background: #F4F1EA; padding: 120px 0;">
    <h1 style="font-family: 'Playfair Display', serif; font-size: 56px; color: #2C1810;">
      手工陶艺
    </h1>
    <p style="color: #8B7355;">每一件都是独一无二的艺术品</p>
    <button style="background: #C1774B; color: white; padding: 16px 48px;">
      探索作品
    </button>
  </div>
</template>
```

问题：这就是第一篇搜索结果里的"手工艺网站"模板。换成一个木工坊、一个皮具店，出来的东西一模一样。

✅ Frontend Design 方式：

**第一步：锁定主体**

```text
> 这是 Kyoto Clay（京都陶土），一家位于京都东山区的独立陶艺工作室。
> 主理人是第三代的陶艺家，作品特点是"留白"和"不对称"。
> 受众是 30-45 岁、愿意为手工器物花钱的设计爱好者。
> 页面唯一的工作：让人预约工作室参观。
```

**第二步：从主体的世界提取视觉语言**

- 配色：不是"手工艺 = 陶土色"。京都陶艺的语言是**釉料的微妙变化**——高温还原焰下青瓷釉从灰绿到天青的渐变。用冷灰绿+天青，而不是暖陶土。
- 排版：不用 Playfair Display（太"西式手工艺"）。用 **Zen Old Mincho**（日文明朝体）做标题，源ノ角ゴシック做正文——这是京都陶艺，不是 Tuscany 陶艺。
- 布局：不对称。京都陶艺的美学是"不完全之美"。居中对称的 hero 是对这种美学的背叛。
- 签名：只用一处——**釉料流动动画**。hero 的文字从灰绿渐变到天青，模拟釉料在窑火中流动的状态。其他地方全是安静的。

**第三步：写代码**

```vue
<!-- Kyoto Clay Studio — 每个设计决策都有主体依据 -->
<template>
  <div class="page">
    <!-- 釉料流动 hero -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="glaze-text">土と火の間</span>
        </h1>
        <p class="hero-sub">Between earth and fire, form emerges.</p>
        <a href="/visit" class="cta-link">
          予約する
          <span class="cta-arrow">→</span>
        </a>
      </div>
      <div class="hero-negative">
        <!-- 留白——不是空，是负空间的宣言 -->
      </div>
    </section>

    <!-- 作品陈列 — 不对称网格 -->
    <section class="works">
      <h2 class="section-label">作品</h2>
      <div class="asymmetric-grid">
        <article class="work-item large">
          <img src="/chawan-ao.jpg" alt="青瓷茶碗 — 天青釉，还原焰 1280°C" />
          <span class="work-name">青瓷茶碗</span>
        </article>
        <article class="work-item">
          <img src="/hachi-kohiki.jpg" alt="粉引鉢" />
          <span class="work-name">粉引鉢</span>
        </article>
        <article class="work-item tall">
          <img src="/kabin-seiji.jpg" alt="青瓷花瓶" />
          <span class="work-name">青瓷花瓶</span>
        </article>
      </div>
    </section>
  </div>
</template>

<style>
/* === Token System === */
:root {
  /* 釉料系列——从灰绿到天青 */
  --glaze-ash: #7A8B7B;        /* 灰绿 — 底色 */
  --glaze-celadon: #9CB4A3;    /* 青瓷 — 中间色 */
  --glaze-sky: #B8D4D0;        /* 天青 — 高光 */
  --clay-raw: #D4C9BC;         /* 素坯 — 表面色 */
  --ink-dark: #2D2A26;         /* 墨 — 正文 */
  --paper-warm: #FAF7F2;       /* 和纸 — 页面底 */

  /* 排版 — 京都，不是米兰 */
  --font-display: 'Zen Old Mincho', serif;
  --font-body: 'Zen Kaku Gothic New', sans-serif;
  --font-utility: 'IBM Plex Mono', monospace;

  /* 动效 */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}

/* === Hero — 非对称 === */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}
/* 左边内容故意偏移，不居中 */
.hero-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 12vw;
  padding-right: 4rem;
}

/* 釉料流动 —— 签名元素，只用这一次 */
.glaze-text {
  background: linear-gradient(
    135deg,
    var(--glaze-ash) 0%,
    var(--glaze-celadon) 40%,
    var(--glaze-sky) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  /* 釉料在窑火中流动是缓慢的——6s 不是 300ms */
  animation: glazeFlow 6s ease-in-out infinite alternate;
}

@keyframes glazeFlow {
  from { background-position: 0% 50%; }
  to { background-position: 100% 100%; }
}

.hero-negative {
  background: var(--paper-warm);
  /* 右边大量留白——负空间的宣言 */
}

/* CTA 不给大按钮——预约是低调的邀请 */
.cta-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: var(--ink-dark);
  text-decoration: none;
  border-bottom: 1px solid var(--glaze-ash);
  padding-bottom: 4px;
  transition: gap 300ms var(--ease-out-expo);
}
.cta-link:hover .cta-arrow { gap: 16px; }

/* 不对称网格 */
.asymmetric-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1px;
}
.work-item.large { grid-row: span 2; }
.work-item.tall { grid-row: span 2; }
</style>
```

**第四步：自我质疑**

同样的 prompt（"陶艺工作室"），去掉"京都"这个主体，换个意大利托斯卡纳的陶艺坊，会给出一样的设计吗？

不一样——托斯卡纳会用暖陶土色 + 意大利体 + 对称布局，因为它的世界是阳光、红瓦、古典平衡。

**结果**：这个页面只有 Kyoto Clay 能长这样。

### Java 示例

**场景**：做一个法律 SaaS 后台——律所案件管理系统。

❌ 不用 Frontend Design：

```java
// 随手写的颜色常量，跟任何其他后台一样
public class ThemeConfig {
    public static final String PRIMARY = "#1890FF";     // Ant Design 蓝
    public static final String SIDEBAR_BG = "#001529";  // Ant Design 深蓝
    // 嗯，跟 100 个其他后台一模一样
}
```

✅ Frontend Design 方式：

**第一步：锁定主体**

```text
> 这是 LexNexus，一个精品律所的 SaaS 后台。
> 用户是律师和法务助理——他们每天盯着屏幕 8 小时，处理高度精确的文字工作。
> 页面的工作：让信息层级绝对清晰，零视觉噪音。
```

**第二步：从主体的世界提取视觉语言**

法律世界的视觉语言不是"蓝色 = 权威"——那太宽泛了。更准确的来源是**法律文书**：

- 排版：法律文书的核心字体是**等宽衬线**——打字机时代的遗产，代表"每个字都有法律效力"。IBM Plex Serif 做标题（保留衬线的严肃感），IBM Plex Sans 做正文，IBM Plex Mono 做案卷编号。
- 配色：不是 Ant Design 蓝。法律文书的页面是**泛黄的白**——长时间阅读不刺眼。用 warm-white 底色 + ink-charcoal 正文 + legal-red（仅用于"截止日期"——不是装饰，是警告）。
- 布局：三层信息架构——左侧案卷列表（常驻）、中间文书正文（主区）、右侧案件信息（可折叠）。和实际翻阅卷宗的流程一致。
- 签名：只做一处——**案卷编号的等宽字体显示**。`LEX-2024-0387` 用 Mono 字体，每个字符等宽排列，像法律文书的编号戳。

```java
/**
 * LexNexus Design Token System
 * 法律 SaaS 后台 — 视觉语言来自法律文书
 *
 * 原则：
 * - 等宽衬线承载"严肃"（法律文书的字体遗产）
 * - ink-on-paper 配色（长时间阅读不刺眼）
 * - legal-red 仅用于截止日期（语义色，不是装饰）
 */
public enum LexNexusToken {

    // === 配色：文书页面 ===
    COLOR_PAPER("#FDFBF7"),              // warm-white — 法律文书底色
    COLOR_INK("#1C1917"),                // ink-charcoal — 正文
    COLOR_INK_SECONDARY("#57534E"),      // stone-600 — 次级文字
    COLOR_RULE("#D6D3D1"),              // stone-300 — 分割线（淡，不抢注意力）
    COLOR_LEGAL_RED("#B91C1C"),         // red-700 — 仅用于截止/逾期日期
    COLOR_DOCKET_BLUE("#1E40AF"),       // blue-800 — 案卷链接色

    // === 排版：法律文书体系 ===
    // 显示字体 — IBM Plex Serif（衬线保留严肃感）
    FONT_DISPLAY("IBM Plex Serif, Georgia, serif"),
    // 正文 — IBM Plex Sans（屏显可读）
    FONT_BODY("IBM Plex Sans, system-ui, sans-serif"),
    // 案卷编号 — IBM Plex Mono（等宽，文书编号感）
    FONT_DOCKET("IBM Plex Mono, Courier New, monospace"),

    // === 字号：文书比例 ===
    FONT_SIZE_XS(12),                    // 案卷元信息
    FONT_SIZE_BODY(15),                  // 正文（比 16px 略小——律师习惯）
    FONT_SIZE_DOCKET(18),                // 案卷编号
    FONT_SIZE_HEADING(22),              // 标题

    // === 间距：文档呼吸感 ===
    SPACING_PAGE(32),                    // 页面边距
    SPACING_SECTION(24),                 // 段落间距
    SPACING_PARAGRAPH(12),              // 行内间距

    // === 动效 — 几乎不动 ===
    DURATION_INSTANT(100),              // 列表切换
    DURATION_REVEAL(200),               // 面板展开
    // 没有 hover 颜色动画——律师不需要"活泼"

    // === 布局 ===
    SIDEBAR_WIDTH(280),                  // 案卷列表
    MAIN_MAX_WIDTH(720),                 // 文书正文 — 等同法律打印规格
    ELEVATION_CARD("0 1px 3px rgba(0,0,0,0.08)");  // 阴影极淡——不浮夸

    private final Object value;
    LexNexusToken(Object value) { this.value = value; }

    public String s() { return (String) value; }
    public int n() { return (Integer) value; }
}
```

**场景**：做一个案件列表展示。

```java
// 从 LexNexusToken 派生全部视觉决策
public class CaseListRenderer {

    /**
     * 案件列表项生成
     * 案卷编号用等宽字体——这是签名元素
     */
    public String renderCaseItem(CaseRecord c) {
        var overdue = c.deadline().isBefore(LocalDate.now());

        return """
            <div class="case-row">
              <span class="docket-number">%s</span>
              <div class="case-info">
                <span class="case-title">%s</span>
                <span class="case-meta">%s · %s</span>
              </div>
              %s
            </div>
            """.formatted(
                renderDocket(c.docketNumber()),     // LEX-2024-0387 — 等宽
                escapeHtml(c.title()),
                c.clientName(),
                c.court(),
                overdue ? renderDeadlineWarning(c.deadline()) : ""
            );
    }

    // 案卷编号 — <span class="docket-number" style="font-family: IBM Plex Mono">
    private String renderDocket(String number) {
        return "<span class=\"docket-number\">" + number + "</span>";
    }

    // 逾期警告 — 仅在 deadline 附近出现，legal-red 是语义色
    private String renderDeadlineWarning(LocalDate deadline) {
        return """
            <span class="deadline-warning" role="alert">
              ⚠ 截止 %s — %s 天
            </span>
            """.formatted(
                deadline.format(DateTimeFormatter.ofPattern("MM/dd")),
                ChronoUnit.DAYS.between(LocalDate.now(), deadline)
            );
    }
}
```

CSS 从 Token 派生：

```css
.case-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-section);           /* 24px */
  padding: var(--spacing-paragraph);     /* 12px */
  border-bottom: 1px solid var(--color-rule);
}
.docket-number {
  font-family: var(--font-docket);       /* 等宽——签名元素 */
  font-size: var(--font-size-docket);    /* 18px */
  color: var(--color-docket-blue);       /* 案卷链接色 */
  letter-spacing: 0.5px;                 /* 增强编号感 */
  min-width: 160px;                      /* 固定宽度，不抖动 */
  font-variant-numeric: tabular-nums;    /* 数字等宽 */
}
.case-info { display: flex; flex-direction: column; }
.case-title {
  font-family: var(--font-body);
  font-size: var(--font-size-body);      /* 15px */
  color: var(--color-ink);               /* 正文黑 */
}
.case-meta {
  font-size: var(--font-size-xs);        /* 12px */
  color: var(--color-ink-secondary);     /* 次级灰 */
}
.deadline-warning {
  font-size: var(--font-size-xs);
  color: var(--color-legal-red);         /* 仅此处用红 */
  font-weight: 600;
  margin-left: auto;                     /* 推到右边 */
  white-space: nowrap;                   /* 不折行 */
}
```

**关键**：这个后台的视觉语言来自"法律文书"——等宽衬线、案卷编号、暖纸底色——不是因为"好看"，是因为"这个领域本来就长这样"。

## 实战场景一：新品牌落地页——从"模板感"到"有记忆点"

### 场景

你要做一个播客平台（PodStream）的落地页。竞品全是深色背景 + 荧光绿播放按钮——所有播客平台首页都长一个样。

### 你怎么操作（对话流程）

**第一步：让 Frontend Design 做设计计划**

```text
> 做一个播客平台 PodStream 的首页。
> 定位：长文本播客（2-3 小时深度访谈），不是碎片 FM。
> 受众：通勤族和深夜听众。
> 页面的工作：让人点播放按钮听预告片。
```

### 不用 Frontend Design 的 AI 会怎么做

1. 深色背景 + 荧光绿 play 按钮（因为"音频 = 深色 + 绿色"在训练数据里最多）
2. 大标题 + subheadline + CTA 按钮的标准 hero
3. 跟 Spotify、Apple Podcasts、小宇宙 长得一模一样

**结果**：又一个"音频平台模板"，用户划过，不记得你叫什么。

### Frontend Design 方式

**第一步：从主体世界提取视觉语言**

播客世界最独特的东西是什么？不是"音频波形"（那个属于所有音频产品）。是**深夜**。

深夜收听者的世界里有什么？昏暗的床头灯、窗外的街灯、耳机里一个人的声音。视觉语言从光影里来——不是从音频波形里来。

**色彩**：不是荧光绿。深夜收听者的颜色是**暖光在黑暗中**——床头灯的 2700K 暖黄在近乎全黑的房间里。`#F5A623`（暖琥珀）在 `#0A0A0A` 底色上，只有一处亮光。

**排版**：不是 Inter。深夜收听的情感是**亲密**——一个人的声音在你耳边说话。排版应该像一本私密小说的排版：标题用 **Literata**（字体本身有"读书"的性格），正文用 **Source Serif 4**（小字号时温暖可读）。

**布局**：不是 hero → features → pricing 模板。深夜收听者的行为是"往下滑、发现、停住、听"。内容节奏应该是：**一个预告片（停住）→ 一段介绍文字（了解）→ 三个精选节目（选择）**。

**签名元素**：只有一处——**暖光呼吸动画**。播放按钮周围有一圈淡淡的琥珀色光晕，像床头灯在黑暗中呼吸。1.5s 的缓慢脉动，不是 300ms 的蹦跳。

```vue
<!-- PodStream Hero — 暖光呼吸 -->
<template>
  <section class="night-hero">
    <!-- 极暗背景 -->
    <div class="dark-canvas">
      <!-- 播放按钮 + 呼吸光晕 — 页面唯一的视觉焦点 -->
      <button class="play-btn" @click="playTrailer" :aria-label="isPlaying ? '暂停预告片' : '播放预告片'">
        <!-- 呼吸光晕层 -->
        <span class="glow-ring" aria-hidden="true" />
        <!-- 播放三角 SVG -->
        <svg class="play-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7z" fill="currentColor"/>
        </svg>
      </button>

      <h1 class="show-title">深夜对话录</h1>
      <p class="show-desc">每次 3 小时，跟一个人慢慢聊</p>
      <span class="episode-hint">最新：E12 · 张小龙 — "产品是世界观"</span>
    </div>
  </section>
</template>

<style>
/* === Token System === */
:root {
  --night-black: #0A0A0A;     /* 深夜房间底色 */
  --warm-amber: #F5A623;       /* 床头灯暖光 — 唯一亮色 */
  --warm-amber-dim: #8B6914;   /* 暖光暗色 — hover */
  --text-dim: #6B6B6B;         /* 次级文字 — 深夜可见但不刺眼 */
  --text-body: #A0A0A0;        /* 正文 */
  --font-display: 'Literata', serif;
  --font-body: 'Source Serif 4', serif;
  --breathe-duration: 3s;      /* 缓慢呼吸 — 不是 300ms */
}

.night-hero {
  background: var(--night-black);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark-canvas {
  text-align: center;
  max-width: 480px;
}

/* 播放按钮 + 呼吸光晕 — 页面唯一焦点 */
.play-btn {
  position: relative;
  width: 80px;
  height: 80px;
  border: none;
  background: none;
  cursor: pointer;
  margin: 0 auto 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 呼吸光晕 — 签名元素，只在这里用 */
.glow-ring {
  position: absolute;
  inset: -16px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(245, 166, 35, 0.12) 0%,    /* 中心亮 */
    rgba(245, 166, 35, 0.04) 50%,   /* 渐弱 */
    transparent 70%                  /* 消失在黑暗中 */
  );
  animation: breathe var(--breathe-duration) ease-in-out infinite alternate;
}

@keyframes breathe {
  from {
    transform: scale(0.95);
    opacity: 0.6;
  }
  to {
    transform: scale(1.12);
    opacity: 1;
  }
}

.play-icon {
  width: 32px;
  height: 32px;
  color: var(--warm-amber);
  transition: color 200ms ease;
}
.play-btn:hover .play-icon {
  color: var(--warm-amber-dim);
}

.show-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);  /* 响应式但不炫耀 */
  font-weight: 700;
  color: var(--warm-amber);              /* 暖光，不是荧光绿 */
  margin-bottom: 16px;
  letter-spacing: 0.02em;
}
.show-desc {
  font-family: var(--font-body);
  font-size: 1.125rem;
  color: var(--text-body);
  margin-bottom: 12px;
  font-style: italic;                    /* 斜体增加 "私人感" */
}
.episode-hint {
  font-size: 0.875rem;
  color: var(--text-dim);
}

/* reduced-motion — 呼吸变为静态光晕 */
@media (prefers-reduced-motion: reduce) {
  .glow-ring {
    animation: none;
    opacity: 0.8;
  }
}
</style>
```

**第二步：自我质疑**

同样的 prompt，换个产品（比如一个视频平台），会给出一样的结果吗？

不会。视频平台不该是黑暗中的暖光——视频是亮屏体验，是白天发的 YouTube 链接。配色和排版会完全不同。

**结果**：这个播客平台首页只有一个记忆点——黑暗中呼吸的琥珀色光晕。不撞脸。

## 实战场景二：重构老后台——从"Ant Design 复制品"到"有行业性格"

### 场景

你接手一个医疗机构后台。当前界面是标准的 Ant Design 蓝白模板——和银行后台、电商后台完全一样，没有任何行业特征。产品经理说"要看起来专业，但不要太冷冰冰"。

### 你怎么操作（对话流程）

**第一步：锁主体，提取视觉语言**

```text
> 这是 MediBoard，一个社区医院的电子病历后台。
> 用户是值班护士和医生——每班 12 小时，疲劳时会看错信息。
> 评审标准：能不能在凌晨 3 点、第 11 个小时的班次里，一眼分清"正常 / 观察 / 警告"？
```

医疗病历世界的视觉语言不是"蓝色"（那太宽泛了）。更精确的来源：**病历打印纸**的颜色和排版。

**配色**：暖白底色（长时间阅读不刺眼）、深灰正文、仅三种语义色——绿（正常）、琥珀（观察中）、红（警告）。没有装饰色，没有"品牌蓝"。

**排版**：不是 Inter。病历的传统字体遗产是**打字机**——但等宽字体在小字号时不可读。折中：**Noto Serif**（对亚洲文字有专业衬线）做标题，**Noto Sans** 做正文，**JetBrains Mono** 仅用于"心率/血压/血氧"等数值——保留"医疗读数 = 精确 = 等宽"的语义。

**布局**：两栏——左窄（病历列表，常驻）、右宽（病历正文，主区）。不叠卡片、不加阴影、不要圆角——医生在翻病历，不是在逛网站。

```java
/**
 * MediBoard Token System
 * 电子病历后台 — 视觉语言来自病历打印纸
 *
 * 原则：
 * - 暖白底 + 深灰字 = 12 小时班次不刺眼
 * - 仅三个语义色：绿（正常）、琥珀（观察）、红（警告）
 * - 等宽字体仅用于生命体征数值
 */
public enum MediToken {
    // === 配色：病历纸张 ===
    COLOR_CHART_PAPER("#FEFCF9"),        // 暖白 — 病历打印纸色
    COLOR_INK("#1E1B18"),                // 正文 — 不是纯黑，带暖意
    COLOR_INK_SECONDARY("#57534E"),      // 次级信息
    COLOR_GRID_LINE("#E7E5E4"),          // 表格线 — 极淡

    // 三级语义色 — 仅三个，没有第四个
    COLOR_NORMAL("#15803D"),             // 正常值 — 绿
    COLOR_OBSERVE("#B45309"),            // 观察中 — 琥珀
    COLOR_CRITICAL("#B91C1C"),           // 警告 — 红

    // === 排版：病历遗产 ===
    FONT_HEADING("Noto Serif SC, serif"),
    FONT_BODY("Noto Sans SC, sans-serif"),
    FONT_VITALS("JetBrains Mono, monospace"),  // 仅心率/血压等

    FONT_SIZE_VITALS(20),                // 生命体征读数
    FONT_SIZE_BODY(14),                  // 正文
    FONT_SIZE_LABEL(11),                 // 标签 — 最小但不低于 11px

    // === 布局：病历翻阅 ===
    SIDEBAR_WIDTH(260),
    MAIN_MAX_WIDTH(840),                 // 病历正文宽度
    GRID_GAP(0),                         // 无间距 — 表格是紧密的
    BORDER_RADIUS(0),                    // 无圆角 — 病历不需要"友好"
}
```

生命体征展示——等宽字体 + 语义色：

```java
public class VitalsRenderer {

    /**
     * 心率: <span class="vitals-value normal">72</span> bpm
     * 血压: <span class="vitals-value observe">142/88</span> mmHg
     * 血氧: <span class="vitals-value critical">89</span>%
     */
    public String renderVital(VitalSign vital) {
        String levelClass = switch (vital.severity()) {
            case NORMAL  -> "normal";
            case OBSERVE -> "observe";
            case CRITICAL -> "critical";
        };

        return """
            <div class="vital-row">
              <span class="vital-label">%s</span>
              <span class="vital-value %s">%s</span>
              <span class="vital-unit">%s</span>
            </div>
            """.formatted(
                vital.label(),     // "心率"
                levelClass,        // normal | observe | critical
                vital.display(),   // "72" — JetBrains Mono
                vital.unit()       // "bpm"
            );
    }
}
```

CSS：

```css
.vital-value {
  font-family: 'JetBrains Mono', monospace;  /* 等宽 = 精确感 */
  font-size: 20px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;        /* 数字等宽不抖动 */
}
.vital-value.normal   { color: #15803D; }    /* 绿 — 正常 */
.vital-value.observe  { color: #B45309; }    /* 琥珀 — 三更半夜最显眼 */
.vital-value.critical { color: #B91C1C; }    /* 红 — 必须行动 */
```

**结果**：这个后台不叫"好看"，叫"凌晨 3 点不会看错"。语义色只有三个——护士不需要猜"这个橙色是什么意思"。

## 最佳实践

### 什么时候用

| 场景 | 适合 | 不适合 |
|------|------|--------|
| 新品牌/新产品落地页 | ✅ 需要独特视觉身份 | — |
| 后台有新领域特征 | ✅ 让后台匹配行业 | — |
| 页面"缺乏个性" | ✅ 锁定主体重新提取 | — |
| 已有成熟设计系统 | — | ❌ 按现有系统走 |
| 纯功能迭代 | — | ❌ 不变视觉，只改逻辑 |
| 急修 bug | — | ❌ 不改设计 |

### 设计检查清单

每次交付前问自己三个问题：

1. **换个项目能用吗？** 同样的 prompt，改成另一个产品，输出会不会一样？一样 → 推翻。
2. **签名元素是唯一的吗？** 这个页面让人记住的**一个**东西是什么？没有 → 找到它加上。
3. **每个颜色、每个字体、每个间距有没有主体依据？** "好看"不是依据。"因为这是深夜收听者的床头灯"才是。

### 与 UI/UX Pro Max 的配合

Frontend Design 管"有没有个性"，UI/UX Pro Max 管"有没有踩坑"：

```text
Frontend Design → 锁定主体 → 提取视觉语言 → 设计 Token 系统
       ↓
UI/UX Pro Max → 对照 UX 准则检查：对比度、触控大小、键盘导航
       ↓
   交付 → 有个性 + 不踩坑
```

## 常见问题

### 这和 UI/UX Pro Max 有什么区别？

UI/UX Pro Max 是**检索式**的——从 161 套配色里匹配最适合你的。Frontend Design 是**推导式**的——从你的产品世界里提取独一无二的视觉语言。前者确保"不踩坑"，后者确保"不撞脸"。配合使用效果最好。

### 每次都要从零设计 Token 系统吗？

新项目/新品牌时值得。迭代现有项目时走现有 Token 系统，不要推翻重来。

### 设计得不满意怎么办？

回到第一步——锁定的主体不够具体。"一个 SaaS 后台"不具体。"一个社区医院护士凌晨 3 点看生命体征的后台"才具体。主体越具体，视觉语言越有据可依。

### 能用来做组件库设计吗？

能。但不是"做一套万能组件"——是做**匹配你这个主体的组件库**。律所后台的 Button 和播客平台的 Button 不应该长一样。
