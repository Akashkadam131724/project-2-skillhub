"use client";

import CmsEditable from "@/components/cms/CmsEditable";
import { mediaUrl } from "@/lib/cms-api";
import SectionButtonsFooter from "./SectionButtonsFooter";
import SectionWrapper from "./SectionWrapper";

const SURFACE_CLASS = {
  white: "bg-white dark:bg-slate-950",
  muted: "bg-slate-100 dark:bg-slate-900",
};

/** @deprecated use SectionWrapper — kept as alias for older imports */
export function SectionInner({ children, className = "" }) {
  return <SectionWrapper className={className}>{children}</SectionWrapper>;
}

/**
 * Full-width section surface (bg / bg-image).
 * Title / subtitle only render when those props are passed — sections that
 * place title elsewhere (e.g. Overview) omit them so CMS pencils aren't duplicated.
 * Buttons footer defaults to the bottom; pass buttonsFooter={false} when a
 * section places SectionButtonsFooter itself (layout owns placement).
 */
export default function SectionFrame({
  title,
  subtitle,
  children,
  action,
  cmsMode = false,
  onEditField,
  surfaceTone = "white",
  section_bg_img,
  id,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  buttonsFooter = true,
}) {
  const editTitle = title !== undefined;
  const editSubtitle = subtitle !== undefined;
  const showTitle = editTitle && (title || cmsMode);
  const showSubtitle = editSubtitle && (subtitle || cmsMode);
  const showHeader = showTitle || showSubtitle || action;
  const bgUrl = mediaUrl(section_bg_img);
  const surfaceClass = bgUrl
    ? "bg-transparent"
    : SURFACE_CLASS[surfaceTone] || SURFACE_CLASS.white;

  return (
    <section
      id={id || undefined}
      className={`relative w-full overflow-hidden py-10 sm:py-12 ${surfaceClass}${
        bgUrl ? " bg-cover bg-center bg-no-repeat" : ""
      }`}
      style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}
    >
      <SectionWrapper>
        {showHeader ? (
          <header
            className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 ${
              children ? "mb-4 sm:mb-4 md:mb-6" : ""
            }`}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-2.5">
              {showTitle ? (
                <CmsEditable
                  cmsMode={cmsMode}
                  field="section_title"
                  label="Title"
                  onEditField={onEditField}
                >
                  {title ? (
                    <h2 className="m-0 text-2xl leading-tight font-bold tracking-tight text-ink sm:text-[1.75rem] md:text-3xl dark:text-white">
                      {title}
                    </h2>
                  ) : (
                    <h2 className="m-0 text-2xl leading-tight font-bold text-slate-300 italic sm:text-[1.75rem] md:text-3xl dark:text-slate-600">
                      Add title…
                    </h2>
                  )}
                </CmsEditable>
              ) : null}
              {showSubtitle ? (
                <CmsEditable
                  cmsMode={cmsMode}
                  field="sub_title"
                  label="Subtitle"
                  onEditField={onEditField}
                >
                  {subtitle ? (
                    <p className="m-0 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                      {subtitle}
                    </p>
                  ) : (
                    <p className="m-0 text-[15px] leading-relaxed text-slate-300 italic sm:text-base dark:text-slate-600">
                      Add subtitle…
                    </p>
                  )}
                </CmsEditable>
              ) : null}
            </div>
            {action ? (
              <div className="shrink-0 sm:pb-0.5">{action}</div>
            ) : null}
          </header>
        ) : null}
        {children ? <div className="min-w-0">{children}</div> : null}
        {buttonsFooter ? (
          <SectionButtonsFooter
            buttons={buttons}
            button_title={button_title}
            target_url={target_url}
            cmsMode={cmsMode}
            onEditField={onEditField}
            onFormOpen={onFormOpen}
          />
        ) : null}
      </SectionWrapper>
    </section>
  );
}
