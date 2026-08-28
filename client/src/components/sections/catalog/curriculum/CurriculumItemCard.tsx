import { itemTitle } from "@/lib/sections/item-types";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";

export type CurriculumItemCardProps = {
  item?: { title?: string; [key: string]: unknown } | string | null;
  title?: string;
  preview?: boolean;
};

/** Curriculum module row — prefer plain `title`; `item` for CMS previews. */
export default function CurriculumItemCard({
  item,
  title,
  preview = false,
}: CurriculumItemCardProps) {
  const resolvedTitle =
    title ?? (typeof item === "string" ? item : item ? itemTitle(item) : "");

  return (
    <>
      {resolvedTitle ||
        (preview ? <CardPlaceholder>Module name…</CardPlaceholder> : null)}
    </>
  );
}
