import PillarDestinationsUi from "./PillarDestinationsUi";
import { PILLAR_DESTINATIONS_STATIC_DEMO } from "./lib/static-demo";

export type PillarDestinationsStaticProps = {
  className?: string;
  id?: string;
};

/**
 * Static pillar destinations — hard-coded demo → {@link PillarDestinationsUi}.
 */
export default function PillarDestinationsStatic({
  className,
  id,
}: PillarDestinationsStaticProps = {}) {
  return (
    <PillarDestinationsUi
      id={id}
      title={PILLAR_DESTINATIONS_STATIC_DEMO.section_title}
      subtitle={PILLAR_DESTINATIONS_STATIC_DEMO.sub_title}
      items={PILLAR_DESTINATIONS_STATIC_DEMO.items}
      className={className}
    />
  );
}
