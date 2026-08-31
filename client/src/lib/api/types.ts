export type QueryParams = Record<
  string,
  string | number | boolean | string[] | null | undefined
>;

export type FetchInitOptions = {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  cache?: RequestCache;
};

export type ApiGetOptions = FetchInitOptions & {
  notFoundMessage?: string;
};

export type CmsRequestOptions = FetchInitOptions & {
  method?: string;
  body?: unknown;
};

export type ApiListResponse<T = unknown> = {
  data?: T[];
  total?: number;
  totalPages?: number;
};

export type ApiItemResponse<T = unknown> = {
  data: T;
};

export type ResolvedPageSectionsResponse = {
  sections?: unknown[];
  page?: { theme?: unknown; [key: string]: unknown } | null;
};

export type SectionCategoriesResponse = ApiListResponse<Record<string, unknown>> & {
  uncategorized_count?: number;
};

export type CmsApiError = Error & {
  status?: number;
  fields?: unknown;
  payload?: unknown;
};
