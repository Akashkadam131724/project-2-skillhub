import { SectionLayoutRoot } from "@/components/sections/layout";
import type { BlogDirectoryUiProps } from "./lib/types";

export default function BlogDirectoryUi({
  title,
  subtitle,
  eyebrow = "SkillHub journal",
  titleSlot,
  subtitleSlot,
  children,
  id = "blogs",
  className = "",
}: BlogDirectoryUiProps) {

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
