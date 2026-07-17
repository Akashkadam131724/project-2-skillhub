"use client";

import CmsEditable from "@/components/cms/CmsEditable";
import { mediaUrl } from "@/lib/cms-api";
import { resolveItemsForSection, itemTitle } from "@/lib/item-types";
import CmsSectionItemsBar from "../CmsSectionItemsBar";
import EmptyItemsHint from "../EmptyItemsHint";
import SectionWrapper from "../SectionWrapper";
import { PARTNER_LOGOS } from "./partner-logos";

function LogoCell({ name, src, href }) {
  const img = (
    <div className="relative flex h-14 w-40 items-center justify-center sm:h-16 sm:w-44 lg:h-20 lg:w-52">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name || "Partner"}
        className="max-h-full max-w-full object-contain opacity-80 transition duration-300 group-hover/logo:opacity-100"
      />
    </div>
  );

  const shellClass =
    "group/logo flex-shrink-0 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-[0_10px_30px_-24px_color-mix(in_srgb,var(--ink)_35%,transparent)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-brand/25 dark:border-slate-800 dark:bg-slate-950/70";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${shellClass} no-underline`}
      >
        {img}
      </a>
    );
  }

  return <div className={shellClass}>{img}</div>;
}

/**
 * Partners — Logo Marquee
 * Soft edge-fade strip with floating logo chips.
 */
export default function PartnersMarqueeSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "partners_marquee",
  cmsMode,
  onEditField,
  id,
}) {
  const mapped = resolveItemsForSection(section_key, mappingItems);
  const fromCms = mapped
    .map((item) => {
      const src = mediaUrl(item?.image_url || item?.icon || "");
      if (!src) return null;
      return {
        name: itemTitle(item) || item?.title || "",
        image_url: src,
        href: String(item?.href || "").trim() || undefined,
      };
    })
    .filter(Boolean);

  const logos = fromCms.length
    ? fromCms
    : cmsMode
      ? []
      : PARTNER_LOGOS.map((l) => ({
          name: l.name,
          image_url: l.image_url,
        }));
  const track = logos.length ? [...logos, ...logos] : [];

  const showTitle = Boolean(section_title) || cmsMode;
  const showSubtitle = Boolean(sub_title) || cmsMode;

  return (
    <section
      id={id || undefined}
      className="relative w-full overflow-hidden py-14 sm:py-16"
    >
      <SectionWrapper>
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode={cmsMode}
          onEditField={onEditField}
          itemCount={fromCms.length}
          className="mb-4"
        />

        {showTitle || showSubtitle ? (
          <header className="mb-8 flex max-w-3xl flex-col gap-3 sm:mb-10">
            <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
              Ecosystem
            </p>
            {showTitle ? (
              <CmsEditable
                cmsMode={cmsMode}
                field="section_title"
                label="Title"
                onEditField={onEditField}
              >
                {section_title ? (
                  <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-4xl dark:text-white">
                    {section_title}
                  </h2>
                ) : (
                  <h2 className="m-0 text-3xl font-semibold text-slate-300 italic dark:text-slate-600">
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
                {sub_title ? (
                  <p className="m-0 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    {sub_title}
                  </p>
                ) : (
                  <p className="m-0 text-base text-slate-300 italic dark:text-slate-600">
                    Add subtitle…
                  </p>
                )}
              </CmsEditable>
            ) : null}
          </header>
        ) : null}

        {!logos.length ? (
          cmsMode ? (
            <EmptyItemsHint
              sectionKey={section_key}
              onEditField={onEditField}
            />
          ) : null
        ) : (
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex w-max animate-[partner-marquee_70s_linear_infinite] items-center gap-x-4 py-1 sm:gap-x-5">
              {track.map((logo, i) => (
                <LogoCell
                  key={`${logo.name}-${i}`}
                  name={logo.name}
                  src={logo.image_url}
                  href={logo.href}
                />
              ))}
            </div>
          </div>
        )}
      </SectionWrapper>
    </section>
  );
}
