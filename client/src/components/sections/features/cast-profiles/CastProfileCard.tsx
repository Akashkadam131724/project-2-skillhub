import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { SectionMediaOverlay } from "@/components/sections/shared/design";
import { DS_RADIUS, DS_TEXT, sectionClassNames } from "@/lib/sections/section-design-system";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { CastProfileUiItem } from "./lib/types";

type CastProfileCardProps = {
  item: CastProfileUiItem;
  index: number;
  featured?: boolean;
  visible: boolean;
};

export default function CastProfileCard({
  item,
  index,
  featured = false,
  visible,
}: CastProfileCardProps) {
  const name = item.title || "";
  const character = item.subtitle || "";
  const badge = item.value || "";
  const delay = Math.min(index, 10) * 55;

  return (
    <article
      className={`group flex h-full flex-col transition duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <SectionMediaOverlay
        className={sectionClassNames(
          "relative h-80 w-full shrink-0 overflow-hidden bg-slate-900 shadow-lg ring-1 ring-black/10 sm:aspect-[3/4] sm:h-auto",
          DS_RADIUS.nested
        )}
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={name ? `${name} as ${character || "cast"}` : "Cast member"}
            className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            Photo
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
          aria-hidden
        />
        {badge ? (
          <span
            className="section-media-badge absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] uppercase"
          >
            {badge}
          </span>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 p-4 text-left sm:p-5">
          {name ? (
            <h3
              className={`${DS_TEXT.heading} m-0 font-[family-name:var(--font-display)] font-semibold tracking-tight ${
                featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
              }`}
            >
              {name}
            </h3>
          ) : null}
          {character ? (
            <p className={`${DS_TEXT.muted} mt-1 mb-0 text-sm font-semibold`}>
              as {character}
            </p>
          ) : null}
        </div>
      </SectionMediaOverlay>
      {!isRichTextEmpty(item.body) ? (
        <CmsRichText
          html={item.body}
          className={`${DS_TEXT.muted} mt-3 text-sm leading-relaxed`}
        />
      ) : null}
    </article>
  );
}
