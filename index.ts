#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SentryMcpServer } from "./src/server.js";

async function main() {
  const transport = new StdioServerTransport();
  const server = new SentryMcpServer();

  await server.connect(transport);
}

main().catch((error) => {
  console.error("Sentry MCP server crashed", error);
  process.exit(1);
});

