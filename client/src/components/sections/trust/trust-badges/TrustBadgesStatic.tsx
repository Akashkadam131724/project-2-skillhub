import TrustBadgesUi from "./TrustBadgesUi";
import { TRUST_BADGES_STATIC_DEMO } from "./lib/static-demo";

export type TrustBadgesStaticProps = {
  id?: string;
  className?: string;
};

/**
 * Static trust badges — hard-coded demo → {@link TrustBadgesUi}.
 */
export default function TrustBadgesStatic({
  id = "trust-badges-static",
  className,
}: TrustBadgesStaticProps = {}) {
  return (
    <TrustBadgesUi
      id={id}
      className={className}
      title={TRUST_BADGES_STATIC_DEMO.title}
      subtitle={TRUST_BADGES_STATIC_DEMO.subtitle}
      items={TRUST_BADGES_STATIC_DEMO.items}
    />
  );
}
