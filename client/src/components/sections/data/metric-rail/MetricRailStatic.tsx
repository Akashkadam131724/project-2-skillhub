import MetricRailUi from "./MetricRailUi";
import { METRIC_RAIL_STATIC_DEMO } from "./lib/static-demo";

export type MetricRailStaticProps = {
  className?: string;
  id?: string;
};

/**
 * Static metric rail — hard-coded demo → {@link MetricRailUi}.
 */
export default function MetricRailStatic({
  className,
  id,
}: MetricRailStaticProps = {}) {
  return (
    <MetricRailUi
      id={id}
      title={METRIC_RAIL_STATIC_DEMO.title}
      subtitle={METRIC_RAIL_STATIC_DEMO.subtitle}
      items={METRIC_RAIL_STATIC_DEMO.items}
      className={className}
    />
  );
}
