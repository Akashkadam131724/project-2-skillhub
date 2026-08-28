import AwardsUi from "./AwardsUi";
import { AWARDS_STATIC_DEMO } from "./lib/static-demo";

export type AwardsStaticProps = {
  className?: string;
  id?: string;
};

/**
 * Static awards — hard-coded demo → {@link AwardsUi}.
 */
export default function AwardsStatic({
  className,
  id,
}: AwardsStaticProps = {}) {
  return (
    <AwardsUi
      id={id}
      title={AWARDS_STATIC_DEMO.title}
      subtitle={AWARDS_STATIC_DEMO.subtitle}
      items={AWARDS_STATIC_DEMO.items}
      className={className}
    />
  );
}
