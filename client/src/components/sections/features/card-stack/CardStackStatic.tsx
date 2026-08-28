import CardStackUi from "./CardStackUi";
import { CARD_STACK_STATIC_DEMO } from "./lib/static-demo";

export type CardStackStaticProps = {
  className?: string;
  id?: string;
};

/**
 * Static card stack — hard-coded demo → {@link CardStackUi}.
 */
export default function CardStackStatic({
  className,
  id,
}: CardStackStaticProps = {}) {
  return (
    <CardStackUi
      id={id}
      title={CARD_STACK_STATIC_DEMO.title}
      subtitle={CARD_STACK_STATIC_DEMO.subtitle}
      items={CARD_STACK_STATIC_DEMO.items}
      className={className}
    />
  );
}
