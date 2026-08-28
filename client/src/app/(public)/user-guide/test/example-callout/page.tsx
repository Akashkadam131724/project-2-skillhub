import type { Metadata } from "next";
import Link from "next/link";
import { ExampleCalloutStatic } from "@/components/sections/test/example-callout";
import { EXAMPLE_CALLOUT_BLUEPRINT } from "@/components/sections/test/example-callout";
import SectionWrapper from "@/components/sections/SectionWrapper";
import GuideStepsPanel, {
  type GuideStep,
} from "@/app/(public)/user-guide/_components/GuideStepsPanel";
import { stepsForBlueprint } from "@/lib/sections/test";

export const metadata: Metadata = {
  title: "Example callout (test) · SkillHub",
  description: "Minimal sandbox section — static archetype, page-alt band.",
};

const BUILD_STEPS: GuideStep[] = [
  {
    title: "Copy _template/",
    detail:
      "cp -R components/sections/test/_template components/sections/test/your-name — rename TemplateBand → YourSection.",
    status: "done",
  },
  {
    title: "section.blueprint.ts",
    detail: `Archetype: ${EXAMPLE_CALLOUT_BLUEPRINT.archetype}, band: ${EXAMPLE_CALLOUT_BLUEPRINT.band}, key: ${EXAMPLE_CALLOUT_BLUEPRINT.key}.`,
    status: "done",
  },
  {
    title: "Ui + Static + Public",
    detail:
      "ExampleCalloutUi (pure layout), ExampleCalloutStatic (demo), ExampleCalloutPublicSection (placement adapter).",
    status: "done",
  },
  {
    title: "lib/cms-capabilities.ts",
    detail:
      "resolveBlueprintCmsCapabilities(blueprint) — static mode until you switch archetype.",
    status: "done",
  },
  {
    title: "Preview page",
    detail: "This page — import *Static directly; no manifest required for sandbox.",
    status: "done",
  },
  {
    title: "Promote (when ready)",
    detail:
      "Add catalog row, section-manifest.ts, registry-sync, server catalog — see /user-guide/test.",
    status: "todo",
  },
];

const CMS_STEPS: GuideStep[] = [
  {
    title: "Not in CMS yet",
    detail:
      "test_example_callout is sandbox-only. Promote using the integration checklist before adding DB rows.",
  },
];

export default function ExampleCalloutTestPage() {
  const promoteSteps = stepsForBlueprint(EXAMPLE_CALLOUT_BLUEPRINT);

  return (
    <main className="min-h-screen bg-transparent">
      <SectionWrapper className="py-8 sm:py-10">
        <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          <Link href="/user-guide/test" className="hover:underline">
            Test sandbox
          </Link>
          {" / Example callout"}
        </p>
        <h1 className="section-theme-heading mt-2 mb-0 text-2xl font-semibold tracking-tight sm:text-3xl">
          Example callout
        </h1>
        <p className="section-theme-muted mt-3 mb-0 max-w-3xl text-sm leading-relaxed">
          Minimal reference section. Behavior key:{" "}
          <code className="text-xs">test_example_callout</code> (not in production
          catalog).
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <GuideStepsPanel title="Sandbox — build here" steps={BUILD_STEPS} />
          <GuideStepsPanel title="CMS — after promotion" steps={CMS_STEPS} />
        </div>

        <div className="section-theme-muted mt-6 rounded-2xl border border-slate-200 p-5 text-sm dark:border-slate-800">
          <p className="section-theme-heading m-0 font-medium">
            Steps when promoting ({promoteSteps.length} files)
          </p>
          <ul className="m-0 mt-3 list-disc space-y-1 pl-5 text-xs">
            {promoteSteps.map((step) => (
              <li key={step.id}>
                <code>{step.file}</code>
              </li>
            ))}
          </ul>
        </div>
      </SectionWrapper>

      <ExampleCalloutStatic />

      <SectionWrapper className="border-t border-slate-200 py-8 dark:border-slate-800">
        <p className="section-theme-muted m-0 text-sm">
          Source:{" "}
          <code className="text-xs">components/sections/test/example-callout/</code>
        </p>
      </SectionWrapper>
    </main>
  );
}
