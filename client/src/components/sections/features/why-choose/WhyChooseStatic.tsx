import WhyChooseUi from "./WhyChooseUi";
import { WHY_CHOOSE_STATIC_DEMO } from "./lib/static-demo";

export type WhyChooseStaticProps = {
  className?: string;
  id?: string;
  onDarkBand?: boolean;
};

/**
 * Static why choose — hard-coded demo → {@link WhyChooseUi}.
 */
export default function WhyChooseStatic({
  className,
  id,
  onDarkBand = false,
}: WhyChooseStaticProps = {}) {
  return (
    <WhyChooseUi
      id={id}
      eyebrow={WHY_CHOOSE_STATIC_DEMO.eyebrow}
      title={WHY_CHOOSE_STATIC_DEMO.title}
      subtitle={WHY_CHOOSE_STATIC_DEMO.subtitle}
      items={WHY_CHOOSE_STATIC_DEMO.items}
      onDarkBand={onDarkBand}
      className={className}
    />
  );
}
