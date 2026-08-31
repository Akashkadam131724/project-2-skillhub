import { redirect } from "next/navigation";
import type { CategorySlugPageProps } from "@/app/types";

export default async function PublicSectionCategoryRedirect({
  params,
}: CategorySlugPageProps) {
  const { categorySlug } = await params;
  redirect(`/cms/section/${categorySlug}`);
}
