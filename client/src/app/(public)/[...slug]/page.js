import PublicPageSectionsSuspense from "@/components/cms/PublicPageSectionsSuspense";
import ContentCatchAllSections from "../ContentCatchAllSections";
import { fetchContentByPath } from "@/lib/api";
import {
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
export default function ContentCatchAllPage({ params }) {
  return (
    <main>
      <PublicPageSectionsSuspense>
        <ContentCatchAllSections params={params} />
      </PublicPageSectionsSuspense>
    </main>
  );
}
