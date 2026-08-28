import type { Metadata } from "next";
import Link from "next/link";
import { SarderEcosystemStatic } from "@/components/sections/content/sarder-ecosystem";
import SectionWrapper from "@/components/sections/SectionWrapper";
import GuideStepsPanel, {
  type GuideStep,
} from "@/app/(public)/user-guide/_components/GuideStepsPanel";

export const metadata: Metadata = {
  title: "Sarder ecosystem · SkillHub",
  description:
    "Static UI preview and integration roadmap for sarder_ecosystem.",
};

const BUILD_STEPS: GuideStep[] = [
  {
    title: "Ui + Static (done)",
    detail:
      "SarderEcosystemUi — spine connectors, logo pills, three card groups. SarderEcosystemStatic uses lib/static-demo.ts.",
    status: "done",
  },
  {
    title: "Register static phase (done)",
    detail:
      "section-manifest.ts, section-catalog, server catalog, CMS mode: static, STATIC_RENDER_SECTION_KEYS.",
    status: "done",
  },
  {
    title: "Logo assets",
    detail:
      "SVG/PNG in client/public/ — Sarder-R-Logo.png, partner logos, black-dots-bg.png (spine).",
    status: "done",
  },
  {
    title: "CMS — title + subtitle + logo (done)",
    detail:
      "Pencils on section_title, sub_title, section_img_url (brand logo). Section band hidden in toolbar.",
    status: "done",
  },
  {
    title: "CMS — groups + logo rows (done)",
    detail:
      "Nested items: parent = group title; children = logo (image_url), label (title), alt (subtitle), URL (href empty = non-clickable).",
    status: "done",
  },
  {
    title: "configs + map + placement (done)",
    detail:
      "SARDER_ECOSYSTEM_ITEMS_CONFIG, map.ts (groupItemsByTabs), placement.ts, hybrid blueprint.",
    status: "done",
  },
];

const CMS_STEPS: GuideStep[] = [
  {
    title: "Add section to page",
    detail:
      "CMS → Pages → add mapping with section_key sarder_ecosystem.",
  },
  {
    title: "Edit left column",
    detail: "Pencil title, subtitle, and brand logo (section image).",
  },
  {
    title: "Edit groups",
    detail:
      "Items drawer → Add group (parent row with title). Inside each group, add child rows: logo, label, optional URL.",
  },
  {
    title: "Add new rows",
    detail:
      "Use + in items editor to add groups or logo links. Reorder with sort_order. Empty URL = disabled card (no link).",
  },
  {
    title: "Section band",
    detail: "Hidden — fixed #f5f5f5 background is built into the section UI.",
  },
];

export default function SarderEcosystemGuidePage() {
  return (
    <main className="min-h-screen bg-transparent">
      <SectionWrapper className="py-8 sm:py-10">
        <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          <Link href="/user-guide" className="hover:underline">
            User guide
          </Link>
          {" / Sarder ecosystem"}
        </p>
        <h1 className="section-theme-heading mt-2 mb-0 text-2xl font-semibold tracking-tight sm:text-3xl">
          Sarder ecosystem
        </h1>
        <p className="section-theme-muted mt-3 mb-0 max-w-3xl text-sm leading-relaxed">
          Legacy port of <strong>SarderEcosystem</strong>. Behavior key:{" "}
          <code className="text-xs">sarder_ecosystem</code> — full CMS with nested
          groups; section band hidden in toolbar.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <GuideStepsPanel title="Developer — static + roadmap" steps={BUILD_STEPS} />
          <GuideStepsPanel title="CMS — current + next" steps={CMS_STEPS} />
        </div>
      </SectionWrapper>

      <SarderEcosystemStatic />

      <SectionWrapper className="border-t border-slate-200 py-8 dark:border-slate-800">
        <p className="section-theme-muted m-0 text-sm">
          Source:{" "}
          <code className="text-xs">
            components/sections/content/sarder-ecosystem/
          </code>
        </p>
      </SectionWrapper>
    </main>
  );
}
