"use client";

import CmsSectionToolbar from "@/components/cms/CmsSectionToolbar";
import {
  buildSectionCompProps,
  PageSectionPlacementShell,
  previewSrc,
  wrapSectionBody,
} from "@/components/cms/page-section-placement";
import { resolveSectionComponent } from "@/lib/section-registry-sync";
import FallbackSection from "@/components/sections/FallbackSection";

/**
 * CMS live-edit placement renderer — eager section imports for instant preview.
 */
export default function CmsPageSectionRender({
  section,
  surfaceTone,
  surfaceBand,
  sectionTheme = "inherit",
  pageTheme,
  pageContext,
  catalog = [],
  navSections,
  onEditField,
  onToggleVisibility,
  onRemoveExtra,
}) {
  const key = section.section_key;
  const renderKey = section.render_key || "";
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
    onEditField,
  });

  const Comp = resolveSectionComponent(key, renderKey) || FallbackSection;
  const sectionBody = <Comp {...compProps} />;

  const body = wrapSectionBody({
    section,
    catalogKey,
    sectionBody,
    sectionTheme,
    pageTheme,
    surfaceTone,
    surfaceBand,
  });

  const cmsToolbar = (
    <CmsSectionToolbar
      section={section}
      preview={preview}
      hidden={hidden}
      onEditField={onEditField}
      onToggleVisibility={onToggleVisibility}
      onRemoveExtra={onRemoveExtra}
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
