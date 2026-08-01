import Link from "next/link";
import PageThemeShell from "@/components/cms/theme/PageThemeShell";
import PageSectionRender from "@/components/cms/pages/PageSectionRender";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { mergeTheme } from "@/lib/theme";
import {
  buildVisibleWithSurface,
  normalizeInitialSections,
  placementKey,
} from "@/lib/sections/page-sections-stack";

/**
 * Server-rendered section stack for public pages — no CMS client bundle.
 */
export default function PublicPageSections({
  pageKey,
  sections: initialSections = [],
  initialTheme = null,
  pageContext = null,
}) {
  const sections = normalizeInitialSections(initialSections);
  const pageTheme = mergeTheme(initialTheme);
  const visibleWithSurface = buildVisibleWithSurface(sections, pageTheme, false);

  return (
    <PageThemeShell theme={pageTheme}>
      {!visibleWithSurface.length ? (
        <SectionWrapper className="py-8 text-sm text-slate-500">
          No CMS sections yet.{" "}
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
            rows.map(
              (
                { section, surfaceTone, surfaceBand, surfaceBandIndex, sectionTheme },
                relIndex
              ) => {
              const index = baseIndex + relIndex;
              const navSections =
                section.section_key === "in_page_nav"
                  ? visibleWithSurface
                      .slice(index + 1)
                      .map(({ section: s }) => s)
                      .filter((s) => s.section_key !== "in_page_nav")
                  : undefined;

              return (
                <PageSectionRender
                  key={placementKey(section)}
                  section={section}
                  surfaceTone={surfaceTone}
                  surfaceBand={surfaceBand}
                  surfaceBandIndex={surfaceBandIndex}
                  sectionTheme={sectionTheme}
                  pageTheme={pageTheme}
                  pageContext={pageContext}
                  navSections={navSections}
                />
              );
            });

          if (navIndex === -1) {
            return renderPlacements(visibleWithSurface, 0);
          }

          return (
            <>
              {renderPlacements(visibleWithSurface.slice(0, navIndex), 0)}
              <div className="relative">
                {renderPlacements(visibleWithSurface.slice(navIndex), navIndex)}
              </div>
            </>
          );
        })()
      )}
    </PageThemeShell>
  );
}
