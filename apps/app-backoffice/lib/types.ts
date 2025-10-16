export interface PlanDefinition {
  id: string;
  name: string;
  price: number;
  pageLimit: number | null;
  storageLimitMb: number;
  contactEnabled: boolean;
  collaborators?: string;
}

export interface LimitIndicator {
  state: 'ok' | 'warning' | 'blocked';
  message?: string;
  metric: 'pages' | 'storage';
}

export interface ArtistSummary {
  id: string;
  name: string;
  slug: string;
  planId: string;
  pageCount: number;
  storageMb: number;
  limit: LimitIndicator;
}

export interface AccountOverview {
  account: {
    id: string;
    name: string;
    plan: PlanDefinition;
    status: string;
    usage: {
      pages: number;
      storageMb: number;
    };
  };
  artists: ArtistSummary[];
}

export type { PageDefinition, PageSection } from './schemas/page';

