import type { Metadata } from "next";
import PublicPageSectionsSuspense from "@/components/cms/pages/PublicPageSectionsSuspense";
import ContentCatchAllSections from "../ContentCatchAllSections";
import { fetchContentByPath } from "@/lib/api";
import {
  contentPathFromParams,
  isReservedContentPath,
} from "@/lib/content/content-pages";
import type { SlugArrayPageProps } from "@/app/types";

export async function generateMetadata({
  params,
}: SlugArrayPageProps): Promise<Metadata> {
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
      title: String(content.name || ""),
      description: String(content.description || content.name || ""),
    };
  } catch {
    return { title: "Not found" };
  }
}

/**
 * Catch-all for Content pages — looks up Content.path in the DB.
 * Root `/` is handled by app/page.js.
 */
export default function ContentCatchAllPage({ params }: SlugArrayPageProps) {
  return (
    <main>
      <PublicPageSectionsSuspense>
        <ContentCatchAllSections params={params} />
      </PublicPageSectionsSuspense>
    </main>
  );
}
