import PublicPageSections from "@/components/cms/pages/PublicPageSections";
import { fetchContentByPath } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/api/cms-api";

export default async function HomePageSections() {
  let content = null;
  let cmsSections = [];
  let pageTheme = null;

  try {
    const res = await fetchContentByPath("/");
    content = res?.data || null;
    if (content) {
      const contentId = String(content._id || content.id);
      const sectionsRes = await getPageSectionsResolved("home", contentId, {
        cache: "no-store",
      }).catch(() => ({ sections: [] }));
      cmsSections = sectionsRes.sections || [];
      pageTheme = sectionsRes.page?.theme || null;
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
        entityName: content.name,
        contentPath: content.path,
      }}
    />
  );
}
