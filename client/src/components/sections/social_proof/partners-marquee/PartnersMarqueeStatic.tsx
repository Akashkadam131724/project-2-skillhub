import PartnersMarqueeUi from "./PartnersMarqueeUi";
import { PARTNERS_MARQUEE_STATIC_DEMO } from "./lib/static-demo";

export type PartnersMarqueeStaticProps = {
  id?: string;
  className?: string;
};

/** Static partners marquee — hard-coded demo → {@link PartnersMarqueeUi}. */
export default function PartnersMarqueeStatic({
  id = "partners-marquee-static",
  className,
}: PartnersMarqueeStaticProps = {}) {
  return (
    <PartnersMarqueeUi
      id={id}
      className={className}
      title={PARTNERS_MARQUEE_STATIC_DEMO.title}
      subtitle={PARTNERS_MARQUEE_STATIC_DEMO.subtitle}
      items={PARTNERS_MARQUEE_STATIC_DEMO.items}
    />
  );
}
