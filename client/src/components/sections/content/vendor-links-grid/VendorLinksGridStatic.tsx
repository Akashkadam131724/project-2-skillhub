import SectionThemeWrap from "@/components/sections/SectionThemeWrap";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import VendorLinksGridUi from "./VendorLinksGridUi";
import {
  VENDOR_LINKS_GRID_DEFAULT_BODY,
  VENDOR_LINKS_GRID_DEFAULT_TITLE,
  VENDOR_LINKS_GRID_STATIC_BUTTONS,
  VENDOR_LINKS_GRID_STATIC_LINKS,
} from "./lib/static-demo";

export default function VendorLinksGridStatic({
  id = "vendor-links-grid-static",
}: {
  id?: string;
}) {
  return (
    <SectionThemeWrap theme="dark" sectionKey="vendor_link_grid">
      <VendorLinksGridUi
        id={id}
        title={VENDOR_LINKS_GRID_DEFAULT_TITLE}
        body={VENDOR_LINKS_GRID_DEFAULT_BODY}
        links={VENDOR_LINKS_GRID_STATIC_LINKS}
        onDarkBand
        footer={
          <SectionButtonsFooter
            buttons={VENDOR_LINKS_GRID_STATIC_BUTTONS}
            inverted
            surface="dark"
            className="mt-4"
          />
        }
      />
    </SectionThemeWrap>
  );
}
