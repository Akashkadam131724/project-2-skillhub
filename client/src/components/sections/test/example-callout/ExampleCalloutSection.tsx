import ExampleCalloutPublicSection from "./ExampleCalloutPublicSection";
import type { ExampleCalloutPublicSectionProps } from "./ExampleCalloutPublicSection";

/** CMS live-edit adapter — extend when leaving static archetype. */
export default function ExampleCalloutSection(props: ExampleCalloutPublicSectionProps) {
  return <ExampleCalloutPublicSection {...props} />;
}
