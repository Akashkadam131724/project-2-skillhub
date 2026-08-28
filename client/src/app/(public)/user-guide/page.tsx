import type { Metadata } from "next";
import Link from "next/link";
import SectionWrapper from "@/components/sections/SectionWrapper";
import {
  SECTION_CATALOG,
  SECTION_CATEGORIES,
} from "@/lib/sections/section-registry";

export const metadata: Metadata = {
  title: "Section library · SkillHub",
  description:
    "Browse CMS section categories and preview layouts with realistic SkillHub demo data.",
};

export default function DemoIndexPage() {
  const totalSections = SECTION_CATALOG.length;

  return (
    <main className="min-h-screen bg-transparent">
      <SectionWrapper className="py-10 sm:py-14">
        <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          Component library
        </p>
        <h1 className="section-theme-heading mt-2 mb-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Section categories
        </h1>
        <p className="section-theme-muted mt-4 mb-0 max-w-3xl text-base leading-relaxed">
          {totalSections} registered layouts across {SECTION_CATEGORIES.length}{" "}
          categories. Pick a category to preview every variant with realistic
          SkillHub demo data.
        </p>
        <p className="mt-6 mb-0 text-sm">
          <Link href="/" className="text-brand hover:underline">
            Home
          </Link>
          {" · "}
          <Link href="/user-guide/buttons" className="text-brand hover:underline">
            Button system
          </Link>
          {" · "}
          <Link
            href="/user-guide/hero-gradient-slider"
            className="text-brand hover:underline"
          >
            Hero gradient slider
          </Link>
          {" · "}
          <Link
            href="/user-guide/vendor-links-grid"
            className="text-brand hover:underline"
          >
            Vendor link grid
          </Link>
          {" · "}
          <Link href="/user-guide/test" className="text-brand hover:underline">
            Test sandbox
          </Link>
        </p>
      </SectionWrapper>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <SectionWrapper className="py-8 sm:py-10">
          <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {SECTION_CATEGORIES.map((category) => {
              const count = SECTION_CATALOG.filter(
                (section) => section.category === category.key
              ).length;
              if (!count) return null;

              return (
                <li key={category.key}>
                  <Link
                    href={`/user-guide/${category.key}`}
                    className="section-ui-card group flex h-full flex-col rounded-2xl border p-5 transition hover:border-brand/40 hover:shadow-md"
                  >
                    <p className="m-0 text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
                      {count} layout{count === 1 ? "" : "s"}
                    </p>
                    <h2 className="section-theme-heading mt-2 mb-0 text-xl font-semibold tracking-tight group-hover:text-brand">
                      {category.name}
                    </h2>
                    <p className="section-theme-muted mt-2 mb-0 text-sm">
                      Preview {category.name.toLowerCase()} sections
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </SectionWrapper>
      </div>
    </main>
  );
}
