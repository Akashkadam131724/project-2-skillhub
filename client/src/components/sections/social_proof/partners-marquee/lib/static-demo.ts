import type { PartnerLogoUiItem } from "./types";

export const PARTNERS_MARQUEE_STATIC_DEMO = {
  title: "Trusted by industry leaders",
  subtitle: "Enterprise teams across finance, tech, and healthcare.",
  items: [
    {
      id: "p1",
      name: "Amazon",
      imageUrl:
        "https://images.netcomlearning.com/cms/logos/amazon-logo-training-partner.png",
    },
    {
      id: "p2",
      name: "Deloitte",
      imageUrl:
        "https://images.netcomlearning.com/cms/logos/deloitte-logo-training-partner.png",
    },
  ] satisfies PartnerLogoUiItem[],
};
