"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SectionWrapper from "@/components/sections/SectionWrapper";
import CmsPageSectionRender from "@/components/cms/pages/CmsPageSectionRender";
import { sectionUsesImage, sectionUsesBg, sectionUsesBgColor, sectionUsesItems, getSectionItemsConfig } from "@/lib/sections/section-registry";
import { itemsConfigRenderKey, placementRenderKey } from "@/lib/sections/section-render-key";
import Drawer from "@/components/ui/Drawer";
import {
  EmptyState,
  SectionPreviewThumb,
  inputClass,
} from "@/components/cms/admin/CmsUi";
import CmsPagePreviewStack from "@/components/cms/sections/CmsPagePreviewStack";
import {
  FilterGroup,
  FilterChipRow,
  buildCategoryOptions,
  sectionCategory,
  sectionKind,
  ScopeBadge,
} from "@/components/cms/sections/CmsSectionFilters";
import PageThemeShell from "@/components/cms/theme/PageThemeShell";
import SettingsIcon from "@/components/icons/SettingsIcon";
import {
  defaultSiteTheme,
  emptyPageTheme,
  mergeTheme,
  normalizePageTheme,
  surfacePatternLabel,
  themeForApiSave,
} from "@/lib/theme";
import { normalizeSectionTheme } from "@/lib/sections/section-theme";
import {
  buildVisibleWithSurface,
  normalizeInitialSections,
  placementKey,
} from "@/lib/sections/page-sections-stack";
import { mergePlacementData, pickPlacementArrayField } from "@/lib/sections/placement-data";
import {
  saveSectionBandForPlacement,
} from "@/lib/sections/placement-save";
import { bandDraftFromSection } from "@/lib/sections/section-band-cms";
import CmsSectionBandEditor from "@/components/cms/sections/CmsSectionBandEditor";
import CmsBgColorPicker from "@/components/cms/editors/CmsBgColorPicker";
import CmsButtonsEditor, {
  normalizeButtonsDraft,
  serializeButtonsDraft,
} from "@/components/cms/editors/CmsButtonsEditor";
import CmsItemsEditor, {
  normalizeItemsDraft,
  serializeItemsDraft,
} from "@/components/cms/editors/CmsItemsEditor";
import {
  deleteEntityPageSection,
  getEntityPageSections,
  getPage,
  getPageSectionsResolved,
  getSiteTheme,
  listPageSections,
  listSections,
  mediaUrl,
  updatePage,
  uploadCmsImage,
  upsertEntityPageSection,
} from "@/lib/api/cms-api";
import {
  contentLockedAtLayer,
  lockedContentHref,
  lockedContentMessage,
  normalizeContentScope,
} from "@/lib/cms/content-scope";
import CmsModeToggle from "@/components/cms/public/CmsModeToggle";
import CmsRichTextEditor from "@/components/cms/editors/CmsRichTextEditor";
import CmsThemeEditor from "@/components/cms/theme/CmsThemeEditor";
import { sanitizeRichHtml } from "@/lib/utils/rich-text";

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

function previewSrc(section, catalog = []) {
  if (section?.section_preview_img) return section.section_preview_img;
  const fromCatalog = catalog.find((c) => c.key === section?.section_key);
  return fromCatalog?.section_preview_img || "";
}

function fieldValue(section, field) {
  if (field === "body") return section?.data?.body || "";
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
  if (field === "section_bg_color") {
    return (
      section?.section_bg_color || section?.data?.bg_color || ""
    );
  }
  return section?.[field] || "";
}

function pickArrayField(field, ...sources) {
  return pickPlacementArrayField(field, ...sources);
}

