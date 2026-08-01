"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "../SectionFrame";
import SectionButtons from "@/components/ui/SectionButtons";
import { mediaUrl } from "@/lib/api/cms-api";
import { resolveItemsForSection } from "@/lib/sections/item-types";

export default function MediaMosaicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "media_mosaic",
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {items.map((card, i) => {
            const img = mediaUrl(card.image_url || card.image || "");
            const span = i === 0 && items.length >= 3 ? "sm:col-span-2 sm:row-span-2" : "";
            const hasButtons =
              Array.isArray(card.buttons) && card.buttons.length > 0;
            return (
              <article
                key={card._id || card.id || i}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 ${span}`}
              >
                <div
                  className={`relative w-full bg-slate-200 dark:bg-slate-800 ${
                    span ? "aspect-[16/10] min-h-[220px]" : "aspect-[4/3]"
                  }`}
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt={card.title || ""}
                      className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-xs text-slate-400">
                      Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    {card.title ? (
                      <h3 className="m-0 text-base font-semibold text-white sm:text-lg">
                        {card.title}
                      </h3>
                    ) : null}
                    {card.subtitle ? (
                      <p className="mt-1 text-sm text-white/85">{card.subtitle}</p>
                    ) : null}
                    {hasButtons ? (
                      <div className="mt-3">
                        <SectionButtons
                          buttons={card.buttons}
                          inverted
                          className="flex flex-wrap gap-2"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
