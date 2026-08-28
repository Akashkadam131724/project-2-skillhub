import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { lcpImgProps } from "@/components/sections/hero/shared/lib/lcp-image";
import type { EditorialBannerUiProps } from "./lib/types";

const fallbackBg = {
  backgroundImage:
    "radial-gradient(ellipse at 20% 20%, color-mix(in srgb, var(--brand) 78%, white 10%) 0%, transparent 45%), linear-gradient(160deg, var(--ink) 0%, color-mix(in srgb, var(--ink) 64%, var(--brand) 36%) 55%, var(--ink) 100%)",
};

const bottomOverlay = {
  backgroundImage:
    "linear-gradient(to top, color-mix(in srgb, var(--ink) 55%, transparent), transparent 45%)",
};

/**
 * Full-bleed editorial banner — large display type over a dominant image plane.
 */
export default function EditorialBannerUi({
  id,
  imageUrl,
  imageAlt,
  title,
  subtitle,
  body = "",
  titleSlot,
  subtitleSlot,
  bodySlot,
  footer = null,
  priority = true,
}: EditorialBannerUiProps) {
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showBody = bodySlot != null || !isRichTextEmpty(body);

  return (
    <section
      id={id || undefined}
      data-always-light-text=""
      className="relative isolate min-h-[70vh] w-full overflow-hidden bg-ink text-white sm:min-h-[78vh]"
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={imageAlt || mediaAlt(title, "Editorial banner")}
          className="absolute inset-0 h-full w-full scale-100 object-cover opacity-100 transition duration-[1.4s] ease-out"
          {...lcpImgProps(priority)}
        />
      ) : (
        <div className="absolute inset-0" style={fallbackBg} />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/70 to-ink/25" />
      <div className="absolute inset-0" style={bottomOverlay} />

      <div className="relative mx-auto flex min-h-[70vh] max-w-[1400px] flex-col justify-end px-4 py-16 sm:min-h-[78vh] sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl translate-y-0 opacity-100 transition duration-700 ease-out">
          {titleSlot ??
            (showTitle ? (
              <h1 className="m-0 font-[family-name:var(--font-display)] text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
                {title}
              </h1>
            ) : null)}

          {subtitleSlot ??
            (showSubtitle ? (
              <p className="mt-5 mb-0 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg lg:text-xl">
                {subtitle}
              </p>
            ) : null)}

          {bodySlot ??
            (showBody ? (
              <CmsRichText
                html={body}
                className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70"
              />
            ) : null)}

          {footer}
        </div>
      </div>
    </section>
  );
}
