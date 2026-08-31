import { SectionLayoutRoot } from "@/components/sections/layout";
import type { ProductsUiProps } from "./lib/types";

export default function ProductsUi({
  title,
  subtitle,
  eyebrow = "Products",
  titleSlot,
  subtitleSlot,
  children,
  id,
  className = "",
}: ProductsUiProps) {

  return (
        <SectionLayoutRoot
      id={id}
      className={className}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
    >
{children}
    </SectionLayoutRoot>
  );
}
