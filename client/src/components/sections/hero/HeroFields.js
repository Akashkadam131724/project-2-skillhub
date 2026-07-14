"use client";

import CmsEditable from "@/components/cms/CmsEditable";
import CmsRichText from "@/components/cms/CmsRichText";
import { mediaUrl } from "@/lib/cms-api";
import {
  placementHasMeaningfulContent,
  sectionProbeFromProps,
} from "@/lib/item-types";

/** Public pages: skip empty field-driven heroes (CMS still shows shells). */
export function shouldHideEmptyHero(sectionKey, props = {}) {
  if (props.cmsMode) return false;
  return !placementHasMeaningfulContent(
    sectionProbeFromProps(sectionKey, props)
  );
}

export function HeroTitle({
  section_title,
  cmsMode,
  onEditField,
  inverted = false,
  as: Tag = "h1",
  className = "",
  placeholderClassName = "",
}) {
  return (
    <CmsEditable
      cmsMode={cmsMode}
      field="section_title"
      label="Title"
      onEditField={onEditField}
      inverted={inverted}
    >
      {section_title ? (
        <Tag className={className}>{section_title}</Tag>
      ) : (
        <Tag
          className={`${placeholderClassName || className} ${
            !section_title ? "italic opacity-40" : ""
          }`.trim()}
        >
          Add title…
        </Tag>
      )}
    </CmsEditable>
  );
}

export function HeroSubtitle({
  sub_title,
  cmsMode,
  onEditField,
  inverted = false,
  className = "",
}) {
  if (!sub_title && !cmsMode) return null;
  return (
    <CmsEditable
      cmsMode={cmsMode}
      field="sub_title"
      label="Subtitle"
      onEditField={onEditField}
      inverted={inverted}
    >
      {sub_title ? (
        <p className={`m-0 ${className}`}>{sub_title}</p>
      ) : (
        <p className={`m-0 italic opacity-40 ${className}`}>Add subtitle…</p>
      )}
    </CmsEditable>
  );
}

export function HeroBody({
  data,
  cmsMode,
  onEditField,
  inverted = false,
  className = "",
}) {
  const body = data?.body || "";
  if (!body && !cmsMode) return null;
  return (
    <CmsEditable
      cmsMode={cmsMode}
      field="body"
      label="Body"
      onEditField={onEditField}
      inverted={inverted}
    >
      <CmsRichText
        html={body}
        className={className}
        empty={
          cmsMode ? (
            <p className={`m-0 italic opacity-40 ${className}`}>Add body…</p>
          ) : null
        }
      />
    </CmsEditable>
  );
}

/**
 * Optional hero image — renders nothing when empty (public + layout).
 * In CMS with no image, shows a compact add chip only (no empty image frame).
 */
export function HeroImage({
  section_img_url,
  cmsMode,
  onEditField,
  inverted = false,
  className = "",
  imgClassName = "h-full w-full object-cover",
}) {
  const imgUrl = mediaUrl(section_img_url);

  if (!imgUrl) {
    if (!cmsMode) return null;
    return (
      <CmsEditable
        cmsMode={cmsMode}
        field="section_img_url"
        label="Hero image"
        onEditField={onEditField}
        inverted={inverted}
        className={className}
      >
        <span
          className={`inline-flex rounded-md border border-dashed px-3 py-1.5 text-xs ${
            inverted
              ? "border-white/40 text-white/70"
              : "border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400"
          }`}
        >
          Add image…
        </span>
      </CmsEditable>
    );
  }

  return (
    <CmsEditable
      cmsMode={cmsMode}
      field="section_img_url"
      label="Hero image"
      onEditField={onEditField}
      inverted={inverted}
      className={className}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imgUrl} alt="" className={imgClassName} />
    </CmsEditable>
  );
}

/** Compact CMS-only control for optional background images. */
export function HeroBgAddChip({
  section_bg_img,
  cmsMode,
  onEditField,
  inverted = true,
  className = "",
}) {
  if (!cmsMode) return null;
  const bgUrl = mediaUrl(section_bg_img);
  return (
    <CmsEditable
      cmsMode={cmsMode}
      field="section_bg_img"
      label="Background image"
      onEditField={onEditField}
      inverted={inverted}
      className={className}
    >
      <span
        className={`inline-flex rounded-md border border-dashed px-3 py-1.5 text-xs ${
          inverted
            ? "border-white/40 text-white/70"
            : "border-slate-300 text-slate-500"
        }`}
      >
        {bgUrl ? "Edit background image" : "Add background image…"}
      </span>
    </CmsEditable>
  );
}

export function hasMediaUrl(value) {
  return Boolean(mediaUrl(value));
}
