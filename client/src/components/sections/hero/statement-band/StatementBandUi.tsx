import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { StatementBandUiProps } from "./lib/types";

/**
 * Oversized typographic statement over a soft image wash — modern manifesto band.
 */
export default function StatementBandUi({
  id,
  imageUrl,
  imageAlt,
  eyebrow,
  title,
  subtitle,
  body = "",
  titleSlot,
  subtitleSlot,
  bodySlot,
  footer = null,
}: StatementBandUiProps) {
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showBody = bodySlot != null || !isRichTextEmpty(body);

  return (
    <section
      id={id || undefined}
      data-always-light-text=""
      className="relative isolate min-h-[85vh] w-full overflow-hidden bg-ink text-white"
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={imageAlt || mediaAlt(title, "Statement background")}
          className="absolute inset-0 h-full w-full scale-100 object-cover opacity-40 transition duration-[1.6s] ease-out"
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,color-mix(in_srgb,var(--brand)_35%,transparent),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/75 to-ink" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-[1400px] flex-col justify-center px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-5xl translate-y-0 opacity-100 transition duration-800 ease-out">
          {eyebrow ? (
            <p className="m-0 mb-5 text-xs font-semibold tracking-[0.28em] text-white/55 uppercase">
              {eyebrow}
            </p>
          ) : null}

          {titleSlot ??
            (showTitle ? (
              <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] font-semibold tracking-tight text-white">
                {title}
              </h1>
            ) : null)}

          {subtitleSlot ??
            (showSubtitle ? (
              <p className="mt-8 mb-0 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
                {subtitle}
              </p>
            ) : null)}

          {bodySlot ??
            (showBody ? (
              <CmsRichText
                html={body}
                className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60"
              />
            ) : null)}

          {footer}
        </div>
      </div>
    </section>
  );
}
