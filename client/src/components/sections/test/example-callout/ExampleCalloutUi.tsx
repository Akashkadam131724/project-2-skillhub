import SectionWrapper from "@/components/sections/SectionWrapper";
import type { ExampleCalloutUiProps } from "./lib/types";

/**
 * Pure layout — no CMS imports. All test sections start here.
 */
export default function ExampleCalloutUi({
  eyebrow = "Section",
  title,
  body,
  id,
  className = "",
}: ExampleCalloutUiProps) {
  return (
    <section
      id={id || undefined}
      className={`relative w-full overflow-hidden bg-transparent py-12 sm:py-16 ${className}`.trim()}
    >
      <SectionWrapper>
        <div className="section-ui-card rounded-2xl border p-6 sm:p-8 lg:p-10">
          {eyebrow ? (
            <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="section-theme-heading m-0 mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h2>
          ) : null}
          {body ? (
            <p className="section-theme-muted m-0 mt-3 max-w-2xl text-base leading-relaxed">
              {body}
            </p>
          ) : null}
        </div>
      </SectionWrapper>
    </section>
  );
}
