# CC Learn

> 📚 一份由浅入深的 Claude Code 使用教程 — 从入门到精通

[![Deploy](https://img.shields.io/badge/🔗%20在线阅读-claude--learn.pages.dev-0f766e)](https://claude-learn.pages.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Rspress](https://img.shields.io/badge/Built%20with-Rspress%20v2-ff6b35)](https://rspress.dev)

## ✨ 项目简介

CC Learn 是一份中文 Claude Code 使用教程，涵盖从安装配置到高级工作流的全部内容。无论你是初次接触 AI 编程助手，还是想要深入掌握 Hooks、MCP 服务器和多智能体协作，这里都能找到对应的指南。

**🔗 在线访问：[claude-learn.pages.dev](https://claude-learn.pages.dev)**

## 📖 内容目录

| 章节         | 说明                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------ |
| **基础篇**   | 安装配置、首次对话、文件操作、权限模型                                                     |
| **进阶篇**   | 代码库导航、Slash 命令、CLAUDE.md 约定、Git 工作流、上下文管理                             |
| **高级篇**   | Hooks、MCP 服务器、多智能体、自动化、Superpowers、Gstack 等工具链集成                      |
| **技能**     | 自定义 Skills、技能市场、Superpowers / Gstack / Ralph / Openspec 工作流、Context7 文档查询 |
| **实用技巧** | React / Vue / Java / 前端最佳实践、ECC 效率技巧                                            |
| **命令参考** | Claude Code 完整命令速查手册                                                               |

## 🛠️ 技术栈

- **[Rspress v2](https://rspress.dev)** — 基于 Rspack 的静态文档站生成器
- **React 19** — 主题和组件层
- **TypeScript** — 严格模式
- **pnpm** — 包管理器
- **Cloudflare Pages** — 部署平台

## 🚀 本地开发

### 环境要求

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) (项目已声明 `packageManager`，推荐使用 [corepack](https://nodejs.org/api/corepack.html) 自动管理)

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/Muromi-Rikka/cc-learn.git
cd cc-learn

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本（输出到 doc_build/）
pnpm build

# 本地预览构建产物
pnpm preview
```

## 📁 项目结构

```
cc-learn/
├── docs/                    # 文档内容根目录
│   ├── guide/               # 教程（基础篇 / 进阶篇 / 高级篇）
│   ├── skills/              # 技能相关文档
│   ├── commands/            # 命令参考
│   ├── tips/                # 实用技巧
│   └── public/              # 静态资源（logo、图标）
├── theme/                   # 主题扩展（CSS 变量覆盖）
├── rspress.config.ts        # Rspress 站点配置
├── package.json
└── tsconfig.json
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feat/your-feature`
3. 提交更改：`git commit -m "docs: add xxx"`
4. 推送分支：`git push origin feat/your-feature`
5. 提交 Pull Request

### 内容编写规范

- 所有文档使用中文撰写，技术术语保留英文
- 每个文档页面需添加 `description` frontmatter（50–160 字符）
- 验证方式：运行 `pnpm build` 确保构建通过

## 📄 License

MIT License © [Muromi-Rikka](https://github.com/Muromi-Rikka)
