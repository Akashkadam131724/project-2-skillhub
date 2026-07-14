import Link from "next/link";
import SectionWrapper from "@/components/sections/SectionWrapper";

function BannerAtmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute top-[6%] left-[8%] size-96 rounded-full bg-[#3B82F6]/20 blur-[42px]" />
      <div className="absolute right-[6%] bottom-0 size-[32rem] rounded-full bg-[#A855F7]/20 blur-[42px]" />
      <div className="absolute top-1/2 left-[35%] hidden h-80 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#06B6D4]/15 blur-[56px] lg:block" />

      <svg className="absolute inset-0 h-full w-full opacity-30">
        <defs>
          <linearGradient id="banner-g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="banner-g2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="banner-g3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line
          x1="10%"
          y1="20%"
          x2="40%"
          y2="80%"
          stroke="url(#banner-g1)"
          strokeWidth="1"
        />
        <line
          x1="60%"
          y1="10%"
          x2="90%"
          y2="70%"
          stroke="url(#banner-g2)"
          strokeWidth="1"
        />
        <line
          x1="30%"
          y1="90%"
          x2="70%"
          y2="30%"
          stroke="url(#banner-g3)"
          strokeWidth="1"
        />
      </svg>

      {[
        ["10%", "20%"],
        ["22%", "54%"],
        ["40%", "45%"],
        ["58%", "36%"],
        ["76%", "27%"],
        ["88%", "61%"],
      ].map(([left, top], i) => (
        <div
          key={`dot-b-${i}`}
          className="absolute size-1 rounded-full bg-blue-400"
          style={{ left, top }}
        />
      ))}
      {[
        ["15%", "30%"],
        ["39%", "76%"],
        ["63%", "72%"],
        ["87%", "68%"],
      ].map(([left, top], i) => (
        <div
          key={`dot-p-${i}`}
          className="absolute size-2 rounded-full bg-purple-400/80"
          style={{ left, top }}
        />
      ))}
    </div>
  );
}

/**
 * Site hero — uses the same content width as header / catalog / detail pages.
 */
export default function PageBanner({
  eyebrow = "SkillHub",
  title = "Enterprise-Grade Industry Solutions for Workforce Transformation",
  description = "SkillHub delivers strategic, industry-aligned technology solutions that help enterprise leaders close capability gaps, accelerate digital initiatives, and achieve measurable business impact at scale.",
  ctaLabel = "Explore Solutions",
  ctaHref = "/course-catalog",
  logo,
}) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(157.967deg, rgb(15, 23, 42) 0%, rgb(0, 35, 109) 50%, rgb(15, 23, 42) 100%)",
      }}
    >
      <BannerAtmosphere />

      <SectionWrapper className="relative z-10 flex flex-col py-12 sm:py-14 lg:py-16">
        {logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt=""
            className="mb-4 h-7 w-auto max-w-[120px] object-contain sm:mb-5 sm:h-8 sm:max-w-[140px]"
          />
        )}

        <div className="flex max-w-2xl flex-col gap-4 sm:gap-5">
          {eyebrow && (
            <p className="m-0 text-[11px] font-semibold tracking-[0.16em] text-brand/80 uppercase sm:text-xs">
              {eyebrow}
            </p>
          )}

          <h1 className="m-0 text-[28px] leading-[1.15] font-semibold tracking-tight text-white sm:text-[34px] lg:text-[40px]">
            {title}
          </h1>

          {description && (
            <p className="m-0 text-[15px] leading-relaxed text-slate-200 sm:text-base">
              {description}
            </p>
          )}
        </div>

        {ctaHref && ctaLabel && (
          <div className="mt-7 sm:mt-8">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-[15px] font-semibold text-black no-underline transition hover:bg-gray-100 sm:px-6 sm:py-3 sm:text-base"
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </SectionWrapper>
    </section>
  );
}
