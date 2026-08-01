import LazySectionBody from "@/components/cms/sections/LazySectionBody";
import {
  buildSectionCompProps,
  PageSectionPlacementShell,
  wrapSectionBody,
} from "@/components/cms/sections/page-section-placement";
import { itemsConfigRenderKey } from "@/lib/sections/section-render-key";

/**
 * Server-friendly placement renderer for public pages (code-split sections).
 */
export default function PageSectionRender({
  section,
  surfaceTone,
  surfaceBand,
  sectionTheme = "inherit",
  pageTheme,
  pageContext,
  navSections,
}) {
  const key = section.section_key;
  const renderKey = itemsConfigRenderKey(section);
  const { compProps, catalogKey } = buildSectionCompProps({
    section,
    cmsMode: false,
    surfaceTone,
    surfaceBand,
    sectionTheme,
    pageContext,
    navSections,
  });

  const sectionBody = (
    <LazySectionBody sectionKey={key} renderKey={renderKey} compProps={compProps} />
  );

  const body = wrapSectionBody({
    section,
    catalogKey,
    sectionBody,
    sectionTheme,
    pageTheme,
    surfaceTone,
    surfaceBand,
  });

  return (
    <PageSectionPlacementShell section={section} sectionBody={body} />
  );
}
