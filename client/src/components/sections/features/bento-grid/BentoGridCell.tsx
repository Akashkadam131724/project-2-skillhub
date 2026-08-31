import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { DS_RADIUS, sectionClassNames } from "@/lib/sections/section-design-system";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { BentoGridUiItem } from "./lib/types";

type BentoGridCellProps = {
  item: BentoGridUiItem;
  index: number;
  visible: boolean;
};

function BentoGridCell({ item, index, visible }: BentoGridCellProps) {
  const delay = Math.min(index, 6) * 70;
  const isHero = index % 6 === 0;

  return (
    <article
      className={sectionClassNames(
        "group relative flex h-full min-h-[220px] flex-col justify-end overflow-hidden border border-slate-200/80 bg-slate-950 text-white transition duration-700 ease-out dark:border-slate-800",
        DS_RADIUS.empty,
        isHero ? "sm:min-h-[420px]" : "sm:min-h-[220px]",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={mediaAlt(item, "Bento item")}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(145deg,var(--ink),var(--brand))]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
      <div className={`relative z-[1] p-5 sm:p-6 ${isHero ? "sm:p-8" : ""}`}>
        {item.value ? (
          <p
            className={`m-0 mb-2 font-[family-name:var(--font-display)] font-semibold tracking-tight text-white ${
              isHero ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"
            }`}
          >
            {item.value}
          </p>
        ) : null}
        {item.title ? (
          <h3
            className={`m-0 font-semibold tracking-tight text-white ${
              isHero ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
            }`}
          >
            {item.title}
          </h3>
        ) : null}
        {item.subtitle ? (
          <p className="mt-1 mb-0 text-sm text-white/65">{item.subtitle}</p>
        ) : null}
        {!isRichTextEmpty(item.body) ? (
          <CmsRichText
            html={item.body}
            className="mt-3 max-w-md text-sm leading-relaxed text-white/70"
          />
        ) : null}
      </div>
    </article>
  );
}

export default BentoGridCell;
