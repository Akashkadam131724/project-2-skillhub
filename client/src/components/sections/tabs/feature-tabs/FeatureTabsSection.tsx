import NestedTabsCmsSection from "../shared/NestedTabsCmsSection";
import type { TabsSectionProps } from "../shared/lib/types";

export default function FeatureTabsSection(props: TabsSectionProps) {
  return (
    <NestedTabsCmsSection
      {...props}
      layout="vertical"
      section_key={props.section_key || "feature_tabs"}
    />
  );
}
