import type { Metadata } from "next";
import Link from "next/link";
import { HeroGradientSliderStatic } from "@/components/sections/hero/hero-gradient-slider";
import SectionWrapper from "@/components/sections/SectionWrapper";

export const metadata: Metadata = {
  title: "Hero gradient slider (static) · SkillHub",
  description:
    "Static UI preview for the hero gradient slider section before CMS wiring.",
};

const INTEGRATION_CHECKLIST = [
  {
    step: "1. Ui + Static",
    detail:
      "Pure presentation (HeroGradientSliderUi) and hard-coded demo (HeroGradientSliderStatic). No CMS imports in Ui.",
    status: "done",
  },
  {
    step: "2. lib/",
    detail:
      "types.ts, static-demo.ts, then map.ts (API/CMS → slides), placement.ts, cms-config.js for item fields.",
    status: "partial",
  },
  {
    step: "3. Public + Section adapters",
    detail:
      "HeroGradientSliderPublicSection + HeroGradientSliderSection render static demo (no CMS fields yet).",
    status: "done",
  },
  {
    step: "4. SECTION_CATALOG",
    detail:
      "Registered as hero_gradient_slider in section-registry.js + server section.catalog.js.",
    status: "done",
  },
  {
    step: "5. section-manifest.ts",
    detail:
      "loadPublic + loadStatic registered — drives public pages and user-guide.",
    status: "done",
  },
  {
    step: "6. section-registry-sync.js",
    detail: "HeroGradientSliderSection wired for CMS live-edit preview.",
    status: "done",
  },
  {
    step: "7. configs/index.js",
    detail: "Import HERO_GRADIENT_SLIDER_ITEMS_CONFIG if section uses items[].",
    status: "todo",
  },
  {
    step: "8. Tests",
    detail: "map.test.ts, optional PublicSection render test, manifest catalog test.",
    status: "todo",
  },
  {
    step: "9. graphify update client",
    detail: "Refresh architecture graph after new variant lands.",
    status: "todo",
  },
];

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
          Static UI — new section workflow
        </h1>
        <p className="section-theme-muted mt-3 mb-0 max-w-3xl text-sm leading-relaxed">
          Preview below uses baked-in demo slides. On a live page, add a placement
          with <code className="text-xs">section_key</code> and{" "}
          <code className="text-xs">render_key</code> set to{" "}
          <code className="text-xs">hero_gradient_slider</code> — CMS fields can
          stay empty; the static banner still renders.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <h2 className="section-theme-heading m-0 text-sm font-semibold">
            Integration checklist
          </h2>
          <ul className="section-theme-muted mt-4 mb-0 list-none space-y-3 p-0 text-sm">
            {INTEGRATION_CHECKLIST.map((item) => (
              <li key={item.step} className="flex gap-3">
                <span
                  className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    item.status === "done"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : item.status === "partial"
                        ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {item.status}
                </span>
                <div>
                  <p className="section-theme-heading m-0 font-medium">
                    {item.step}
                  </p>
                  <p className="m-0 mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </SectionWrapper>

      <HeroGradientSliderStatic />

      <SectionWrapper className="border-t border-slate-200 py-8 dark:border-slate-800">
        <p className="section-theme-muted m-0 text-sm">
          Files:{" "}
          <code className="text-xs">
            components/sections/hero/hero-gradient-slider/
          </code>
        </p>
      </SectionWrapper>
    </main>
  );
}
