import FormSplitUi from "./FormSplitUi";
import { normalizeFormContentSide } from "./lib/content-side";
import { resolveFormHighlightUiItems } from "./lib/map";
import { isFormSplitPlacementShowable } from "./lib/placement";
import type { FormSplitSectionProps } from "./lib/types";

export default function FormSplitPublicSection({
  section_title,
  sub_title,
  data = {},
  items: mappingItems,
  section_key = "form_split",
  id,
}: FormSplitSectionProps) {
  if (
    !isFormSplitPlacementShowable(
      {
        section_title,
        sub_title,
        data,
        items: mappingItems,
        section_key,
      },
      false
    )
  ) {
    return null;
  }

  const body = data?.body || "";
  const contentSide = normalizeFormContentSide(data);
  const highlights = resolveFormHighlightUiItems(section_key, mappingItems);

  return (
    <FormSplitUi
      id={id}
      contentSide={contentSide}
      title={section_title}
      subtitle={sub_title}
      body={body}
      highlights={highlights}
      formTitle={data?.form_title || "Send a message"}
      formSubtitle={data?.form_subtitle || ""}
      formKey={data?.form_key || "lead"}
      submitLabel={data?.submit_label || "Submit"}
      successMessage={data?.success_message}
    />
  );
}
