"use client";

import TabsSection from "@/components/sections/TabsSection";

/** Vertical tabs + preview panel (legacy key: feature_tabs). */
export default function FeatureTabsSection(props) {
  return (
    <TabsSection
      {...props}
      section_key={props.section_key || "feature_tabs"}
      layout="vertical"
    />
  );
}
