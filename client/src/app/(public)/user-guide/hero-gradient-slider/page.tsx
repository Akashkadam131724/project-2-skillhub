import type { Metadata } from "next";
import Link from "next/link";
import { HeroGradientSliderStatic } from "@/components/sections/hero/hero-gradient-slider";
import SectionWrapper from "@/components/sections/SectionWrapper";
import GuideStepsPanel, {
  type GuideStep,
} from "@/app/(public)/user-guide/_components/GuideStepsPanel";

export const metadata: Metadata = {
  title: "Hero gradient slider · SkillHub",
  description:
    "Static UI preview and full integration steps for hero_gradient_slider.",
};

const BUILD_STEPS: GuideStep[] = [
  {
    title: "Ui + Static",
    detail:
      "HeroGradientSliderUi (presentation) and HeroGradientSliderStatic (baked-in NetCom demo slides). No CMS imports inside Ui.",
    status: "done",
  },
  {
    title: "lib/types.ts + lib/static-demo.ts",
    detail:
      "Slide shape, default gradient bg, demo image URLs, stats row, and CTA labels.",
    status: "done",
  },
  {
    title: "Public + Section adapters",
    detail:
      "HeroGradientSliderPublicSection and HeroGradientSliderSection currently render the static demo only — CMS field mapping not wired yet.",
    status: "partial",
  },
  {
    title: "Register in section-registry.js",
    detail:
      'SECTION_CATALOG entry key: hero_gradient_slider (category: hero). Mirror in server/src/modules/cms/section.catalog.js.',
    status: "done",
  },
  {
    title: "section-manifest.ts",
    detail:
      "defineSection with loadPublic → HeroGradientSliderPublicSection and loadStatic → HeroGradientSliderStatic.",
    status: "done",
  },
  {
    title: "section-registry-sync.js",
    detail:
      "HeroGradientSliderSection for CMS live-edit / content-section preview.",
    status: "done",
  },
  {
    title: "lib/cms-capabilities.ts",
    detail:
      'mode: "static" — toolbar shows visibility only; pencils disabled until content mode is enabled.',
    status: "done",
  },
  {
    title: "item-types.js STATIC_RENDER",
    detail:
      "Empty CMS fields still show the demo on public pages (placement visibility only).",
    status: "done",
  },
  {
    title: "section-theme.js",
    detail:
      "Own full-bleed band + fixed dark palette (band theme editor hidden for now).",
    status: "done",
  },
  {
    title: "lib/map.ts + lib/placement.ts + lib/cms-config.js",
    detail:
      "Map items[] → slides; placement showability; per-slide CMS item fields (image, title, body, video URL, buttons).",
    status: "todo",
  },
  {
    title: "configs/index.js",
    detail: "Import HERO_GRADIENT_SLIDER_ITEMS_CONFIG when items[] are added.",
    status: "todo",
  },
  {
    title: "Switch cms-capabilities to content mode",
    detail:
      "Enable section_title, body, buttons, items; turn on sectionBand when gradient should follow ink/brand.",
    status: "todo",
  },
  {
    title: "Tests + graphify",
    detail:
      "map.test.ts, manifest catalog test, then graphify update client from project-2-skillhub/.",
    status: "todo",
  },
];

const CMS_STEPS: GuideStep[] = [
  {
    title: "Create the section row (Mongo / seed)",
    detail:
      'Insert a Section document with key hero_gradient_slider, name "Hero — Gradient Slider", category hero. render_key can match section_key.',
  },
  {
    title: "Tag on a page template",
    detail:
      "In CMS → Pages → pick template (e.g. home) → add section mapping with section_key hero_gradient_slider, sort_order, status: true.",
  },
  {
    title: "Live page today",
    detail:
      "Home live edit (/cms/home/edit): section renders demo slides even with empty fields. Toolbar shows Static badge — only show/hide works.",
  },
  {
    title: "After CMS wiring (future)",
    detail:
      "Edit slides via items drawer, band via Section band…, global vs page scope same as other hero sections.",
  },
];

const DB_EXAMPLE = `{
  "key": "hero_gradient_slider",
  "name": "Hero — Gradient Slider",
  "category": "hero",
  "section_key": "hero_gradient_slider",
  "render_key": "hero_gradient_slider"
}`;

export default function HeroGradientSliderTestPage() {
  return (
    <main className="min-h-screen bg-transparent">
      <SectionWrapper className="py-8 sm:py-10">
        <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          <Link href="/user-guide" className="hover:underline">
            User guide
          </Link>
          {" / Hero gradient slider"}
        </p>
        <h1 className="section-theme-heading mt-2 mb-0 text-2xl font-semibold tracking-tight sm:text-3xl">
          Hero gradient slider
        </h1>
        <p className="section-theme-muted mt-3 mb-0 max-w-3xl text-sm leading-relaxed">
          Legacy port of <strong>TWHomepageBanner3</strong>. Preview below is the
          static demo. Registered behavior key:{" "}
          <code className="text-xs">hero_gradient_slider</code>.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <GuideStepsPanel title="Developer — build & register" steps={BUILD_STEPS} />
          <GuideStepsPanel title="CMS — add to a page" steps={CMS_STEPS} />
        </div>

        <div className="section-theme-muted mt-6 rounded-2xl border border-slate-200 p-5 text-sm dark:border-slate-800">
          <p className="section-theme-heading m-0 font-medium">
            Example placement payload
          </p>
          <pre className="mt-3 mb-0 overflow-x-auto rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-900">
            {DB_EXAMPLE}
          </pre>
        </div>
      </SectionWrapper>

      <HeroGradientSliderStatic />

      <SectionWrapper className="border-t border-slate-200 py-8 dark:border-slate-800">
        <p className="section-theme-muted m-0 text-sm">
          Source:{" "}
          <code className="text-xs">
            components/sections/hero/hero-gradient-slider/
          </code>
        </p>
      </SectionWrapper>
    </main>
  );
}
