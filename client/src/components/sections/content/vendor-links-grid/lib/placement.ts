import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { resolveVendorLinksGridLinks } from "./map";
import type { VendorLinksGridSectionProps } from "./types";

function hasActiveButtons(props: VendorLinksGridSectionProps) {
  const buttons = props.buttons;
  if (Array.isArray(buttons)) {
    const live = buttons.some(
      (b) =>
        b &&
        (b as { status?: boolean }).status !== false &&
        Boolean(
          String(
            (b as { title?: string; label?: string }).title ||
              (b as { label?: string }).label ||
              ""
          ).trim() ||
            String(
              (b as { href?: string; target_url?: string; url?: string }).href ||
                (b as { target_url?: string }).target_url ||
                (b as { url?: string }).url ||
                ""
            ).trim()
        )
    );
    if (live) return true;
  }
  return Boolean(
    String(props.button_title || "").trim() ||
      String(props.target_url || "").trim()
  );
}

export function isVendorLinkGridPlacementShowable(
  props: VendorLinksGridSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (String(props.section_title || "").trim()) return true;
  if (!isRichTextEmpty(props.data?.body)) return true;
  if (hasActiveButtons(props)) return true;
  return (
    resolveVendorLinksGridLinks(props.items, { fallbackStatic: true }).length >
    0
  );
}
