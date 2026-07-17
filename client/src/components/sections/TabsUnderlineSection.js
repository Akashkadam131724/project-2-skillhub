"use client";

import TabsSection from "@/components/sections/TabsSection";

/** Underline / text tabs (editorial) + content panel. */
export default function TabsUnderlineSection(props) {
  return (
    <TabsSection
      {...props}
      section_key={props.section_key || "tabs_underline"}
      layout="underline"
    />
  );
}
