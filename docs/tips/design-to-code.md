---
title: Axure + Playwright + 前端 + Superpowers 实战
description: 用 Axure 原型做设计源、Playwright 做桥梁验证、前端实现后回测、Superpowers 串联全流程——从设计稿到上线的完整闭环
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★☆☆☆  | ★★★★☆    |
| 📦 产品 | ★★★★☆  | ★★★☆☆    |

**🎯 学习产出：** 掌握 Axure 原型到 Playwright 验证再到前端实现的完整流程，能独立建立设计稿→代码的可验证闭环

**🚀 AI 能力提升：** 设计→代码
:::

# Axure + Playwright + 前端 + Superpowers 实战

> 设计师出 Axure 原型，Playwright 把它变成可验证的活文档，Superpowers 带着前端团队把它做成真的——一个都不掉链子。

## 为什么这四样东西要放一起

传统流程的问题：设计师给 Axure 原型 → 前端看两眼开始写代码 → 写完发现和原型长得不一样 → 改 → 再改。中间没有桥梁，全靠人眼比对。

```
传统流程：
  Axure 原型  ──👀──  前端实现  ──😰──  上线走样

加 Playwright + Superpowers：
  Axure 原型  ──🟢 Playwright 自动验证  ──🟡 前端 TDD 实现  ──🟢 Playwright 回归  ──✅ 上线
```

四样东西各司其职：

| 角色            | 干什么                                     | 谁在用                  |
| --------------- | ------------------------------------------ | ----------------------- |
| **Axure**       | 交互原型，设计源                           | 设计师 / PM             |
| **Playwright**  | 自动化验证桥梁                             | 前端 / QA / Claude Code |
| **前端**        | 真实实现                                   | 前端 / Claude Code      |
| **Superpowers** | 流程纪律：brainstorm → plan → tdd → review | Claude Code             |

## 完整实战流程

### 场景：设计师给了一个 Axure 后台表单页面原型

假设原型里有一个"新建用户"表单：姓名、邮箱、角色下拉、提交按钮，提交后跳转到列表页。设计师已经导出成静态 HTML 放在 `design/user-form/` 目录。

### Step 1：Axure 原型 → Playwright 快照（建立"标准答案"）

先不给前端看原型写代码。先用 Playwright 把原型的交互录成测试——这就是"标准答案"。后面前端写完了，跑同样的测试，通过就说明实现和设计一致。

```ts
// tests/design-specs/user-form.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Axure 原型验证 - 新建用户表单', () => {
  test.beforeEach(async ({ page }) => {
    // 打开 Axure 导出的静态原型
    await page.goto(`file://${process.cwd()}/design/user-form/index.html`);
  });

  test('表单字段完整性', async ({ page }) => {
    // 验证所有设计稿中的字段都存在
    await expect(page.getByLabel('姓名')).toBeVisible();
    await expect(page.getByLabel('邮箱')).toBeVisible();
    await expect(page.getByLabel('角色')).toBeVisible();
    await expect(page.getByRole('button', { name: '提交' })).toBeVisible();
  });

  test('角色下拉选项', async ({ page }) => {
    const roleSelect = page.getByLabel('角色');
    await expect(roleSelect).toBeVisible();

    const options = await roleSelect.locator('option').allTextContents();
    expect(options).toContain('管理员');
    expect(options).toContain('普通用户');
    expect(options).toContain('只读');
  });

  test('表单验证 - 空字段提交', async ({ page }) => {
    await page.getByRole('button', { name: '提交' }).click();
    // 原型中应有错误提示
    await expect(page.getByText('请输入姓名')).toBeVisible();
    await expect(page.getByText('请输入邮箱')).toBeVisible();
  });

  test('正常提交流程', async ({ page }) => {
    await page.getByLabel('姓名').fill('张三');
    await page.getByLabel('邮箱').fill('zhangsan@example.com');
    await page.getByLabel('角色').selectOption('管理员');
    await page.getByRole('button', { name: '提交' }).click();

    // 原型中提交后跳转到列表页
    await expect(page).toHaveURL(/user-list/);
    await expect(page.getByText('张三')).toBeVisible();
  });
});
```

```bash
# 跑一遍，确认原型本身的行为是正确的
npx playwright test tests/design-specs/user-form.spec.ts
```

:::tip
**Playwright 访问本地 HTML 文件**：`file://` 协议可以直接打开 Axure 导出的静态页面。如果原型涉及 AJAX 请求，用 `page.route()` mock 掉后端接口。
:::

