import TestimonialsUi from "./TestimonialsUi";
import { TESTIMONIALS_STATIC_DEMO } from "./lib/static-demo";

export type TestimonialsStaticProps = {
  id?: string;
  className?: string;
};

/** Static testimonials — hard-coded demo → {@link TestimonialsUi}. */
export default function TestimonialsStatic({
  id = "testimonials-static",
  className,
}: TestimonialsStaticProps = {}) {
  return (
    <TestimonialsUi
      id={id}
      className={className}
      title={TESTIMONIALS_STATIC_DEMO.title}
      subtitle={TESTIMONIALS_STATIC_DEMO.subtitle}
      items={TESTIMONIALS_STATIC_DEMO.items}
    />
  );
}
