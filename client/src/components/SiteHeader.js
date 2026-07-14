import Link from "next/link";
import { Suspense } from "react";
import { getNavigationTree } from "@/lib/navigation";
import SiteHeaderNav from "@/components/SiteHeaderNav";
import HeaderSearch from "@/components/HeaderSearch";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import CmsModeToggle from "@/components/CmsModeToggle";
import SkillHubLogo from "@/components/SkillHubLogo";
import SectionWrapper from "@/components/sections/SectionWrapper";

function CartIcon() {
  return (
    <svg
      className="size-5"
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

export default async function SiteHeader() {
  const { navigation, error } = await getNavigationTree();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <SectionWrapper className="flex items-center gap-2 py-3.5 sm:gap-4">
        <div className="order-1 flex items-center lg:order-2 lg:min-w-0 lg:flex-1">
          {error ? (
            <p className="m-0 hidden text-sm text-rose-500 lg:block">
              {error}. Is the header server running on :4000?
            </p>
          ) : (
            <SiteHeaderNav navigation={navigation} />
          )}
        </div>

        <Link
          href="/"
          className="order-2 flex shrink-0 items-center gap-2 no-underline lg:order-1"
          aria-label="SkillHub home"
        >
          <SkillHubLogo size={36} priority />
        </Link>

        <div className="order-3 ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Suspense fallback={null}>
            <CmsModeToggle variant="header" />
          </Suspense>
          <HeaderSearch />
          <ThemeSwitcher />
          <Link
            href="/course-catalog"
            className="inline-flex size-10 items-center justify-center rounded-full text-slate-700 no-underline hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Cart"
          >
            <CartIcon />
          </Link>
        </div>
      </SectionWrapper>
    </header>
  );
}
