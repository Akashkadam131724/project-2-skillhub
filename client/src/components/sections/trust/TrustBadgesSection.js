"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "../SectionFrame";
import { mediaUrl } from "@/lib/api/cms-api";
import { resolveItemsForSection } from "@/lib/sections/item-types";
import { DS_TEXT } from "@/lib/sections/section-design-system";

export default function TrustBadgesSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "trust_badges",
  cmsMode,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  return (
    <SectionFrame
      title={section_title}
      subtitle={sub_title}
      eyebrow="Trust"
      cmsMode={cmsMode}
      onEditField={onEditField}
      buttons={buttons}
      button_title={button_title}
      target_url={target_url}
      onFormOpen={onFormOpen}
      {...frameProps}
    >
      <CmsSectionItemsBar
        sectionKey={section_key}
        cmsMode={cmsMode}
        onEditField={onEditField}
        itemCount={items.length}
      />
      {items.length ? (
        <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {items.map((badge, i) => {
            const img = mediaUrl(badge.image_url || badge.icon || "");
            return (
              <li
                key={badge._id || badge.id || i}
                data-section-surface="light-card"
                data-light-surface=""
                className="section-light-card section-ui-card flex flex-col items-center justify-center rounded-2xl border px-4 py-6 text-center"
              >
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img}
                    alt={badge.title || ""}
                    className="mx-auto h-10 w-auto max-w-full object-contain opacity-90"
                  />
                ) : (
                  <span className={`text-2xl font-bold ${DS_TEXT.subtle}`}>
                    {badge.value || "✓"}
                  </span>
                )}
                {badge.title ? (
                  <p className={`m-0 mt-3 text-xs font-semibold ${DS_TEXT.heading}`}>
                    {badge.title}
                  </p>
                ) : null}
                {badge.subtitle ? (
                  <p className={`m-0 mt-1 text-[11px] ${DS_TEXT.muted}`}>
                    {badge.subtitle}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
