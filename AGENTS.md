# AGENTS.md

## Quick Reference

```bash
pnpm install            # Install dependencies (pnpm@11.5.0, node>=18)
pnpm run dev            # Start dev server
pnpm run build          # Validate changes — output to doc_build/
pnpm run check         # Lint + format check (oxlint && oxfmt --check)
```

## Architecture

- **Rspress v2** documentation site for Claude Code tutorial (Chinese with English technical terms)
- `docs/` — content root; all pages are `.md` or `.mdx`
- `docs/public/` — static assets referenced by absolute path (`/cc-learn-icon.png`)
- `theme/` — intentionally minimal: CSS variable overrides in `theme/index.css` + re-export from theme-original in `theme/index.tsx`. Avoid ejecting components.
- Navigation: `docs/_nav.json` (top navbar), `docs/**/_meta.json` (sidebar ordering)

## Content Rules

- Every doc page needs `description` frontmatter (50–160 chars, for SEO and llms.txt)
- Use MDX for React components (`Tabs`, `Tab` from Rspress)
- `pageType` frontmatter: `home`, `doc` (default), `doc-wide`, `custom`, `blank`
- Built-in containers: `:::tip`, `:::info`, `:::warning`, `:::danger`, `:::details`

## Code Style

- **oxfmt**: single quotes, trailing commas, 100 print width (120 for `.md`), LF endings
- **oxlint**: correctness=error, suspicious/perf=warn. Plugins: typescript, unicorn, oxc, import
- TypeScript strict mode; `verbatimModuleSyntax: true` — use `import type` for type-only imports
- MDX files type-checked (`mdx.checkMdx: true`)

## Gotchas

- **No test runner** — validate with `pnpm run build` (dev server can pass where static generation fails)
- **No CI workflows** — no automated checks on push; lint/format/build only run locally
- Docs root is explicitly `docs/` in `rspress.config.ts`, not repo root
- `docs/superpowers/*` and `raw/` are gitignored — don't commit content from these paths
- `pnpm-workspace.yaml` only sets allowBuilds (esbuild, sharp, workerd) — not a monorepo
- Plugins: `@rspress/plugin-llms`, `rspress-plugin-mermaid`, `@rspress/plugin-sitemap`, `rspress-plugin-reading-time`, `rspress-plugin-google-analytics`
- Deployed to Cloudflare Pages (`wrangler` in devDeps)

## Agent Skills

Two skills in `.agents/skills/` (from `rstackjs/agent-skills`):

- `rspress-best-practices` — config, content, MDX, theme, deployment
- `rspress-description-generator` — batch description frontmatter generation

See `.agents/skills/*/SKILL.md` for details.
