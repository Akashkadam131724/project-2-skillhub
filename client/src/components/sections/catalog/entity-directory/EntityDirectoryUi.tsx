import { SectionLayoutRoot } from "@/components/sections/layout";
import type { EntityDirectoryUiProps } from "./lib/types";

export default function EntityDirectoryUi({
  title,
  subtitle,
  eyebrow,
  titleSlot,
  subtitleSlot,
  children,
  id = "directory",
  className = "",
}: EntityDirectoryUiProps) {

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
