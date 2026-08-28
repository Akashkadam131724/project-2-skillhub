import ContactUsUi from "./ContactUsUi";
import { CONTACT_US_STATIC_DEMO } from "./lib/static-demo";

export default function ContactUsStatic() {
  return (
    <ContactUsUi
      title={CONTACT_US_STATIC_DEMO.section_title}
      subtitle={CONTACT_US_STATIC_DEMO.sub_title}
      body={CONTACT_US_STATIC_DEMO.data.body}
      items={CONTACT_US_STATIC_DEMO.items}
    />
  );
}
