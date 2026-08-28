import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { OrbitHeroUiProps } from "./lib/types";

/**
 * Launch-UI / SaaS style hero — badge, display type, dual CTA, browser product frame.
 */
export default function OrbitHeroUi({
  id,
  imageUrl,
  imageAlt,
  badge,
  title,
  subtitle,
  body = "",
  titleSlot,
  subtitleSlot,
  bodySlot,
  footer = null,
}: OrbitHeroUiProps) {
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showBody = bodySlot != null || !isRichTextEmpty(body);

  return (
    <section
      id={id || undefined}
      className="relative isolate overflow-hidden bg-[linear-gradient(165deg,#f8fafc_0%,#ffffff_40%,#eef2f7_100%)] py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--ink) 8%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--ink) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl translate-y-0 flex-col items-center text-center opacity-100 transition duration-700">
          {badge ? (
            <span className="section-ui-card section-theme-heading mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide shadow-sm">
              <span className="bg-brand size-1.5 rounded-full" />
              {badge}
            </span>
          ) : null}

          {titleSlot ??
            (showTitle ? (
              <h1 className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.05] font-semibold tracking-tight">
                {title}
              </h1>
            ) : null)}

          {subtitleSlot ??
            (showSubtitle ? (
              <p className="section-theme-muted mt-5 mb-0 max-w-2xl text-base leading-relaxed sm:text-lg">
                {subtitle}
              </p>
            ) : null)}

          {bodySlot ??
            (showBody ? (
              <CmsRichText
                html={body}
                className="section-theme-muted mt-4 max-w-xl text-sm"
              />
            ) : null)}

          {footer}
        </div>

        <div className="relative mx-auto mt-12 max-w-5xl translate-y-0 opacity-100 transition duration-1000 delay-150 sm:mt-16">
          <div className="section-ui-card overflow-hidden rounded-2xl border shadow-[0_24px_80px_-24px_rgba(11,31,77,0.35)]">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <span className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="ml-3 truncate rounded-md bg-white px-3 py-1 text-xs text-slate-400 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
                app.skillhub.io
              </span>
            </div>
            <div className="relative aspect-[16/9] bg-ink">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={imageAlt || mediaAlt(title, "Product preview")}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--ink),var(--brand))]" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
