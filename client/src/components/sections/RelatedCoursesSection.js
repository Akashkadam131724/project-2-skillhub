"use client";

import SectionFrame from "./SectionFrame";

export default function RelatedCoursesSection({
  section_title,
  sub_title,
  ...frameProps
}) {
  return (
    <SectionFrame title={section_title} subtitle={sub_title} {...frameProps}>
      <p className="m-0 text-sm text-slate-500">
        Course grid is rendered by the page catalog below / beside this block.
      </p>
    </SectionFrame>
  );
}
