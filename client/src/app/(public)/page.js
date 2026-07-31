import { Suspense } from "react";
import { fetchContentByPath } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/cms-api";
import CmsLivePageSections from "@/components/cms/CmsLivePageSections";

export const metadata = {
  title: {
    absolute: "SkillHub — Publish pages your team can own",
  },
  description:
    "Publish campaign pages, solution hubs, and showcases from a live CMS — without redeploying. Catalog stays structured; stories stay flexible.",
};

export default async function HomePage() {
  let content = null;
  let cmsSections = [];
  let pageTheme = null;

  try {
    const res = await fetchContentByPath("/");
    content = res?.data || null;
    if (content) {
      const contentId = String(content._id || content.id);
      const sectionsRes = await getPageSectionsResolved(
        "home",
        contentId
      ).catch(() => ({ sections: [] }));
      cmsSections = sectionsRes.sections || [];
      pageTheme = sectionsRes.page?.theme || null;
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
      <Suspense fallback={null}>
        <CmsLivePageSections
          pageKey="home"
          entityId={contentId}
          entityLabel={content.name}
          initialSections={cmsSections}
          initialTheme={pageTheme}
          pageContext={{
            entityType: "content",
            entityId: contentId,
            entityName: content.name,
            contentPath: content.path,
          }}
        />
      </Suspense>
    </main>
  );
}
