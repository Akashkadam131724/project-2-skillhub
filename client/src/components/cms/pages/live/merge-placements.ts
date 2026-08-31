import { resolveContentScope } from "@/lib/cms/content-scope";
import { mergePlacementData, pickPlacementArrayField } from "@/lib/sections/placement-data";
import { placementRenderKey } from "@/lib/sections/section-render-key";
import type { PagePlacement, SectionCatalogEntry } from "../types";

/**
 * Merge template page tags + entity overrides into live editable placements.
 */
export function mergePlacements(
  tags: Array<Record<string, unknown>>,
  overrides: Array<Record<string, unknown>>,
  entityId: string | number | null | undefined,
  catalog: SectionCatalogEntry[] = [],
  sortDisabled = true
): PagePlacement[] {
  const catalogByKey = new Map(
    (catalog || []).map((s) => [String(s.key).toLowerCase(), s])
  );
  const catalogById = new Map(
    (catalog || []).map((s) => [String(s._id || s.id || ""), s])
  );
  const byTag = new Map(
    (overrides || [])
      .filter((o) => o.page_tag_id)
      .map((o) => [String(o.page_tag_id), o])
  );
  const extras = (overrides || []).filter((o) => !o.page_tag_id);

  const fromTemplate = (tags || []).map((tag) => {
    const override = byTag.get(String(tag.id));
    const catalogSection = catalogByKey.get(
      String(tag.section_key || "").toLowerCase()
    );
    const content_scope = resolveContentScope({
      scope: tag.content_scope || catalogSection?.content_scope,
      sectionKey: String(tag.section_key || ""),
      catalogSection,
    });
    const status =
      override?.status === false
        ? false
        : override?.status === true
          ? true
          : tag.status !== false;

    const pick = (key: string, fallback: unknown = "") => {
      if (content_scope === "global") {
        // API-enriched tag already carries Section content
        const t = tag[key];
        if (t !== null && t !== undefined && t !== "") return t;
        return catalogSection?.[key] ?? fallback;
      }
      if (content_scope === "template") {
        const t = tag[key];
        if (t !== null && t !== undefined && t !== "") return t;
        return catalogSection?.[key] ?? fallback;
      }
      const v = override?.[key];
      if (v !== null && v !== undefined && v !== "") return v;
      const t = tag[key];
      if (t !== null && t !== undefined && t !== "") return t;
      return catalogSection?.[key] ?? fallback;
    };

    const pickButtons = () => {
      if (content_scope === "global") {
        if (Array.isArray(tag.buttons)) return tag.buttons;
        return Array.isArray(catalogSection?.buttons)
          ? catalogSection.buttons
          : [];
      }
      if (content_scope === "template") {
        return pickPlacementArrayField("buttons", tag, catalogSection);
      }
      return pickPlacementArrayField("buttons", override, tag, catalogSection);
    };

    const pickItems = () => {
      if (content_scope === "global") {
        if (Array.isArray(tag.items)) return tag.items;
        return Array.isArray(catalogSection?.items) ? catalogSection.items : [];
      }
      if (content_scope === "template") {
        return pickPlacementArrayField("items", tag, catalogSection);
      }
      return pickPlacementArrayField("items", override, tag, catalogSection);
    };

    const sort_order =
      !sortDisabled &&
      override?.sort_order !== null &&
      override?.sort_order !== undefined
        ? override.sort_order
        : tag.sort_order;

    return {
      placement_id: String(tag.id),
      page_tag_id: tag.id,
      is_entity_extra: false,
      section_key: tag.section_key,
      render_key: placementRenderKey(
        catalogSection || { key: tag.section_key }
      ),
      section_id: tag.section_id,
      name: tag.section_name || tag.section_key,
      content_scope,
      sort_order,
      section_title: pick("section_title"),
      sub_title: pick("sub_title"),
      in_page_nav_title: pick("in_page_nav_title"),
      section_bg_img: pick("section_bg_img"),
      section_bg_color: pick("section_bg_color"),
      section_img_url: pick("section_img_url"),
      section_theme: pick("section_theme"),
      section_theme_local:
        override != null
          ? override.section_theme ?? null
          : entityId
            ? null
            : tag.section_theme ?? null,
      section_preview_img:
        catalogSection?.section_preview_img || tag.section_preview_img || "",
      buttons: pickButtons(),
      items: pickItems(),
      data:
        content_scope === "global"
          ? mergePlacementData(tag.data, catalogSection?.data)
          : content_scope === "template"
            ? mergePlacementData(catalogSection?.data, tag.data)
            : mergePlacementData(
                catalogSection?.data,
                tag.data,
                override?.data
              ),
      status,
      entity_override_id: override?._id || override?.id || null,
      entity_id: entityId,
    };
  });

  const fromExtras = extras.map((extra) => {
    const catalogSection =
      catalogByKey.get(String(extra.section_key || "").toLowerCase()) ||
      catalogById.get(
        String(
          (extra.section as Record<string, unknown> | undefined)?._id ||
            extra.section ||
            ""
        )
      );
    const sectionKey = String(
      extra.section_key || catalogSection?.key || ""
    );
    const content_scope = resolveContentScope({
      scope: catalogSection?.content_scope,
      sectionKey,
      catalogSection,
    });
    return {
      placement_id: String(extra._id || extra.id),
      page_tag_id: null,
      is_entity_extra: true,
      section_key: sectionKey,
      render_key: placementRenderKey(
        catalogSection || { key: sectionKey }
      ),
      section_id: extra.section,
      name: catalogSection?.name || extra.section_key || catalogSection?.key || "",
      content_scope,
      sort_order: extra.sort_order ?? 99,
      section_title:
        content_scope === "global"
          ? extra.section_title || catalogSection?.section_title || ""
          : extra.section_title || catalogSection?.section_title || "",
      sub_title:
        content_scope === "global"
          ? extra.sub_title || catalogSection?.sub_title || ""
          : extra.sub_title || catalogSection?.sub_title || "",
      in_page_nav_title:
        content_scope === "global"
          ? extra.in_page_nav_title || catalogSection?.in_page_nav_title || ""
          : extra.in_page_nav_title ||
            catalogSection?.in_page_nav_title ||
            "",
      section_bg_img:
        content_scope === "global"
          ? extra.section_bg_img || catalogSection?.section_bg_img || ""
          : extra.section_bg_img || catalogSection?.section_bg_img || "",
      section_bg_color:
        content_scope === "global"
          ? extra.section_bg_color ||
            catalogSection?.section_bg_color ||
            String(
              (catalogSection?.data as Record<string, unknown> | undefined)
                ?.bg_color || ""
            ) ||
            ""
          : extra.section_bg_color ||
            catalogSection?.section_bg_color ||
            String(
              (catalogSection?.data as Record<string, unknown> | undefined)
                ?.bg_color || ""
            ) ||
            "",
      section_img_url:
        content_scope === "global"
          ? extra.section_img_url || catalogSection?.section_img_url || ""
          : extra.section_img_url || catalogSection?.section_img_url || "",
      section_preview_img:
        catalogSection?.section_preview_img ||
        extra.section_preview_img ||
        "",
      section_theme:
        content_scope === "global"
          ? extra.section_theme || catalogSection?.section_theme || ""
          : (() => {
              const v = extra.section_theme;
              if (v !== null && v !== undefined && String(v).trim() !== "")
                return v;
              return catalogSection?.section_theme || "";
            })(),
      section_theme_local:
        content_scope === "global"
          ? extra.section_theme || catalogSection?.section_theme || ""
          : extra.section_theme ?? null,
      buttons:
        content_scope === "global"
          ? Array.isArray(extra.buttons)
            ? extra.buttons
            : Array.isArray(catalogSection?.buttons)
              ? catalogSection.buttons
              : []
          : pickPlacementArrayField("buttons", extra, catalogSection),
      items:
        content_scope === "global"
          ? Array.isArray(extra.items)
            ? extra.items
            : Array.isArray(catalogSection?.items)
              ? catalogSection.items
              : []
          : pickPlacementArrayField("items", extra, catalogSection),
      data:
        content_scope === "global"
          ? mergePlacementData(catalogSection?.data, extra.data)
          : mergePlacementData(catalogSection?.data, extra.data),
      status: extra.status !== false,
      entity_override_id: extra._id || extra.id,
      entity_id: entityId,
    };
  });

  return ([...fromTemplate, ...fromExtras].sort(
    (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)
  ) as unknown as PagePlacement[]);
}
