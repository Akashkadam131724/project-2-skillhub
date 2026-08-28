import PricingTiersUi from "./PricingTiersUi";
import { PRICING_TIERS_STATIC_DEMO } from "./lib/static-demo";

export type PricingTiersStaticProps = {
  className?: string;
  id?: string;
  onDarkBand?: boolean;
};

export default function PricingTiersStatic({
  className,
  id,
  onDarkBand = false,
}: PricingTiersStaticProps = {}) {
  return (
    <PricingTiersUi
      id={id}
      title={PRICING_TIERS_STATIC_DEMO.title}
      subtitle={PRICING_TIERS_STATIC_DEMO.subtitle}
      items={PRICING_TIERS_STATIC_DEMO.items}
      onDarkBand={onDarkBand}
      className={className}
    />
  );
}
