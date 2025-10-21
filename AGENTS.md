# Repository Guidelines

## Contributor Notes
- Keep source code, comments, documentation, and commit messages in English.
- Run `npm run build` and `npx eslint .` before publishing changes to ensure type-checking and linting stay green.
- When formatting or refactoring code, default to running `npx eslint --fix` (without dry-run) so lintable issues are auto-corrected early.
- Maintain `README.md` in English and `README-ru.md` in Russian so both stay aligned with the Sentry MCP feature set.

## Planning Workflow
- **Always create a plan document before implementation** for non-trivial tasks (new features, significant refactoring, or multi-file changes).
- **Plan documents must be stored in `temp/` directory** with descriptive filenames (e.g., `temp/issues-filtering-plan.md`).
- **All plan documents must include a Table of Contents (TOC)** for easy navigation.
- **Rule: Documentation changes come before code changes** - When a task requires both adding new rules/guidelines and implementing them:
  1. First, update AGENTS.md with new rules and best practices
  2. Then, implement the code changes following those rules
  3. This ensures guidelines are documented before they become implicit knowledge
- Plan document structure should include:
  - Overview and motivation
  - Detailed implementation steps with file references and line numbers where applicable
  - Type definitions and interfaces
  - API endpoints and parameters
  - Error handling strategy
  - Testing approach
  - Files to be modified with estimated line counts
- Use the plan as a checklist during implementation - mark sections as completed as you progress.

## Documentation Guidelines
### Language Policy
- This AGENTS.md must always be written in English. Do not localize or translate this file.
- Examples, code snippets, and rule text in this file should remain in English for consistency across all contributors and tools.
- **Use professional style without emojis** in all documentation, commit messages, and code comments.
- Keep documentation clear, concise, and technically accurate.
- Focus on technical content rather than decorative elements.
- **All Markdown files must include a Table of Contents (TOC)** after the main heading and before the first section.
- TOC should use standard Markdown anchor links (e.g., `[Overview](#overview)`).
- Include all level 2 (`##`) and level 3 (`###`) headers in the TOC for easy navigation.
- Update the TOC whenever document structure changes (new sections, renamed headers, etc.).
- Example TOC format:
  ```markdown
  ## Table of Contents
  - [Section 1](#section-1)
    - [Subsection 1.1](#subsection-11)
  - [Section 2](#section-2)
  ```

### Pre‑Release TOC Verification (Release Rule)
- Before every release, verify that README TOCs are present and accurate:
  - Files: `README.md` and `README-ru.md`.
  - Ensure each TOC includes all `##` and `###` headings in the correct order and with proper anchors.
- Suggested quick checks:
  - Presence: `rg -n "^## Table of Contents" README.md README-ru.md`
  - Compare headers vs TOC entries:
    ```bash
    for f in README.md README-ru.md; do
      echo "== $f ==";
      echo "Headers (H2/H3):";
      rg -n "^(##|###) " "$f" | sed -E 's/^[^ ]+\s+//' | sed -E 's/^#+ //';
      echo "TOC entries:";
      rg -n "^- \\[[^\\]]+\\\\]\\(#[^)]+\\)" "$f" || true;
    done
    ```
  - If mismatches are found, update the TOC blocks in the README files accordingly.

### TOC Exception for Robot-Facing Markdown
- Robot-facing instruction files do not require a TOC to stay compact for agent ingestion and reduce noise.
- Applies to: `AGENTS.md`, `CLAUDE.md`, and other docs intended primarily for AI agents (e.g., files under `.code/agents/`, `.claude/`).
- Human-facing documentation (e.g., `README.md`, `README-ru.md`, `README-release.md`, `CHANGELOG.md`) must continue to include a TOC.

## Project Structure
- `src/`: TypeScript sources for the MCP server, Sentry client, and tool registrations.
- `dist/`: Compiled JavaScript emitted by `npm run build` (ignored by git).
- `index.ts`: Entry point that wires the stdio transport to the server.

## Build & Development Commands
- `npm run build`: Compile TypeScript to `dist/`.
- `npm run dev`: Watch mode for local development (`tsc --watch`).
- `npx eslint --print-config <file>`: Dry-run lint config inspection (first run rule).
- `npx eslint . --no-cache`: Run ESLint repo-wide from the project root to ensure TypeScript Program is built for type-aware rules (e.g., `@typescript-eslint/prefer-nullish-coalescing`, `@typescript-eslint/no-unnecessary-condition`).
- After modifying `package.json` dependencies, always run `npm install` to update `package-lock.json` accordingly.
- Keep documentation (`README*`, `TODO*`, ru variants when available) aligned with the current Sentry feature set after each iteration.

## Coding Style & Tooling
- Project uses TypeScript + ESLint (flat config). Follow the automated lint checks; avoid disabling rules without discussion.
- Prefer modern ES/TypeScript features (`const`, optional chaining, nullish coalescing, async/await).
- Keep TypeScript types strict: no `any`, prefer precise interfaces.

## Concurrency Control for Batch Operations
- **CRITICAL: All `Promise.all()` operations on arrays must implement concurrency limiting** to prevent API overload and timeout issues.
- **Never use unlimited `Promise.all()` for external API calls**.

### Standard Library for Concurrency Control
- Use the `@vitalyostanin/mutex-pool` package for concurrency limiting, mirroring `youtrack-mcp`.
- Pattern:

```ts
import { MutexPool } from "@vitalyostanin/mutex-pool";

async function processWithLimit<T, R>(items: T[], limit: number, worker: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const pool = new MutexPool(Math.max(1, limit));
  const results: R[] = new Array(items.length);

  items.forEach((item, i) => {
    pool.start(async () => {
      results[i] = await worker(item, i);
    });
  });

  await pool.allJobsFinished();
  return results;
}
```

- Do not roll your own worker loops; prefer the shared pattern above for readability and correctness.

### MCP Response Format
- The server returns exactly one data node by default, controlled via `SENTRY_USE_STRUCTURED_CONTENT` (default: "true").
- When `true`: return only `structuredContent` with full data, and include an empty `content: []` to satisfy MCP typing.
- When `false`: return only `content` (single `text` item with JSON string), omit `structuredContent`.
- For errors, always set `isError: true` and apply the same single-node rule (i.e., empty `content` with `structuredContent` when `true`, or text `content` when `false`).
- Use `toolSuccess`/`toolError` in `src/utils/tool-response.ts` to keep behavior consistent across all tools.

## MCP Tooling Expectations
- Implement pagination for every MCP tool that may return large result sets; expose explicit pagination parameters and defaults in the schema.
- Use conservative defaults (≤100 items per page unless API enforces a different limit) and document maximum supported sizes.

## MCP Tool Registration
- **Always use the `.tool()` method** for registering MCP tools with an args object of Zod definitions, mirroring the sample project.

## README Documentation Guidelines
- Do NOT include MCP tool invocation examples in README files; describe features and tools at a high level.
