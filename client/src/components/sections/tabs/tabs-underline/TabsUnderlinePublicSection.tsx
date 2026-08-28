import NestedTabsPublicSection from "../shared/NestedTabsPublicSection";
import type { TabsSectionProps } from "../shared/lib/types";

export default function TabsUnderlinePublicSection(props: TabsSectionProps) {
  return (
    <NestedTabsPublicSection
      {...props}
      layout="underline"
      section_key={props.section_key || "tabs_underline"}
    />
  );
}
