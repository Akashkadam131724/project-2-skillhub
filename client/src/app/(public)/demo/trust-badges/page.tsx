import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import TrustBadgesStatic from "@/components/sections/trust/trust-badges/TrustBadgesStatic";
import TrustBadgesPublicSection from "@/components/sections/trust/trust-badges/TrustBadgesPublicSection";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { fetchContentByPath } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/api/cms-api";

export const metadata: Metadata = {
  title: "Trust badges demo · SkillHub",
  description: "Static vs dynamic trust_badges section.",
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

async function loadHomeTrustBadges() {
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
          String(s?.section_key || "").toLowerCase() === "trust_badges" ||
          String(s?.render_key || "").toLowerCase() === "trust_badges"
      ) || null
    );
  } catch {
    return null;
  }
}

export default async function TrustBadgesDemoPage() {
  const placement = await loadHomeTrustBadges();

  return (
    <main className="min-h-screen bg-transparent">
      <SectionWrapper className="py-10 sm:py-12">
        <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          Demo
        </p>
        <h1 className="section-theme-heading mt-2 mb-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
          Trust badges · static vs dynamic
        </h1>
        <p className="mt-4 mb-0 text-sm">
          <Link href="/demo/key-benefits" className="text-brand hover:underline">
            Key benefits
          </Link>
          {" · "}
          <Link href="/demo/faq" className="text-brand hover:underline">
            FAQ
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
          <Link href="/" className="text-brand hover:underline">
            Home
          </Link>
        </p>
      </SectionWrapper>

      <DemoBand
        label="1 · TrustBadgesStatic"
        hint="Drop-in &lt;TrustBadgesStatic /&gt; — TRUST_BADGES_STATIC_DEMO."
      >
        <TrustBadgesStatic />
      </DemoBand>

      <DemoBand
        label="2 · Dynamic (TrustBadgesPublicSection)"
        hint="Home page trust_badges placement via view=public."
      >
        {placement ? (
          <TrustBadgesPublicSection
            id="trust-badges-dynamic"
            section_key={placement.section_key || "trust_badges"}
            section_title={placement.section_title}
            sub_title={placement.sub_title}
            items={placement.items}
            buttons={placement.buttons}
            button_title={placement.button_title}
            target_url={placement.target_url}
          />
        ) : (
          <SectionWrapper className="pb-16">
            <p className="section-theme-muted m-0 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-sm dark:border-slate-700">
              No <code>trust_badges</code> on home yet. Add one in CMS, then
              refresh.
            </p>
          </SectionWrapper>
        )}
      </DemoBand>
    </main>
  );
}
