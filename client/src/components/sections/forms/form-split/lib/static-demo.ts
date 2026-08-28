import type { FormHighlightUiItem } from "./types";

export const FORM_SPLIT_STATIC_DEMO = {
  section_title: "Talk to a learning advisor",
  sub_title:
    "Content on one side, a short static form on the other — flip columns in CMS.",
  data: {
    content_side: "left",
    form_key: "lead",
    form_title: "Request a callback",
    form_subtitle: "Share a few details and we will reach out.",
    submit_label: "Send message",
    success_message:
      "Thanks — your message is in. We will respond within one business day.",
    body: "<p>Prefer a call? Mention your timezone in the message field.</p>",
  },
  highlights: [
    {
      id: "fs1",
      title: "Enterprise rollouts",
      subtitle: "Cohort planning & vendor alignment",
    },
    {
      id: "fs2",
      title: "CMS & content pages",
      subtitle: "Live editing on public URLs",
    },
  ] satisfies FormHighlightUiItem[],
};
