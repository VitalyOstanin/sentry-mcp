# Changelog

## Table of Contents
- [Unreleased](#unreleased)
- [v0.1.1 - 2025-10-21](#v011---2025-10-21)
- [v0.1.0 - 2024-10-20](#v010---2024-10-20)

## Unreleased

### Changed
- Modernized toolchain: TypeScript 6, ESLint 10 (flat config + `projectService`), Zod 4, `@modelcontextprotocol/sdk` 1.29, Vitest 4 + `@vitest/coverage-v8` for unit tests, `eslint-config-flat-gitignore` instead of repeated ignore blocks.
- Raised `engines.node` floor to `>=22.13.0`; pinned `packageManager` to `npm@11.12.1`.
- Split TypeScript configs into `tsconfig.base.json` (compiler options) + `tsconfig.json` (IDE/typecheck, `noEmit`) + `tsconfig.build.json` (production build).
- Strengthened `prepublishOnly` to run lint, typecheck, tests, audit, and build.
- Reworked CI: matrix Node 22.x + 24.x, added typecheck and coverage steps, Codecov upload, audit job, job/step timeouts, concurrency group with `cancel-in-progress`.
- Reworked publish: split into `pre-publish-checks` and `publish` jobs, OIDC trusted publishing with `--provenance` (no more `NPM_TOKEN`), smoke pack-and-install of the real tarball before publishing, Node 24 in publish job to satisfy npm `>=11.5.1` for OIDC.
- Replaced removed-in-Zod-4 `required_error` option in `src/config/schemas.ts` with explicit `min(...)` messages.

### Added
- `--version` / `-v` CLI flag in `index.ts` so smoke tests and humans can verify the installed binary without running the stdio server.
- `LICENSE` (MIT) file in repository root.
- `.editorconfig`, `.nvmrc` (Node 24), `.github/dependabot.yml` (npm + github-actions, weekly Mon 06:00 Europe/Moscow, grouped types/eslint/vitest).
- Vitest setup (`vitest.config.ts`, `test/setup.ts`) with starter unit tests for `src/utils/date.ts`.

### Removed
- `@vitalyostanin/eslint-prefer-de-morgan-law` plugin and its rule.
- `tsconfig.eslint.json` (replaced by ESLint `projectService`).
- `.npmignore` (the `files` allow-list in `package.json` is the single source of truth for published artefacts).

## v0.1.1 - 2025-10-21

### Added
- Environment flag `SENTRY_USE_STRUCTURED_CONTENT` to control MCP response node (`structuredContent` vs text `content`).

### Changed
- Unified tool response helpers and documentation to consistently return a single MCP node depending on `SENTRY_USE_STRUCTURED_CONTENT`.
- README files aligned and cross-linked (English/Russian), clarified configuration examples for Code, Claude Code CLI, and VS Code Cline.
- Release guide: added pre-release README TOC verification step.

## v0.1.0 - 2024-10-20

### Initial release
- Sentry MCP server with tools: `service_info`, `sentry_organizations`, `sentry_projects`, `sentry_issues`, `sentry_issue_latest_event`, batch tools with concurrency limiting.

