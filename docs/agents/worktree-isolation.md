---
title: Worktree 隔离并行开发 — 两个 Feature 同时开工
description: 用 Agent isolation mode 在两个独立 Worktree 中并行开发用户头像上传和邮件通知重构，文件系统隔离互不干扰，开发效率翻倍
pageType: doc
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★★☆    |
| 🧪 测试 | ★★★☆☆  | ★★★★☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握 Agent Worktree 隔离模式，能独立编排并行 Feature 开发，理解隔离开销和适用边界

**🚀 AI 能力提升：** 并行开发、环境隔离
:::

## 场景概述

假设你在维护一个 Next.js 全栈项目，产品规划了两个独立需求：

1. **用户头像上传组件** -- 支持拖拽上传、图片裁剪、压缩预览，涉及新建 `AvatarUpload` 组件和后端上传 API
2. **邮件通知模块重构** -- 从硬编码的 SendGrid 调用抽象出 `MailService` 接口，替换模板引擎为 React Email

两个 feature 修改的文件完全不重叠——一个动 `components/` 和 `app/api/upload/`，一个动 `lib/mail/` 和 `templates/`。按传统方式，你只能在分支 A 开发完、commit、切到分支 B 继续——串行等待浪费时间。如果中途产品说"头像上传先上"，你得 stash 邮件重构的改动才能切回去，来回切换既慢又容易出错。

但如果你可以**在两个完全独立的文件系统中同时开发两个 feature**，各自拥有干净的上下文，开发完分别 review、分别 merge——这就是 Agent Worktree 隔离模式要解决的问题。

## 为什么用 Worktree 隔离

先看清楚三种"并行开发"方式的本质区别：

| 方式              | 原理                                     | 上下文隔离                              | 文件系统 | 切换成本                          | 适合场景                   |
| ----------------- | ---------------------------------------- | --------------------------------------- | -------- | --------------------------------- | -------------------------- |
| git stash 切换    | 暂存改动 → 切分支 → 恢复                 | 差（同一目录，文件残留）                | 共享     | 手动 `stash` + `pop`，易冲突      | 临时打断，快速切回         |
| git checkout 分支 | 切换到另一分支的 HEAD                    | 差（只改了 Git 指针，工作目录是共享的） | 共享     | 必须先 commit 或 stash 当前改动   | 单线程开发，一次只做一件事 |
| git worktree      | 创建独立目录，每个目录有独立分支和工作区 | **好**（完全独立的文件系统）            | **隔离** | 零切换，两个终端各连一个 worktree | 真正的并行开发             |

Worktree 的核心优势就两点：

1. **真正的并行**：Agent A 在 `worktree-a` 里写头像组件时，Agent B 同时在 `worktree-b` 里改邮件模板，两者完全不知道对方的存在。不存在"我先 commit 你才能开始"的串行依赖。
2. **文件系统隔离**：每个 worktree 有自己完整的 `node_modules`、`dist`、编辑器缓存。Agent A 装了 `react-image-crop`，Agent B 的世界里根本不存在这个包——不会有幽灵依赖的干扰。

:::warning
Worktree 隔离不是银弹。创建 worktree 有 **200-500ms 的开销**（Git 需要 checkout 整个工作树），且当两个 feature 修改**同一文件的不同部分**时，merge 阶段仍会产生冲突。真正的并行前提是：两个 feature 改的文件不重叠。
:::

## 前置准备

```bash
# 确认 git worktree 可用（Git 2.5+ 内置，无需额外安装）
git worktree list
# 输出示例：
# /Users/me/project  abc1234 [main]

# 项目结构 — Next.js + TypeScript 全栈项目
# .
# ├── app
# │   ├── api
# │   │   └── upload/          # ← 头像上传 API（feature A 修改此目录）
# │   ├── page.tsx
# │   └── layout.tsx
# ├── components
# │   └── AvatarUpload/        # ← 头像上传组件（feature A 新增）
# ├── lib
# │   └── mail/                # ← 邮件模块（feature B 修改此目录）
# ├── emails/                  # ← 邮件模板（feature B 修改此目录）
# ├── package.json
# └── tsconfig.json
```

项目已经 `npm install` 完毕，`npm run dev` 能正常启动。接下来用两个 Agent + 两个 Worktree 并行推进。

## 完整交互过程

### Step 1：创建两个 feature 分支并编写 Workflow 脚本

先创建两个分支，然后编写脚本驱动 Agent。

```bash
# 从 main 创建两个 feature 分支
git checkout -b feature/avatar-upload main
git push -u origin feature/avatar-upload

git checkout -b feature/mail-refactor main
git push -u origin feature/mail-refactor

# 回到 main
git checkout main
```

接下来是关键环节——编写 Workflow 脚本。这里用一个 TypeScript 脚本编排两个 Agent，分别指定 `isolation: 'worktree'`。

