export const PROMO_MODAL_STATIC_DEMO = {
  section_title: "Spring skill fest — 20% off cohorts",
  sub_title: "Limited-time offer for enterprise teams.",
  data: {
    body: "<p>Book a planning call this month and save on instructor-led delivery.</p>",
    open_delay_ms: 1200,
    storage_key: "showcase_promo_modal",
  },
  buttons: [
    {
      label: "Claim offer",
      target_url: "/contact-us",
      variant: "primary",
    },
    {
      label: "Maybe later",
      variant: "secondary",
      action_type: "anchor",
      target_id: "cms-section",
    },
  ],
};
