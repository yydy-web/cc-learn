---
title: 自动化与 CI/CD
description: 在自动化流程和 CI/CD 中使用 Claude Code
---

# 自动化与 CI/CD

Claude Code 不仅可以在交互式终端中使用，还可以集成到自动化流程中。

## 非交互模式

使用 `--print` 参数进入非交互模式，适合脚本调用：

```bash
claude --print "解释一下 src/index.ts 的作用"
```

### 管道输入

```bash
cat src/broken-file.ts | claude --print "这段代码有什么 bug？如何修复？"
```

### JSON 输出

```bash
claude --print --output-format json "分析这个项目的依赖关系"
```

## CI/CD 集成

### GitHub Actions

在 GitHub Actions 中使用 Claude Code：

```yaml
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### GitLab CI

```yaml
claude-review:
  stage: review
  script:
    - npm install -g @anthropic-ai/claude-code
    - claude --print "审查这个 MR 的代码改动" > review.md
  artifacts:
    paths:
      - review.md
```

## 自动化任务

### 定期代码审查

```bash
# 每周运行，检查代码质量
claude --print "检查项目中是否有 TODO 和 FIXME 注释，整理成列表"
```

### 自动生成文档

```bash
# 为新代码生成文档
claude --print "为 src/utils/ 目录下的所有函数生成 JSDoc 注释"
```

### 依赖更新检查

```bash
claude --print "检查 package.json 中的依赖，哪些有大版本更新？更新时需要注意什么？"
```

## 环境变量

在自动化场景中，通过环境变量配置：

```bash
export ANTHROPIC_API_KEY=your-key
export CLAUDE_MODEL=claude-sonnet-4-20250514
claude --print "你的任务描述"
```

## 安全注意事项

- 不要在 CI 日志中暴露 API Key
- 使用 GitHub Secrets 或类似的密钥管理服务
- 限制自动化任务的权限范围
- 对于敏感操作，保留人工审核环节

## 自主循环开发

对于需要多轮迭代的大型功能，可以使用 [Ralph](/guide/advanced/ralph) 让 Claude Code 自主循环执行：

```bash
# 使用 Claude Code 自主循环执行 PRD 中的所有用户故事
./scripts/ralph/ralph.sh --tool claude
```

Ralph 会反复启动新的 Claude Code 实例，逐个实现 PRD 中的用户故事，直到全部完成。适合需要长时间自主运行的开发场景。

## 下一步

- [命令参考](/commands/) — 查看所有可用的 Claude Code 命令
- [技巧与最佳实践](/tips/best-practices) — 更多实用技巧
