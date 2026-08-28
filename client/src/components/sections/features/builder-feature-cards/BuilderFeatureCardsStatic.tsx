import BuilderFeatureCardsUi from "./BuilderFeatureCardsUi";
import { BUILDER_FEATURE_CARDS_STATIC_DEMO } from "./lib/static-demo";

export type BuilderFeatureCardsStaticProps = {
  className?: string;
  id?: string;
};

/**
 * Static builder feature cards — hard-coded demo → {@link BuilderFeatureCardsUi}.
 */
export default function BuilderFeatureCardsStatic({
  className,
  id,
}: BuilderFeatureCardsStaticProps = {}) {
  return (
    <BuilderFeatureCardsUi
      id={id}
      title={BUILDER_FEATURE_CARDS_STATIC_DEMO.title}
      subtitle={BUILDER_FEATURE_CARDS_STATIC_DEMO.subtitle}
      items={BUILDER_FEATURE_CARDS_STATIC_DEMO.items}
      className={className}
    />
  );
}
