import NestedTabsPublicSection from "../shared/NestedTabsPublicSection";
import type { TabsSectionProps } from "../shared/lib/types";

export default function TabsHorizontalPublicSection(props: TabsSectionProps) {
  return (
    <NestedTabsPublicSection
      {...props}
      layout="horizontal"
      section_key={props.section_key || "tabs_horizontal"}
    />
  );
}
