import CustomerTestimonialsUi from "./CustomerTestimonialsUi";
import { CUSTOMER_TESTIMONIALS_STATIC_DEMO } from "./lib/static-demo";

export type CustomerTestimonialsStaticProps = {
  id?: string;
  className?: string;
};

/** Static customer testimonials — hard-coded demo → {@link CustomerTestimonialsUi}. */
export default function CustomerTestimonialsStatic({
  id = "customer-testimonials-static",
  className,
}: CustomerTestimonialsStaticProps = {}) {
  return (
    <CustomerTestimonialsUi
      id={id}
      className={className}
      preview
      title={CUSTOMER_TESTIMONIALS_STATIC_DEMO.title}
      subtitle={CUSTOMER_TESTIMONIALS_STATIC_DEMO.subtitle}
      items={CUSTOMER_TESTIMONIALS_STATIC_DEMO.items}
    />
  );
}
