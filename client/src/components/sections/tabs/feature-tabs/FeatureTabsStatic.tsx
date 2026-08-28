import FeatureTabsUi from "./FeatureTabsUi";
import { FEATURE_TABS_STATIC_DEMO } from "./lib/static-demo";

export default function FeatureTabsStatic({
  id = "feature-tabs-static",
  className,
}: {
  id?: string;
  className?: string;
} = {}) {
  return (
    <FeatureTabsUi
      id={id}
      className={className}
      title={FEATURE_TABS_STATIC_DEMO.title}
      subtitle={FEATURE_TABS_STATIC_DEMO.subtitle}
      tabs={FEATURE_TABS_STATIC_DEMO.tabs}
    />
  );
}
