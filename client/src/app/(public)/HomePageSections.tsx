import PublicPageSections from "@/components/cms/pages/PublicPageSections";
import type { PagePlacement } from "@/components/cms/pages/types";
import type { PageThemeDraft } from "@/components/cms/theme/types";
import { fetchContentByPath } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/api/cms-api";

export default async function HomePageSections() {
  let content: Record<string, unknown> | null = null;
  let cmsSections: PagePlacement[] = [];
  let pageTheme: PageThemeDraft | null = null;

  try {
    const res = await fetchContentByPath("/");
    content = res?.data || null;
    if (content) {
      const contentId = String(content._id || content.id);
      const sectionsRes = await getPageSectionsResolved("home", contentId, {
        cache: "no-store",
      }).catch(() => ({ sections: [], page: null }));
      cmsSections = (sectionsRes.sections || []) as PagePlacement[];
      pageTheme = (sectionsRes.page?.theme as PageThemeDraft | undefined) || null;
    }
  } catch {
    content = null;
  }

  if (!content) {
    return (
      <div className="px-4 py-16 text-center text-slate-600 dark:text-slate-300">
        Homepage content not found. Run{" "}
        <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
          npm run seed:contents
        </code>
        .
      </div>
    );
  }

  const contentId = String(content._id || content.id);

  return (
    <PublicPageSections
      pageKey="home"
      sections={cmsSections}
      initialTheme={pageTheme}
      pageContext={{
        entityType: "content",
        entityId: contentId,
        entityName: String(content.name),
        contentPath: String(content.path),
      }}
    />
  );
}
