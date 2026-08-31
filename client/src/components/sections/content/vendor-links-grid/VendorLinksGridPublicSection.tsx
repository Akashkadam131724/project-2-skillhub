import { publicSectionButtonsFooter } from "@/components/sections/shared/public-section-footer";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import VendorLinksGridUi from "./VendorLinksGridUi";
import {
  VENDOR_LINKS_GRID_DEFAULT_BODY,
  VENDOR_LINKS_GRID_DEFAULT_TITLE,
} from "./lib/static-demo";
import { resolveVendorLinksGridLinks } from "./lib/map";
import { isVendorLinkGridPlacementShowable } from "./lib/placement";
import type { VendorLinksGridSectionProps } from "./lib/types";

export default function VendorLinksGridPublicSection({
  section_title,
  data,
  items: mappingItems,
  section_key = "vendor_link_grid",
  section_theme,
  sectionTheme,
  surfaceTone,
  surfaceBand,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: VendorLinksGridSectionProps) {
  const props = {
    section_key,
    section_title,
    data,
    items: mappingItems,
    buttons,
    button_title,
    target_url,
  };

  if (!isVendorLinkGridPlacementShowable(props, false)) {
    return null;
  }

  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  const title =
    String(section_title || "").trim() || VENDOR_LINKS_GRID_DEFAULT_TITLE;
  const body = data?.body?.trim()
    ? data.body
    : VENDOR_LINKS_GRID_DEFAULT_BODY;
  const links = resolveVendorLinksGridLinks(mappingItems, {
    fallbackStatic: true,
  });

  return (
    <VendorLinksGridUi
      id={id}
      title={title}
      body={body}
      links={links}
      onDarkBand={onDarkBand}
      footer={publicSectionButtonsFooter({
        buttons,
        button_title,
        target_url,
        onFormOpen,
        inverted: onDarkBand,
        surface: onDarkBand ? "dark" : "inherit",
        className: "mt-4",
      })}
    />
  );
}
