import TabsUnderlineUi from "./TabsUnderlineUi";
import { TABS_UNDERLINE_STATIC_DEMO } from "./lib/static-demo";

export default function TabsUnderlineStatic({
  id = "tabs-underline-static",
  className,
}: { id?: string; className?: string } = {}) {
  return (
    <TabsUnderlineUi
      id={id}
      className={className}
      title={TABS_UNDERLINE_STATIC_DEMO.title}
      subtitle={TABS_UNDERLINE_STATIC_DEMO.subtitle}
      tabs={TABS_UNDERLINE_STATIC_DEMO.tabs}
    />
  );
}
