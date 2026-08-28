import { normalizeButton } from "@/lib/utils/button-types";

/** Sample buttons for the action-type gallery. */
export const BUTTON_ACTION_DEMOS = {
  url: normalizeButton({
    label: "Browse catalog",
    variant: "primary",
    icon: "arrow-right",
    action_type: "url",
    target_url: "/catalog",
  }),
  anchor: normalizeButton({
    label: "Jump to builder",
    variant: "outline",
    icon: "anchor",
    action_type: "anchor",
    target_id: "button-builder",
  }),
  form: normalizeButton({
    label: "Request demo",
    variant: "secondary",
    icon: "form",
    action_type: "form",
    form_key: "contact",
  }),
  youtube: normalizeButton({
    label: "Watch overview",
    variant: "primary",
    icon: "youtube",
    action_type: "youtube",
    target_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  }),
  email: normalizeButton({
    label: "Email sales",
    variant: "ghost",
    icon: "mail",
    action_type: "email",
    target_url: "sales@skillhub.example",
  }),
  phone: normalizeButton({
    label: "Call us",
    variant: "ghost",
    icon: "phone",
    action_type: "phone",
    target_url: "+1-800-555-0199",
  }),
  download: normalizeButton({
    label: "Download syllabus",
    variant: "outline",
    icon: "pdf",
    action_type: "download",
    target_url: "/files/skillhub-syllabus.pdf",
    download_filename: "skillhub-syllabus.pdf",
  }),
  scroll_top: normalizeButton({
    label: "Back to top",
    variant: "link",
    icon: "arrow-up",
    action_type: "scroll_top",
  }),
};

export const BUTTON_BUILDER_STARTER = [
  normalizeButton({
    label: "Get started",
    variant: "primary",
    size: "md",
    shape: "rounded",
    icon: "arrow-right",
    icon_position: "end",
    action_type: "url",
    target_url: "/get-started",
    sort_order: 0,
  }),
  normalizeButton({
    label: "Talk to sales",
    variant: "outline",
    size: "md",
    shape: "rounded",
    icon: "none",
    action_type: "form",
    form_key: "contact",
    sort_order: 1,
  }),
];
