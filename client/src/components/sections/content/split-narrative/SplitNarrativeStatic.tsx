import SplitNarrativeUi from "./SplitNarrativeUi";
import { SPLIT_NARRATIVE_STATIC_DEMO } from "./lib/static-demo";

export default function SplitNarrativeStatic() {
  return (
    <SplitNarrativeUi
      title={SPLIT_NARRATIVE_STATIC_DEMO.section_title}
      subtitle={SPLIT_NARRATIVE_STATIC_DEMO.sub_title}
      items={SPLIT_NARRATIVE_STATIC_DEMO.items}
    />
  );
}
