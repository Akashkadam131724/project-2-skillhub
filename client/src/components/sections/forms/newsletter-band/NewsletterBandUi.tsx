import { SectionLayoutRoot } from "@/components/sections/layout";
import type { NewsletterBandUiProps } from "./lib/types";

export default function NewsletterBandUi({
  id,
  className = "",
  title,
  subtitle,
  eyebrow = "Stay in the loop",
  titleSlot,
  subtitleSlot,
  placeholder = "Work email",
  readOnly = false,
  formFooter = null,
}: NewsletterBandUiProps) {
  return (
    <SectionLayoutRoot
      id={id}
      className={className}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
      hasBodyContent
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row sm:items-stretch">
        <label className="sr-only" htmlFor="newsletter-email">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          readOnly={readOnly}
          placeholder={placeholder}
          className="section-field min-w-0 flex-1"
        />
        {formFooter}
      </div>
    </SectionLayoutRoot>
  );
}
