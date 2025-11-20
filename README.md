
# Sentry MCP Server

Also available in Russian: [README-ru.md](README-ru.md)

[![CI](https://github.com/VitalyOstanin/sentry-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/VitalyOstanin/sentry-mcp/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@vitalyostanin/sentry-mcp.svg)](https://www.npmjs.com/package/@vitalyostanin/sentry-mcp)

Sentry MCP server provides tools for working with Sentry organizations, projects, and issues directly from Claude Code, Code CLI, and other MCP clients.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
  - [Using npx (Recommended)](#using-npx-recommended)
  - [Manual Installation (Development)](#manual-installation-development)
- [Running the server (stdio)](#running-the-server-stdio)
- [Configuration for Code (Recommended)](#configuration-for-code-recommended)
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
Add similar entry to your `cline_mcp_settings.json`:

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


## MCP Tools

| Tool | Description |
| --- | --- |
| `service_info` | Status information: url, tokenPresent, timezone, readOnly, version. |
| `sentry_organizations` | List organizations with pagination (cursor/perPage); brief mode by default. |
| `sentry_projects` | List projects in an organization; supports query, pagination, brief mode. |
| `sentry_issues` | List issues with filters: query, environments, statsPeriod or since/until, project; pagination supported. |
| `sentry_issue_latest_event` | Get latest event for an issue (brief summary by default). |
| `sentry_issues_latest_events_batch` | Get latest events for multiple issues with safe concurrency. |
| `sentry_issues_details_batch` | Get issue details for multiple issues with safe concurrency. |
