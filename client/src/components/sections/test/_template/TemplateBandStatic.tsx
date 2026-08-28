import TemplateBandUi from "./TemplateBandUi";
import { TEMPLATE_BAND_STATIC_DEMO } from "./lib/static-demo";

export type TemplateBandStaticProps = {
  id?: string;
  className?: string;
};

export default function TemplateBandStatic({
  id = "template-band-static",
  className,
}: TemplateBandStaticProps = {}) {
  return (
    <TemplateBandUi
      id={id}
      className={className}
      eyebrow={TEMPLATE_BAND_STATIC_DEMO.eyebrow}
      title={TEMPLATE_BAND_STATIC_DEMO.title}
      body={TEMPLATE_BAND_STATIC_DEMO.body}
    />
  );
}
