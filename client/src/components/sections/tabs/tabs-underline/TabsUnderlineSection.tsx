import NestedTabsCmsSection from "../shared/NestedTabsCmsSection";
import type { TabsSectionProps } from "../shared/lib/types";

export default function TabsUnderlineSection(props: TabsSectionProps) {
  return (
    <NestedTabsCmsSection
      {...props}
      layout="underline"
      section_key={props.section_key || "tabs_underline"}
    />
  );
}
