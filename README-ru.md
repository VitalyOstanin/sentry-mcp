
# Sentry MCP Server

[![CI](https://github.com/VitalyOstanin/sentry-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/VitalyOstanin/sentry-mcp/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@vitalyostanin/sentry-mcp.svg)](https://www.npmjs.com/package/@vitalyostanin/sentry-mcp)

## Содержание

- [Возможности](#возможности)
- [Требования](#требования)
- [Установка](#установка)
  - [Используя npx (Рекомендуется)](#используя-npx-рекомендуется)
  - [Ручная установка (Для разработки)](#ручная-установка-для-разработки)
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
Добавьте в `cline_mcp_settings.json` аналогично примеру выше:

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


## MCP-инструменты

| Инструмент | Описание |
| --- | --- |
| `service_info` | Статус интеграции: url, tokenPresent, timezone, readOnly, version. |
| `sentry_organizations` | Список организаций с пагинацией (cursor/perPage); по умолчанию brief. |
| `sentry_projects` | Список проектов организации; поддерживает query, пагинацию, brief режим. |
| `sentry_issues` | Список issues с фильтрами: query, environments, statsPeriod или since/until, project; поддерживается пагинация. |
| `sentry_issue_latest_event` | Последнее событие для issue (по умолчанию краткая сводка). |
| `sentry_issues_latest_events_batch` | Последние события для нескольких issues с ограничением конкурентности. |
| `sentry_issues_details_batch` | Детали для нескольких issues с ограничением конкурентности. |

Примечания:
- Используйте `query` по синтаксису Sentry, например: `is:unresolved environment:production`. Для нескольких окружений передайте `environments: ["production", "staging"]`.
- Для пагинации используйте `nextCursor` в следующем вызове.
