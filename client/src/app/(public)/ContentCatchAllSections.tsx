import { notFound } from "next/navigation";
import PublicPageSections from "@/components/cms/pages/PublicPageSections";
import type { PagePlacement } from "@/components/cms/pages/types";
import type { PageThemeDraft } from "@/components/cms/theme/types";
import { fetchContentByPath } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/api/cms-api";
import {
  CONTENT_DIRECTORY_BY_PATH,
  CONTENT_PAGE_KEY,
  contentPathFromParams,
  isReservedContentPath,
} from "@/lib/content/content-pages";
import type { SlugArrayPageProps } from "@/app/types";

export default async function ContentCatchAllSections({ params }: SlugArrayPageProps) {
  const { slug: slugParam } = await params;

  if (isReservedContentPath(slugParam)) {
    notFound();
  }

  const path = contentPathFromParams(slugParam);
  if (!path || path === "/") {
    notFound();
  }

  let content: Record<string, unknown>;
  let cmsSections: PagePlacement[] = [];
  let pageTheme: PageThemeDraft | null = null;

  try {
    const res = await fetchContentByPath(path);
    content = res?.data || null;
  } catch {
    notFound();
  }

  if (!content || content.status === "inactive") {
    notFound();
  }

  const contentId = String(content._id || content.id);

  try {
    const sectionsRes = await getPageSectionsResolved(CONTENT_PAGE_KEY, contentId, {
      cache: "no-store",
    }).catch(() => ({ sections: [], page: null }));
    cmsSections = (sectionsRes.sections || []) as PagePlacement[];
    pageTheme = (sectionsRes.page?.theme as PageThemeDraft | undefined) || null;
  } catch {
    cmsSections = [];
  }

  const directoryType =
    path in CONTENT_DIRECTORY_BY_PATH
      ? CONTENT_DIRECTORY_BY_PATH[path as keyof typeof CONTENT_DIRECTORY_BY_PATH]
      : undefined;

  return (
    <PublicPageSections
      pageKey={CONTENT_PAGE_KEY}
      sections={cmsSections}
      initialTheme={pageTheme}
      pageContext={{
        entityType: "content",
        entityId: contentId,
        entityName: String(content.name),
        contentSlug: String(content.slug),
        contentPath: String(content.path),
        ...(directoryType ? { directoryType } : {}),
      }}
    />
  );
}
