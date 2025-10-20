
# Sentry MCP Server

## Содержание
- [Возможности](#возможности)
- [Требования](#требования)
- [Установка](#установка)
- [Запуск сервера (stdio)](#запуск-сервера-stdio)
- [Конфигурация для Code](#конфигурация-для-code)
- [Конфигурация для Claude Code CLI](#конфигурация-для-claude-code-cli)
- [Конфигурация для VS Code Cline](#конфигурация-для-vs-code-cline)
- [MCP-инструменты](#mcp-инструменты)

## Возможности
- Просмотр организаций, проектов и issues в Sentry через MCP.
- Фильтрация issues по `query`, окружениям (`environment`), периоду (`statsPeriod` либо `since`/`until`), проектам, пагинация `cursor`.
- Единый формат ответов `toolSuccess/toolError`.

## Требования
- Node.js 20+
- Настроенные переменные окружения:
  - `SENTRY_URL` — базовый URL Sentry.
  - `SENTRY_TOKEN` — токен доступа (Bearer).
  - `SENTRY_TIMEZONE` — таймзона (опционально, по умолчанию `Europe/Moscow`).
  - `SENTRY_READ_ONLY` — флаг (по умолчанию `true`).
  - `SENTRY_HTTP_TIMEOUT_MS` — таймаут HTTP-запросов в мс (опционально, по умолчанию `10000`).

## Установка
### Используя npx (Рекомендуется)
```bash
npx -y @vitalyostanin/sentry-mcp@latest
```

### Ручная установка (Для разработки)
```bash
npm ci
npm run build
```

## Запуск сервера (stdio)
```bash
node dist/index.js
```

## Конфигурация для Code
Пример `~/.code/config.toml`:
```toml
[mcp_servers.sentry-mcp]
command = "npx"
args = ["-y", "@vitalyostanin/sentry-mcp@latest"]

[mcp_servers.sentry-mcp.env]
SENTRY_URL = "https://sentry.example.com"
SENTRY_TOKEN = "<token>"
```

## Конфигурация для Claude Code CLI
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

## Конфигурация для VS Code Cline
Добавьте в `cline_mcp_settings.json` аналогично примеру выше.

## MCP-инструменты
- `service_info`: статус интеграции (url, tokenPresent, timezone, readOnly, version).
- `sentry_organizations`:
  - Вход: `cursor?`, `perPage? (1..100)`, `briefOutput?` (по умолчанию `true`).
  - Выход: `{ items, nextCursor, count }`.
- `sentry_projects`:
  - Вход: `org` (slug), `query?`, `cursor?`, `perPage?`, `briefOutput?` (по умолчанию `true`).
  - Выход: `{ items, nextCursor, count }`.
- `sentry_issues`:
  - Вход: `org`, `query?`, `environments?: string[]`, `statsPeriod?` или `since/until`, `project?: number|number[]|string|string[]` (часто обязателен на стороне Sentry; можно передавать id или slug), `perPage? (1..100)`, `cursor?`, `briefOutput?` (по умолчанию `true`).
  - Выход: `{ items, nextCursor, count }`.
- `sentry_issue_latest_event`:
  - Вход: `issueId`, `briefOutput?` (по умолчанию `true`).
  - Выход: краткая сводка исключений c форматированными фреймами либо `raw` при `briefOutput=false`.
- `sentry_issues_latest_events_batch`:
  - Вход: `issueIds: string[] (макс. 50)`, `concurrency? (1..10, по умолчанию 5)`, `briefOutput?` (по умолчанию `true`).
  - Выход: `{ items, failed, count }`.
- `sentry_issues_details_batch`:
  - Вход: `issueIds: string[] (макс. 50)`, `concurrency? (1..10, по умолчанию 5)`, `briefOutput?` (по умолчанию `true`).
  - Выход: `{ items, failed, count }`.

Примечания:
- Используйте `query` по синтаксису Sentry, например: `is:unresolved environment:production`. Для нескольких окружений передайте `environments: ["production", "staging"]`.
- Для пагинации используйте `nextCursor` в следующем вызове.
