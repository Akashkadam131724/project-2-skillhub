"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { SECTION_COMPONENTS, sectionUsesAltSurface, sectionUsesImage, sectionUsesBg, sectionUsesItems, getSectionItemsConfig } from "@/lib/section-registry";
import { FallbackSection } from "@/components/sections";
import Drawer from "@/components/ui/Drawer";
import {
  EmptyState,
  SectionPreviewThumb,
  inputClass,
} from "@/components/cms/CmsUi";
import CmsPagePreviewStack from "@/components/cms/CmsPagePreviewStack";
import {
  FilterGroup,
  FilterChipRow,
  buildCategoryOptions,
  sectionCategory,
  sectionKind,
} from "@/components/cms/CmsSectionFilters";
import CmsSectionToolbar from "@/components/cms/CmsSectionToolbar";
import SectionSurface from "@/components/sections/SectionSurface";
import PageThemeShell from "@/components/cms/PageThemeShell";
import {
  defaultSiteTheme,
  emptyPageTheme,
  mergeTheme,
  normalizePageTheme,
  surfaceToneForMode,
} from "@/lib/theme";
import CmsBgColorPicker from "@/components/cms/CmsBgColorPicker";
import CmsButtonsEditor, {
  normalizeButtonsDraft,
  serializeButtonsDraft,
} from "@/components/cms/CmsButtonsEditor";
import CmsItemsEditor, {
  normalizeItemsDraft,
  serializeItemsDraft,
} from "@/components/cms/CmsItemsEditor";
import { shouldRenderPlacement } from "@/lib/item-types";
import {
  deleteEntityPageSection,
  deleteEntityPageTheme,
  getEntityPageSections,
  getEntityPageTheme,
  getPage,
  getSiteTheme,
  listPageSections,
  listSections,
  mediaUrl,
  uploadCmsImage,
  upsertEntityPageSection,
  upsertEntityPageTheme,
} from "@/lib/cms-api";
import {
  contentLockedAtLayer,
  lockedContentHref,
  lockedContentMessage,
  normalizeContentScope,
} from "@/lib/content-scope";
import CmsModeToggle from "@/components/CmsModeToggle";
import CmsRichTextEditor from "@/components/cms/CmsRichTextEditor";
import CmsThemeEditor from "@/components/cms/CmsThemeEditor";
import { sanitizeRichHtml } from "@/lib/rich-text";

