"use client";

import SectionFrame, { type SectionFrameProps } from "./SectionFrame";

export type FallbackSectionProps = SectionFrameProps & {
  section_key?: string;
  section_title?: string;
  sub_title?: string;
};

export default function FallbackSection({
  section_key,
  section_title,
  sub_title,
  ...frameProps
}: FallbackSectionProps) {
  return (
    <SectionFrame
      title={section_title || section_key}
      subtitle={sub_title}
      {...frameProps}
    >
      <p className="m-0 text-sm text-slate-500">
        Section <code>{section_key}</code> — add a renderer in the registry.
      </p>
    </SectionFrame>
  );
}
