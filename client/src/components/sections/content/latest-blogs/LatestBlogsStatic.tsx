import { DS_RADIUS, sectionClassNames } from "@/lib/sections/section-design-system";
import LatestBlogsUi from "./LatestBlogsUi";

export default function LatestBlogsStatic() {
  return (
    <LatestBlogsUi title="Latest insights" subtitle="Stories from the SkillHub team">
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={sectionClassNames(
              DS_RADIUS.media,
              "h-[25rem] animate-pulse bg-slate-200 dark:bg-slate-800"
            )}
          />
        ))}
      </div>
    </LatestBlogsUi>
  );
}
