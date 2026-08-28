import NestedTabsPublicSection from "../shared/NestedTabsPublicSection";
import type { TabsSectionProps } from "../shared/lib/types";

export default function FeatureTabsPublicSection(props: TabsSectionProps) {
  return (
    <NestedTabsPublicSection
      {...props}
      layout="vertical"
      section_key={props.section_key || "feature_tabs"}
    />
  );
}
