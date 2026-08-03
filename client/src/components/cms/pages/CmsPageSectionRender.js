"use client";

import CmsSectionToolbar from "@/components/cms/sections/CmsSectionToolbar";
import {
  buildSectionCompProps,
  PageSectionPlacementShell,
  previewSrc,
  wrapSectionBody,
} from "@/components/cms/sections/page-section-placement";
import { resolveSectionComponent } from "@/lib/sections/section-registry-sync";
import { itemsConfigRenderKey } from "@/lib/sections/section-render-key";
import { SectionCmsProvider } from "@/components/cms/sections/SectionCmsContext";
import FallbackSection from "@/components/sections/FallbackSection";
import { useCmsLiveEdit } from "@/components/cms/pages/live/CmsLiveEditContext";
import { useCmsLivePagePlacements } from "@/components/cms/pages/live/useCmsLivePagePlacements";

/**
 * CMS live-edit placement renderer — page/theme/actions from live contexts.
 * @param {{ section, surfaceTone, surfaceBand, surfaceBandIndex, sectionTheme }} placement
 */
export default function CmsPageSectionRender({ placement, navSections }) {
  const {
    section,
    surfaceTone,
    surfaceBand,
    surfaceBandIndex,
    sectionTheme = "inherit",
  } = placement;
  const { pageTheme, pageContext } = useCmsLiveEdit();
  const {
    catalog = [],
    openFieldEdit,
    toggleVisibility,
    removeExtra,
  } = useCmsLivePagePlacements();

  const key = section.section_key;
  const itemsRenderKey = itemsConfigRenderKey(section);
  const hidden = section.status === false;
  const preview = previewSrc(section, catalog);

  const { compProps, catalogKey } = buildSectionCompProps({
    section,
    cmsMode: true,
    surfaceTone,
    surfaceBand,
    sectionTheme,
    pageContext,
    navSections,
    onEditField: openFieldEdit,
  });

  const Comp = resolveSectionComponent(key, itemsRenderKey) || FallbackSection;
  const sectionBody = (
    <SectionCmsProvider section={section} renderKey={itemsRenderKey}>
      <Comp {...compProps} />
    </SectionCmsProvider>
  );

  const body = wrapSectionBody({
    section,
    catalogKey,
    sectionBody,
    sectionTheme,
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
