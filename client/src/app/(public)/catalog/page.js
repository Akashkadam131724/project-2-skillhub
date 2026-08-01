import Link from "next/link";
import { CATALOG_HUB_ITEMS } from "@/lib/content/content-catalog";
import SectionWrapper from "@/components/sections/SectionWrapper";

export const metadata = {
  title: "Global catalog",
  description: "Browse SkillHub catalogs — content pages, showcases, and CMS routes.",
};

export default function CatalogHubPage() {
  return (
    <main>
      <SectionWrapper className="py-10 sm:py-14">
        <div className="mb-10 max-w-2xl">
          <p className="m-0 text-xs font-semibold tracking-[0.22em] text-brand uppercase">
            SkillHub
          </p>
          <h1 className="mt-2 mb-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink sm:text-4xl dark:text-white">
            Global catalog
          </h1>
          <p className="mt-3 mb-0 text-slate-600 dark:text-slate-400">
            One place to browse every catalog in the project. Open the content page gallery to
            preview CMS routes in fullscreen — like flipping through a deck.
          </p>
        </div>

        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {CATALOG_HUB_ITEMS.map((item) => (
            <li key={item.id}>
              {item.active ? (
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-[1.35rem] border border-slate-200/90 bg-white p-6 no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950"
                >
                  <span className="inline-flex w-fit rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold tracking-wide text-brand uppercase">
                    Active
                  </span>
                  <h2 className="mt-4 mb-0 font-[family-name:var(--font-display)] text-xl font-semibold text-ink group-hover:text-brand dark:text-white">
                    {item.name}
                  </h2>
                  <p className="mt-2 mb-0 flex-1 text-sm text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink dark:text-white">
                    Open catalog
                    <span aria-hidden className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              ) : (
                <div className="flex h-full flex-col rounded-[1.35rem] border border-dashed border-slate-200 bg-slate-50/80 p-6 opacity-60 dark:border-slate-800 dark:bg-slate-900/50">
                  <span className="inline-flex w-fit rounded-full bg-slate-200 px-3 py-1 text-[11px] font-bold tracking-wide text-slate-500 uppercase dark:bg-slate-800">
                    Soon
                  </span>
                  <h2 className="mt-4 mb-0 text-xl font-semibold text-slate-500">{item.name}</h2>
                  <p className="mt-2 mb-0 text-sm text-slate-400">{item.description}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </SectionWrapper>
    </main>
  );
}
