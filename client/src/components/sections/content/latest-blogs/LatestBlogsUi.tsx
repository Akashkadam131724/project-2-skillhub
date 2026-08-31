import { SectionLayoutRoot } from "@/components/sections/layout";
import Link from "next/link";
import type { LatestBlogsUiProps } from "./lib/types";

export default function LatestBlogsUi({
  id,
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  action,
  children,
}: LatestBlogsUiProps) {

  return (
    <SectionLayoutRoot
      id={id}
      title={title}
      subtitle={subtitle}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
      headerAction={action}
    >
{children}
    </SectionLayoutRoot>
  );
}
