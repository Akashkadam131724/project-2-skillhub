import ExampleCalloutUi from "./ExampleCalloutUi";
import { EXAMPLE_CALLOUT_STATIC_DEMO } from "./lib/static-demo";
import type { ExampleCalloutUiProps } from "./lib/types";

export type ExampleCalloutPublicSectionProps = ExampleCalloutUiProps & {
  section_key?: string;
  section_title?: string;
  data?: { body?: string };
};

/**
 * Public adapter — maps placement props → {@link ExampleCalloutUi}.
 * Static phase: falls back to built-in demo when fields are empty.
 */
export default function ExampleCalloutPublicSection({
  section_title,
  data,
  section_key: _sectionKey = "test_example_callout",
  ...rest
}: ExampleCalloutPublicSectionProps) {
  const title = section_title || EXAMPLE_CALLOUT_STATIC_DEMO.title;
  const body = data?.body || EXAMPLE_CALLOUT_STATIC_DEMO.body;

  return (
    <ExampleCalloutUi
      {...rest}
      eyebrow={EXAMPLE_CALLOUT_STATIC_DEMO.eyebrow}
      title={title}
      body={body}
    />
  );
}
