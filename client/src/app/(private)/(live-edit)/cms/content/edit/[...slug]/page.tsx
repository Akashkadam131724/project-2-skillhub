import type { Metadata } from "next";
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
import type { SlugArrayPageProps } from "@/app/types";

export async function generateMetadata({
  params,
}: SlugArrayPageProps): Promise<Metadata> {
  const { slug: slugParam } = await params;
  const path = contentPathFromParams(slugParam);
  return {
    title: `Edit sections · ${path}`,
    robots: { index: false, follow: false },
  };
}

export default async function CmsContentSectionEditPage({ params }: SlugArrayPageProps) {
  const { slug: slugParam } = await params;
  const path = contentPathFromParams(slugParam);

  if (!path || path === "/") {
    notFound();
  }

  let content: Record<string, unknown>;
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

  const directoryType =
    path in CONTENT_DIRECTORY_BY_PATH
      ? CONTENT_DIRECTORY_BY_PATH[path as keyof typeof CONTENT_DIRECTORY_BY_PATH]
      : undefined;

  return (
    <main>
      <CmsLiveEditProvider
        pageKey={CONTENT_PAGE_KEY}
        entityId={contentId}
        entityLabel={String(content.name)}
        initialTheme={pageTheme}
        publicHref={cmsPublicHref("content", path)}
        pageContext={{
          entityType: "content",
          entityId: contentId,
          entityName: String(content.name),
          contentSlug: String(content.slug),
          contentPath: String(content.path),
          ...(directoryType ? { directoryType } : {}),
        }}
      >
        <CmsLivePageSections />
      </CmsLiveEditProvider>
    </main>
  );
}
