import axios, { type AxiosInstance } from "axios";
import { loadConfig, type Config } from "../config/index.js";

export class SentryClient {
  private readonly axios: AxiosInstance;
  private readonly config: Config;

  constructor() {
    this.config = loadConfig();
    this.axios = axios.create({
      baseURL: this.config.sentry.url,
      timeout: this.config.httpTimeoutMs,
      headers: {
        Authorization: `Bearer ${this.config.sentry.token}`,
        Accept: "application/json",
      },
    });
  }

  getConfig(): Config {
    return this.config;
  }

  async getIssueById(issueId: string, opts: { signal?: AbortSignal } = {}) {
    const resp = await this.axios.get(`/api/0/issues/${encodeURIComponent(issueId)}/`, { signal: opts.signal });

    return resp.data as unknown;
  }

  async getIssueLatestEvent(issueId: string, opts: { signal?: AbortSignal } = {}) {
    const resp = await this.axios.get(`/api/0/issues/${encodeURIComponent(issueId)}/events/latest/`, { signal: opts.signal });

    return resp.data as unknown;
  }

  async listOrganizations(params: { cursor?: string; perPage?: number; signal?: AbortSignal } = {}) {
    const resp = await this.axios.get("/api/0/organizations/", {
      params: { cursor: params.cursor, per_page: params.perPage ?? 50 },
      signal: params.signal,
    });
    const nextCursor = extractNextCursor(resp.headers.link as string | undefined);

    return { data: resp.data as unknown[], nextCursor };
  }

  async listProjects(orgSlug: string, params: { cursor?: string; perPage?: number; query?: string; signal?: AbortSignal } = {}) {
    const resp = await this.axios.get(`/api/0/organizations/${encodeURIComponent(orgSlug)}/projects/`, {
      params: { cursor: params.cursor, per_page: params.perPage ?? 50, query: params.query },
      signal: params.signal,
    });
    const nextCursor = extractNextCursor(resp.headers.link as string | undefined);

    return { data: resp.data as unknown[], nextCursor };
  }

  async listIssues(
    orgSlug: string,
    params: {
      cursor?: string;
      perPage?: number;
      query?: string;
      environments?: string[];
      statsPeriod?: string;
      since?: string;
      until?: string;
      project?: number | number[] | string | string[];
      signal?: AbortSignal;
    } = {},
  ) {
    const { cursor, perPage, query, environments, statsPeriod, since, until, project } = params;
    const resp = await this.axios.get(`/api/0/organizations/${encodeURIComponent(orgSlug)}/issues/`, {
      params: {
        cursor,
        // Some Sentry endpoints use per_page, others honor limit; send both
        per_page: perPage ?? 50,
        limit: perPage ?? 50,
        query,
        // environment supports array to filter by multiple
        environment: environments,
        statsPeriod,
        since,
        until,
        project,
      },
      signal: params.signal,
      // axios v1 serializes arrays as repeated keys by default; no custom serializer is necessary
    });
    const nextCursor = extractNextCursor(resp.headers.link as string | undefined);

    return { data: resp.data as unknown[], nextCursor };
  }
}

function extractNextCursor(linkHeader: string | undefined): string | undefined {
  if (!linkHeader) return undefined;

  // Sentry style: <url?cursor=xyz>; rel="next"; results="true"; cursor="xyz", ...
  const parts = linkHeader.split(',');

  for (const part of parts) {
    if (part.includes('rel="next"') && part.includes('results="true"')) {
      const cursorMatch = part.match(/cursor="?([^";>]+)"?/);

      if (cursorMatch) return cursorMatch[1];
    }
  }

  return undefined;
}
