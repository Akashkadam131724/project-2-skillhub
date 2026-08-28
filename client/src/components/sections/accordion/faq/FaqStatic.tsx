import FaqUi from "./FaqUi";
import { FAQ_STATIC_DEMO } from "./lib/static-demo";

export type FaqStaticProps = {
  id?: string;
  className?: string;
  darkBand?: boolean;
};

/**
 * Static FAQ — hard-coded demo data into {@link FaqUi}.
 * Use for /user-guide, section library samples, Storybook.
 * Swap data in `lib/static-demo.ts` (FAQ_STATIC_DEMO).
 */
export default function FaqStatic({
  id = "faq-static",
  className,
  darkBand = false,
}: FaqStaticProps = {}) {
  return (
    <FaqUi
      id={id}
      className={className}
      eyebrow="FAQ"
      title={FAQ_STATIC_DEMO.title}
      subtitle={FAQ_STATIC_DEMO.subtitle}
      items={FAQ_STATIC_DEMO.items}
      darkBand={darkBand}
    />
  );
}
