"use client";

import type { ElementType, ReactNode } from "react";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import {
  HeroBodyCms,
  HeroSubtitleCms,
  HeroTitleCms,
  heroBodyCmsSlot,
} from "./hero-cms-fields";
import type { HeroContentSectionProps, HeroData } from "./lib/types";

type SlotOptions = {
  section_title?: string;
  sub_title?: string;
  data?: HeroData;
  onEditField?: HeroContentSectionProps["onEditField"];
  inverted?: boolean;
  titleAs?: ElementType;
  titleClassName?: string;
  subtitleClassName?: string;
  bodyClassName?: string;
  includeBody?: boolean;
};

export function buildHeroLayoutCmsSlots({
  section_title,
  sub_title,
  data,
  onEditField,
  inverted = false,
  titleAs = "h1",
  titleClassName = "",
  subtitleClassName = "",
  bodyClassName = "",
  includeBody = true,
}: SlotOptions) {
  return {
    titleSlot: (
      <HeroTitleCms
        section_title={section_title}
        onEditField={onEditField}
        inverted={inverted}
        as={titleAs}
        className={titleClassName}
      />
    ),
    subtitleSlot: (
      <HeroSubtitleCms
        sub_title={sub_title}
        onEditField={onEditField}
        inverted={inverted}
        className={subtitleClassName}
      />
    ),
    bodySlot: includeBody
      ? heroBodyCmsSlot(data?.body, onEditField, bodyClassName, inverted)
      : undefined,
  };
}

export function heroLayoutCmsFooter(
  props: Pick<
    HeroContentSectionProps,
    "buttons" | "button_title" | "target_url" | "onFormOpen" | "onEditField"
  >,
  className = "",
  options: { inverted?: boolean; buttonsClassName?: string } = {}
): ReactNode {
  return (
    <SectionButtonsFooter
      buttons={props.buttons}
      button_title={props.button_title}
      target_url={props.target_url}
      cmsMode
      onEditField={props.onEditField}
      onFormOpen={props.onFormOpen}
      inverted={options.inverted}
      className={className}
      buttonsClassName={options.buttonsClassName}
    />
  );
}

export { HeroBodyCms, HeroImageCms } from "./hero-cms-fields";
