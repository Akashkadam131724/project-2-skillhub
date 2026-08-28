import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import FaqStatic from "@/components/sections/accordion/faq/FaqStatic";
import FaqPublicSection from "@/components/sections/accordion/faq/FaqPublicSection";
import FaqTwoColumnStatic from "@/components/sections/accordion/faq-two-column/FaqTwoColumnStatic";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { fetchContentByPath } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/api/cms-api";

export const metadata: Metadata = {
  title: "FAQ demo · SkillHub",
  description: "Static FAQ components vs dynamic FAQ from resolved CMS sections.",
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

async function loadHomeFaqPlacement() {
  try {
    const res = await fetchContentByPath("/");
    const content = res?.data || null;
    if (!content) return null;
    const contentId = String(content._id || content.id);
    const sectionsRes = await getPageSectionsResolved("home", contentId, {
      cache: "no-store",
    }).catch(() => ({ sections: [] }));
    const sections = Array.isArray(sectionsRes.sections) ? sectionsRes.sections : [];
    const faq = sections.find(
      (s: { section_key?: string; render_key?: string }) =>
        String(s?.section_key || "").toLowerCase() === "faq" ||
        String(s?.render_key || "").toLowerCase() === "faq"
    );
    return faq || null;
  } catch {
    return null;
  }
}

export default async function FaqDemoPage() {
  const faqPlacement = await loadHomeFaqPlacement();

  return (
    <main className="min-h-screen bg-transparent">
      <SectionWrapper className="py-10 sm:py-12">
        <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          Demo
        </p>
        <h1 className="section-theme-heading mt-2 mb-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
          FAQ · static vs dynamic
        </h1>
        <p className="section-theme-muted mt-3 mb-0 max-w-2xl text-base leading-relaxed">
          <code className="text-sm">*Static</code> components ship hard-coded
          demo data. <code className="text-sm">*PublicSection</code> maps CMS
          resolve payloads.
        </p>
        <p className="mt-4 mb-0 text-sm">
          <Link href="/demo/key-benefits" className="text-brand hover:underline">
            Key benefits
          </Link>
          {" · "}
          <Link href="/demo/trust-badges" className="text-brand hover:underline">
            Trust badges
          </Link>
          {" · "}
          <Link href="/demo/awards" className="text-brand hover:underline">
            Awards
          </Link>
          {" · "}
          <Link href="/demo/stats" className="text-brand hover:underline">
            Stats
          </Link>
          {" · "}
          <Link
            href="/demo/training-options"
            className="text-brand hover:underline"
          >
            Training options
          </Link>
          {" · "}
          <Link href="/demo/why-choose" className="text-brand hover:underline">
            Why choose
          </Link>
          {" · "}
          <Link href="/demo/metric-rail" className="text-brand hover:underline">
            Metric rail
          </Link>
          {" · "}
          <Link
            href="/demo/process-steps"
            className="text-brand hover:underline"
          >
            Process steps
          </Link>
          {" · "}
          <Link href="/" className="text-brand hover:underline">
            Home
          </Link>
        </p>
      </SectionWrapper>

      <DemoBand
        label="1 · FaqStatic"
        hint="Drop-in <FaqStatic /> — data from FAQ_STATIC_DEMO."
      >
        <FaqStatic />
      </DemoBand>

      <DemoBand
        label="2 · FaqTwoColumnStatic"
        hint="Drop-in <FaqTwoColumnStatic /> — data from FAQ_TWO_COLUMN_STATIC_DEMO."
      >
        <FaqTwoColumnStatic />
      </DemoBand>

      <DemoBand
        label="3 · Dynamic (FaqPublicSection)"
        hint="Home page FAQ placement via GET /pages/home/sections?view=public."
      >
        {faqPlacement ? (
          <FaqPublicSection
            id="faq-dynamic"
            section_key={faqPlacement.section_key || "faq"}
            section_title={faqPlacement.section_title}
            sub_title={faqPlacement.sub_title}
            items={faqPlacement.items}
            buttons={faqPlacement.buttons}
            button_title={faqPlacement.button_title}
            target_url={faqPlacement.target_url}
            section_theme={faqPlacement.section_theme}
            sectionTheme={faqPlacement.sectionTheme}
            surfaceTone={faqPlacement.surfaceTone}
            surfaceBand={faqPlacement.surfaceBand}
          />
        ) : (
          <SectionWrapper className="pb-16">
            <p className="section-theme-muted m-0 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-sm dark:border-slate-700">
              No <code>faq</code> section on the home page yet. Add one in CMS
              home live-edit, then refresh.
            </p>
          </SectionWrapper>
        )}
      </DemoBand>
    </main>
  );
}
