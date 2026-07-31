import PublicPageSectionsSuspense from "@/components/cms/PublicPageSectionsSuspense";
import HomePageSections from "./HomePageSections";

export const revalidate = 60;

export const metadata = {
  title: {
    absolute: "SkillHub — Publish pages your team can own",
  },
  description:
    "Publish campaign pages, solution hubs, and showcases from a live CMS — without redeploying. Catalog stays structured; stories stay flexible.",
};

export default function HomePage() {
  return (
    <main>
      <PublicPageSectionsSuspense>
        <HomePageSections />
      </PublicPageSectionsSuspense>
    </main>
  );
}
