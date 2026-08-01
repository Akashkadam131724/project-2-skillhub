"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import SectionButtonsFooter from "./SectionButtonsFooter";
import SectionWrapper from "./SectionWrapper";

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
  eyebrow,
  children,
  action,
  cmsMode = false,
  onEditField,
  id,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  buttonsFooter = true,
  buttonsInverted = false,
}) {
  const editTitle = title !== undefined;
  const editSubtitle = subtitle !== undefined;
  const showTitle = editTitle && (title || cmsMode);
  const showSubtitle = editSubtitle && (subtitle || cmsMode);
  const showHeader = showTitle || showSubtitle || action || eyebrow;

  return (
    <section
      id={id || undefined}
      className="relative w-full overflow-hidden bg-transparent py-14 sm:py-16 lg:py-20"
    >
      <SectionWrapper>
        {showHeader ? (
          <header
            className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 ${
              children ? "mb-8 sm:mb-10" : ""
            }`}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-2.5 sm:gap-3">
              {eyebrow ? (
                <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
                  {eyebrow}
                </p>
              ) : null}
              {showTitle ? (
                <CmsEditable
                  cmsMode={cmsMode}
                  field="section_title"
                  label="Title"
                  onEditField={onEditField}
                >
                  {title ? (
                    <h2 className="section-theme-heading m-0 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
                      {title}
                    </h2>
                  ) : (
                    <h2 className="section-theme-placeholder m-0 text-3xl leading-tight font-semibold italic sm:text-4xl">
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
                    <p className="section-theme-muted m-0 max-w-2xl text-base leading-relaxed">
                      {subtitle}
                    </p>
                  ) : (
                    <p className="section-theme-placeholder m-0 text-base leading-relaxed italic">
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
            inverted={buttonsInverted}
          />
        ) : null}
      </SectionWrapper>
    </section>
  );
}
