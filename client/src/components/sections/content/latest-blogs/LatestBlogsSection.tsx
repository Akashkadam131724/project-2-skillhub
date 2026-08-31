"use client";

import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import LatestBlogsClient from "./LatestBlogsClient";
import type { LatestBlogsSectionProps } from "./lib/types";

export default function LatestBlogsSection({
  section_title,
  sub_title,
  data,
  cmsMode,
  onEditField,
  ...frameProps
}: LatestBlogsSectionProps) {
  return (
    <LatestBlogsClient
      section_title={section_title}
      sub_title={sub_title}
      data={data}
      cmsMode={cmsMode}
      {...frameProps}
      {...cmsSectionHeaderSlots({
        section_title,
        sub_title,
        onEditField,
        cmsMode,
      })}
    />
  );
}
