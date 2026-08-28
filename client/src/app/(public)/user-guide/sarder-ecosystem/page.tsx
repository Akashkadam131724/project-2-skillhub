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
    title: "CMS — title + subtitle + logo",
    detail: "Enable section_title, sub_title, section_img_url on left column.",
    status: "todo",
  },
  {
    title: "CMS — groups (items)",
    detail:
      "Nested items: group title + child rows (logo, label, href, disabled). cms-config.js + map.ts.",
    status: "todo",
  },
  {
    title: "Switch archetype",
    detail:
      'Change blueprint from static → hybrid/items; wire placement.ts and remove from STATIC_RENDER_SECTION_KEYS.',
    status: "todo",
  },
];

const CMS_STEPS: GuideStep[] = [
  {
    title: "Add section to page",
    detail:
      'CMS → Pages → add mapping with section_key sarder_ecosystem. Static phase: built-in demo always renders.',
  },
  {
    title: "Live editor (static)",
    detail: "Visibility toggle only — toolbar shows static hint until fields are enabled.",
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
          <code className="text-xs">sarder_ecosystem</code> — static phase first;
          CMS fields enabled incrementally.
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
