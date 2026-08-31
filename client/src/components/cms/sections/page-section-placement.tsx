import SectionSurface from "@/components/sections/SectionSurface";
import SectionThemeWrap from "@/components/sections/SectionThemeWrap";
import { resolvePageBandFill } from "@/lib/sections/page-band-fill";
import type { SurfaceBandLike } from "@/lib/theme/surface-patterns";
import { SECTION_THEME_BAND_SKIP_KEYS } from "@/lib/sections/section-theme";
import { shouldRenderPlacement } from "@/lib/sections/item-types";
import { placementKey } from "@/lib/sections/page-sections-stack";
import type {
  BuildSectionCompPropsArgs,
  PageSectionPlacementShellProps,
  WrapSectionBodyArgs,
} from "./types";
import type { PagePlacement, SectionCatalogEntry } from "@/components/cms/pages/types";

function previewSrc(
  section: PagePlacement | Record<string, unknown>,
  catalog: SectionCatalogEntry[] = []
): string {
  if (section?.section_preview_img) return String(section.section_preview_img);
  const fromCatalog = catalog.find((c) => c.key === section?.section_key);
  return String(fromCatalog?.section_preview_img || "");
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
}: BuildSectionCompPropsArgs) {
  const key = String(section.section_key || "");
  const { key: _catalogKey, ...sectionProps } = section as PagePlacement & {
    key?: string;
  };
  const cmsProps = cmsMode
    ? {
        cmsMode: true,
        onEditField: (field: string, options?: Record<string, unknown>) =>
          onEditField?.(section, field, options),
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
    catalogKey: String(_catalogKey || ""),
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
  surfaceBandIndex,
}: WrapSectionBodyArgs) {
  const key = String(section.section_key || "");
  const fullBleedKeys = SECTION_THEME_BAND_SKIP_KEYS;
  const pageSurfaceMode = pageTheme?.surface_mode;

  if (fullBleedKeys.has(key)) {
    return (
      <SectionThemeWrap
        theme={sectionTheme}
        sectionKey={key}
        pageSurfaceMode={String(pageSurfaceMode || "")}
      >
        {sectionBody}
      </SectionThemeWrap>
    );
  }

  const pageBandFill = resolvePageBandFill(
    pageTheme,
    surfaceBand as SurfaceBandLike | null | undefined,
    surfaceTone,
    surfaceBandIndex
  );

  return (
    <SectionSurface
      sectionKey={key || catalogKey}
      section_bg_color={String(section.section_bg_color || "")}
      section_bg_img={String(section.section_bg_img || "")}
      legacy_bg_color={
        (section.data as Record<string, unknown> | undefined)?.bg_color as
          | string
          | undefined
      }
      surfaceTone={surfaceTone as string | undefined}
      surfaceBand={surfaceBand as never}
      sectionTheme={sectionTheme}
      pageTheme={pageTheme}
      pageSurfaceMode={String(pageSurfaceMode || "")}
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
}: PageSectionPlacementShellProps) {
  if (!shouldRenderPlacement(section, cmsMode)) return null;

  const hidden = section.status === false;
  const key = String(section.section_key || "");
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
