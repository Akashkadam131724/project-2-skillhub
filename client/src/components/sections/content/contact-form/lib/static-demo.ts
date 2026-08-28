import type { ContactChannelUiItem } from "./types";

export const CONTACT_FORM_STATIC_DEMO = {
  title: "Get in touch",
  subtitle: "Static demo via ContactFormStatic — no API.",
  body: "<p>Reach our team for demos, partnerships, or support.</p>",
  successNote:
    "Thanks — your inquiry is in. A SkillHub specialist will follow up within one business day.",
  channels: [
    {
      id: "cf1",
      icon: "email",
      title: "Email",
      subtitle: "hello@skillhub.example",
      href: "mailto:hello@skillhub.example",
    },
    {
      id: "cf2",
      icon: "phone",
      title: "Phone",
      subtitle: "+1 (555) 010-2000",
      href: "tel:+15550102000",
    },
  ] satisfies ContactChannelUiItem[],
};
