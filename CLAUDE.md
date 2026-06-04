# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CC Learn — a Rspress v2 documentation site for a Claude Code tutorial (使用教程). Content is written in Chinese with English technical terms. The site covers basic tutorials and practical notes for Claude Code usage.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start local dev server (rspress dev)
npm run build        # Production build (rspress build) — output to doc_build/
npm run preview      # Preview production build locally
```

No test runner is configured. Validate changes by running `npm run build` — a page that works in dev can fail during static generation.

## Architecture

**Rspress config**: `rspress.config.ts` — site title, logo, icon, social links. Docs root is explicitly set to `docs/`.

**Content root**: `docs/` — all markdown/MDX pages live here. Static assets go in `docs/public/` and are referenced by absolute path (e.g., `/cc-learn-icon.png`).

**Theme**: `theme/` extends the original Rspress theme via `export * from '@rspress/core/theme-original'`. Brand colors are overridden with CSS custom properties in `theme/index.css`. Avoid ejecting components — prefer CSS variable overrides and BEM class overrides first.

**Navigation**: Controlled by `_meta.json` (sidebar ordering/labels) and `_nav.json` (top navbar). Do not encode page order in filenames.

## Content Authoring

- Pages are `.md` or `.mdx`. Use MDX when embedding React components (e.g., `Tabs`, `Tab` from Rspress).
- Add `description` frontmatter to every doc page for SEO and llms.txt output. Keep descriptions 50–160 chars, direct and specific.
- Use `pageType` frontmatter to control layout: `home` (landing), `doc` (default), `doc-wide`, `custom`, `blank`.
- Rspress built-in containers: `:::tip`, `:::info`, `:::warning`, `:::danger`, `:::details`.
- Code blocks support `title`, `lineNumbers`, `wrapCode` attributes via Shiki.

## TypeScript

Strict mode enabled. `verbatimModuleSyntax: true` — use `import type` for type-only imports. MDX files are type-checked (`mdx.checkMdx: true`).

## Skills

Two agent skills are installed under `.agents/skills/` (from `rstackjs/agent-skills`):

- **rspress-best-practices**: Config, content structure, MDX, theme, and deployment guidance.
- **rspress-description-generator**: Automated workflow for generating `description` frontmatter.

See `.agents/skills/*/SKILL.md` for full details.
