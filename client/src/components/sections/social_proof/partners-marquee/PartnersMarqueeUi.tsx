"use client";

import { SectionLayoutRoot } from "@/components/sections/layout";

import type { PartnerLogoUiItem, PartnersMarqueeUiProps } from "./lib/types";

function LogoCell({
  name,
  src,
  href,
}: {
  name?: string;
  src: string;
  href?: string;
}) {
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
    "group/logo flex-shrink-0 rounded-2xl section-ui-card border px-4 py-3 shadow-[0_10px_30px_-24px_color-mix(in_srgb,var(--ink)_35%,transparent)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-brand/25";

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

export default function PartnersMarqueeUi({
  title,
  subtitle,
  eyebrow = "Ecosystem",
  titleSlot,
  subtitleSlot,
  eyebrowSlot,
  itemsBar,
  emptyState = null,
  items = [],
  preview = false,
  id,
  className = "",
}: PartnersMarqueeUiProps) {
  const track = items.length ? [...items, ...items] : [];
  const showEyebrow = eyebrowSlot != null || Boolean(eyebrow);

  return (
        <SectionLayoutRoot
      id={id}
      className={className}
      eyebrow={eyebrow}
      eyebrowSlot={eyebrowSlot}
      title={title}
      subtitle={subtitle}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
      itemsBar={itemsBar}
      emptyState={emptyState}
      items={items}
    >
{items.length ? (
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex w-max animate-[partner-marquee_70s_linear_infinite] items-center gap-x-4 py-1 sm:gap-x-5">
              {track.map((logo: PartnerLogoUiItem, i) => (
                <LogoCell
                  key={`${logo.id ?? logo.name}-${i}`}
                  name={logo.name}
                  src={logo.imageUrl || ""}
                  href={logo.href}
                />
              ))}
            </div>
          </div>
        ) : (
          emptyState
        )}
    </SectionLayoutRoot>
  );
}
