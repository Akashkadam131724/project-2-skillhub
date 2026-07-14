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
    <div className="relative h-12 w-36 md:h-16 md:w-40 lg:h-24 lg:w-56">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name || "Partner"}
        className="absolute inset-0 size-full object-contain"
      />
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 rounded-md p-2 no-underline sm:p-3 lg:p-4"
      >
        {img}
      </a>
    );
  }

  return (
    <div className="flex-shrink-0 rounded-md p-2 sm:p-3 lg:p-4">{img}</div>
  );
}

/**
 * Partners — Logo Marquee
 * Centered title + infinite horizontal logo strip.
 * Global-scope content: edit once under Content sections.
 */
export default function PartnersMarqueeSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "partners_marquee",
  cmsMode,
  onEditField,
  surfaceTone = "white",
  section_bg_img,
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
  const bgUrl = mediaUrl(section_bg_img);

  return (
    <section
      id={id || undefined}
      className={`relative w-full overflow-hidden py-10 sm:py-12 ${
        bgUrl
          ? "bg-cover bg-center bg-no-repeat"
          : surfaceTone === "muted"
            ? "bg-slate-100 dark:bg-slate-900"
            : "bg-white dark:bg-slate-950"
      }`}
      style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}
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
          <header className="mb-6 flex flex-col items-start gap-2 text-left sm:mb-8">
            {showTitle ? (
              <CmsEditable
                cmsMode={cmsMode}
                field="section_title"
                label="Title"
                onEditField={onEditField}
              >
                {section_title ? (
                  <h2 className="m-0 max-w-4xl text-2xl leading-tight font-bold tracking-tight text-ink sm:text-[1.75rem] md:text-3xl dark:text-white">
                    {section_title}
                  </h2>
                ) : (
                  <h2 className="m-0 text-2xl font-bold text-slate-300 italic dark:text-slate-600">
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
                  <p className="m-0 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                    {sub_title}
                  </p>
                ) : (
                  <p className="m-0 text-[15px] text-slate-300 italic dark:text-slate-600">
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
          <div className="relative overflow-hidden pt-2">
            <div className="flex w-max animate-[partner-marquee_80s_linear_infinite] items-center gap-x-4 sm:gap-x-6">
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
