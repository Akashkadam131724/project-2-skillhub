import type { Metadata } from "next";
import Link from "next/link";
import SectionWrapper from "@/components/sections/SectionWrapper";
import {
  SECTION_INTEGRATION_STEPS,
  TEST_SECTION_ENTRIES,
} from "@/lib/sections/test";

export const metadata: Metadata = {
  title: "Section test sandbox · SkillHub",
  description:
    "Prototype new sections under components/sections/test before promoting to production.",
};

export default function SectionTestHubPage() {
  return (
    <main className="min-h-screen bg-transparent">
      <SectionWrapper className="py-10 sm:py-14">
        <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          <Link href="/user-guide" className="hover:underline">
            User guide
          </Link>
          {" / Test sandbox"}
        </p>
        <h1 className="section-theme-heading mt-2 mb-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
          Section test sandbox
        </h1>
        <p className="section-theme-muted mt-4 mb-0 max-w-3xl text-base leading-relaxed">
          Build and preview new sections in{" "}
          <code className="text-sm">components/sections/test/</code> before
          wiring catalog, manifest, and CMS. Copy{" "}
          <code className="text-sm">_template/</code> to start.
        </p>

        <h2 className="section-theme-heading mt-10 mb-0 text-lg font-semibold">
          Live prototypes
        </h2>
        <ul className="mt-4 grid list-none gap-4 p-0 sm:grid-cols-2">
          {TEST_SECTION_ENTRIES.map((entry) => (
            <li key={entry.slug}>
              <Link
                href={`/user-guide/test/${entry.slug}`}
                className="section-ui-card group flex h-full flex-col rounded-2xl border p-5 transition hover:border-brand/40 hover:shadow-md"
              >
                <p className="m-0 text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
                  {entry.key}
                </p>
                <h3 className="section-theme-heading mt-2 mb-0 text-xl font-semibold group-hover:text-brand">
                  {entry.name}
                </h3>
                <p className="section-theme-muted mt-2 mb-0 text-sm">
                  {entry.folder}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="section-theme-heading mt-10 mb-0 text-lg font-semibold">
          Promotion checklist
        </h2>
        <p className="section-theme-muted mt-2 mb-0 text-sm">
          When a test section is ready for CMS pages, wire these files (then move
          the folder out of <code className="text-xs">test/</code>).
        </p>
        <ol className="section-theme-muted mt-4 list-decimal space-y-2 pl-5 text-sm">
          {SECTION_INTEGRATION_STEPS.map((step) => (
            <li key={step.id}>
              <span className="section-theme-heading font-medium">
                {step.label}
              </span>
              {step.optional ? (
                <span className="ml-1 text-xs text-brand">(optional)</span>
              ) : null}
              <br />
              <code className="text-xs">{step.file}</code>
            </li>
          ))}
        </ol>
      </SectionWrapper>
    </main>
  );
}
