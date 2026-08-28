import TabsHorizontalUi from "./TabsHorizontalUi";
import { TABS_HORIZONTAL_STATIC_DEMO } from "./lib/static-demo";

export default function TabsHorizontalStatic({
  id = "tabs-horizontal-static",
  className,
}: { id?: string; className?: string } = {}) {
  return (
    <TabsHorizontalUi
      id={id}
      className={className}
      title={TABS_HORIZONTAL_STATIC_DEMO.title}
      subtitle={TABS_HORIZONTAL_STATIC_DEMO.subtitle}
      tabs={TABS_HORIZONTAL_STATIC_DEMO.tabs}
    />
  );
}
