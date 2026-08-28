import KeyBenefitsUi from "./KeyBenefitsUi";
import { KEY_BENEFITS_STATIC_DEMO } from "./lib/static-demo";

export type KeyBenefitsStaticProps = {
  id?: string;
  className?: string;
};

/**
 * Static key benefits — hard-coded demo → {@link KeyBenefitsUi}.
 */
export default function KeyBenefitsStatic({
  id = "key-benefits-static",
  className,
}: KeyBenefitsStaticProps = {}) {
  return (
    <KeyBenefitsUi
      id={id}
      className={className}
      title={KEY_BENEFITS_STATIC_DEMO.title}
      subtitle={KEY_BENEFITS_STATIC_DEMO.subtitle}
      items={KEY_BENEFITS_STATIC_DEMO.items}
    />
  );
}
