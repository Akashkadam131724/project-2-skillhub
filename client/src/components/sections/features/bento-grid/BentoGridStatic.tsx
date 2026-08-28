import BentoGridUi from "./BentoGridUi";
import { BENTO_GRID_STATIC_DEMO } from "./lib/static-demo";

export type BentoGridStaticProps = {
  className?: string;
  id?: string;
};

/**
 * Static bento grid — hard-coded demo → {@link BentoGridUi}.
 */
export default function BentoGridStatic({
  className,
  id,
}: BentoGridStaticProps = {}) {
  return (
    <BentoGridUi
      id={id}
      title={BENTO_GRID_STATIC_DEMO.title}
      subtitle={BENTO_GRID_STATIC_DEMO.subtitle}
      items={BENTO_GRID_STATIC_DEMO.items}
      className={className}
    />
  );
}
