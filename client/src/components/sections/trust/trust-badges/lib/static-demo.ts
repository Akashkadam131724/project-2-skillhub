import type { TrustBadgeUiItem } from "./types";

/** Hard-coded trust badges — used by {@link TrustBadgesStatic}. */
export const TRUST_BADGES_STATIC_DEMO = {
  title: "Enterprise-ready",
  subtitle: "Compliance and security signals — static demo.",
  items: [
    { id: "t1", title: "SOC 2", subtitle: "Type II", value: "SOC2" },
    { id: "t2", title: "GDPR", subtitle: "EU ready", value: "GDPR" },
    { id: "t3", title: "ISO 27001", subtitle: "Certified", value: "ISO" },
    { id: "t4", title: "WCAG", subtitle: "AA target", value: "A11y" },
  ] satisfies TrustBadgeUiItem[],
};
