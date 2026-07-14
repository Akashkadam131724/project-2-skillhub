"use client";

import SectionFrame from "./SectionFrame";

export default function FallbackSection({
  section_key,
  section_title,
  sub_title,
  ...frameProps
}) {
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
