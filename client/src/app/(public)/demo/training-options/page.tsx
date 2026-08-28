import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import TrainingOptionsStatic from "@/components/sections/features/training-options/TrainingOptionsStatic";
import TrainingOptionsPublicSection from "@/components/sections/features/training-options/TrainingOptionsPublicSection";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { fetchContentByPath } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/api/cms-api";

export const metadata: Metadata = {
  title: "Training options demo · SkillHub",
  description: "Static vs dynamic training_options section.",
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

async function loadHomeTrainingOptions() {
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
          String(s?.section_key || "").toLowerCase() === "training_options" ||
          String(s?.render_key || "").toLowerCase() === "training_options"
      ) || null
    );
  } catch {
    return null;
  }
}

export default async function TrainingOptionsDemoPage() {
  const placement = await loadHomeTrainingOptions();

  return (
    <main className="min-h-screen bg-transparent">
      <SectionWrapper className="py-10 sm:py-12">
        <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          Demo
        </p>
        <h1 className="section-theme-heading mt-2 mb-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
          Training options · static vs dynamic
        </h1>
        <p className="mt-4 mb-0 text-sm">
          <Link href="/demo/faq" className="text-brand hover:underline">
            FAQ
          </Link>
          {" · "}
          <Link href="/demo/stats" className="text-brand hover:underline">
            Stats
          </Link>
          {" · "}
          <Link href="/demo/awards" className="text-brand hover:underline">
            Awards
          </Link>
          {" · "}
          <Link href="/demo/why-choose" className="text-brand hover:underline">
            Why choose
          </Link>
          {" · "}
          <Link href="/" className="text-brand hover:underline">
            Home
          </Link>
        </p>
      </SectionWrapper>

      <DemoBand
        label="1 · TrainingOptionsStatic"
        hint="Drop-in &lt;TrainingOptionsStatic /&gt; — TRAINING_OPTIONS_STATIC_DEMO."
      >
        <TrainingOptionsStatic />
      </DemoBand>

      <DemoBand
        label="2 · Dynamic (TrainingOptionsPublicSection)"
        hint="Home page training_options placement via view=public."
      >
        {placement ? (
          <TrainingOptionsPublicSection
            id="training-options-dynamic"
            section_key={placement.section_key || "training_options"}
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
              No <code>training_options</code> on home yet. Add one in CMS, then
              refresh.
            </p>
          </SectionWrapper>
        )}
      </DemoBand>
    </main>
  );
}
