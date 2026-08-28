import LatestBlogsUi from "./LatestBlogsUi";

export default function LatestBlogsStatic() {
  return (
    <LatestBlogsUi title="Latest insights" subtitle="Stories from the SkillHub team">
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-[25rem] animate-pulse rounded-[1.75rem] bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>
    </LatestBlogsUi>
  );
}