```typescript
// scripts/parallel-features.ts
export const meta = {
  title: '并行 Feature 开发：头像上传 + 邮件重构',
  description: '在两个独立 Worktree 中并行开发用户头像上传组件和邮件通知模块重构',
};

const [resultA, resultB] = await parallel([
  {
    description: '开发用户头像上传组件',
    isolation: 'worktree',
    branch: 'feature/avatar-upload',
    prompt: `
在 feature/avatar-upload 分支上开发用户头像上传功能，改动范围仅限于以下目录：

## 需求
1. 在 components/AvatarUpload/ 下新建 AvatarUpload 组件
   - 支持拖拽上传和点击选择
   - 上传前用 canvas 裁剪为 200x200 正方形
   - 上传进度条显示百分比
   - 文件大小限制 5MB，仅允许 image/png, image/jpeg
2. 在 app/api/upload/route.ts 中新建 POST 端点
   - 接收 multipart/form-data
   - 存储到 public/uploads/avatars/
   - 返回 URL 路径

## 约束
- 不要修改 components/ 和 app/api/upload/ 之外的任何文件
- 使用 React 18 + TypeScript
- 上传 API 不要引入第三方存储服务，本地文件系统即可
- 组件状态用 useState + useRef，不需要状态管理库

完成后输出：改了哪些文件、每个文件的用途、如何测试（curl 命令或手动操作步骤）。
`,
  },
  {
    description: '重构邮件通知模块',
    isolation: 'worktree',
    branch: 'feature/mail-refactor',
    prompt: `
在 feature/mail-refactor 分支上重构邮件通知模块，改动范围仅限于 lib/mail/ 和 emails/ 目录。

## 需求
1. 在 lib/mail/ 下抽象 MailService 接口
   - send(options: SendOptions): Promise<SendResult>
   - 接口方法不依赖具体实现
2. 实现 SendGridMailService 和 ResendMailService
   - 两个实现都满足 MailService 接口
   - 通过工厂函数 createMailService(provider) 创建实例
3. 把 emails/ 下的 Handlebars 模板替换为 React Email 组件
   - 新建 emails/WelcomeEmail.tsx
   - 新建 emails/PasswordReset.tsx

## 约束
- 不要修改 lib/mail/ 和 emails/ 之外的任何文件
- 接口定义和实现分离到不同文件
- React Email 组件使用 @react-email/components

完成后输出：改了哪些文件、MailService 接口设计理由、旧模板和新 React Email 模板的对比。
`,
  },
]);

log(`\n===== Agent 1 完成 =====`);
log(resultA.output);
log(`\n===== Agent 2 完成 =====`);
log(resultB.output);
```

脚本编写完成后，通过 Claude Code 的 Workflow 工具运行即可。Workflow 脚本在对话中执行——将脚本内容提供给 CC，它会自动识别 `export const meta` 格式并调用 Workflow 工具。

脚本执行后，两个 Agent 会分别在各自的 worktree 中启动。你会看到 Agent A checkout 到 `feature/avatar-upload` 的 worktree，Agent B checkout 到 `feature/mail-refactor` 的 worktree——两个目录完全隔离，并行推进。

:::tip
`isolation: 'worktree'` 是 Workflow 的内置选项，不需要手动 `git worktree add`。Agent 启动时会自动创建临时 worktree、checkout 目标分支，任务完成后自动清理（除非你配置了保留）。
:::

### Step 2：Agent A 在 worktree A 开发头像上传功能

Agent A 收到指令后，在独立的 worktree 中完成组件和后端 API。

**CC 输出：**

````text
## 交付摘要

### 新建文件：components/AvatarUpload/index.tsx

