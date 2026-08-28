import { DEMO_IMAGES } from "@/lib/demo/shared-demo-images";

export const HERO_MEDIA_STATIC_DEMO = {
  items: [
    {
      id: "slide-1",
      title: "Cloud certification paths",
      subtitle: "AWS, Azure, and GCP—compared side by side",
      body:
        "<p>Help engineers choose the right track with role-based recommendations and live seat availability.</p>",
      image_url: DEMO_IMAGES.heroWorkshop,
      buttons: [
        {
          title: "Browse catalog",
          label: "Browse catalog",
          href: "/catalog",
          target_url: "/catalog",
        },
      ],
    },
    {
      id: "slide-2",
      title: "Leadership development cohorts",
      subtitle: "Instructor-led programs for managers and directors",
      body:
        "<p>Blend vendor content with your internal playbooks in a single learner experience.</p>",
      image_url: DEMO_IMAGES.heroOffice,
      bg_color: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
    },
  ],
};
