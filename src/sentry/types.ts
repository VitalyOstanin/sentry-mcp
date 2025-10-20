export interface SentryOrganization {
  id: string | number;
  slug: string;
  name: string;
  status?: { id?: string; name?: string };
  dateCreated?: string;
}

export interface SentryProject {
  id: string | number;
  slug: string;
  name: string;
  isBookmarked?: boolean;
  isPublic?: boolean;
  isInternal?: boolean;
  platform?: string | null;
  dateCreated?: string;
}

export interface SentryIssue {
  id: string | number;
  shortId?: string;
  title?: string;
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

