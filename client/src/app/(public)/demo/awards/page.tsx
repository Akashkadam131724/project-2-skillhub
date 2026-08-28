import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import AwardsStatic from "@/components/sections/features/awards/AwardsStatic";
import AwardsPublicSection from "@/components/sections/features/awards/AwardsPublicSection";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { fetchContentByPath } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/api/cms-api";

export const metadata: Metadata = {
  title: "Awards demo · SkillHub",
  description: "Static vs dynamic awards section.",
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

async function loadHomeAwards() {
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
          String(s?.section_key || "").toLowerCase() === "awards" ||
          String(s?.render_key || "").toLowerCase() === "awards"
      ) || null
    );
  } catch {
    return null;
  }
}

export default async function AwardsDemoPage() {
  const placement = await loadHomeAwards();

  return (
    <main className="min-h-screen bg-transparent">
      <SectionWrapper className="py-10 sm:py-12">
        <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          Demo
        </p>
        <h1 className="section-theme-heading mt-2 mb-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
          Awards · static vs dynamic
        </h1>
        <p className="mt-4 mb-0 text-sm">
          <Link href="/demo/faq" className="text-brand hover:underline">
            FAQ demo
          </Link>
          {" · "}
          <Link href="/demo/key-benefits" className="text-brand hover:underline">
            Key benefits demo
          </Link>
          {" · "}
          <Link href="/demo/trust-badges" className="text-brand hover:underline">
            Trust badges demo
          </Link>
          {" · "}
          <Link href="/demo/stats" className="text-brand hover:underline">
            Stats demo
          </Link>
          {" · "}
          <Link
            href="/demo/training-options"
            className="text-brand hover:underline"
          >
            Training options
          </Link>
          {" · "}
          <Link href="/" className="text-brand hover:underline">
            Home
          </Link>
        </p>
      </SectionWrapper>

      <DemoBand
        label="1 · AwardsStatic"
        hint="Drop-in &lt;AwardsStatic /&gt; — AWARDS_STATIC_DEMO."
      >
        <AwardsStatic />
      </DemoBand>

      <DemoBand
        label="2 · Dynamic (AwardsPublicSection)"
        hint="Home page awards placement via view=public."
      >
        {placement ? (
          <AwardsPublicSection
            id="awards-dynamic"
            section_key={placement.section_key || "awards"}
            section_title={placement.section_title}
            sub_title={placement.sub_title}
            items={placement.items}
          />
        ) : (
          <SectionWrapper className="pb-16">
            <p className="section-theme-muted m-0 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-sm dark:border-slate-700">
              No <code>awards</code> on home yet. Add one in CMS, then refresh.
            </p>
          </SectionWrapper>
        )}
      </DemoBand>
    </main>
  );
}
