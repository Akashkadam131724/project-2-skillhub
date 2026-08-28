import TemplateBandUi from "./TemplateBandUi";
import { TEMPLATE_BAND_STATIC_DEMO } from "./lib/static-demo";
import type { TemplateBandUiProps } from "./lib/types";

export type TemplateBandPublicSectionProps = TemplateBandUiProps & {
  section_key?: string;
  section_title?: string;
  data?: { body?: string };
};

export default function TemplateBandPublicSection({
  section_title,
  data,
  ...rest
}: TemplateBandPublicSectionProps) {
  return (
    <TemplateBandUi
      {...rest}
      eyebrow={TEMPLATE_BAND_STATIC_DEMO.eyebrow}
      title={section_title || TEMPLATE_BAND_STATIC_DEMO.title}
      body={data?.body || TEMPLATE_BAND_STATIC_DEMO.body}
    />
  );
}
