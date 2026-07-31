import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchContentByPath } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/cms-api";
import CmsLivePageSections from "@/components/cms/CmsLivePageSections";
import {
  CONTENT_DIRECTORY_BY_PATH,
  CONTENT_PAGE_KEY,
  contentPathFromParams,
  isReservedContentPath,
} from "@/lib/content-pages";

export async function generateMetadata({ params }) {
  const { slug: slugParam } = await params;
  if (isReservedContentPath(slugParam)) {
    return { title: "Not found" };
  }
  const path = contentPathFromParams(slugParam);
  try {
    const res = await fetchContentByPath(path);
    const content = res?.data;
    if (!content || content.status === "inactive") {
      return { title: "Not found" };
    }
    return {
      title: content.name,
      description: content.description || content.name,
    };
  } catch {
    return { title: "Not found" };
  }
}

/**
 * Catch-all for Content pages — looks up Content.path in the DB.
 * Root `/` is handled by app/page.js.
 */
export default async function ContentCatchAllPage({ params }) {
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
    const sectionsRes = await getPageSectionsResolved(
      CONTENT_PAGE_KEY,
      contentId
    ).catch(() => ({ sections: [] }));
    cmsSections = sectionsRes.sections || [];
    pageTheme = sectionsRes.page?.theme || null;
  } catch {
    cmsSections = [];
  }

  return (
    <main>
      <Suspense fallback={null}>
        <CmsLivePageSections
          pageKey={CONTENT_PAGE_KEY}
          entityId={contentId}
          entityLabel={content.name}
          initialSections={cmsSections}
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
      </Suspense>
    </main>
  );
}
