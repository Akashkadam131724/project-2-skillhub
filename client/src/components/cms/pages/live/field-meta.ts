import type { FieldMeta, FieldMetaKey, PagePlacement, SectionCatalogEntry } from "../types";

/** Field editor metadata for live page CMS placements. */
export const FIELD_META: Record<FieldMetaKey, FieldMeta> = {
  section_title: {
    label: "Title",
    input: "text",
    hint: "Overrides the section default for this page only",
  },
  sub_title: {
    label: "Subtitle",
    input: "textarea",
    hint: "Overrides the section default for this page only",
  },
  in_page_nav_title: {
    label: "In-page nav title",
    input: "text",
    hint: "Label in the sticky on-page nav (falls back to section title)",
  },
  section_img_url: {
    label: "Section image",
    input: "image",
    hint: "Only rendered when this section’s UI supports it (e.g. Overview, CTA)",
  },
  body: {
    label: "Body",
    input: "richtext",
    hint: "Rich text — lists, links, images, color, alignment (stored in section data)",
  },
  buttons: {
    label: "Buttons",
    input: "buttons",
    hint: "CTAs for this section — URL, YouTube, on-page #id, or form",
  },
  items: {
    label: "Cards",
    input: "items",
    hint: "Structured cards for this section — fields follow the section layout",
  },
  faq_header_side: {
    label: "Title column",
    input: "select",
    hint: "Which side shows the title — FAQs stack on the opposite column",
    options: [
      { value: "left", label: "Title left · FAQs right" },
      { value: "right", label: "Title right · FAQs left" },
    ],
  },
  cta_image_side: {
    label: "Image column",
    input: "select",
    hint: "Hero image on the left or right of the copy (tablet+)",
    options: [
      { value: "right", label: "Image right · Copy left" },
      { value: "left", label: "Image left · Copy right" },
    ],
  },
  form_content_side: {
    label: "Content column",
    input: "select",
    hint: "Copy on the left or right — form sits on the opposite side",
    options: [
      { value: "left", label: "Content left · Form right" },
      { value: "right", label: "Content right · Form left" },
    ],
  },
  section_band: {
    label: "Section band",
    input: "section_band",
    hint: "Background image or color for this section — band light/dark comes from page theme",
  },
};

export function previewSrc(
  section: PagePlacement | null | undefined,
  catalog: SectionCatalogEntry[] = []
): string {
  if (section?.section_preview_img) return String(section.section_preview_img);
  const fromCatalog = catalog.find((c) => c.key === section?.section_key);
  return String(fromCatalog?.section_preview_img || "");
}

export function fieldValue(section: PagePlacement | null | undefined, field: string): string {
  if (field === "body") return String(section?.data?.body || "");
  if (field === "faq_header_side") {
    const side = section?.data?.header_side;
    return side === "right" ? "right" : "left";
  }
  if (field === "cta_image_side") {
    const side = section?.data?.image_side;
    return side === "left" ? "left" : "right";
  }
  if (field === "form_content_side") {
    const side = section?.data?.content_side;
    return side === "right" ? "right" : "left";
  }
  return String(section?.[field] || "");
}