```tsx
'use client'

import { useState, useRef, useCallback } from 'react'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg']

export default function AvatarUpload() {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) return '仅支持 PNG 和 JPEG 格式'
    if (file.size > MAX_SIZE) return '文件大小不能超过 5MB'
    return null
  }

  const cropToSquare = useCallback((file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const size = Math.min(img.width, img.height)
        const canvas = document.createElement('canvas')
        canvas.width = 200
        canvas.height = 200
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 200, 200)
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('裁剪失败')), file.type)
      }
      img.src = URL.createObjectURL(file)
    })
  }, [])

  const uploadFile = async (blob: Blob) => {
    const formData = new FormData()
    formData.append('file', blob)

    setUploading(true)
    setProgress(0)
    setError(null)

    const xhr = new XMLHttpRequest()
    xhr.upload.onprogress = e => e.lengthComputable && setProgress(Math.round((e.loaded / e.total) * 100))
    xhr.onload = () => {
      if (xhr.status === 200) {
        const { url } = JSON.parse(xhr.responseText)
        setPreview(url)
      } else {
        setError('上传失败')
      }
      setUploading(false)
    }
    xhr.onerror = () => { setError('网络错误'); setUploading(false) }
    xhr.open('POST', '/api/upload')
    xhr.send(formData)
  }
  // ... 拖拽处理和渲染逻辑省略，完整代码见分支
}
````

### 新建文件：app/api/upload/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: '未找到文件' }, { status: 400 });

  const ext = file.name.split('.').pop() || 'png';
  const filename = `${uuid()}.${ext}`;
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');

  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/avatars/${filename}` });
}
```

### 设计决策

- **XHR 替代 fetch**：fetch 不支持上传进度回调，用 XHR 的 `upload.onprogress` 实现进度条
- **Canvas 裁剪在前端**：减少服务端图像处理开销，200x200 的 canvas 输出足够头像使用
- **文件名校验**：用 uuid 重命名避免路径遍历和文件名冲突

````

### Step 3：Agent B 在 worktree B 重构邮件通知

与此同时，Agent B 在另一个 worktree 中独立推进邮件重构。

**CC 输出：**

```text
## 交付摘要

### 新建文件：lib/mail/types.ts

```typescript
export interface SendOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export interface SendResult {
  messageId: string
  accepted: string[]
}

export interface MailService {
  send(options: SendOptions): Promise<SendResult>
}
````

### 新建文件：lib/mail/providers/sendgrid.ts

```typescript
import sgMail from '@sendgrid/mail';
import type { MailService, SendOptions, SendResult } from '../types';

export class SendGridMailService implements MailService {
  constructor(apiKey: string) {
    sgMail.setApiKey(apiKey);
  }

  async send(options: SendOptions): Promise<SendResult> {
    const [response] = await sgMail.send({
      to: options.to,
      from: options.from || process.env.MAIL_FROM!,
      subject: options.subject,
      html: options.html,
    });

    return {
      messageId: response.headers['x-message-id'] || '',
      accepted: [options.to],
    };
  }
}
```

### 新建文件：lib/mail/providers/resend.ts

```typescript
import { Resend } from 'resend';
import type { MailService, SendOptions } from '../types';

export class ResendMailService implements MailService {
  private resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  async send(options: SendOptions) {
    const { data, error } = await this.resend.emails.send({
      to: [options.to],
      from: options.from || process.env.MAIL_FROM!,
      subject: options.subject,
      html: options.html,
    });

    if (error) throw new Error(error.message + ': ' + error.name);
    return { messageId: data!.id, accepted: [options.to] };
  }
}
```

### 新建文件：lib/mail/factory.ts

```typescript
import type { MailService } from './types';
import { SendGridMailService } from './providers/sendgrid';
import { ResendMailService } from './providers/resend';

export function createMailService(provider: 'sendgrid' | 'resend' = 'resend'): MailService {
  const apiKey = process.env.MAIL_API_KEY;
  if (!apiKey) throw new Error('MAIL_API_KEY 环境变量未设置');

  switch (provider) {
    case 'sendgrid':
      return new SendGridMailService(apiKey);
    case 'resend':
      return new ResendMailService(apiKey);
  }
}
```

### 设计决策

- **MailService 接口只定义 `send`**：当前需求只有发送邮件，不做过度抽象。接口只有一个方法，未来加 `sendBatch`、`getStatus` 时扩展接口即可
- **工厂函数替代 DI 容器**：项目规模不需要依赖注入框架，一个简单的 `createMailService()` 就够了，通过环境变量控制用哪个 provider
- **旧模板 vs 新模板**：Handlebars 模板需要维护 `.hbs` + JSON context 两套文件，React Email 模板是纯 TypeScript，类型安全且可以在 dev 模式下实时预览

````

:::info
两个 Agent 在各自的 worktree 中同时工作——Agent A 改 `components/AvatarUpload/` 和 `app/api/upload/`，Agent B 改 `lib/mail/` 和 `emails/`。修改的文件完全不重叠，所以两个 worktree 之间没有任何感知，各自 `npm run dev` 也不互相影响。
:::

### Step 4：Review → Diff → Merge

两个 Agent 都完成后，回到 main 工作区，对两个 feature 分别做 code review 和合并。

```bash
# 查看 agent A 的改动
git diff main...feature/avatar-upload --stat

# 审查具体改动
git diff main...feature/avatar-upload

# 确认无误后合并
git checkout main
git merge feature/avatar-upload

# 同理处理 feature B
git diff main...feature/mail-refactor --stat
git diff main...feature/mail-refactor
git merge feature/mail-refactor

# 验证合并结果
npm run build
npm run dev
````

因为两个 feature 修改的文件完全不重叠，两次 merge 都不会产生冲突——你甚至可以先合并 B 再合并 A，顺序无关紧要。

