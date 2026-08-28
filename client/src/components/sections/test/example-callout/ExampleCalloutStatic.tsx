import ExampleCalloutUi from "./ExampleCalloutUi";
import { EXAMPLE_CALLOUT_STATIC_DEMO } from "./lib/static-demo";

export type ExampleCalloutStaticProps = {
  id?: string;
  className?: string;
};

/** User-guide + local preview — hard-coded demo → {@link ExampleCalloutUi}. */
export default function ExampleCalloutStatic({
  id = "example-callout-static",
  className,
}: ExampleCalloutStaticProps = {}) {
  return (
    <ExampleCalloutUi
      id={id}
      className={className}
      eyebrow={EXAMPLE_CALLOUT_STATIC_DEMO.eyebrow}
      title={EXAMPLE_CALLOUT_STATIC_DEMO.title}
      body={EXAMPLE_CALLOUT_STATIC_DEMO.body}
    />
  );
}
