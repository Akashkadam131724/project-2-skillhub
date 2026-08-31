import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";

export type PlacementButtonsInput = {
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
};

/** Resolve active section buttons from CMS array or legacy title/url fields. */
export function resolvePlacementButtons({
  buttons,
  button_title,
  target_url,
}: PlacementButtonsInput) {
  return sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );
}

export type PublicSectionButtonsFooterProps = PlacementButtonsInput & {
  onFormOpen?: (formKey: string, button?: unknown) => void;
  inverted?: boolean;
  surface?: string;
  className?: string;
  buttonsClassName?: string;
};

/** Public-page section footer — wraps {@link SectionButtonsFooter} (no CMS manage bar). */
export function publicSectionButtonsFooter({
  buttons,
  button_title,
  target_url,
  onFormOpen,
  inverted = false,
  surface = "inherit",
  className = "mt-6 sm:mt-8",
  buttonsClassName = "flex flex-wrap items-center gap-3",
}: PublicSectionButtonsFooterProps) {
  return (
    <SectionButtonsFooter
      buttons={buttons}
      button_title={button_title}
      target_url={target_url}
      onFormOpen={onFormOpen}
      inverted={inverted}
      surface={surface}
      cmsMode={false}
      className={className}
      buttonsClassName={buttonsClassName}
    />
  );
}
