import type { ElementType } from "react";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { mediaUrl } from "@/lib/api/cms-api";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { lcpImgProps } from "./lib/lcp-image";

export { shouldHideEmptyHero, isHeroPlacementShowable } from "./lib/placement";

export type HeroTitleProps = {
  title?: string;
  as?: ElementType;
  className?: string;
};

export function HeroTitle({
  title,
  as: Tag = "h1",
  className = "",
}: HeroTitleProps) {
  if (!title) return null;
  return <Tag className={className}>{title}</Tag>;
}

export type HeroSubtitleProps = {
  subtitle?: string;
  className?: string;
};

export function HeroSubtitle({ subtitle, className = "" }: HeroSubtitleProps) {
  if (!subtitle) return null;
  return <p className={`m-0 ${className}`.trim()}>{subtitle}</p>;
}

export type HeroBodyProps = {
  body?: string;
  className?: string;
};

export function HeroBody({ body = "", className = "" }: HeroBodyProps) {
  if (isRichTextEmpty(body)) return null;
  return <CmsRichText html={body} className={className} />;
}

export type HeroImageProps = {
  imageUrl?: string;
  title?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  /** Above-the-fold hero images default to high priority for LCP. */
  priority?: boolean;
};

export function HeroImage({
  imageUrl,
  title,
  alt = "Hero image",
  className = "",
  imgClassName = "aspect-[5/4] h-auto w-full object-cover",
  priority = true,
}: HeroImageProps) {
  if (!imageUrl) return null;

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-[1.75rem] shadow-[0_32px_80px_-32px_color-mix(in_srgb,var(--ink)_28%,transparent)] ring-1 ring-slate-200/80 dark:ring-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={mediaAlt(title, alt)}
          className={imgClassName}
          {...lcpImgProps(priority)}
        />
      </div>
    </div>
  );
}

export function hasMediaUrl(value: unknown): boolean {
  return Boolean(mediaUrl(value as string));
}
