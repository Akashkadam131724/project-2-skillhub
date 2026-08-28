import type { SarderEcosystemGroup } from "./types";

export const SARDER_ECOSYSTEM_STATIC_TITLE = "The Sarder Ecosystem";
export const SARDER_ECOSYSTEM_STATIC_SUBTITLE =
  "Unified Ecosystem for AI Readiness";
export const SARDER_ECOSYSTEM_STATIC_LOGO = "/Sarder-R-Logo.png";
export const SARDER_ECOSYSTEM_STATIC_LOGO_ALT = "Sarder logo";

/** Demo groups — assets in `client/public/` (from netcomlearning.com legacy). */
export const SARDER_ECOSYSTEM_STATIC_GROUPS: SarderEcosystemGroup[] = [
  {
    id: "upskill",
    title: "Upskill & Certify at Scale",
    items: [
      {
        id: "netcom",
        logo: "/transparent_1759164909_9032.svg",
        alt: "NetCom Learning",
        label: "Instructor-Led Training",
        href: "https://www.netcomlearning.com/",
        disabled: true,
        logoHeightClass: "h-8 md:h-9",
      },
      {
        id: "netcom-plus",
        logo: "/NetCom-Symbol-R-3.svg",
        alt: "NetCom+",
        label: "Digital eLearning Platform",
        href: "https://www.netcomlearning.com/solutions/nplus",
        logoHeightClass: "h-8 md:h-7",
      },
      {
        id: "ai-certs",
        logo: "/AICerts-2.svg",
        alt: "AI CERTS",
        label: "AI Certifications",
        href: "https://www.netcomlearning.com/vendor/ai-certs-training",
      },
    ],
  },
  {
    id: "enable-ai",
    title: "Enable Enterprise AI Adoption",
    items: [
      {
        id: "ai-labs",
        logo: "/transparent_1759164875_9238.svg",
        alt: "AI Labs 365",
        label: "Labs, Proctoring & Credentialing Apps",
        href: "https://www.ailabs365.ai/",
      },
      {
        id: "adoptify",
        logo: "/Adoptify-AI-R-Logo-1-1.svg",
        alt: "AdoptifyAI",
        label: "AI Adoption Services",
        href: "https://www.netcomlearning.com/solutions/adoptifyai",
      },
    ],
  },
  {
    id: "share-knowledge",
    title: "Share Knowledge & Drive Impact",
    items: [
      {
        id: "sarder-tv",
        logo: "/transparent_1759164916_7652.svg",
        alt: "Sarder TV",
        label: "Media & Thought Leadership",
        href: "https://www.sardertv.com/",
        logoHeightClass: "h-8 md:h-9",
      },
      {
        id: "foundation",
        logo: "/Sarder-Foundation-R-1.svg",
        alt: "Sarder Foundation",
        label: "Non-Profit AI Skilling",
        href: "https://www.sarderfoundation.org/",
        logoHeightClass: "h-8 md:h-9",
      },
    ],
  },
];
