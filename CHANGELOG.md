# Changelog

## Table of Contents
- [Unreleased](#unreleased)
- [v0.1.1 - 2025-10-21](#v011---2025-10-21)
- [v0.1.0 - 2024-10-20](#v010---2024-10-20)

## Unreleased
- No changes yet.

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

