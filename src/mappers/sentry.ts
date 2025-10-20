import { formatDatetime } from "../utils/date.js";
import type { SentryIssue, SentryOrganization, SentryProject } from "../sentry/types.js";

export interface MappedOrganization {
  id: string;
  slug: string;
  name: string;
  status?: string;
  dateCreated?: string;
}

export function mapOrganization(org: SentryOrganization, opts: { brief?: boolean } = {}): MappedOrganization {
  const base: MappedOrganization = {
    id: String(org.id),
    slug: String(org.slug),
    name: String(org.name),
  };

  if (opts.brief) return base;

  return {
    ...base,
    status: org.status?.name ?? org.status?.id,
    dateCreated: formatDatetime(org.dateCreated),
  };
}

export interface MappedProject {
  id: string | number;
  slug: string;
  name: string;
  isBookmarked?: boolean;
  isPublic?: boolean;
  isInternal?: boolean;
  platform?: string | null;
  dateCreated?: string;
}

export function mapProject(project: SentryProject, opts: { brief?: boolean } = {}): MappedProject {
  const base: MappedProject = {
    id: project.id,
    slug: String(project.slug),
    name: String(project.name),
  };

  if (opts.brief) return base;

  return {
    ...base,
    isBookmarked: Boolean(project.isBookmarked),
    isPublic: Boolean(project.isPublic),
    isInternal: Boolean(project.isInternal),
    platform: project.platform ?? null,
    dateCreated: formatDatetime(project.dateCreated),
  };
}

export interface MappedIssue {
  id: string;
  shortId?: string;
  title: string;
  culprit?: string;
  level?: string;
  status?: string;
  isPublic?: boolean;
  assignedTo?: unknown;
  userCount?: number;
  count?: string;
  firstSeen?: string;
  lastSeen?: string;
  permalink?: string;
}

export function mapIssue(issue: SentryIssue, opts: { brief?: boolean } = {}): MappedIssue {
  const base: MappedIssue = {
    id: String(issue.id),
    shortId: issue.shortId,
    title: String(issue.title ?? ""),
    status: issue.status,
    lastSeen: formatDatetime(issue.lastSeen),
    permalink: issue.permalink,
  };

  if (opts.brief) return base;

  return {
    ...base,
    culprit: issue.culprit,
    level: issue.level,
    isPublic: Boolean(issue.isPublic),
    assignedTo: issue.assignedTo ?? undefined,
    userCount: typeof issue.userCount === "number" ? issue.userCount : undefined,
    count: issue.count,
    firstSeen: formatDatetime(issue.firstSeen),
  };
}
