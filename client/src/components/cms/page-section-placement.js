import SectionSurface from "@/components/sections/SectionSurface";
import SectionThemeWrap from "@/components/sections/SectionThemeWrap";
import { resolvePageBandFill } from "@/lib/page-band-fill";
import { SECTION_THEME_BAND_SKIP_KEYS } from "@/lib/section-theme";
import { shouldRenderPlacement } from "@/lib/item-types";
import { placementKey } from "@/lib/page-sections-stack";

function previewSrc(section, catalog = []) {
  if (section?.section_preview_img) return section.section_preview_img;
  const fromCatalog = catalog.find((c) => c.key === section?.section_key);
  return fromCatalog?.section_preview_img || "";
}

export function buildSectionCompProps({
  section,
  cmsMode,
  surfaceTone,
  surfaceBand,
  sectionTheme,
  pageContext,
  navSections,
  onEditField,
}) {
  const key = section.section_key;
  const { key: _catalogKey, ...sectionProps } = section;
  const cmsProps = cmsMode
    ? {
        cmsMode: true,
        onEditField: (field, options) => onEditField?.(section, field, options),
      }
    : {};

  return {
    compProps: {
      ...sectionProps,
      section_key: key || _catalogKey,
      ...cmsProps,
      surfaceTone,
      surfaceBand,
      sectionTheme,
      lightBand: sectionTheme === "light",
      pageContext,
      ...(key === "in_page_nav" ? { navSections: navSections || [] } : {}),
    },
    catalogKey: _catalogKey,
  };
}

export function wrapSectionBody({
  section,
  catalogKey,
  sectionBody,
  sectionTheme,
  pageTheme,
  surfaceTone,
  surfaceBand,
}) {
  const key = section.section_key;
  const fullBleedKeys = SECTION_THEME_BAND_SKIP_KEYS;
  const pageSurfaceMode = pageTheme?.surface_mode;

  if (fullBleedKeys.has(key)) {
    return (
      <SectionThemeWrap
        theme={sectionTheme}
        sectionKey={key}
        pageSurfaceMode={pageSurfaceMode}
      >
        {sectionBody}
      </SectionThemeWrap>
    );
  }

  const pageBandFill = resolvePageBandFill(pageTheme, surfaceBand, surfaceTone);

  return (
    <SectionSurface
      sectionKey={key || catalogKey}
      section_bg_color={section.section_bg_color}
      section_bg_img={section.section_bg_img}
      legacy_bg_color={section.data?.bg_color}
      surfaceTone={surfaceTone}
      surfaceBand={surfaceBand}
      sectionTheme={sectionTheme}
      pageTheme={pageTheme}
      pageSurfaceMode={pageSurfaceMode}
      pageBandFill={pageBandFill}
    >
      {sectionBody}
    </SectionSurface>
  );
}

export function PageSectionPlacementShell({
  section,
  cmsMode = false,
  catalog = [],
  sectionBody,
  cmsToolbar = null,
}) {
  if (!shouldRenderPlacement(section, cmsMode)) return null;

  const hidden = section.status === false;
  const key = section.section_key;
  const pid = placementKey(section);
  const preview = previewSrc(section, catalog);
  const body = sectionBody;

  if (key === "in_page_nav") {
    return (
      <>
        <div
          id={`cms-section-${pid}`}
          className="scroll-mt-[var(--scroll-anchor-offset,7.5rem)]"
          aria-hidden
        />
        {cmsMode ? (
          <div className={`transition ${hidden ? "opacity-40" : ""}`}>{cmsToolbar}</div>
        ) : null}
        {body}
      </>
    );
  }

  return (
    <div
      id={`cms-section-${pid}`}
      className={`scroll-mt-[var(--scroll-anchor-offset,7.5rem)] transition ${
        cmsMode && hidden ? "opacity-40" : ""
      }`}
    >
      {cmsToolbar}
      {body}
    </div>
  );
}

export { previewSrc, shouldRenderPlacement };
