import { fetchAllContents } from "@/lib/api";
import { isGalleryContentPage } from "@/lib/content-catalog";
import ContentPageGallery from "@/components/catalog/ContentPageGallery";

export const metadata = {
  title: "Content pages catalog",
  description: "Gallery of every CMS content page on SkillHub.",
};

export default async function ContentPagesCatalogPage() {
  let pages = [];

  try {
    const all = await fetchAllContents();
    pages = all.filter(isGalleryContentPage);
    pages.sort((a, b) => (a.path || "").localeCompare(b.path || ""));
  } catch {
    pages = [];
  }

  return (
    <main>
      <ContentPageGallery
        pages={pages}
        title="Content pages"
        subtitle="CMS marketing routes only — not vendor, product, or course entity pages. Open any card for a slide preview."
      />
    </main>
  );
}
