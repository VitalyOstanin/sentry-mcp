
# Sentry MCP Server

Sentry MCP server provides tools for working with Sentry organizations, projects, and issues directly from Claude Code, Code CLI, and other MCP clients.

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the server (stdio)](#running-the-server-stdio)
- [Configuration for Code](#configuration-for-code)
- [Configuration for Claude Code CLI](#configuration-for-claude-code-cli)
- [Configuration for VS Code Cline](#configuration-for-vs-code-cline)
- [MCP Tools](#mcp-tools)

## Features
- List organizations and projects available to the token.
- Query issues with filters: `query`, multiple `environment`, `statsPeriod` or `since/until`, `project`, pagination via `cursor`.
- Consistent structured responses with `toolSuccess/toolError`.

## Requirements
- Node.js 20+
- Environment variables:
  - `SENTRY_URL` — Sentry base URL
  - `SENTRY_TOKEN` — Sentry auth token (Bearer)
  - `SENTRY_TIMEZONE` — optional, defaults to `Europe/Moscow`
  - `SENTRY_READ_ONLY` — optional, defaults to `true`
  - `SENTRY_HTTP_TIMEOUT_MS` — optional request timeout in ms (default `10000`)

## Installation
### Using npx (Recommended)
```bash
npx -y @vitalyostanin/sentry-mcp@latest
```

### Manual Installation (Development)
```bash
npm ci
npm run build
```

## Running the server (stdio)
```bash
node dist/index.js
```

## Configuration for Code (Recommended)
Add to `~/.code/config.toml`:
```toml
[mcp_servers.sentry-mcp]
command = "npx"
args = ["-y", "@vitalyostanin/sentry-mcp@latest"]

[mcp_servers.sentry-mcp.env]
SENTRY_URL = "https://sentry.example.com"
SENTRY_TOKEN = "<token>"
```

## Configuration for Claude Code CLI
```json
{
  "mcpServers": {
    "sentry-mcp": {
      "command": "npx",
      "args": ["-y", "@vitalyostanin/sentry-mcp@latest"],
      "env": {
        "SENTRY_URL": "https://sentry.example.com",
        "SENTRY_TOKEN": "<token>"
      }
    }
  }
}
```

## Configuration for VS Code Cline
Add similar entry to your `cline_mcp_settings.json`.

## MCP Tools
- `service_info` — status information: url, tokenPresent, timezone, readOnly, version.
- `sentry_organizations` — args: `cursor?`, `perPage? (1..100)`, `briefOutput?` (default true); returns `{ items, nextCursor, count }`.
- `sentry_projects` — args: `org`, `query?`, `cursor?`, `perPage?`, `briefOutput?` (default true); returns `{ items, nextCursor, count }`.
- `sentry_issues` — args: `org`, `query?`, `environments?: string[]`, `statsPeriod?` or `since/until`, `project?: number|number[]|string|string[]` (often required by Sentry; accepts id or slug), `perPage? (1..100)`, `cursor?`, `briefOutput?` (default true); returns `{ items, nextCursor, count }`.
- `sentry_issue_latest_event` — args: `issueId`, `briefOutput?` (default true); returns latest event summary (exceptions with formatted frames) or raw when `briefOutput=false`.
- `sentry_issues_latest_events_batch` — args: `issueIds: string[] (max 50)`, `concurrency? (1..10, default 5)`, `briefOutput?` (default true); returns `{ items, failed, count }`.
- `sentry_issues_details_batch` — args: `issueIds: string[] (max 50)`, `concurrency? (1..10, default 5)`, `briefOutput?` (default true); returns `{ items, failed, count }`.
