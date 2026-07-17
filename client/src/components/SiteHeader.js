import Link from "next/link";
// Dynamic mega-nav (paused — restore later):
// import { getNavigationTree } from "@/lib/navigation";
// import SiteHeaderNav from "@/components/SiteHeaderNav";
import ProjectNav from "@/components/ProjectNav";
import HeaderSearch from "@/components/HeaderSearch";
import SkillHubLogo from "@/components/SkillHubLogo";
import SectionWrapper from "@/components/sections/SectionWrapper";

function CartIcon() {
  return (
    <svg
      className="size-[1.15rem]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        d="M6 6h15l-1.5 9h-12z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 6L5 3H2" strokeLinecap="round" />
      <circle cx="9" cy="20" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconButton({ href, label, children }) {
  return (
    <Link
      href={href}
      className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 text-ink no-underline transition hover:border-ink/20 hover:bg-white hover:text-brand dark:border-slate-700 dark:bg-slate-900/70 dark:text-white dark:hover:bg-slate-900"
      aria-label={label}
    >
      {children}
    </Link>
  );
}

export default async function SiteHeader() {
  // --- Dynamic navigation (commented for now; use later) ---
  // const { navigation, error } = await getNavigationTree();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl [--site-header-h:4.25rem] dark:border-slate-800/80 dark:bg-slate-950/75 lg:[--site-header-h:4.75rem]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent"
      />

      <SectionWrapper className="relative flex h-[var(--site-header-h)] items-center gap-2 sm:gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none lg:justify-self-start">
          <Link
            href="/"
            className="group flex min-w-0 shrink items-center gap-2.5 no-underline"
            aria-label="SkillHub home"
          >
            <span className="relative inline-flex shrink-0">
              <SkillHubLogo size={34} showWordmark={false} />
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-1 rounded-xl bg-brand/10 opacity-0 transition group-hover:opacity-100"
              />
            </span>
            <span className="flex min-w-0 flex-col leading-none">
              <span className="font-[family-name:var(--font-display)] text-[1.05rem] font-semibold tracking-tight text-ink dark:text-white">
                SkillHub
              </span>
              <span className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
                Learn · Build · Ship
              </span>
            </span>
          </Link>
        </div>

        <div className="hidden justify-self-center lg:block">
          {/* Dynamic mega-nav (restore later):
          {error ? (
            <p className="m-0 text-sm text-rose-500">
              {error}. Is the SkillHub API running on :3000?
            </p>
          ) : (
            <SiteHeaderNav navigation={navigation} showMobile={false} />
          )}
          */}
          <ProjectNav showMobile={false} />
        </div>

        <div className="ml-auto flex shrink-0 items-center justify-end gap-1.5 sm:gap-2 lg:ml-0 lg:justify-self-end">
          <HeaderSearch />

          <IconButton href="/courses" label="Cart">
            <CartIcon />
          </IconButton>

          <Link
            href="/contact-us"
            className="hidden h-10 shrink-0 items-center justify-center rounded-xl bg-ink px-3.5 text-xs font-semibold tracking-wide text-white no-underline transition hover:bg-brand lg:inline-flex dark:bg-white dark:text-ink dark:hover:bg-brand dark:hover:text-white"
          >
            Contact us
          </Link>

          <div className="lg:hidden">
            {/* Dynamic mobile nav (restore later):
            {error ? null : (
              <SiteHeaderNav navigation={navigation} showDesktop={false} />
            )}
            */}
            <ProjectNav showDesktop={false} />
          </div>
        </div>
      </SectionWrapper>
    </header>
  );
}
