"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import FeatureCardPlaceholder from "@/components/sections/features/cards/FeatureCardPlaceholder";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { TeamUiItem } from "./lib/types";

export type TeamMemberItemCardProps = TeamUiItem & {
  preview?: boolean;
};

export default function TeamMemberItemCard({
  imageUrl,
  name,
  role,
  body,
  preview = false,
}: TeamMemberItemCardProps) {
  return (
    <article
      data-section-surface="light-card"
      data-light-surface=""
      className="section-light-card section-ui-card flex h-full flex-col overflow-hidden rounded-2xl border"
    >
      <div className="relative h-80 w-full shrink-0 overflow-hidden bg-slate-100 sm:aspect-[4/5] sm:h-auto dark:bg-slate-900">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name || "Team member"}
            className="h-full w-full object-cover"
          />
        ) : preview ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400 italic">
            Add photo…
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Photo
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        {name || preview ? (
          <h3 className="section-theme-heading m-0 text-lg font-semibold tracking-tight">
            {name ||
              (preview ? (
                <FeatureCardPlaceholder>Member name…</FeatureCardPlaceholder>
              ) : null)}
          </h3>
        ) : null}
        {role ? (
          <p className="m-0 text-sm font-medium text-brand">{role}</p>
        ) : null}
        {!isRichTextEmpty(body) || preview ? (
          <CmsRichText
            html={body}
            className="section-theme-muted mt-1 text-sm leading-relaxed"
            empty={
              preview ? (
                <p className="section-theme-muted mt-1 mb-0 text-sm leading-relaxed italic opacity-50">
                  Short bio…
                </p>
              ) : null
            }
          />
        ) : null}
      </div>
    </article>
  );
}
