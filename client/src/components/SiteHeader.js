import Link from "next/link";
import ProjectNav from "@/components/ProjectNav";
import HeaderSearch from "@/components/HeaderSearchLazy";
import SkillHubLogo from "@/components/SkillHubLogo";
import SectionWrapper from "@/components/sections/SectionWrapper";
import CartIcon from "@/components/icons/CartIcon";

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

export default function SiteHeader() {
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

        <div className="hidden min-w-0 justify-self-center overflow-x-auto lg:block">
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

          <ProjectNav showDesktop={false} />
        </div>
      </SectionWrapper>
    </header>
  );
}
