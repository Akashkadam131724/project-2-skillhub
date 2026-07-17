import Link from "next/link";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { mediaAlt } from "@/lib/media-alt";

function BannerAtmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 80% at 30% 40%, black, transparent)",
        }}
      />
      <div className="absolute -top-24 left-[8%] size-[28rem] rounded-full bg-brand/25 blur-[80px]" />
      <div className="absolute right-[-4%] bottom-[-20%] size-[34rem] rounded-full bg-white/10 blur-[90px]" />
      <div className="absolute top-1/2 left-[42%] hidden size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[70px] lg:block" />
    </div>
  );
}

/**
 * Entity detail hero — theme-aware gradient banner.
 */
export default function PageBanner({
  eyebrow = "",
  title = "Enterprise-Grade Industry Solutions for Workforce Transformation",
  description = "",
  ctaLabel = "Explore Solutions",
  ctaHref = "/courses",
  logo,
}) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(158deg,var(--ink)_0%,var(--brand)_52%,var(--ink)_100%)] text-white">
      <BannerAtmosphere />

      <SectionWrapper className="relative z-10 py-16 sm:py-20 lg:py-24">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={mediaAlt(title, "Logo")}
            className="mb-6 h-9 w-auto max-w-[160px] object-contain sm:h-10"
          />
        ) : null}

        <div className="flex max-w-3xl flex-col gap-5 sm:gap-6">
          {eyebrow ? (
            <p className="m-0 text-[11px] font-semibold tracking-[0.24em] text-white/55 uppercase">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="m-0 font-[family-name:var(--font-display)] text-[2rem] leading-[1.08] font-semibold tracking-tight text-white sm:text-[2.6rem] lg:text-[3.2rem]">
            {title}
          </h1>

          {description ? (
            <p className="m-0 max-w-2xl text-base leading-relaxed text-white/78 sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>

        {ctaHref && ctaLabel ? (
          <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink no-underline transition hover:bg-white/90 sm:px-6 sm:text-[15px]"
            >
              {ctaLabel}
            </Link>
            <Link
              href="/get-started"
              className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white no-underline backdrop-blur-sm transition hover:border-white/40 hover:bg-white/15 sm:px-6 sm:text-[15px]"
            >
              Plan a program
            </Link>
          </div>
        ) : null}
      </SectionWrapper>
    </section>
  );
}
