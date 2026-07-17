"use client";

import CmsRichText from "@/components/cms/CmsRichText";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import { mediaUrl } from "@/lib/cms-api";
import { resolveItemsForSection } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";

function TeamMemberCard({ item }) {
  const photo = mediaUrl(item.image_url);
  const name = item.title || "";
  const role = item.subtitle || "";
  const bio = item.body || "";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="relative h-80 w-full shrink-0 overflow-hidden bg-slate-100 sm:aspect-[4/5] sm:h-auto dark:bg-slate-900">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={name || "Team member"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Photo
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        {name ? (
          <h3 className="m-0 text-lg font-semibold tracking-tight text-ink dark:text-white">
            {name}
          </h3>
        ) : null}
        {role ? (
          <p className="m-0 text-sm font-medium text-brand">{role}</p>
        ) : null}
        {!isRichTextEmpty(bio) ? (
          <CmsRichText
            html={bio}
            className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
          />
        ) : null}
      </div>
    </article>
  );
}

export default function TeamSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "team",
  cmsMode,
  onEditField,
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
      {...frameProps}
    >
      <CmsSectionItemsBar
        sectionKey={section_key}
        cmsMode={cmsMode}
        onEditField={onEditField}
        itemCount={items.length}
      />
      {items.length ? (
        <MobileCardPeekRow
          gapClassName="gap-5"
          gridClassName="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {items.map((item, i) => (
            <TeamMemberCard key={item._id || item.id || i} item={item} />
          ))}
        </MobileCardPeekRow>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
