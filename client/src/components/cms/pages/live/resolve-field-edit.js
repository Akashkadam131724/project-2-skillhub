"use client";

import {
  sectionUsesImage,
  sectionUsesItems,
} from "@/lib/sections/section-registry";
import { itemsConfigRenderKey } from "@/lib/sections/section-render-key";
import {
  contentLockedAtLayer,
  liveEditContentLayer,
  lockedContentMessage,
} from "@/lib/cms/content-scope";
import { FIELD_META } from "@/components/cms/pages/live/field-meta";

/**
 * Open field drawer or apply side presets without opening UI.
 * Returns { handled, editing? }.
 */
export function resolveFieldEditRequest(
  section,
  field,
  options,
  { savePlacement, reload, setError, setSaving }
) {
  let nextField = field;
  // Band editor owns bg image + color
  if (nextField === "section_bg_img" || nextField === "section_bg_color") {
    nextField = "section_band";
  }
  if (!FIELD_META[nextField]) {
    return { handled: true };
  }

  const editLayer = liveEditContentLayer();

  const applySidePreset = (dataKey) => {
    if (options.preset !== "left" && options.preset !== "right") return false;
    if (contentLockedAtLayer(section.content_scope, editLayer)) {
      setError(lockedContentMessage(section.content_scope, editLayer));
      return true;
    }
    setSaving(true);
    savePlacement(section, {
      data: {
        ...(section.data || {}),
        [dataKey]: options.preset,
      },
    })
      .then(() => reload())
      .catch((err) => setError(err.message || "Save failed"))
      .finally(() => setSaving(false));
    return true;
  };

  if (nextField === "faq_header_side" && applySidePreset("header_side")) {
    return { handled: true };
  }
  if (nextField === "cta_image_side" && applySidePreset("image_side")) {
    return { handled: true };
  }
  if (nextField === "form_content_side" && applySidePreset("content_side")) {
    return { handled: true };
  }

  if (
    nextField === "items" &&
    !sectionUsesItems(section.section_key, itemsConfigRenderKey(section))
  ) {
    return { handled: true };
  }
  if (
    nextField === "section_img_url" &&
    !sectionUsesImage(section.section_key, itemsConfigRenderKey(section))
  ) {
    return { handled: true };
  }

  return {
    handled: false,
    editing: { section, field: nextField, ...options },
  };
}
