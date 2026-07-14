import { Suspense } from "react";
import { fetchContentBySlug } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/cms-api";
import CmsLivePageSections from "@/components/cms/CmsLivePageSections";

export const metadata = {
  title: {
    absolute: "SkillHub",
  },
  description: "SkillHub learning platform",
};

export default async function HomePage() {
  let content = null;
  let cmsSections = [];

  try {
    const res = await fetchContentBySlug("home");
    content = res?.data || null;
    if (content) {
      const contentId = String(content._id || content.id);
      const sectionsRes = await getPageSectionsResolved(
        "home",
        contentId
      ).catch(() => ({ sections: [] }));
      cmsSections = sectionsRes.sections || [];
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
        </code>{" "}
        then{" "}
        <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
          npm run seed:heroes
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
          pageContext={{
            entityType: "content",
            entityId: contentId,
            entityName: content.name,
          }}
        />
      </Suspense>
    </main>
  );
}
