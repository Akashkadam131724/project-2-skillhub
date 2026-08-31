"use client";

import Link from "next/link";
import SectionWrapper from "@/components/sections/SectionWrapper";
import CmsPageSectionRender from "@/components/cms/pages/CmsPageSectionRender";
import PageThemeShell from "@/components/cms/theme/PageThemeShell";
import { placementKey } from "@/lib/sections/page-sections-stack";
import { useCmsLiveEdit } from "@/components/cms/pages/live/CmsLiveEditContext";
import { useCmsLivePagePlacements } from "@/components/cms/pages/live/useCmsLivePagePlacements";
import type { PlacementWithSurface } from "../types";

/** Live-edit placement stack (mirrors public render + CMS edit hooks). */
export default function CmsLivePlacementStack() {
  const { pageKey, pageTheme } = useCmsLiveEdit();
  const { visibleWithSurface } = useCmsLivePagePlacements();
  const rows = visibleWithSurface as PlacementWithSurface[];

  return (
    <PageThemeShell theme={pageTheme}>
      {!rows.length ? (
        <SectionWrapper className="py-8 text-sm text-slate-500">
          No CMS sections yet. Open page settings to add one — this page only.{" "}
          <Link href={`/cms/pages/${pageKey}`} className="text-brand">
            Template CMS
          </Link>
        </SectionWrapper>
      ) : (
        (() => {
          const navIndex = rows.findIndex(
            ({ section }) => section.section_key === "in_page_nav"
          );

          const renderPlacements = (
            rows: PlacementWithSurface[],
            baseIndex: number
          ) =>
            rows.map((placement, relIndex) => {
              const { section } = placement;
              const index = baseIndex + relIndex;
              const navSections =
                section.section_key === "in_page_nav"
                  ? rows
                      .slice(index + 1)
                      .map(({ section: s }) => s)
                      .filter((s) => s.section_key !== "in_page_nav")
                  : undefined;
              return (
                <CmsPageSectionRender
                  key={placementKey(section)}
                  placement={placement}
                  navSections={navSections}
                />
              );
            });

          if (navIndex === -1) {
            return renderPlacements(rows, 0);
          }

          return (
            <>
              {renderPlacements(rows.slice(0, navIndex), 0)}
              {/* Sticky in-page nav must share a tall ancestor with sections below */}
              <div className="relative">
                {renderPlacements(rows.slice(navIndex), navIndex)}
              </div>
            </>
          );
        })()
      )}
    </PageThemeShell>
  );
}
