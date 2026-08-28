import NestedTabsCmsSection from "../shared/NestedTabsCmsSection";
import type { TabsSectionProps } from "../shared/lib/types";

export default function TabsHorizontalSection(props: TabsSectionProps) {
  return (
    <NestedTabsCmsSection
      {...props}
      layout="horizontal"
      section_key={props.section_key || "tabs_horizontal"}
    />
  );
}