const FIELD_META = {
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
  section_bg_img: {
    label: "Background image",
    input: "image",
    hint: "Upload an image or paste a URL for this section placement",
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
  section_bg_color: {
    label: "Background color",
    input: "bg_color",
    hint: "Solid color or gradient for this section band",
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
};

function placementKey(s) {
  return s.placement_id || s.page_tag_id || s.entity_override_id;
}

function previewSrc(section, catalog = []) {
  if (section?.section_preview_img) return section.section_preview_img;
  const fromCatalog = catalog.find((c) => c.key === section?.section_key);
  return fromCatalog?.section_preview_img || "";
}

function fieldValue(section, field) {
  if (field === "body") return section?.data?.body || "";
  if (field === "section_bg_color") {
    return (
      section?.section_bg_color || section?.data?.bg_color || ""
    );
  }
  return section?.[field] || "";
}

function pickArrayField(field, ...sources) {
  for (const source of sources) {
    if (source != null && Array.isArray(source[field])) return source[field];
  }
  return [];
}

function mergePlacements(tags, overrides, entityId, catalog = [], sortDisabled = true) {
  const catalogByKey = new Map(
    (catalog || []).map((s) => [String(s.key).toLowerCase(), s])
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
    const content_scope = normalizeContentScope(
      tag.content_scope || catalogSection?.content_scope
    );
    const status =
      override?.status === false
        ? false
        : override?.status === true
          ? true
          : tag.status !== false;

    const pick = (key, fallback = "") => {
      if (content_scope === "global") {
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
        return Array.isArray(catalogSection?.buttons)
          ? catalogSection.buttons
          : [];
      }
      if (content_scope === "template") {
        return pickArrayField("buttons", tag, catalogSection);
      }
      return pickArrayField("buttons", override, tag, catalogSection);
    };

    const pickItems = () => {
      if (content_scope === "global") {
        return Array.isArray(catalogSection?.items) ? catalogSection.items : [];
      }
      if (content_scope === "template") {
        return pickArrayField("items", tag, catalogSection);
      }
      return pickArrayField("items", override, tag, catalogSection);
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
      section_preview_img:
        pick("section_preview_img") ||
        catalogSection?.section_preview_img ||
        "",
      buttons: pickButtons(),
      items: pickItems(),
      data:
        content_scope === "global"
          ? catalogSection?.data ?? {}
          : content_scope === "template"
            ? (tag.data ?? catalogSection?.data ?? {})
            : (override?.data ?? tag.data ?? catalogSection?.data ?? {}),
      status,
      entity_override_id: override?._id || override?.id || null,
      entity_id: entityId,
    };
  });

  const fromExtras = extras.map((extra) => {
    const catalogSection = catalogByKey.get(
      String(extra.section_key || "").toLowerCase()
    );
    const content_scope = normalizeContentScope(
      catalogSection?.content_scope
    );
    // Entity-only extras: still respect global lock; template scope uses extra as the placement content
    return {
      placement_id: String(extra._id || extra.id),
      page_tag_id: null,
      is_entity_extra: true,
      section_key: extra.section_key,
      section_id: extra.section,
      name: extra.section_key,
      content_scope,
      sort_order: extra.sort_order ?? 99,
      section_title:
        content_scope === "global"
          ? catalogSection?.section_title || ""
          : extra.section_title || catalogSection?.section_title || "",
      sub_title:
        content_scope === "global"
          ? catalogSection?.sub_title || ""
          : extra.sub_title || catalogSection?.sub_title || "",
      in_page_nav_title:
        content_scope === "global"
          ? catalogSection?.in_page_nav_title || ""
          : extra.in_page_nav_title ||
            catalogSection?.in_page_nav_title ||
            "",
      section_bg_img:
        content_scope === "global"
          ? catalogSection?.section_bg_img || ""
          : extra.section_bg_img || catalogSection?.section_bg_img || "",
      section_bg_color:
        content_scope === "global"
          ? catalogSection?.section_bg_color ||
            catalogSection?.data?.bg_color ||
            ""
          : extra.section_bg_color ||
            catalogSection?.section_bg_color ||
            catalogSection?.data?.bg_color ||
            "",
      section_img_url:
        content_scope === "global"
          ? catalogSection?.section_img_url || ""
          : extra.section_img_url || catalogSection?.section_img_url || "",
      section_preview_img:
        catalogSection?.section_preview_img ||
        extra.section_preview_img ||
        "",
      buttons:
        content_scope === "global"
          ? Array.isArray(catalogSection?.buttons)
            ? catalogSection.buttons
            : []
          : pickArrayField("buttons", extra, catalogSection),
      items:
        content_scope === "global"
          ? Array.isArray(catalogSection?.items)
            ? catalogSection.items
            : []
          : pickArrayField("items", extra, catalogSection),
      data:
        content_scope === "global"
          ? catalogSection?.data ?? {}
          : extra.data ?? catalogSection?.data ?? {},
      status: extra.status !== false,
      entity_override_id: extra._id || extra.id,
      entity_id: entityId,
    };
  });

  return [...fromTemplate, ...fromExtras].sort(
    (a, b) => a.sort_order - b.sort_order
  );
}

const SHOW_SECTION_PREVIEWS_KEY = "cms-show-section-previews";

function SectionRender({
  section,
  cmsMode,
  showSectionPreviews = false,
  surfaceTone,
  pageContext,
  catalog = [],
  navSections,
  onEditField,
  onToggleVisibility,
  onRemoveExtra,
}) {
  // Live pages: never mount item-driven sections with no items
  if (!shouldRenderPlacement(section, cmsMode)) return null;

  const hidden = section.status === false;
  const key = section.section_key;
  const pid = placementKey(section);
  const preview = previewSrc(section, catalog);
  const previewUrl = mediaUrl(preview);
  const cmsProps = cmsMode
    ? {
        cmsMode: true,
        onEditField: (field) => onEditField?.(section, field),
      }
    : {};

  const Comp =
    SECTION_COMPONENTS[String(key || "").toLowerCase()] || FallbackSection;
  // Section catalog docs use `key` — must not spread into JSX (React reserved)
  const { key: _catalogKey, ...sectionProps } = section;
  const compProps = {
    ...sectionProps,
    section_key: key || _catalogKey,
    ...cmsProps,
    surfaceTone,
    pageContext,
    ...(key === "in_page_nav" ? { navSections: navSections || [] } : {}),
  };

  // Sticky nav must NOT sit inside SectionSurface (or any short wrapper) —
  // position:sticky is limited to its parent's height, so a nav-tall parent
  // makes sticky appear broken.
  let body;
  if (cmsMode && showSectionPreviews) {
    body = previewUrl ? (
      <div className="w-full bg-slate-100 dark:bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt={`${section.section_title || key || "Section"} preview`}
          className="block h-auto w-full"
        />
      </div>
    ) : (
      <div className="border-y border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        No preview image for{" "}
        <span className="font-mono text-xs">{key || "section"}</span>
      </div>
    );
  } else if (key === "in_page_nav") {
    body = <Comp {...compProps} />;
  } else {
    body = (
      <SectionSurface
        sectionKey={key || _catalogKey}
        section_bg_color={section.section_bg_color}
        section_bg_img={section.section_bg_img}
        legacy_bg_color={section.data?.bg_color}
        surfaceTone={surfaceTone}
      >
        <Comp {...compProps} />
      </SectionSurface>
    );
  }

  const cmsToolbar = cmsMode ? (
    <CmsSectionToolbar
      section={section}
      preview={preview}
      hidden={hidden}
      onEditField={onEditField}
      onToggleVisibility={onToggleVisibility}
      onRemoveExtra={onRemoveExtra}
    />
  ) : null;

  if (key === "in_page_nav") {
    return (
      <>
        <div
          id={`cms-section-${pid}`}
          className="scroll-mt-[120px]"
          aria-hidden
        />
        {cmsMode ? (
          <div className={`transition ${hidden ? "opacity-40" : ""}`}>
            {cmsToolbar}
          </div>
        ) : null}
        {body}
      </>
    );
  }

  return (
    <div
      id={`cms-section-${pid}`}
      className={`scroll-mt-[120px] transition ${
        cmsMode && hidden ? "opacity-40" : ""
      }`}
    >
      {cmsToolbar}
      {body}
    </div>
  );
}

export default function CmsLivePageSections({
  pageKey,
  entityId,
  entityLabel,
  initialSections = [],
  initialTheme = null,
  cmsMode: cmsModeProp = false,
  exitHref: exitHrefProp,
  pageContext = null,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cmsMode =
    cmsModeProp ||
    String(searchParams.get("cms") || "").toLowerCase() === "true";
  const exitHref = useMemo(() => {
    if (exitHrefProp) return exitHrefProp;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("cms");
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [exitHrefProp, pathname, searchParams]);

  const [sections, setSections] = useState(
    (initialSections || []).map((s) => ({
      ...s,
      placement_id:
        s.placement_id ||
        (s.page_tag_id
          ? String(s.page_tag_id)
          : String(s.sources?.entity_page_section_id || "")),
      is_entity_extra: Boolean(s.is_entity_extra),
    }))
  );
  const [pageTheme, setPageTheme] = useState(
    () => initialTheme || defaultSiteTheme()
  );
  const [entityThemeDraft, setEntityThemeDraft] = useState(emptyPageTheme());
  const [templateTheme, setTemplateTheme] = useState(null);
  const [siteThemeDoc, setSiteThemeDoc] = useState(null);

  useEffect(() => {
    if (initialTheme) setPageTheme(initialTheme);
  }, [initialTheme]);

  const [catalog, setCatalog] = useState([]);
  const [addKey, setAddKey] = useState("");
  const [addSearch, setAddSearch] = useState("");
  const [addScopeFilter, setAddScopeFilter] = useState("all");
  const [addKindFilter, setAddKindFilter] = useState("all");
  const [addPlacedFilter, setAddPlacedFilter] = useState("all");
  const [addCategoryFilter, setAddCategoryFilter] = useState("all");
  const [addCategorySearch, setAddCategorySearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [fieldValueState, setFieldValueState] = useState("");
  const [buttonsDraft, setButtonsDraft] = useState([]);
  const [itemsDraft, setItemsDraft] = useState([]);
  const buttonsDraftRef = useRef(buttonsDraft);
  const itemsDraftRef = useRef(itemsDraft);
  buttonsDraftRef.current = buttonsDraft;
  itemsDraftRef.current = itemsDraft;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState("mapped");
  const [sortDisabled, setSortDisabled] = useState(true);
  const [showSectionPreviews, setShowSectionPreviews] = useState(false);

  useEffect(() => {
    try {
      setShowSectionPreviews(
        localStorage.getItem(SHOW_SECTION_PREVIEWS_KEY) === "1"
      );
    } catch {
      /* ignore */
    }
  }, []);

  function toggleShowSectionPreviews() {
    setShowSectionPreviews((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SHOW_SECTION_PREVIEWS_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  async function loadThemes(pageDoc) {
    const [siteRes, entityRes] = await Promise.all([
      getSiteTheme().catch(() => null),
      entityId
        ? getEntityPageTheme({ page_key: pageKey, entity_id: entityId }).catch(
            () => null
          )
        : Promise.resolve(null),
    ]);
    const site = siteRes?.data || null;
    const entityTheme = normalizePageTheme(entityRes?.data?.theme);
    setSiteThemeDoc(site);
    setTemplateTheme(normalizePageTheme(pageDoc?.theme));
    setEntityThemeDraft(entityTheme);
    setPageTheme(mergeTheme(site, pageDoc?.theme, entityTheme));
  }

  useEffect(() => {
    if (!cmsMode || !entityId) return;
    let alive = true;
    (async () => {
      try {
        const [tagsRes, overridesRes, sectionsRes, pageRes] = await Promise.all([
          listPageSections({ page_key: pageKey }),
          getEntityPageSections({ page_key: pageKey, entity_id: entityId }),
          listSections({ status: true }),
          getPage(pageKey).catch(() => null),
        ]);
        if (!alive) return;
        const disabled = pageRes?.data?.is_sort_disabled !== false;
        setSortDisabled(disabled);
        await loadThemes(pageRes?.data);
        setCatalog(sectionsRes.data || []);
        setSections(
          mergePlacements(
            tagsRes.data || [],
            overridesRes.data || [],
            entityId,
            sectionsRes.data || [],
            disabled
          )
        );
      } catch (err) {
        if (alive) setError(err.message || "Failed to load sections");
      }
    })();
    return () => {
      alive = false;
    };
  }, [cmsMode, entityId, pageKey]);

  useEffect(() => {
    if (!cmsMode) return;
    const prev = document.body.style.paddingTop;
    document.body.style.paddingTop = "57px";
    return () => {
      document.body.style.paddingTop = prev;
    };
  }, [cmsMode]);

  async function reload() {
    setError(null);
    try {
      const [tagsRes, overridesRes, sectionsRes, pageRes] = await Promise.all([
        listPageSections({ page_key: pageKey }),
        getEntityPageSections({ page_key: pageKey, entity_id: entityId }),
        listSections({ status: true }),
        getPage(pageKey).catch(() => null),
      ]);
      const nextCatalog = sectionsRes.data || [];
      const disabled = pageRes?.data?.is_sort_disabled !== false;
      setSortDisabled(disabled);
      await loadThemes(pageRes?.data);
      setCatalog(nextCatalog);
      const merged = mergePlacements(
        tagsRes.data || [],
        overridesRes.data || [],
        entityId,
        nextCatalog,
        disabled
      );
      setSections(merged);
      if (editing?.section) {
        const refreshed = merged.find(
          (s) => placementKey(s) === placementKey(editing.section)
        );
        if (refreshed) {
          setEditing((prev) =>
            prev ? { ...prev, section: refreshed } : null
          );
          if (editing.field === "buttons") {
            setButtonsDraft(normalizeButtonsDraft(refreshed.buttons));
          } else if (editing.field === "items") {
            setItemsDraft(normalizeItemsDraft(refreshed.items));
          } else {
            setFieldValueState(fieldValue(refreshed, editing.field));
          }
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load sections");
    }
  }

  const visible = useMemo(() => {
    return sections.filter((s) => shouldRenderPlacement(s, cmsMode));
  }, [cmsMode, sections]);

  const visibleWithSurface = useMemo(() => {
    let altIndex = 0;
    const mode = pageTheme?.surface_mode || "alternating";
    const isTransparent =
      String(mode).toLowerCase() === "transparent" ||
      String(mode).toLowerCase() === "none";
    return visible.map((section) => {
      const hasCustomBg = Boolean(
        section.section_bg_img ||
          section.section_bg_color ||
          section.data?.bg_color
      );
      // Fixed surfaces + sections with custom bg skip white/grey alternation
      const usesAlt =
        !hasCustomBg &&
        !isTransparent &&
        sectionUsesAltSurface(section.section_key);
      let surfaceTone;
      if (isTransparent && !hasCustomBg) {
        surfaceTone = null; // clear — page bg shows through
      } else if (usesAlt) {
        surfaceTone = surfaceToneForMode(mode, altIndex);
        altIndex += 1;
      }
      return {
        section,
        surfaceTone: hasCustomBg ? undefined : surfaceTone,
      };
    });
  }, [visible, pageTheme?.surface_mode]);

  function openFieldEdit(section, field) {
    if (!FIELD_META[field]) return;
    if (field === "items" && !sectionUsesItems(section.section_key)) return;
    if (field === "section_img_url" && !sectionUsesImage(section.section_key))
      return;
    if (field === "section_bg_img" && !sectionUsesBg(section.section_key))
      return;
    setPanelOpen(false);
    setEditing({ section, field });
    if (field === "buttons") {
      setButtonsDraft(normalizeButtonsDraft(section.buttons));
      setItemsDraft([]);
      setFieldValueState("");
    } else if (field === "items") {
      setItemsDraft(normalizeItemsDraft(section.items));
      setButtonsDraft([]);
      setFieldValueState("");
    } else {
      setFieldValueState(fieldValue(section, field));
      setButtonsDraft([]);
      setItemsDraft([]);
    }
    setDrawerOpen(true);
    setError(null);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditing(null);
    setFieldValueState("");
    setButtonsDraft([]);
    setItemsDraft([]);
  }

  function openCmsPanel() {
    closeDrawer();
    setPanelOpen(true);
  }

  async function savePlacement(s, patch) {
    if (s.is_entity_extra || s.entity_override_id) {
      return upsertEntityPageSection({
        id: s.entity_override_id,
        page_key: pageKey,
        entity_id: entityId,
        section_key: s.section_key,
        ...patch,
      });
    }
    return upsertEntityPageSection({
      page_key: pageKey,
      entity_id: entityId,
      section_key: s.section_key,
      page_tag_id: s.page_tag_id,
      ...patch,
    });
  }

  async function persistOrder(nextList) {
    setSaving(true);
    setError(null);
    try {
      if (sortDisabled) {
        // Template tags keep template sort_order; page-mapped extras always
        // use EntityPageSection.sort_order (slot between neighbors).
        const effective = nextList.map((s) =>
          s.is_entity_extra ? null : Number(s.sort_order)
        );
        const updates = [];
        for (let i = 0; i < nextList.length; i++) {
          const s = nextList[i];
          if (!s.is_entity_extra) continue;

          let prevOrder = null;
          for (let p = i - 1; p >= 0; p--) {
            if (effective[p] != null && Number.isFinite(effective[p])) {
              prevOrder = effective[p];
              break;
            }
          }
          let nextOrder = null;
          for (let n = i + 1; n < nextList.length; n++) {
            if (!nextList[n].is_entity_extra) {
              const v = Number(nextList[n].sort_order);
              if (Number.isFinite(v)) {
                nextOrder = v;
                break;
              }
            }
          }

          let order;
          if (prevOrder != null && nextOrder != null) {
            order = (prevOrder + nextOrder) / 2;
          } else if (prevOrder != null) {
            order = prevOrder + 1;
          } else if (nextOrder != null) {
            order = nextOrder - 1;
          } else {
            order = i + 1;
          }

          effective[i] = order;
          updates.push(savePlacement(s, { sort_order: order }));
        }
        await Promise.all(updates);
      } else {
        // Page-level sort: always persist via EntityPageSection mapping
        await Promise.all(
          nextList.map((s, i) => savePlacement(s, { sort_order: i + 1 }))
        );
      }
      await reload();
    } catch (err) {
      setError(err.message || "Reorder failed");
      await reload();
    } finally {
      setSaving(false);
    }
  }

  async function move(index, dir) {
    const item = sections[index];
    if (sortDisabled && !item?.is_entity_extra) return;
    const next = sections.slice();
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setSections(next);
    await persistOrder(next);
  }

  async function saveField(e) {
    e.preventDefault();
    if (!editing) return;
    const { section, field } = editing;
    if (contentLockedAtLayer(section.content_scope, "page")) {
      setError(lockedContentMessage(section.content_scope, "page"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (field === "buttons") {
        await savePlacement(section, {
          buttons: serializeButtonsDraft(buttonsDraftRef.current),
        });
      } else if (field === "items") {
        await savePlacement(section, {
          items: serializeItemsDraft(
            itemsDraftRef.current,
            section.section_key
          ),
        });
      } else if (field === "body") {
        const value = sanitizeRichHtml(fieldValueState);
        await savePlacement(section, {
          data: { ...(section.data || {}), body: value || null },
        });
      } else if (field === "section_bg_color") {
        const value = fieldValueState.trim();
        await savePlacement(section, {
          section_bg_color: value || null,
        });
      } else {
        const value = fieldValueState.trim();
        await savePlacement(section, {
          [field]: value || null,
        });
      }
      await reload();
      closeDrawer();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisibility(section) {
    setSaving(true);
    setError(null);
    try {
      await savePlacement(section, { status: section.status === false });
      await reload();
    } catch (err) {
      setError(err.message || "Could not update visibility");
    } finally {
      setSaving(false);
    }
  }

  async function addOnThisPage(e) {
    e.preventDefault();
    if (!addKey) return;
    setSaving(true);
    setError(null);
    try {
      const maxSort = sections.reduce(
        (m, s) => Math.max(m, Number(s.sort_order) || 0),
        0
      );
      await upsertEntityPageSection({
        page_key: pageKey,
        entity_id: entityId,
        section_key: addKey,
        sort_order: maxSort + 1,
        status: true,
      });
      setAddKey("");
      await reload();
    } catch (err) {
      setError(err.message || "Could not add section");
    } finally {
      setSaving(false);
    }
  }

  async function removeExtra(section) {
    const target = section || editing?.section;
    if (!target?.is_entity_extra || !target.entity_override_id) return;
    if (!confirm("Remove this section from this page only?")) return;
    setSaving(true);
    try {
      await deleteEntityPageSection(target.entity_override_id);
      if (editing?.section && placementKey(editing.section) === placementKey(target)) {
        closeDrawer();
      }
      await reload();
    } catch (err) {
      setError(err.message || "Remove failed");
    } finally {
      setSaving(false);
    }
  }

  const sectionOptions = useMemo(
    () => (catalog || []).filter((s) => s.status !== false),
    [catalog]
  );

  const placedKeys = useMemo(
    () => new Set((sections || []).map((s) => s.section_key)),
    [sections]
  );

  const filteredAddOptions = useMemo(() => {
    const q = addSearch.trim().toLowerCase();
    return sectionOptions.filter((s) => {
      const scope = normalizeContentScope(s.content_scope);
      if (addScopeFilter !== "all" && scope !== addScopeFilter) return false;
      if (addKindFilter !== "all" && sectionKind(s.key) !== addKindFilter) {
        return false;
      }
      if (
        addCategoryFilter !== "all" &&
        sectionCategory(s) !== addCategoryFilter
      ) {
        return false;
      }
      const onPage = placedKeys.has(s.key);
      if (addPlacedFilter === "available" && onPage) return false;
      if (addPlacedFilter === "placed" && !onPage) return false;
      if (!q) return true;
      return (
        String(s.name || "")
          .toLowerCase()
          .includes(q) ||
        String(s.key || "")
          .toLowerCase()
          .includes(q) ||
        String(s.section_title || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [
    sectionOptions,
    addScopeFilter,
    addKindFilter,
    addCategoryFilter,
    addPlacedFilter,
    addSearch,
    placedKeys,
  ]);

  const categoryOptions = useMemo(
    () => buildCategoryOptions(sectionOptions),
    [sectionOptions]
  );

  const addFilterCounts = useMemo(() => {
    const scope = {
      all: sectionOptions.length,
      global: 0,
      template: 0,
      page: 0,
    };
    const kind = {
      all: sectionOptions.length,
      hero: 0,
      cards: 0,
      content: 0,
      nav: 0,
      other: 0,
    };
    let placed = 0;
    for (const s of sectionOptions) {
      scope[normalizeContentScope(s.content_scope)] += 1;
      kind[sectionKind(s.key)] += 1;
      if (placedKeys.has(s.key)) placed += 1;
    }
    return {
      scope,
      kind,
      placed: {
        all: sectionOptions.length,
        available: sectionOptions.length - placed,
        placed,
      },
    };
  }, [sectionOptions, placedKeys]);

  const meta = editing ? FIELD_META[editing.field] : null;
  const itemsConfig =
    editing?.field === "items"
      ? getSectionItemsConfig(editing.section.section_key)
      : null;
  const drawerTitle = editing
    ? editing.field === "items"
      ? `Edit ${itemsConfig?.label || "cards"} · ${editing.section.section_key}`
      : `Edit ${meta?.label || "field"} · ${editing.section.section_key}`
    : "Edit field";

  return (
    <div>
      {cmsMode ? (
        <div className="fixed inset-x-0 top-0 z-[60] border-b border-emerald-200/80 bg-emerald-50 shadow-sm dark:border-emerald-900 dark:bg-emerald-950">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
            <div className="min-w-0">
              <p className="m-0 text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                CMS mode
                {entityLabel ? (
                  <span className="font-normal text-emerald-800/80 dark:text-emerald-200/80">
                    {" "}
                    · {entityLabel}
                  </span>
                ) : null}
              </p>
              <p className="mt-0.5 mb-0 text-[11px] text-emerald-800/70 dark:text-emerald-200/70">
                Edits save live · pages always fetch fresh data (SSR)
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={toggleShowSectionPreviews}
                aria-pressed={showSectionPreviews}
                title={
                  showSectionPreviews
                    ? "Showing section preview images — click for live sections"
                    : "Show section preview images instead of live sections"
                }
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  showSectionPreviews
                    ? "bg-emerald-700 text-white hover:bg-emerald-800"
                    : "bg-white text-emerald-900 ring-1 ring-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-50 dark:ring-emerald-800 dark:hover:bg-emerald-900/70"
                }`}
              >
                {showSectionPreviews ? "Previews on" : "Previews off"}
              </button>
              <CmsModeToggle variant="bar" />
              <button
                type="button"
                onClick={openCmsPanel}
                className="inline-flex size-9 items-center justify-center rounded-lg bg-brand text-white hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                aria-label="Open page settings"
                title="Page settings"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <Link
                href={exitHref}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-emerald-900 no-underline hover:bg-emerald-100 dark:text-emerald-100 dark:hover:bg-emerald-900/60"
              >
                Exit
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <PageThemeShell theme={pageTheme}>
        {!visibleWithSurface.length ? (
          <SectionWrapper className="py-8 text-sm text-slate-500">
            No CMS sections yet.{" "}
            {cmsMode
              ? "Open page settings to add one — this page only."
              : null}{" "}
            <Link href={`/cms/pages/${pageKey}`} className="text-brand">
              Template CMS
            </Link>
          </SectionWrapper>
        ) : (
          <>
            {visibleWithSurface.map(({ section, surfaceTone }, index) => {
              const navSections =
                section.section_key === "in_page_nav"
                  ? visibleWithSurface
                      .slice(index + 1)
                      .map(({ section: s }) => s)
                      .filter((s) => s.section_key !== "in_page_nav")
                  : undefined;
              return (
                <SectionRender
                  key={placementKey(section)}
                  section={section}
                  cmsMode={cmsMode}
                  showSectionPreviews={showSectionPreviews}
                  surfaceTone={surfaceTone}
                  pageContext={pageContext}
                  catalog={catalog}
                  navSections={navSections}
                  onEditField={openFieldEdit}
                  onToggleVisibility={toggleVisibility}
                  onRemoveExtra={removeExtra}
                />
              );
            })}
          </>
        )}
      </PageThemeShell>

      {cmsMode ? (
        <>
          <Drawer
            open={panelOpen}
            onClose={() => setPanelOpen(false)}
            side="right"
            size="2xl"
            widthControl
            defaultWidthPct={75}
            title="Page settings"
          >
            <div className="space-y-4">
              <div>
                <p className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
                  {entityLabel || pageKey}
                </p>
                <p className="mt-0.5 mb-0 text-xs text-slate-500">
                  Add, hide, remove page mappings · pencil on the page to edit
                  fields
                </p>
              </div>

              {error && !drawerOpen ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
                  {error}
                </div>
              ) : null}

              <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
                {[
                  {
                    key: "mapped",
                    label: `Mapped Sections (${sections.length})`,
                  },
                  { key: "add", label: "Add new Sections" },
                  { key: "preview", label: "Preview" },
                  { key: "theme", label: "Theme" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setPanelTab(tab.key)}
                    className={`flex-1 rounded-md px-2 py-2 text-[11px] font-semibold transition sm:px-3 sm:text-xs ${
                      panelTab === tab.key
                        ? "bg-white text-brand shadow-sm dark:bg-slate-950 dark:text-white"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {panelTab === "theme" ? (
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                      This page theme
                    </p>
                    <p className="mt-0.5 mb-0 text-xs text-slate-500">
                      Overrides for{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {entityLabel || "this page"}
                      </span>{" "}
                      only. Empty fields use the template theme (then site).
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Link
                      href="/cms/site-theme"
                      className="rounded-md border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600 no-underline hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                    >
                      Site theme
                    </Link>
                    <Link
                      href={`/cms/pages/${pageKey}`}
                      className="rounded-md border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600 no-underline hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                    >
                      Template theme
                    </Link>
                  </div>
                </div>
                <CmsThemeEditor
                  mode="page"
                  inheritFrom="template"
                  inheritedTheme={mergeTheme(siteThemeDoc, templateTheme)}
                  value={entityThemeDraft}
                  onChange={(next) => {
                    setEntityThemeDraft(next);
                    setPageTheme(
                      mergeTheme(siteThemeDoc, templateTheme, next)
                    );
                  }}
                  onSave={async () => {
                    if (!entityId) return;
                    setSaving(true);
                    setError(null);
                    try {
                      await upsertEntityPageTheme({
                        page_key: pageKey,
                        entity_id: entityId,
                        theme: entityThemeDraft,
                      });
                      await loadThemes(
                        (
                          await getPage(pageKey).catch(() => null)
                        )?.data
                      );
                    } catch (err) {
                      setError(err.message || "Could not save page theme");
                    } finally {
                      setSaving(false);
                    }
                  }}
                  saving={saving}
                  saveLabel="Save this page theme"
                />
                <button
                  type="button"
                  disabled={saving}
                  onClick={async () => {
                    if (!entityId) return;
                    setSaving(true);
                    setError(null);
                    try {
                      await deleteEntityPageTheme({
                        page_key: pageKey,
                        entity_id: entityId,
                      });
                      setEntityThemeDraft(emptyPageTheme());
                      await loadThemes(
                        (
                          await getPage(pageKey).catch(() => null)
                        )?.data
                      );
                    } catch (err) {
                      setError(err.message || "Could not clear page theme");
                    } finally {
                      setSaving(false);
                    }
                  }}
                  className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  Use template theme (clear this page)
                </button>
              </div>
              ) : null}

              {panelTab === "add" ? (
              <form onSubmit={addOnThisPage} className="space-y-3">
                <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                  Add on this page
                </p>

                <input
                  className={inputClass}
                  value={addSearch}
                  onChange={(e) => setAddSearch(e.target.value)}
                  placeholder="Search by name or key…"
                />

                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                  <FilterGroup
                    title="Category"
                    search={addCategorySearch}
                    onSearch={setAddCategorySearch}
                    placeholder="Search Category"
                    options={categoryOptions}
                    value={addCategoryFilter}
                    onChange={setAddCategoryFilter}
                    maxHeightClass="max-h-36"
                  />
                </div>

                <FilterChipRow
                  label="Scope"
                  value={addScopeFilter}
                  onChange={setAddScopeFilter}
                  options={[
                    { value: "all", label: "All scopes" },
                    { value: "global", label: "Global" },
                    { value: "template", label: "Template" },
                    { value: "page", label: "Page" },
                  ].map((opt) => ({
                    ...opt,
                    count: addFilterCounts.scope[opt.value] ?? 0,
                  }))}
                />

                <FilterChipRow
                  label="Type"
                  value={addKindFilter}
                  onChange={setAddKindFilter}
                  activeClass="bg-ink text-white"
                  options={[
                    { value: "all", label: "All types" },
                    { value: "hero", label: "Hero" },
                    { value: "cards", label: "Cards" },
                    { value: "content", label: "Content" },
                    { value: "nav", label: "Nav" },
                    { value: "other", label: "Other" },
                  ].map((opt) => ({
                    ...opt,
                    count: addFilterCounts.kind[opt.value] ?? 0,
                  }))}
                />

                <FilterChipRow
                  label="On page"
                  value={addPlacedFilter}
                  onChange={setAddPlacedFilter}
                  activeClass="bg-teal-700 text-white"
                  options={[
                    { value: "all", label: "All sections" },
                    { value: "available", label: "Not on page" },
                    { value: "placed", label: "Already on page" },
                  ].map((opt) => ({
                    ...opt,
                    count: addFilterCounts.placed[opt.value] ?? 0,
                  }))}
                />

                {!filteredAddOptions.length ? (
                  <EmptyState message="No sections match these filters." />
                ) : (
                  <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto">
                    {filteredAddOptions.map((s) => {
                      const selected = addKey === s.key;
                      const onPage = placedKeys.has(s.key);
                      return (
                        <div
                          key={s.key}
                          role="button"
                          tabIndex={0}
                          onClick={() => setAddKey(s.key)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setAddKey(s.key);
                            }
                          }}
                          className={`flex cursor-pointer flex-col overflow-hidden rounded-lg border text-left transition ${
                            selected
                              ? "border-brand ring-2 ring-brand/30"
                              : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                          }`}
                        >
                          <SectionPreviewThumb
                            src={s.section_preview_img}
                            alt={s.name}
                            className="h-16 w-full"
                            rounded="rounded-none"
                          />
                          <div className="flex flex-wrap gap-1 px-2 pt-1">
                            {onPage ? (
                              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                On page
                              </span>
                            ) : null}
                          </div>
                          <span className="truncate px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-200">
                            {s.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="m-0 text-[11px] text-slate-500">
                  Showing {filteredAddOptions.length} of {sectionOptions.length}
                  {addKey ? ` · selected: ${addKey}` : ""}
                </p>

                <button
                  type="submit"
                  disabled={!addKey || saving}
                  className="w-full rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Add (this page only)
                </button>
              </form>
              ) : null}

              {panelTab === "mapped" ? (
              <div>
                <p className="mb-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                  {sortDisabled
                    ? "Sections (template order + page mappings)"
                    : "Sort sections"}
                </p>
                {sortDisabled ? (
                  <p className="mb-2 text-[11px] text-slate-400">
                    Template sections follow{" "}
                    <Link
                      href={`/cms/pages/${pageKey}`}
                      className="font-semibold text-brand no-underline"
                    >
                      template CMS
                    </Link>
                    . Page-only (+page) sections use this page’s mapping sort —
                    move those with ↑ ↓.
                  </p>
                ) : (
                  <p className="mb-2 text-[11px] text-slate-400">
                    Order is stored on this page’s EntityPageSection mappings.
                  </p>
                )}
                <ul className="m-0 list-none space-y-1.5 p-0">
                  {sections.map((s, index) => {
                    const pid = placementKey(s);
                    const canMove = !sortDisabled || s.is_entity_extra;
                    const hidden = s.status === false;
                    return (
                      <li
                        key={pid}
                        className={`flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5 dark:border-slate-800 ${
                          hidden ? "opacity-50" : ""
                        }`}
                      >
                        <SectionPreviewThumb
                          src={previewSrc(s, catalog)}
                          alt={s.section_key}
                          className="size-10"
                        />
                        <button
                          type="button"
                          className="min-w-0 flex-1 truncate text-left text-xs font-medium text-slate-800 dark:text-slate-100"
                          onClick={() => {
                            document
                              .getElementById(`cms-section-${pid}`)
                              ?.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                            setPanelOpen(false);
                          }}
                        >
                          <span className="mr-1 text-slate-400">
                            #{s.sort_order}
                          </span>
                          {s.section_key}
                          {s.is_entity_extra ? (
                            <span className="ml-1 text-[10px] text-emerald-600">
                              +page
                            </span>
                          ) : null}
                          {hidden ? (
                            <span className="ml-1 text-[10px] text-rose-600">
                              hidden
                            </span>
                          ) : null}
                        </button>
                        <button
                          type="button"
                          className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                          disabled={saving}
                          onClick={() => toggleVisibility(s)}
                          title={
                            hidden
                              ? "Show section on this page"
                              : "Hide section on this page"
                          }
                        >
                          {hidden ? "Show" : "Hide"}
                        </button>
                        {s.is_entity_extra ? (
                          <button
                            type="button"
                            className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-30 dark:hover:bg-rose-950/40"
                            disabled={saving}
                            onClick={() => removeExtra(s)}
                            title="Remove this page-only mapping"
                          >
                            Remove
                          </button>
                        ) : null}
                        {canMove ? (
                          <>
                            <button
                              type="button"
                              className="rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                              disabled={index === 0 || saving}
                              onClick={() => move(index, -1)}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className="rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                              disabled={index === sections.length - 1 || saving}
                              onClick={() => move(index, 1)}
                            >
                              ↓
                            </button>
                          </>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
              ) : null}

              {panelTab === "preview" ? (
                <CmsPagePreviewStack
                  emptyMessage="No sections mapped on this page yet."
                  items={sections.map((s) => ({
                    id: placementKey(s),
                    section_key: s.section_key,
                    sort_order: s.sort_order,
                    hidden: s.status === false,
                    preview: previewSrc(s, catalog),
                  }))}
                />
              ) : null}

              <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
                <Link
                  href={exitHref}
                  className="text-xs font-semibold text-slate-600 no-underline hover:text-brand dark:text-slate-300"
                >
                  Exit CMS mode
                </Link>
                <p className="mt-1 mb-0 text-[11px] text-slate-400">
                  Or use <span className="font-semibold">CMS On/Off</span> in
                  the top bar
                </p>
              </div>
            </div>
          </Drawer>

          <Drawer
            open={drawerOpen && Boolean(editing && meta)}
            onClose={closeDrawer}
            side="right"
            size={
              editing?.field === "items" || editing?.field === "body"
                ? "full"
                : "xl"
            }
            widthControl
            defaultWidthPct={
              editing?.field === "items" || editing?.field === "body" ? 75 : 50
            }
            title={drawerTitle}
          >
            {error ? (
              <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
                {error}
              </div>
            ) : null}

            {editing && meta ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-2 dark:border-slate-800">
                  <SectionPreviewThumb
                    src={previewSrc(editing.section, catalog)}
                    alt={editing.section.section_key}
                    className="h-16 w-24"
                  />
                  <div className="min-w-0">
                    <p className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
                      {editing.section.section_key}
                    </p>
                    <p className="m-0 text-xs text-slate-500">
                      {editing.section.section_title || editing.section.name || "Section"}
                    </p>
                  </div>
                </div>
                {contentLockedAtLayer(editing.section.content_scope, "page") ? (
                  <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
                    <p className="m-0">
                      {lockedContentMessage(
                        editing.section.content_scope,
                        "page"
                      )}
                    </p>
                    <Link
                      href={lockedContentHref(editing.section.content_scope, {
                        sectionKey: editing.section.section_key,
                        pageKey,
                        tagId: editing.section.page_tag_id,
                      })}
                      className="inline-flex font-semibold text-brand no-underline"
                    >
                      Edit at{" "}
                      {normalizeContentScope(editing.section.content_scope) ===
                      "template"
                        ? "template"
                        : "global"}{" "}
                      level →
                    </Link>
                  </div>
                ) : (
                  <>
                <p className="m-0 text-xs text-slate-500">{meta.hint}</p>
                {meta.input === "buttons" ? (
                  <CmsButtonsEditor
                    value={buttonsDraft}
                    onChange={setButtonsDraft}
                  />
                ) : meta.input === "items" ? (
                  <CmsItemsEditor
                    value={itemsDraft}
                    onChange={setItemsDraft}
                    sectionKey={editing.section.section_key}
                  />
                ) : meta.input === "bg_color" ? (
                  <form onSubmit={saveField} className="space-y-3">
                    <div>
                      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                        {meta.label}
                      </span>
                      <CmsBgColorPicker
                        value={fieldValueState}
                        onChange={setFieldValueState}
                        variant="theme"
                        defaultLabel="Default"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center rounded-lg border-0 bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
                      >
                        {saving ? "Saving…" : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={closeDrawer}
                        className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <form
                    onSubmit={saveField}
                    className="space-y-3"
                  >
                    <div className="block text-sm">
                      <span className="mb-1 block font-medium text-slate-700 dark:text-slate-200">
                        {meta.label}
                      </span>
                      {meta.input === "richtext" ? (
                        <CmsRichTextEditor
                          value={fieldValueState}
                          onChange={setFieldValueState}
                          placeholder={`Write ${meta.label.toLowerCase()}…`}
                        />
                      ) : meta.input === "textarea" ? (
                        <textarea
                          className={`${inputClass} min-h-[120px]`}
                          value={fieldValueState}
                          onChange={(e) => setFieldValueState(e.target.value)}
                          autoFocus
                        />
                      ) : meta.input === "image" ? (
                        <div className="space-y-3">
                          {fieldValueState ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={mediaUrl(fieldValueState)}
                              alt="Background preview"
                              className="h-28 w-full rounded-lg object-cover"
                            />
                          ) : null}
                          <input
                            className={inputClass}
                            value={fieldValueState}
                            onChange={(e) => setFieldValueState(e.target.value)}
                            placeholder="https://… or /uploads/…"
                            autoFocus
                          />
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="block w-full text-xs text-slate-600"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.target.value = "";
                              if (!file) return;
                              setSaving(true);
                              setError(null);
                              try {
                                const dataUrl = await new Promise(
                                  (resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onload = () => resolve(reader.result);
                                    reader.onerror = () =>
                                      reject(new Error("Could not read file"));
                                    reader.readAsDataURL(file);
                                  }
                                );
                                const res = await uploadCmsImage(
                                  dataUrl,
                                  "sections"
                                );
                                setFieldValueState(res.data?.url || "");
                              } catch (err) {
                                setError(err.message || "Upload failed");
                              } finally {
                                setSaving(false);
                              }
                            }}
                          />
                          {fieldValueState ? (
                            <button
                              type="button"
                              className="text-xs font-semibold text-rose-600"
                              onClick={() => setFieldValueState("")}
                            >
                              Clear image
                            </button>
                          ) : null}
                        </div>
                      ) : (
                        <input
                          className={inputClass}
                          value={fieldValueState}
                          onChange={(e) => setFieldValueState(e.target.value)}
                          autoFocus
                        />
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full rounded-lg bg-brand px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {saving ? "Saving…" : "Save for this page"}
                    </button>
                  </form>
                )}
                {meta.input === "buttons" || meta.input === "items" ? (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveField({ preventDefault() {} })}
                    className="w-full rounded-lg bg-brand px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save for this page"}
                  </button>
                ) : null}
                  </>
                )}
              </div>
            ) : null}
          </Drawer>
        </>
      ) : null}
    </div>
  );
}
