import StatsUi from "./StatsUi";
import { STATS_STATIC_DEMO } from "./lib/static-demo";

export type StatsStaticProps = {
  className?: string;
  id?: string;
  onDarkBand?: boolean;
};

/**
 * Static stats — hard-coded demo → {@link StatsUi}.
 */
export default function StatsStatic({
  className,
  id,
  onDarkBand = false,
}: StatsStaticProps = {}) {
  return (
    <StatsUi
      id={id}
      title={STATS_STATIC_DEMO.title}
      subtitle={STATS_STATIC_DEMO.subtitle}
      items={STATS_STATIC_DEMO.items}
      onDarkBand={onDarkBand}
      className={className}
    />
  );
}
