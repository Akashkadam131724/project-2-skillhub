"use client";

import type { ElementType } from "react";
import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { mediaUrl } from "@/lib/api/cms-api";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { HeroBody, HeroImage, HeroSubtitle, HeroTitle } from "./hero-fields";

type EditHandler = (field: string, extra?: unknown) => void;

export function HeroTitleCms({
  section_title,
  onEditField,
  inverted = false,
  as: Tag = "h1",
  className = "",
  placeholderClassName = "",
  placeholder = "Add title…",
}: {
  section_title?: string;
  onEditField?: EditHandler;
  inverted?: boolean;
  as?: ElementType;
  className?: string;
  placeholderClassName?: string;
  placeholder?: string;
}) {
  return (
    <CmsEditable
      cmsMode
      field="section_title"
      label="Title"
      onEditField={onEditField}
      inverted={inverted}
    >
      {section_title ? (
        <Tag className={className}>{section_title}</Tag>
      ) : (
        <Tag
          className={`${placeholderClassName || className} italic opacity-40`.trim()}
        >
          {placeholder}
        </Tag>
      )}
    </CmsEditable>
  );
}

export function HeroSubtitleCms({
  sub_title,
  onEditField,
  inverted = false,
  className = "",
  placeholder = "Add subtitle…",
}: {
  sub_title?: string;
  onEditField?: EditHandler;
  inverted?: boolean;
  className?: string;
  placeholder?: string;
}) {
  return (
    <CmsEditable
      cmsMode
      field="sub_title"
      label="Subtitle"
      onEditField={onEditField}
      inverted={inverted}
    >
      {sub_title ? (
        <p className={`m-0 ${className}`.trim()}>{sub_title}</p>
      ) : (
        <p className={`m-0 italic opacity-40 ${className}`.trim()}>{placeholder}</p>
      )}
    </CmsEditable>
  );
}

export function HeroBodyCms({
  body = "",
  onEditField,
  inverted = false,
  className = "",
  placeholder = "Add body…",
}: {
  body?: string;
  onEditField?: EditHandler;
  inverted?: boolean;
  className?: string;
  placeholder?: string;
}) {
  return (
    <CmsEditable
      cmsMode
      field="body"
      label="Body"
      onEditField={onEditField}
      inverted={inverted}
    >
      <CmsRichText
        html={body}
        className={className}
        empty={
          isRichTextEmpty(body) ? (
            <p className={`m-0 italic opacity-40 ${className}`.trim()}>
              {placeholder}
            </p>
          ) : null
        }
      />
    </CmsEditable>
  );
}

export function HeroImageCms({
  section_img_url,
  onEditField,
  inverted = false,
  className = "",
  imgClassName,
  title,
  alt = "Hero image",
}: {
  section_img_url?: string;
  onEditField?: EditHandler;
  inverted?: boolean;
  className?: string;
  imgClassName?: string;
  title?: string;
  alt?: string;
}) {
  const imageUrl = mediaUrl(section_img_url);

  if (!imageUrl) {
    return (
      <CmsEditable
        cmsMode
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
      cmsMode
      field="section_img_url"
      label="Hero image"
      onEditField={onEditField}
      inverted={inverted}
      className={className}
    >
      <HeroImage
        imageUrl={imageUrl}
        title={title}
        alt={alt}
        imgClassName={imgClassName}
      />
    </CmsEditable>
  );
}

/** Compact CMS-only control for optional background images. */
export function HeroBgAddChip({
  section_bg_img,
  onEditField,
  inverted = true,
  className = "",
}: {
  section_bg_img?: string;
  onEditField?: EditHandler;
  inverted?: boolean;
  className?: string;
}) {
  const bgUrl = mediaUrl(section_bg_img);

  return (
    <CmsEditable
      cmsMode
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

/** CMS placeholder when body field is empty but should still show an editor shell. */
export function heroBodyCmsSlot(
  body: string | undefined,
  onEditField: EditHandler | undefined,
  className: string,
  inverted = false
) {
  if (!isRichTextEmpty(body)) {
    return (
      <HeroBodyCms
        body={body}
        onEditField={onEditField}
        inverted={inverted}
        className={className}
      />
    );
  }
  return (
    <HeroBodyCms
      body=""
      onEditField={onEditField}
      inverted={inverted}
      className={className}
    />
  );
}
