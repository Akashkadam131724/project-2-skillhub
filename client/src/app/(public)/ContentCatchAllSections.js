import { notFound } from "next/navigation";
import PublicPageSections from "@/components/cms/pages/PublicPageSections";
import { fetchContentByPath } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/api/cms-api";
import {
  CONTENT_DIRECTORY_BY_PATH,
  CONTENT_PAGE_KEY,
  contentPathFromParams,
  isReservedContentPath,
} from "@/lib/content/content-pages";

export default async function ContentCatchAllSections({ params }) {
  const { slug: slugParam } = await params;

  if (isReservedContentPath(slugParam)) {
    notFound();
  }

  const path = contentPathFromParams(slugParam);
  if (!path || path === "/") {
    notFound();
  }

  let content;
  let cmsSections = [];
  let pageTheme = null;

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
    }).catch(() => ({ sections: [] }));
    cmsSections = sectionsRes.sections || [];
    pageTheme = sectionsRes.page?.theme || null;
  } catch {
    cmsSections = [];
  }

  return (
    <PublicPageSections
      pageKey={CONTENT_PAGE_KEY}
      sections={cmsSections}
      initialTheme={pageTheme}
      pageContext={{
        entityType: "content",
        entityId: contentId,
        entityName: content.name,
        contentSlug: content.slug,
        contentPath: content.path,
        ...(CONTENT_DIRECTORY_BY_PATH[path]
          ? { directoryType: CONTENT_DIRECTORY_BY_PATH[path] }
          : {}),
      }}
    />
  );
}