function mergePlacements(tags, overrides, entityId, catalog = [], sortDisabled = true) {
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
      section_preview_img: catalogSection?.section_preview_img || "",
      buttons: pickButtons(),
      items: pickItems(),
      data:
        content_scope === "global"
          ? mergePlacementData(catalogSection?.data)
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
      catalogById.get(String(extra.section?._id || extra.section || ""));
    const content_scope = normalizeContentScope(
      catalogSection?.content_scope
    );
    // Entity-only extras: still respect global lock; template scope uses extra as the placement content
    return {
      placement_id: String(extra._id || extra.id),
      page_tag_id: null,
      is_entity_extra: true,
      section_key:
        extra.section_key ||
        catalogSection?.key ||
        "",
      render_key: placementRenderKey(
        catalogSection || { key: tag.section_key }
      ),
      section_id: extra.section,
      name: catalogSection?.name || extra.section_key || catalogSection?.key || "",
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
      section_preview_img: catalogSection?.section_preview_img || "",
      section_theme:
        content_scope === "global"
          ? catalogSection?.section_theme || ""
          : (() => {
              const v = extra.section_theme;
              if (v !== null && v !== undefined && String(v).trim() !== "")
                return v;
              return catalogSection?.section_theme || "";
            })(),
      section_theme_local:
        content_scope === "global"
          ? catalogSection?.section_theme || ""
          : extra.section_theme ?? null,
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
          ? mergePlacementData(catalogSection?.data)
          : mergePlacementData(catalogSection?.data, extra.data),
      status: extra.status !== false,
      entity_override_id: extra._id || extra.id,
      entity_id: entityId,
    };
  });

  return [...fromTemplate, ...fromExtras].sort(
    (a, b) => a.sort_order - b.sort_order
  );
}

