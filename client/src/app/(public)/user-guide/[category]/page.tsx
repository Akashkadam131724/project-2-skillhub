import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoCategoryShowcase from "../_components/DemoCategoryShowcase";
import {
  getDemoCategory,
  getDemoCategoryKeys,
  getDemoCategoryNav,
} from "../lib/demo-categories";

type DemoCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return getDemoCategoryKeys().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: DemoCategoryPageProps): Promise<Metadata> {
  const { category: categoryKey } = await params;
  const result = getDemoCategory(categoryKey);

  if (!result) {
    return { title: "Category not found · SkillHub" };
  }

  return {
    title: `${result.category.name} sections · SkillHub`,
    description: `Preview ${result.sections.length} ${result.category.name.toLowerCase()} section layouts with SkillHub demo data.`,
  };
}

export default async function DemoCategoryPage({ params }: DemoCategoryPageProps) {
  const { category: categoryKey } = await params;
  const result = getDemoCategory(categoryKey);

  if (!result) {
    notFound();
  }

  return (
    <DemoCategoryShowcase
      categoryKey={result.category.key}
      categoryName={result.category.name}
      sections={result.sections.map((section) => ({
        key: section.key,
        name: section.name,
        tags: section.tags,
        render_key: section.render_key,
      }))}
      allCategories={getDemoCategoryNav()}
    />
  );
}
