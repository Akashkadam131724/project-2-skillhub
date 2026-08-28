import FormSplitUi from "./FormSplitUi";
import { normalizeFormContentSide } from "./lib/content-side";
import { FORM_SPLIT_STATIC_DEMO } from "./lib/static-demo";

export default function FormSplitStatic({
  className,
  id,
}: { className?: string; id?: string } = {}) {
  const demo = FORM_SPLIT_STATIC_DEMO;

  return (
    <FormSplitUi
      id={id}
      className={className}
      contentSide={normalizeFormContentSide(demo.data)}
      title={demo.section_title}
      subtitle={demo.sub_title}
      body={demo.data.body}
      highlights={demo.highlights}
      formTitle={demo.data.form_title}
      formSubtitle={demo.data.form_subtitle}
      formKey={demo.data.form_key}
      submitLabel={demo.data.submit_label}
      successMessage={demo.data.success_message}
    />
  );
}
