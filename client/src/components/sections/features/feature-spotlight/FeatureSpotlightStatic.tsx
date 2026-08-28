import FeatureSpotlightUi from "./FeatureSpotlightUi";
import { FEATURE_SPOTLIGHT_STATIC_DEMO } from "./lib/static-demo";

export type FeatureSpotlightStaticProps = {
  className?: string;
  id?: string;
};

/**
 * Static feature spotlight — hard-coded demo → {@link FeatureSpotlightUi}.
 */
export default function FeatureSpotlightStatic({
  className,
  id,
}: FeatureSpotlightStaticProps = {}) {
  return (
    <FeatureSpotlightUi
      id={id}
      title={FEATURE_SPOTLIGHT_STATIC_DEMO.section_title}
      subtitle={FEATURE_SPOTLIGHT_STATIC_DEMO.sub_title}
      items={FEATURE_SPOTLIGHT_STATIC_DEMO.items}
      className={className}
    />
  );
}
