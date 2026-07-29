"use client";

import TabsSection from "./TabsSection";

/** Horizontal pill tabs + content panel. */
export default function TabsHorizontalSection(props) {
  return (
    <TabsSection
      {...props}
      section_key={props.section_key || "tabs_horizontal"}
      layout="horizontal"
    />
  );
}
