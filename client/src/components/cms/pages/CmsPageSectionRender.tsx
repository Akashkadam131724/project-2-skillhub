import {
  contentLockedAtLayer,
  contentScopeLabel,
  liveEditContentLayer,
  lockedContentHref,
} from "@/lib/cms/content-scope";
import CmsSectionToolbar from "@/components/cms/sections/CmsSectionToolbar";
import {
  buildSectionCompProps,
  PageSectionPlacementShell,
  previewSrc,
  wrapSectionBody,
} from "@/components/cms/sections/page-section-placement";
import { resolveSectionComponent } from "@/lib/sections/section-registry-sync";
import { itemsConfigRenderKey } from "@/lib/sections/section-render-key";
import { SectionCmsProvider } from "@/context/SectionCmsContext";
import FallbackSection from "@/components/sections/FallbackSection";
import { useCmsLiveEdit } from "@/context/CmsLiveEditContext";
import { useCmsLivePagePlacements } from "@/context/CmsLivePlacementsContext";
import type { CmsPageSectionRenderProps } from "./types";

/**
 * CMS live-edit placement renderer — page/theme/actions from live contexts.
 */
export default function CmsPageSectionRender({
  placement,
  navSections,
}: CmsPageSectionRenderProps) {
  const {
    section,
    surfaceTone,
    surfaceBand,
    surfaceBandIndex,
    sectionTheme = "inherit",
  } = placement;
  const { pageKey, pageTheme, pageContext } = useCmsLiveEdit();
  const {
    catalog = [],
    openFieldEdit,
    toggleVisibility,
    removeExtra,
  } = useCmsLivePagePlacements();

  const key = String(section.section_key || "");
  const itemsRenderKey = itemsConfigRenderKey(section);
  const hidden = section.status === false;
  const preview = previewSrc(section, catalog);
  const editLayer = liveEditContentLayer();
  const contentLocked = contentLockedAtLayer(section.content_scope, editLayer);
  const lockedHref = lockedContentHref(section.content_scope, {
    sectionKey: key,
    pageKey,
    tagId:
      section.page_tag_id != null ? String(section.page_tag_id) : undefined,
  });
  const layerLabel = contentScopeLabel(section.content_scope);

  const { compProps, catalogKey } = buildSectionCompProps({
    section,
    cmsMode: true,
    surfaceTone: surfaceTone != null ? String(surfaceTone) : undefined,
    surfaceBand,
    sectionTheme: String(sectionTheme || "inherit"),
    pageContext,
    navSections,
    onEditField: openFieldEdit,
  });

  const Comp = resolveSectionComponent(key, itemsRenderKey) || FallbackSection;
  const sectionBody = (
    <SectionCmsProvider
      section={section}
      sectionKey={key}
      renderKey={String(itemsRenderKey || "")}
    >
      <Comp {...(compProps as Record<string, unknown>)} />
    </SectionCmsProvider>
  );

  const body = wrapSectionBody({
    section,
    catalogKey,
    sectionBody,
    sectionTheme: String(sectionTheme || "inherit"),
    pageTheme,
    surfaceTone,
    surfaceBand,
    surfaceBandIndex,
  });

  const cmsToolbar = (
    <CmsSectionToolbar
      section={section}
      preview={preview}
      hidden={hidden}
      layerLabel={layerLabel}
      contentLocked={contentLocked}
      contentLockedHref={lockedHref}
      onEditField={openFieldEdit}
      onToggleVisibility={toggleVisibility}
      onRemoveExtra={removeExtra}
    />
  );

  return (
    <PageSectionPlacementShell
      section={section}
      cmsMode
      catalog={catalog}
      sectionBody={body}
      cmsToolbar={cmsToolbar}
    />
  );
}
