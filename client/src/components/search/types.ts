export type SearchResultType =
  | "vendor"
  | "product"
  | "course"
  | "skillingArea"
  | "industry"
  | "content";

export type SearchTabId = "all" | SearchResultType;

export type SearchResultItem = {
  id: string | number;
  type: SearchResultType | string;
  href: string;
  name: string;
  logo?: string | null;
  vendorName?: string;
  description?: string;
  path?: string;
};

export type SearchResultGroup = {
  type: SearchResultType | string;
  label: string;
  count: number;
  items: SearchResultItem[];
};

export type GlobalSearchResponse = {
  groups?: SearchResultGroup[];
  total?: number;
};

export type SearchTab = {
  id: SearchTabId;
  label: string;
};

export type ResultRowProps = {
  item: SearchResultItem;
  onSelect: () => void;
};

export type EmptyStateProps = {
  hasQuery: boolean;
  q: string;
};
