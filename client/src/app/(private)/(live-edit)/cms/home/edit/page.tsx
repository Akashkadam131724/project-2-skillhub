import { fetchContentByPath } from "@/lib/api";
import { fetchLiveEditPageTheme } from "@/lib/cms/live-edit-theme";
import { cmsPublicHref } from "@/lib/cms/cms-edit-routes";
import { CmsLiveEditProvider } from "@/components/cms/pages/live/CmsLiveEditContext";
import CmsLivePageSections from "@/components/cms/pages/CmsLivePageSections";

export const metadata = {
  title: "Edit homepage sections",
  robots: { index: false, follow: false },
};

export default async function CmsHomeSectionEditPage() {
  let content: Record<string, unknown> | null = null;
  let pageTheme = null;

  try {
    const res = await fetchContentByPath("/");
    content = res?.data || null;
    if (content) {
      pageTheme = await fetchLiveEditPageTheme("home");
    }
  } catch {
    content = null;
  }

  if (!content) {
    return (
      <main className="px-4 py-16 text-center text-slate-600 dark:text-slate-300">
        Homepage content not found. Run{" "}
        <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
          npm run seed:contents
        </code>
        .
      </main>
    );
  }

  const contentId = String(content._id || content.id);

  return (
    <main>
      <CmsLiveEditProvider
        pageKey="home"
        entityId={contentId}
        entityLabel={String(content.name)}
        initialTheme={pageTheme}
        publicHref={cmsPublicHref("home")}
        pageContext={{
          entityType: "content",
          entityId: contentId,
          entityName: String(content.name),
          contentPath: String(content.path),
        }}
      >
        <CmsLivePageSections />
      </CmsLiveEditProvider>
    </main>
  );
}
