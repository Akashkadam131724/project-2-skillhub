import DomainSearchBandUi from "./DomainSearchBandUi";
import { DOMAIN_SEARCH_BAND_STATIC_DEMO } from "./lib/static-demo";

export default function DomainSearchBandStatic() {
  return (
    <DomainSearchBandUi
      title={DOMAIN_SEARCH_BAND_STATIC_DEMO.section_title}
      subtitle={DOMAIN_SEARCH_BAND_STATIC_DEMO.sub_title}
      domain={DOMAIN_SEARCH_BAND_STATIC_DEMO.data.domain}
      items={DOMAIN_SEARCH_BAND_STATIC_DEMO.items}
    />
  );
}
