import type { PricingTierUiItem } from "./types";

export const PRICING_TIERS_STATIC_DEMO = {
  title: "Delivery options",
  subtitle: "Static demo via PricingTiersStatic — no API.",
  items: [
    {
      id: "pt1",
      title: "Starter",
      price: "$99",
      period: "/mo",
      features: ["Core catalog access", "Email support", "Up to 10 learners"],
      featured: false,
      href: "/courses",
      ctaLabel: "Get started",
    },
    {
      id: "pt2",
      title: "Team",
      price: "$299",
      period: "/mo",
      features: [
        "Everything in Starter",
        "Private cohorts",
        "Dedicated advisor",
      ],
      featured: true,
      href: "/contact-us",
      ctaLabel: "Get started",
    },
    {
      id: "pt3",
      title: "Enterprise",
      price: "Custom",
      period: "",
      features: ["SSO & compliance", "Custom reporting", "SLA support"],
      featured: false,
      href: "/contact-us",
      ctaLabel: "Talk to us",
    },
  ] satisfies PricingTierUiItem[],
};