这一步的价值：

- **设计师**：原型有问题，测试就直接挂了——bug 在设计阶段被发现
- **前端**：不用再"感觉哪里不对但说不出"，测试就是精确的验收标准
- **PM**：测试报告就是"设计还原度"的量化指标

### Step 2：用 Superpowers 启动前端实现

原型验证通过后，切到 Superpowers 工作流来写前端代码：

```bash
# 切到功能分支
git checkout -b feature/user-form

# Step 2.1：头脑风暴 — 确认技术方案
/brainstorm
```

在头脑风暴时说清楚上下文：

```text
> 实现新建用户表单页面。
> 设计稿在 design/user-form/index.html（Axure 原型）。
> 验收标准已经在 tests/design-specs/user-form.spec.ts 里（Playwright 测试）。
>
> 技术栈：React + TypeScript + react-hook-form + zod。
> 后端接口：POST /api/users，字段 name / email / role。
```

Superpowers 会帮你理清：

- 组件拆分为 `UserForm`（表单本体）+ `UserFormPage`（页面容器）
- 表单库选 react-hook-form + zod 是因为字段超 3 个且有联动校验
- 路由：`/users/new` → 成功后跳转 `/users`

```bash
# Step 2.2：写实施计划
/write-plan
```

Superpowers 生成结构化 plan：

```text
Plan: 新建用户表单
├── 1. 安装依赖：react-hook-form, zod, @hookform/resolvers
├── 2. 创建 UserForm 组件（src/components/UserForm.tsx）
│   ├── 字段：name（text）, email（email）, role（select）
│   ├── 校验：name 必填 2-20 字，email 合法，role 必选
│   └── 提交：loading 状态 + 错误处理
├── 3. 创建路由页面（src/pages/UserNew.tsx）
├── 4. 注册路由 /users/new
└── 5. 跑 Playwright 验收测试确认通过
```

```bash
# Step 2.3：TDD 实现
/tdd
```

Superpowers 的 TDD 流程会带着你：

1. 先写单元测试（校验逻辑、表单交互）
2. 再写组件代码
3. 跑测试 → 红灯 → 绿灯
4. 重构

```tsx
// src/components/UserForm.tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, '姓名至少 2 个字符').max(20, '姓名最多 20 个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  role: z.enum(['admin', 'user', 'readonly'], { required_error: '请选择角色' }),
});

type FormData = z.infer<typeof schema>;

export default function UserForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      window.location.href = '/users';
    } catch (e) {
      alert('提交失败：' + (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <div>
        <label htmlFor="name">姓名</label>
        <input id="name" {...register('name')} className="w-full border rounded px-3 py-2" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email">邮箱</label>
        <input id="email" type="email" {...register('email')} className="w-full border rounded px-3 py-2" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="role">角色</label>
        <select id="role" {...register('role')} className="w-full border rounded px-3 py-2">
          <option value="">请选择</option>
          <option value="admin">管理员</option>
          <option value="user">普通用户</option>
          <option value="readonly">只读</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {submitting ? '提交中…' : '提交'}
      </button>
    </form>
  );
}
```

### Step 3：Playwright 回归 —— 同一套测试，换一个 URL

前端写完了，把 Step 1 的 Playwright 测试**改一行 URL**，从原型切到真实前端：

```ts
// tests/design-specs/user-form.spec.ts
test.beforeEach(async ({ page }) => {
  // 原型阶段：file:///.../design/user-form/index.html
  // 前端实现后：换成 dev server URL
  await page.goto('http://localhost:5173/users/new');
});
```

其他断言完全不变。跑：

```bash
npx playwright test tests/design-specs/user-form.spec.ts
```

全部通过 → 前端实现和设计原型**精确一致**。

:::info
这就是 Playwright 做设计验收的核心思路：**同一套测试用例，先在 Axure 原型上跑（验证设计正确性），再在真实前端上跑（验证实现正确性）。** 测试用例就是设计师和开发之间的合约。
:::

### Step 4：Superpowers 审查 + 交付

```bash
# 代码审查
/code-review

# 设计还原度审查（用 Playwright 截图对比）
npx playwright test tests/design-specs/ --reporter=html
```

```bash
# 提交
git add .
git commit -m "feat(users): add user creation form with validation"
```

## Playwright 进阶：截图对比

跑完断言还可以加上**视觉对比**——截图 Axure 原型和真实前端，并排比较：

