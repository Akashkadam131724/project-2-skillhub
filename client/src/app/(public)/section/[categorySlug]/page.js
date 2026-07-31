import { redirect } from "next/navigation";

export default async function PublicSectionCategoryRedirect({ params }) {
  const { categorySlug } = await params;
  redirect(`/cms/section/${categorySlug}`);
}