```text
$ git merge feature/avatar-upload
Updating abc1234..def5678
Fast-forward
 components/AvatarUpload/index.tsx    | 120 ++++++++++++++++
 app/api/upload/route.ts              |  28 ++++
 2 files changed, 148 insertions(+)

$ git merge feature/mail-refactor
Updating def5678..ghi9012
Fast-forward
 lib/mail/types.ts                   |  14 +++
 lib/mail/providers/sendgrid.ts      |  26 ++++
 lib/mail/providers/resend.ts        |  30 ++++
 lib/mail/factory.ts                 |  18 +++
 emails/WelcomeEmail.tsx             |  35 +++++
 emails/PasswordReset.tsx            |  42 ++++++
 6 files changed, 165 insertions(+)
```

## 要点总结

1. **只有文件不重叠的独立 feature 才适合 worktree 并行**。如果两个 feature 都要改同一个文件的不同部分（比如都动 `package.json` 的 dependencies），merge 阶段会产生冲突，worktree 的优势就大打折扣。
2. **Worktree 隔离的本质是"两个独立文件系统同时工作"**。不是简单的分支切换——每个 worktree 有自己的 `node_modules`、构建缓存、临时文件，Agent 在各自的世界里互不干扰。
3. **每个 worktree 创建开销约 200-500ms**。Git 需要从 `.git` 里 checkout 一份完整的工作树。项目越大、文件越多，创建时间越长。这个开销发生在 Agent 启动时，不是运行过程中。
4. **各自独立 review、按任意顺序合并**。因为两个 feature 改的文件不重叠，review 可以并行做，merge 顺序无关紧要。这比传统"串行开发 + 串行 review"快了接近一倍。
5. **Agent 拿到的是"干净的分支"，不是"你的工作区快照"**。`isolation: 'worktree'` 让 Agent 基于目标分支的 HEAD 开始工作——不会把你本地未 commit 的修改带进去，避免了"我改了 A，Agent 基于有 A 改动的代码又改了 B"的链式污染。

## 变体与延伸

### 变体 1：多人协作模拟

如果你想模拟"两个人同时开发"的场景，可以用 Worktree 隔离跑三个 Agent：

```text
# Agent 1（你）
- 在 main 工作区做 code review 和合并
# Agent 2（"同事小王"）
- 在 worktree A 开发头像上传，isolation: 'worktree', branch: 'feature/avatar-upload'
# Agent 3（"同事小李"）
- 在 worktree B 重构邮件通知，isolation: 'worktree', branch: 'feature/mail-refactor'
```

这样你作为项目 owner，同时"管理"两个虚拟同事——他们的产出独立、评审独立、合并独立。适合做 workshop 演示或者练习 Git flow。

### 变体 2：A/B 方案并行对比

当你不确定用方案 A 还是方案 B 时，让两个 Agent 分别在 worktree 中实现，然后对比产出：

```text
# Agent A — Canvas 前端裁剪方案
"在 worktree-a 中实现头像上传，用前端 Canvas 裁剪为 200x200，base64 上传"

# Agent B — Sharp 服务端裁剪方案
"在 worktree-b 中实现头像上传，上传原图后用 sharp 库在服务端裁剪为 200x200"
```

两个方案完成后对比：

| 维度       | Canvas 前端裁剪             | Sharp 服务端裁剪     |
| ---------- | --------------------------- | -------------------- |
| 上传流量   | 小（只传 200x200 裁剪结果） | 大（传原始大图）     |
| 服务器负载 | 无额外处理                  | 需要图像解码 + 裁剪  |
| 移动端体验 | Canvas 在低端机上可能卡顿   | 客户端无压力         |
| 灵活性     | 只能产出一种尺寸            | 可以随时调整裁剪尺寸 |

这种"A/B 并行、对比选优"的模式特别适合架构选型和技术决策。

### 延伸：重构新旧代码并行对比

Worktree 也可以用来安全地做"渐进式重构"——一边在老分支上继续修 bug，一边在新分支上重构：

```bash
# worktree A：在 main 上修 bug（改同一个 controller）
# worktree B：在 refactor-new-arch 上重构同一个 controller

# 重构完、测试通过后，比对两个版本的 diff，确认行为等价
diff <(git show main:src/controller.ts) <(git show refactor-new-arch:src/controller.ts)
```

:::warning
这种场景下两个 worktree 修改的是同一个文件，merge 时一定会产生冲突（甚至重构版已经改得面目全非）。**只建议在重构的探索阶段使用**——用 worktree 保护原代码不被破坏，重构确认 OK 后再决定是直接替换还是合并。
:::

### 相关场景

- [全栈并行开发](./fullstack-development) — 多 Agent 并行全栈开发
- [大规模迁移](./large-scale-migration) — Discover + Fan-out 批量迁移
