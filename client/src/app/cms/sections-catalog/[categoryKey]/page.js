import { redirect } from "next/navigation";

export default async function CmsSectionsCatalogCategoryRedirect({ params }) {
  const { categoryKey } = await params;
  const slug = String(categoryKey || "").replace(/_/g, "-");
  redirect(slug ? `/cms/section/${slug}` : "/cms/section");
}
