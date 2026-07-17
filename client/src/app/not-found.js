import Link from "next/link";
import SectionWrapper from "@/components/sections/SectionWrapper";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="relative isolate min-h-[calc(100vh-4.5rem)] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_10%,color-mix(in_srgb,var(--brand)_22%,transparent),transparent_55%),radial-gradient(ellipse_70%_50%_at_90%_80%,color-mix(in_srgb,var(--ink)_12%,transparent),transparent_50%),linear-gradient(165deg,#f8fafc_0%,#ffffff_45%,#eef2ff_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] size-[28rem] rounded-full bg-brand/10 blur-3xl motion-safe:animate-[notfound-drift_14s_ease-in-out_infinite]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-8%] left-[-8%] size-[22rem] rounded-full bg-ink/5 blur-3xl motion-safe:animate-[notfound-drift_18s_ease-in-out_infinite_reverse]"
        aria-hidden
      />

      <SectionWrapper className="relative flex min-h-[calc(100vh-4.5rem)] flex-col justify-center py-16 sm:py-24">
        <div className="max-w-xl motion-safe:animate-[notfound-rise_0.7s_ease-out_both]">
          <p className="font-[family-name:var(--font-display)] text-[clamp(4.5rem,18vw,8rem)] leading-none font-semibold tracking-tight text-ink/15 dark:text-white/15">
            404
          </p>

          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink sm:text-4xl dark:text-white">
            This page wandered off
          </h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-300">
            The link may be broken, or the page may have moved. Head home to keep
            exploring SkillHub.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white no-underline transition hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Back to homepage
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white/70 px-5 py-2.5 text-sm font-semibold text-ink no-underline backdrop-blur-sm transition hover:border-slate-400 hover:bg-white dark:border-slate-600 dark:bg-slate-950/50 dark:text-white dark:hover:border-slate-500"
            >
              Browse catalog
            </Link>
          </div>
        </div>
      </SectionWrapper>

      <style>{`
        @keyframes notfound-rise {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes notfound-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(18px, -14px); }
        }
      `}</style>
    </main>
  );
}
