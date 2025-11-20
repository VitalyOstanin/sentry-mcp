import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import packageJson from "../package.json" with { type: "json" };

import { SentryClient } from "./sentry/index.js";
// toolError imported implicitly via handlers
import { loadConfig } from "./config/index.js";
import { initializeTimezone } from "./utils/date.js";
import { serviceInfoArgs, serviceInfoHandler } from "./tools/service-info.js";
import { organizationsArgs, organizationsHandler } from "./tools/organizations.js";
import { sentryProjectsArgs, sentryProjectsHandler } from "./tools/projects.js";
import { sentryIssuesArgs, sentryIssuesHandler } from "./tools/issues.js";
import { sentryIssuesDetailsBatchArgs, sentryIssuesDetailsBatchHandler } from "./tools/issues-details-batch.js";
import { sentryIssueLatestEventArgs, sentryIssueLatestEventHandler } from "./tools/issue-latest-event.js";
import { sentryIssuesLatestEventsBatchArgs, sentryIssuesLatestEventsBatchHandler } from "./tools/issues-latest-events-batch.js";

export class SentryMcpServer {
  private readonly server: McpServer;
  private readonly client: SentryClient;
  private readonly version: string;

  constructor() {
    const packageVersion = packageJson.version;

    if (typeof packageVersion !== "string") {
      throw new Error("package.json version must be a string");
    }
    this.version = packageVersion;

    this.server = new McpServer(
      { name: "sentry-mcp", version: this.version },
      { capabilities: { tools: { listChanged: false }, logging: {} } },
    );

    // ensure config loads early (throws if invalid)
    const cfg = loadConfig();

    initializeTimezone(cfg.timezone);
    this.client = new SentryClient();

    this.registerTools();
  }

  async connect(transport: Parameters<McpServer["connect"]>[0]): Promise<void> {
    await this.server.connect(transport);
  }

  private registerTools(): void {
    this.server.tool(
      "service_info",
      "Get Sentry MCP integration status and environment configuration. Returns: name, sentryUrl, tokenPresent, timezone, readOnly, version.",
      serviceInfoArgs,
      async () => serviceInfoHandler(this.client),
    );

    this.server.tool(
      "sentry_organizations",
      "List Sentry organizations for the current token. Supports pagination via cursor/perPage. Parameters: briefOutput (default true) returns key fields; set to false for full fields. Returns items, nextCursor, count.",
      organizationsArgs,
      async (args) => organizationsHandler(this.client, args),
    );

    this.server.tool(
      "sentry_projects",
      "List Sentry projects within an organization. Parameters: org (slug), optional query, cursor, perPage, briefOutput (default true) returns key fields; set to false for full fields. Returns items, nextCursor, count. Note: environment filtering is not applicable at the project level — use environments on issues tools.",
      sentryProjectsArgs,
      async (args) => sentryProjectsHandler(this.client, args),
    );

    this.server.tool(
      "sentry_issues",
      "List Sentry issues within an organization with filtering by query, environment(s), statsPeriod or since/until, project, pagination via cursor/perPage. Parameters: briefOutput (default true) returns key fields; set to false for full fields. Returns items, nextCursor, count. TIP: Prefer the 'environments' parameter. Note: Sentry often requires 'project' (id or slug). Support automatic pagination with 'limit' parameter (1..1000).",
      sentryIssuesArgs,
      async (args) => sentryIssuesHandler(this.client, args),
    );

    this.server.tool(
      "sentry_issues_details_batch",
      "Fetch details for multiple Sentry issues by IDs with safe concurrency. Parameters: issueIds (max 50), concurrency (1..10, default 5), briefOutput (default true) returns key fields; set to false for full fields. Returns items, failed, count.",
      sentryIssuesDetailsBatchArgs,
      async (args) => sentryIssuesDetailsBatchHandler(this.client, args),
    );

    this.server.tool(
      "sentry_issue_latest_event",
      "Fetch latest event for a Sentry issue, including stacktrace. Parameters: issueId, briefOutput (default true) for compact payload.",
      sentryIssueLatestEventArgs,
      async (args) => sentryIssueLatestEventHandler(this.client, args),
    );

    this.server.tool(
      "sentry_issues_latest_events_batch",
      "Fetch latest events (with stacktraces) for multiple Sentry issues by IDs with safe concurrency. Parameters: issueIds (max 50), concurrency (1..10, default 5), briefOutput (default true). Returns items, failed, count.",
      sentryIssuesLatestEventsBatchArgs,
      async (args) => sentryIssuesLatestEventsBatchHandler(this.client, args),
    );
  }
}
