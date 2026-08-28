"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import { mediaAlt } from "@/lib/utils/media-alt";
import Image from "next/image";
import SarderEcosystemUi from "./SarderEcosystemUi";
import { resolveSarderEcosystemGroups } from "./lib/map";
import {
  isSarderEcosystemPlacementShowable,
  resolveSarderEcosystemLogoSrc,
  resolveSarderEcosystemSubtitle,
  resolveSarderEcosystemTitle,
} from "./lib/placement";
import type { SarderEcosystemSectionProps } from "./lib/types";

export default function SarderEcosystemSection({
  section_title,
  sub_title,
  section_img_url,
  items: mappingItems,
  section_key = "sarder_ecosystem",
  cmsMode = true,
  onEditField,
  id,
}: SarderEcosystemSectionProps) {
  const props = {
    section_key,
    section_title,
    sub_title,
    section_img_url,
    items: mappingItems,
  };

  if (!isSarderEcosystemPlacementShowable(props, cmsMode)) {
    return null;
  }

  const groups = resolveSarderEcosystemGroups(mappingItems, { cmsMode: true });
  const title = resolveSarderEcosystemTitle(section_title, cmsMode);
  const subtitle = resolveSarderEcosystemSubtitle(sub_title, cmsMode);
  const logoSrc = resolveSarderEcosystemLogoSrc(section_img_url, {
    cmsMode,
    fallbackStatic: true,
  });

  return (
    <SarderEcosystemUi
      id={id}
      groups={groups}
      titleSlot={
        <CmsEditable
          cmsMode={cmsMode}
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          <h2 className="text-[26px] font-semibold text-gray-900">
            {section_title || (
              <span className="text-gray-400 italic">Add title…</span>
            )}
          </h2>
        </CmsEditable>
      }
      subtitleSlot={
        <CmsEditable
          cmsMode={cmsMode}
          field="sub_title"
          label="Subtitle"
          onEditField={onEditField}
        >
          <p className="mt-2 text-[15px] text-gray-600">
            {sub_title || (
              <span className="text-gray-400 italic">Add subtitle…</span>
            )}
          </p>
        </CmsEditable>
      }
      logoSlot={
        <CmsEditable
          cmsMode={cmsMode}
          field="section_img_url"
          label="Brand logo"
          onEditField={onEditField}
        >
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={mediaAlt(section_title, "Sarder logo")}
              width={260}
              height={70}
              className="order-1 h-9 w-auto object-contain md:order-3 md:h-[60px]"
            />
          ) : (
            <div className="order-1 flex h-14 w-48 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400 italic md:order-3">
              Add brand logo…
            </div>
          )}
        </CmsEditable>
      }
      groupsBar={
        <CmsEditable
          cmsMode={cmsMode}
          field="items"
          label="Ecosystem groups"
          onEditField={onEditField}
        >
          <CmsSectionItemsBar
            sectionKey={section_key}
            cmsMode={cmsMode}
            onEditField={onEditField}
            itemCount={groups.length}
          />
        </CmsEditable>
      }
      emptyGroupsState={
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      }
    />
  );
}
