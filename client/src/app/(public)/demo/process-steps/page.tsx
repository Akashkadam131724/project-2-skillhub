import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import ProcessStepsStatic from "@/components/sections/features/process-steps/ProcessStepsStatic";
import ProcessStepsPublicSection from "@/components/sections/features/process-steps/ProcessStepsPublicSection";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { fetchContentByPath } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/api/cms-api";

export const metadata: Metadata = {
  title: "Process steps demo · SkillHub",
  description: "Static vs dynamic process_steps section.",
};

function DemoBand({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800">
      <SectionWrapper className="py-6">
        <p className="m-0 text-[11px] font-semibold tracking-[0.2em] text-brand uppercase">
          {label}
        </p>
        <p className="section-theme-muted mt-1 mb-0 max-w-2xl text-sm">{hint}</p>
      </SectionWrapper>
      {children}
    </div>
  );
}

async function loadHomeProcessSteps() {
  try {
    const res = await fetchContentByPath("/");
    const content = res?.data || null;
    if (!content) return null;
    const contentId = String(content._id || content.id);
    const sectionsRes = await getPageSectionsResolved("home", contentId, {
      cache: "no-store",
    }).catch(() => ({ sections: [] }));
    const sections = Array.isArray(sectionsRes.sections)
      ? sectionsRes.sections
      : [];
    return (
      sections.find(
        (s: { section_key?: string; render_key?: string }) =>
          String(s?.section_key || "").toLowerCase() === "process_steps" ||
          String(s?.render_key || "").toLowerCase() === "process_steps"
      ) || null
    );
  } catch {
    return null;
  }
}

export default async function ProcessStepsDemoPage() {
  const placement = await loadHomeProcessSteps();

  return (
    <main className="min-h-screen bg-transparent">
      <SectionWrapper className="py-10 sm:py-12">
        <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          Demo
        </p>
        <h1 className="section-theme-heading mt-2 mb-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
          Process steps · static vs dynamic
        </h1>
        <p className="mt-4 mb-0 text-sm">
          <Link href="/demo/metric-rail" className="text-brand hover:underline">
            Metric rail
          </Link>
          {" · "}
          <Link href="/demo/why-choose" className="text-brand hover:underline">
            Why choose
          </Link>
          {" · "}
          <Link href="/demo/faq" className="text-brand hover:underline">
            FAQ
          </Link>
          {" · "}
          <Link href="/" className="text-brand hover:underline">
            Home
          </Link>
        </p>
      </SectionWrapper>

      <DemoBand
        label="1 · ProcessStepsStatic"
        hint="Drop-in &lt;ProcessStepsStatic /&gt; — PROCESS_STEPS_STATIC_DEMO."
      >
        <ProcessStepsStatic />
      </DemoBand>

      <DemoBand
        label="2 · Dynamic (ProcessStepsPublicSection)"
        hint="Home page process_steps placement via view=public."
      >
        {placement ? (
          <ProcessStepsPublicSection
            id="process-steps-dynamic"
            section_key={placement.section_key || "process_steps"}
            section_title={placement.section_title}
            sub_title={placement.sub_title}
            items={placement.items}
            buttons={placement.buttons}
            button_title={placement.button_title}
            target_url={placement.target_url}
            section_theme={placement.section_theme}
            surfaceTone={placement.surfaceTone}
            surfaceBand={placement.surfaceBand}
          />
        ) : (
          <SectionWrapper className="pb-16">
            <p className="section-theme-muted m-0 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-sm dark:border-slate-700">
              No <code>process_steps</code> on home yet. Add one in CMS, then
              refresh.
            </p>
          </SectionWrapper>
        )}
      </DemoBand>
    </main>
  );
}
