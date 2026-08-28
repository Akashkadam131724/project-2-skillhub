import FaqTwoColumnUi from "./FaqTwoColumnUi";
import { FAQ_TWO_COLUMN_STATIC_DEMO } from "./lib/static-demo";

export type FaqTwoColumnStaticProps = {
  id?: string;
  className?: string;
  darkBand?: boolean;
};

/**
 * Static two-column FAQ — hard-coded demo into {@link FaqTwoColumnUi}.
 * Swap data in `lib/static-demo.ts` (FAQ_TWO_COLUMN_STATIC_DEMO).
 */
export default function FaqTwoColumnStatic({
  id = "faq-two-column-static",
  className,
  darkBand = false,
}: FaqTwoColumnStaticProps = {}) {
  return (
    <FaqTwoColumnUi
      id={id}
      className={className}
      eyebrow="FAQ"
      title={FAQ_TWO_COLUMN_STATIC_DEMO.title}
      subtitle={FAQ_TWO_COLUMN_STATIC_DEMO.subtitle}
      headerSide={FAQ_TWO_COLUMN_STATIC_DEMO.headerSide}
      items={FAQ_TWO_COLUMN_STATIC_DEMO.items}
      darkBand={darkBand}
    />
  );
}
