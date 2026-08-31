import { SectionLayoutRoot } from "@/components/sections/layout";
import type { RelatedCoursesUiProps } from "./lib/types";

export default function RelatedCoursesUi({
  title,
  subtitle,
  eyebrow = "Courses",
  titleSlot,
  subtitleSlot,
  action,
  children,
  id,
  className = "",
}: RelatedCoursesUiProps) {

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
