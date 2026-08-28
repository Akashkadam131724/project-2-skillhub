export type CatalogPageContext = {
  catalogBaseParams?: Record<string, string>;
  catalogHideFilterKeys?: string[];
  catalogTitle?: string;
  catalogSubtitle?: string;
  entityId?: string | number;
  entityType?: string;
  entityName?: string;
  vendorId?: string | number;
  directoryType?: string;
  [key: string]: unknown;
};
