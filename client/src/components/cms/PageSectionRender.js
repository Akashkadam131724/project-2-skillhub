import LazySectionBody from "@/components/cms/LazySectionBody";
import {
  buildSectionCompProps,
  PageSectionPlacementShell,
  wrapSectionBody,
} from "@/components/cms/page-section-placement";

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
  const renderKey = section.render_key || "";
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