export default function CmsLivePageSections({
  pageKey,
  entityId,
  entityLabel,
  initialSections = [],
  initialTheme = null,
  cmsMode: cmsModeProp = false,
  publicHref: publicHrefProp = null,
  pageContext = null,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dedicatedEdit = cmsModeProp === true;
  const cmsMode =
    dedicatedEdit ||
    String(searchParams.get("cms") || "").toLowerCase() === "true";

  function exitCms() {
    if (publicHrefProp) {
      router.push(publicHrefProp);
      router.refresh();
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  }

  const [sections, setSections] = useState(() =>
    normalizeInitialSections(initialSections)
  );
  const [pageTheme, setPageTheme] = useState(
    () => initialTheme || defaultSiteTheme()
  );
  const [templateThemeDraft, setTemplateThemeDraft] = useState(emptyPageTheme());
  const [siteThemeDoc, setSiteThemeDoc] = useState(null);
  const templateThemeDirtyRef = useRef(false);

  useEffect(() => {
    if (initialTheme) setPageTheme(initialTheme);
  }, [initialTheme]);

  // Pick up site / template theme changes after save (not while editing).
  useEffect(() => {
    if (!pageKey) return;
    let alive = true;

    async function refreshResolvedTheme() {
      if (templateThemeDirtyRef.current) return;
      try {
        const res = await getPageSectionsResolved(pageKey, entityId || undefined);
        if (!alive || !res?.page?.theme) return;
        setPageTheme(res.page.theme);
      } catch {
        /* keep SSR / initial theme */
      }
    }

    refreshResolvedTheme();
    window.addEventListener("focus", refreshResolvedTheme);
    return () => {
      alive = false;
      window.removeEventListener("focus", refreshResolvedTheme);
    };
  }, [pageKey, entityId]);

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
  const [bandDraft, setBandDraft] = useState(() => bandDraftFromSection(null));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState("mapped");
  const [sortDisabled, setSortDisabled] = useState(true);

  async function loadThemes(pageDoc, { force = false } = {}) {
    const siteRes = await getSiteTheme().catch(() => null);
    const site = siteRes?.data || null;
    const tpl = normalizePageTheme(pageDoc?.theme);
    setSiteThemeDoc(site);
    if (force || !templateThemeDirtyRef.current) {
      setTemplateThemeDraft(tpl);
    }
  }

  useEffect(() => {
    if (!cmsMode || !pageKey) return;
    let alive = true;
    (async () => {
      try {
        const pageRes = await getPage(pageKey).catch(() => null);
        if (!alive) return;
        await loadThemes(pageRes?.data);
      } catch {
        /* keep resolved theme from SSR */
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per page in CMS mode
  }, [cmsMode, pageKey]);

  useEffect(() => {
    setPageTheme(mergeTheme(siteThemeDoc, templateThemeDraft));
  }, [siteThemeDoc, templateThemeDraft]);

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

  const visibleWithSurface = useMemo(
    () => buildVisibleWithSurface(sections, pageTheme, cmsMode),
    [cmsMode, pageTheme, sections]
  );

  function openFieldEdit(section, field, options = {}) {
    if (
      field === "section_bg_img" ||
      field === "section_bg_color"
    ) {
      field = "section_band";
    }
    if (!FIELD_META[field]) return;
    if (
      field === "faq_header_side" &&
      (options.preset === "left" || options.preset === "right")
    ) {
      if (contentLockedAtLayer(section.content_scope, "page")) {
        setError(lockedContentMessage(section.content_scope, "page"));
        return;
      }
      setSaving(true);
      savePlacement(section, {
        data: {
          ...(section.data || {}),
          header_side: options.preset,
        },
      })
        .then(() => reload())
        .catch((err) => setError(err.message || "Save failed"))
        .finally(() => setSaving(false));
      return;
    }
    if (
      field === "cta_image_side" &&
      (options.preset === "left" || options.preset === "right")
    ) {
      if (contentLockedAtLayer(section.content_scope, "page")) {
        setError(lockedContentMessage(section.content_scope, "page"));
        return;
      }
      setSaving(true);
      savePlacement(section, {
        data: {
          ...(section.data || {}),
          image_side: options.preset,
        },
      })
        .then(() => reload())
        .catch((err) => setError(err.message || "Save failed"))
        .finally(() => setSaving(false));
      return;
    }
    if (
      field === "form_content_side" &&
      (options.preset === "left" || options.preset === "right")
    ) {
      if (contentLockedAtLayer(section.content_scope, "page")) {
        setError(lockedContentMessage(section.content_scope, "page"));
        return;
      }
      setSaving(true);
      savePlacement(section, {
        data: {
          ...(section.data || {}),
          content_side: options.preset,
        },
      })
        .then(() => reload())
        .catch((err) => setError(err.message || "Save failed"))
        .finally(() => setSaving(false));
      return;
    }
    if (field === "items" && !sectionUsesItems(section.section_key, itemsConfigRenderKey(section))) return;
    if (field === "section_img_url" && !sectionUsesImage(section.section_key, itemsConfigRenderKey(section)))
      return;
    if (field === "section_bg_img" && !sectionUsesBg(section.section_key))
      return;
    setPanelOpen(false);
    setEditing({ section, field, ...options });
    if (field === "section_band") {
      setBandDraft(bandDraftFromSection(section));
      setButtonsDraft([]);
      setItemsDraft([]);
      setFieldValueState("");
    } else if (field === "buttons") {
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
    setBandDraft(bandDraftFromSection(null));
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
    const pageContentLocked = contentLockedAtLayer(
      section.content_scope,
      "page"
    );
    if (
      pageContentLocked
    ) {
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
            section.section_key,
            itemsConfigRenderKey(section)
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
      } else if (field === "faq_header_side") {
        const side = fieldValueState === "right" ? "right" : "left";
        await savePlacement(section, {
          data: { ...(section.data || {}), header_side: side },
        });
      } else if (field === "cta_image_side") {
        const side = fieldValueState === "left" ? "left" : "right";
        await savePlacement(section, {
          data: { ...(section.data || {}), image_side: side },
        });
      } else if (field === "form_content_side") {
        const side = fieldValueState === "right" ? "right" : "left";
        await savePlacement(section, {
          data: { ...(section.data || {}), content_side: side },
        });
      } else if (field === "section_band") {
        await saveSectionBandForPlacement(section, {
          draft: bandDraft,
          savePlacement,
          contentLocked: pageContentLocked,
          pageKey,
          entityId,
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
      ? getSectionItemsConfig(
        editing.section.section_key,
        itemsConfigRenderKey(editing.section)
      )
      : null;
  const drawerTitle = editing
    ? editing.field === "items"
      ? `Edit ${itemsConfig?.label || "cards"} · ${editing.section.section_key}`
      : editing.field === "section_band"
        ? `Section band · ${editing.section.section_key}`
        : `Edit ${meta?.label || "field"} · ${editing.section.section_key}`
    : "Edit field";

  const bandEditorPlacement = useMemo(() => {
    if (!editing?.section) {
      return { inheritedSurfaceTone: undefined, inheritedSurfaceBand: undefined };
    }
    const row = visibleWithSurface.find(
      ({ section: s }) => placementKey(s) === placementKey(editing.section)
    );
    return {
      inheritedSurfaceTone: row?.surfaceTone,
      inheritedSurfaceBand: row?.surfaceBand,
    };
  }, [editing, visibleWithSurface]);

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
                Edits save live · use ⋮ on each section to edit fields
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {dedicatedEdit ? (
                <>
                  {publicHrefProp ? (
                    <Link
                      href={publicHrefProp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-emerald-300/80 bg-white px-3 py-2 text-xs font-semibold text-emerald-900 no-underline hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100 dark:hover:bg-emerald-900/60"
                    >
                      View public page
                    </Link>
                  ) : null}
                  <Link
                    href="/cms"
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-emerald-900 no-underline hover:bg-emerald-100 dark:text-emerald-100 dark:hover:bg-emerald-900/60"
                  >
                    Admin
                  </Link>
                </>
              ) : (
                <CmsModeToggle variant="bar" />
              )}
              <button
                type="button"
                onClick={openCmsPanel}
                className="inline-flex size-9 items-center justify-center rounded-lg bg-brand text-white hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                aria-label="Open page settings"
                title="Page settings"
              >
                <SettingsIcon />
              </button>
              <button
                type="button"
                onClick={exitCms}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 dark:text-emerald-100 dark:hover:bg-emerald-900/60"
              >
                Exit
              </button>
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
          (() => {
            const navIndex = visibleWithSurface.findIndex(
              ({ section }) => section.section_key === "in_page_nav"
            );

            const renderPlacements = (rows, baseIndex) =>
              rows.map(({ section, surfaceTone, surfaceBand, sectionTheme }, relIndex) => {
                const index = baseIndex + relIndex;
                const navSections =
                  section.section_key === "in_page_nav"
                    ? visibleWithSurface
                      .slice(index + 1)
                      .map(({ section: s }) => s)
                      .filter((s) => s.section_key !== "in_page_nav")
                    : undefined;
                return (
                  <CmsPageSectionRender
                    key={placementKey(section)}
                    section={section}
                    surfaceTone={surfaceTone}
                    surfaceBand={surfaceBand}
                    sectionTheme={sectionTheme}
                    pageTheme={pageTheme}
                    pageContext={pageContext}
                    catalog={catalog}
                    navSections={navSections}
                    onEditField={openFieldEdit}
                    onToggleVisibility={toggleVisibility}
                    onRemoveExtra={removeExtra}
                  />
                );
              });

            if (navIndex === -1) {
              return renderPlacements(visibleWithSurface, 0);
            }

            return (
              <>
                {renderPlacements(visibleWithSurface.slice(0, navIndex), 0)}
                {/* Sticky in-page nav must share a tall ancestor with sections below */}
                <div className="relative">
                  {renderPlacements(visibleWithSurface.slice(navIndex), navIndex)}
                </div>
              </>
            );
          })()
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
                    className={`flex-1 rounded-md px-2 py-2 text-[11px] font-semibold transition sm:px-3 sm:text-xs ${panelTab === tab.key
                        ? "bg-white text-brand shadow-sm dark:bg-slate-950 dark:text-white"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {panelTab === "theme" ? (
                <div className="space-y-4 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <div>
                    <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                      Template theme · {pageKey}
                    </p>
                    <p className="mt-1 mb-0 text-xs text-slate-500">
                      Overrides for every{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {pageKey}
                      </span>{" "}
                      page. Empty fields inherit the site theme. Section bands
                      set to Inherit follow surface mode below.
                    </p>
                  </div>
                  <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
                    <dt className="text-slate-500">Resolved surface</dt>
                    <dd className="m-0 font-semibold text-slate-800 dark:text-slate-100">
                      {surfacePatternLabel(pageTheme) || "Repeating · White → Grey"}
                    </dd>
                  </dl>
                  <CmsThemeEditor
                    mode="page"
                    inheritFrom="site"
                    inheritedTheme={mergeTheme(siteThemeDoc)}
                    value={templateThemeDraft}
                    onChange={(next) => {
                      templateThemeDirtyRef.current = true;
                      setTemplateThemeDraft(next);
                    }}
                    onSave={async () => {
                      setSaving(true);
                      setError(null);
                      try {
                        await updatePage(pageKey, {
                          theme: themeForApiSave(templateThemeDraft),
                        });
                        templateThemeDirtyRef.current = false;
                        const pageRes = await getPage(pageKey).catch(() => null);
                        await loadThemes(pageRes?.data, { force: true });
                      } catch (err) {
                        setError(err.message || "Could not save template theme");
                      } finally {
                        setSaving(false);
                      }
                    }}
                    saving={saving}
                    saveLabel={`Save ${pageKey} template theme`}
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={async () => {
                      setSaving(true);
                      setError(null);
                      try {
                        const cleared = emptyPageTheme();
                        templateThemeDirtyRef.current = false;
                        setTemplateThemeDraft(cleared);
                        await updatePage(pageKey, { theme: themeForApiSave(cleared) });
                        const pageRes = await getPage(pageKey).catch(() => null);
                        await loadThemes(pageRes?.data, { force: true });
                      } catch (err) {
                        setError(err.message || "Could not clear template theme");
                      } finally {
                        setSaving(false);
                      }
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    Use site theme only (clear template overrides)
                  </button>
                  <Link
                    href="/cms/site-theme"
                    className="inline-block text-[11px] font-semibold text-brand no-underline hover:underline"
                  >
                    Edit site theme + all templates →
                  </Link>
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
                            className={`flex cursor-pointer flex-col overflow-hidden rounded-lg border text-left transition ${selected
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
                              <ScopeBadge scope={s.content_scope} />
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
                          className={`flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5 dark:border-slate-800 ${hidden ? "opacity-50" : ""
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
                            <ScopeBadge
                              scope={s.content_scope}
                              className="ml-1 align-middle"
                            />
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
                    content_scope: s.content_scope,
                    preview: previewSrc(s, catalog),
                  }))}
                />
              ) : null}

              <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setPanelOpen(false);
                    exitCms();
                  }}
                  className="border-0 bg-transparent p-0 text-xs font-semibold text-slate-600 hover:text-brand dark:text-slate-300"
                >
                  Exit CMS mode
                </button>
                <p className="mt-1 mb-0 text-[11px] text-slate-400">
                  Returns to the page you were viewing before edit mode.
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
                {contentLockedAtLayer(
                  editing.section.content_scope,
                  "page"
                ) ? (
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
                ) : meta.input === "section_band" ? (
                  <CmsSectionBandEditor
                    draft={bandDraft}
                    onChange={setBandDraft}
                    showBgImage={sectionUsesBg(editing.section.section_key)}
                    showBgColor={sectionUsesBgColor(editing.section.section_key)}
                    inheritedSurfaceTone={bandEditorPlacement.inheritedSurfaceTone}
                    inheritedSurfaceBand={bandEditorPlacement.inheritedSurfaceBand}
                    pageTheme={pageTheme}
                    pageSurfaceMode={pageTheme?.surface_mode}
                    pageInk={pageTheme?.ink}
                    saving={saving}
                    onSubmit={saveField}
                    onCancel={closeDrawer}
                  />
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
                        renderKey={itemsConfigRenderKey(editing.section)}
                        expandItemButtons={Boolean(editing.expandItemButtons)}
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
                          ) : meta.input === "select" ? (
                            <select
                              className={inputClass}
                              value={fieldValueState || meta.options?.[0]?.value || ""}
                              onChange={(e) => setFieldValueState(e.target.value)}
                              autoFocus
                            >
                              {(meta.options || []).map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
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
                        onClick={() => saveField({ preventDefault() { } })}
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
