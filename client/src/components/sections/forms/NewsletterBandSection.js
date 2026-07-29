"use client";

import SectionFrame from "../SectionFrame";
import SectionButtons from "@/components/ui/SectionButtons";
import { sortActiveButtons, buttonsFromLegacy } from "@/lib/button-types";

/**
 * Newsletter / lead capture band — decorative form + section-level CTAs.
 */
export default function NewsletterBandSection({
  section_title,
  sub_title,
  data = {},
  buttons,
  button_title,
  target_url,
  cmsMode,
  onEditField,
  onFormOpen,
  ...frameProps
}) {
  const placeholder = data.email_placeholder || "Work email";
  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <SectionFrame
      title={section_title}
      subtitle={sub_title}
      eyebrow="Stay in the loop"
      cmsMode={cmsMode}
      onEditField={onEditField}
      buttonsFooter={false}
      {...frameProps}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row sm:items-stretch">
        <label className="sr-only" htmlFor="newsletter-email">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          readOnly={!cmsMode}
          placeholder={placeholder}
          className="section-field min-w-0 flex-1"
        />
        {list.length ? (
          <SectionButtons
            buttons={list}
            onFormOpen={onFormOpen}
            className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-nowrap"
          />
        ) : cmsMode ? (
          <p className="self-center text-xs text-slate-400 italic">Add section buttons for submit CTA</p>
        ) : null}
      </div>
    </SectionFrame>
  );
}
