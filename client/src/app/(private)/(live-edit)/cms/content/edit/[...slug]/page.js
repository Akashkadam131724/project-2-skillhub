import { notFound } from "next/navigation";
import { fetchContentByPath } from "@/lib/api";
import { fetchLiveEditPageTheme } from "@/lib/cms/live-edit-theme";
import {
  CONTENT_DIRECTORY_BY_PATH,
  CONTENT_PAGE_KEY,
  contentPathFromParams,
} from "@/lib/content/content-pages";
import { cmsPublicHref } from "@/lib/cms/cms-edit-routes";
import CmsLivePageSections from "@/components/cms/pages/CmsLivePageSections";
import { CmsLiveEditProvider } from "@/components/cms/pages/live/CmsLiveEditContext";

export async function generateMetadata({ params }) {
  const { slug: slugParam } = await params;
  const path = contentPathFromParams(slugParam);
  return {
    title: `Edit sections · ${path}`,
    robots: { index: false, follow: false },
  };
}

export default async function CmsContentSectionEditPage({ params }) {
  const { slug: slugParam } = await params;
  const path = contentPathFromParams(slugParam);

  if (!path || path === "/") {
    notFound();
  }

  let content;
  let pageTheme = null;

  try {
    const res = await fetchContentByPath(path);
    content = res?.data || null;
  } catch {
    notFound();
  }

  if (!content) {
    notFound();
  }

  const contentId = String(content._id || content.id);
  pageTheme = await fetchLiveEditPageTheme(CONTENT_PAGE_KEY);

  return (
    <main>
      <CmsLiveEditProvider
        pageKey={CONTENT_PAGE_KEY}
        entityId={contentId}
        entityLabel={content.name}
        initialTheme={pageTheme}
        publicHref={cmsPublicHref("content", path)}
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
      >
        <CmsLivePageSections />
      </CmsLiveEditProvider>
    </main>
  );
}
