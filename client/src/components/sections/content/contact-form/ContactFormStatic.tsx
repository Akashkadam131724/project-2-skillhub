import ContactFormUi from "./ContactFormUi";
import { CONTACT_FORM_STATIC_DEMO } from "./lib/static-demo";

export default function ContactFormStatic({
  className,
  id,
}: { className?: string; id?: string } = {}) {
  return (
    <ContactFormUi
      id={id}
      title={CONTACT_FORM_STATIC_DEMO.title}
      subtitle={CONTACT_FORM_STATIC_DEMO.subtitle}
      body={CONTACT_FORM_STATIC_DEMO.body}
      successNote={CONTACT_FORM_STATIC_DEMO.successNote}
      channels={CONTACT_FORM_STATIC_DEMO.channels}
      className={className}
    />
  );
}
