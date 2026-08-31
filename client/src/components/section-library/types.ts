export type SectionLibraryCategory = {
  key?: string;
  id?: string | number;
  name: string;
  slug?: string;
  href?: string;
  section_count?: number;
};

export type SectionLibraryCategoryGridProps = {
  categories?: SectionLibraryCategory[];
  uncategorizedCount?: number;
};

export type SectionLibraryBannerProps = {
  title?: string;
  subtitle?: string;
  backHref?: string | null;
  backLabel?: string;
};

export type SectionLibraryPageBodyProps = {
  pageKey: string;
  entityId: string | number;
  entityLabel?: string | null;
  initialTheme?: Record<string, unknown> | null;
  pageContext?: Record<string, unknown> | null;
  publicHref?: string | null;
};
