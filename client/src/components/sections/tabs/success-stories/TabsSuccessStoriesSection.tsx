"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SuccessStoriesUi from "./SuccessStoriesUi";
import { resolveSuccessStoryUiItems } from "./lib/map";
import { isSuccessStoriesPlacementShowable } from "./lib/placement";
import type { SuccessStoriesSectionProps } from "../shared/lib/types";

export default function TabsSuccessStoriesSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "tabs_success_stories",
  onEditField,
  onFormOpen,
  id,
}: SuccessStoriesSectionProps) {
  const stories = resolveSuccessStoryUiItems(mappingItems, { cmsMode: true });

  if (
    !isSuccessStoriesPlacementShowable(
      { section_key, section_title, sub_title, items: mappingItems },
      true
    )
  ) {
    return null;
  }

  return (
    <SuccessStoriesUi
      id={id}
      preview
      onFormOpen={onFormOpen}
      stories={stories}
      titleSlot={
        <CmsEditable
          cmsMode
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title ? (
            <h2 className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
              {section_title}
            </h2>
          ) : (
            <h2 className="m-0 text-3xl font-semibold text-slate-300 italic sm:text-4xl dark:text-slate-600">
              Add title…
            </h2>
          )}
        </CmsEditable>
      }
      subtitleSlot={
        <CmsEditable
          cmsMode
          field="sub_title"
          label="Subtitle"
          onEditField={onEditField}
        >
          {sub_title ? (
            <p className="section-theme-muted m-0 text-base">{sub_title}</p>
          ) : (
            <p className="m-0 text-base text-slate-400 italic">Add subtitle…</p>
          )}
        </CmsEditable>
      }
      itemsBar={
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode
          onEditField={onEditField}
          itemCount={stories.length}
        />
      }
      emptyState={
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      }
    />
  );
}
