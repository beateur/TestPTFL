export interface ArtistSummary {
  id: string;
  displayName: string;
  slug: string;
  planId: string;
}

export interface PageTreeNode {
  id: string;
  title: string;
  slug: string;
  children?: PageTreeNode[];
}