```ts
test('视觉一致性 - 截图对比', async ({ page }) => {
  // 1. 截原型
  await page.goto(`file://${process.cwd()}/design/user-form/index.html`);
  const designShot = await page.screenshot({ fullPage: true });

  // 2. 截前端
  await page.goto('http://localhost:5173/users/new');
  const implShot = await page.screenshot({ fullPage: true });

  // 3. 像素级对比
  expect(implShot).toMatchSnapshot('user-form.png');
});
```

首次运行生成基准截图（`user-form.png`），后续运行自动对比。差异超出阈值时 Playwright 会生成 diff 图，直接贴到 PR 里。

```bash
# CI 中跑视觉回归
npx playwright test --update-snapshots  # 设计师确认改动后更新基准
```

## 实战速查表

| 阶段         | 你做什么                                     | 产出                                           |
| ------------ | -------------------------------------------- | ---------------------------------------------- |
| **原型验收** | 设计师导出 Axure → 写 Playwright 测试 → 跑通 | `tests/design-specs/*.spec.ts`（通过原型验证） |
| **头脑风暴** | `/brainstorm`，说清楚上下文                  | 技术方案确认                                   |
| **写计划**   | `/write-plan`                                | 结构化实施 plan                                |
| **TDD 实现** | `/tdd`                                       | 通过单元测试的组件代码                         |
| **回归测试** | Playwright 改 URL，再跑一遍                  | 设计还原度报告                                 |
| **审查**     | `/code-review`                               | 代码质量报告                                   |
| **交付**     | commit + PR                                  | 线上可用                                       |

## Claude Code 串联全流程

有了这个流程，你可以用 Claude Code 把大部分步骤自动化：

```text
> 设计师更新了 Axure 原型 user-form，帮我做以下事情：
> 1. 检查 tests/design-specs/user-form.spec.ts 是否需要更新（原型改动点）
> 2. 先在原型的 Playwright 测试上跑一遍，确认设计本身没问题
> 3. 更新前端代码匹配新原型
> 4. 在真实前端上跑同一套 Playwright 测试，确认通过
> 5. 跑 /code-review
> 6. 如果全部通过，commit 并提 PR
```

Claude Code 会自动：

- 对比旧新原型差异
- 更新 Playwright 测试
- 用 Superpowers TDD 改前端代码
- 跑全量测试
- 生成 PR

## 常见问题

### Axure 导出的 HTML 结构太乱，Playwright 选择器怎么写？

Axure 生成的 HTML 确实有很多 `div` 嵌套。用 Playwright 的**文本选择器**和**角色选择器**而不是 CSS 类名：

```ts
// ❌ 靠 Axure 生成的 class（可能每次导出都变）
await page.locator('.ax_default.primary_button').click();

// ✅ 靠文本和角色（稳定，除非产品改了按钮文案）
await page.getByRole('button', { name: '提交' }).click();
await page.getByLabel('姓名').fill('张三');
```

### 原型里有交互逻辑（条件显示/跳转），怎么测？

Axure 导出的 HTML 自带交互脚本。Playwright 可以正常触发和验证：

```ts
// 选择"其他"角色 → 应该出现"自定义角色"输入框
await page.getByLabel('角色').selectOption('其他');
await expect(page.getByLabel('自定义角色')).toBeVisible();
```

### 前端和原型有"合理差异"（比如原型没做 loading 状态），怎么办？

不是所有差异都是问题。合理差异包括：

- 原型没做的 loading / empty / error 状态 → 前端应该加
- 原型用了静态图片，前端用动态数据源 → 正常
- 原型没做响应式，前端要做 → 正常

在 Playwright 测试中区分两类断言：

```ts
// 必须完全一致（结构、字段、文案）
await expect(page.getByLabel('姓名')).toBeVisible();

// 原型没有但前端应该有（不要断言原型的缺失）
await expect(page.getByText('提交中…')).toBeVisible(); // 前端新增的 loading 文案
```

### Playwright 测试跑太慢怎么办？

原型阶段（`file://` 协议）很快，前端阶段会慢一些。优化手段：

```bash
# 并行跑
npx playwright test --workers=4

# 只跑变更相关的测试
npx playwright test tests/design-specs/ --only-changed=main

# 设计验收测试和功能测试分开跑（设计验收可以低频）
npx playwright test tests/design-specs/    # 设计师更新原型时才跑
npx playwright test tests/e2e/             # 每次 PR 都跑
```

---
