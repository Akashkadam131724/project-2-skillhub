import SectionButtons from "@/components/ui/SectionButtons";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import CtaBandUi from "./CtaBandUi";
import { isCtaBandPlacementShowable } from "./lib/placement";
import type { CtaBandSectionProps } from "./lib/types";

export default function CtaBandPublicSection({
  section_title,
  sub_title,
  data,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: CtaBandSectionProps) {
  if (
    !isCtaBandPlacementShowable(
      { section_title, sub_title, data, buttons, button_title, target_url },
      false
    )
  ) {
    return null;
  }

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <CtaBandUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      body={data?.body}
      footer={
        list.length ? (
          <SectionButtons
            buttons={list}
            onFormOpen={onFormOpen}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          />
        ) : null
      }
    />
  );
}
