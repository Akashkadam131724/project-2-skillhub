/**
 * Canonical Content routes for the business site.
 * Purge step deletes any Content.path not in this set (home `/` always kept).
 */

import { COMPONENT_PATHS } from "../lib/component-gallery-content-pages.js";
import { NETCOM_CATEGORY_PATHS } from "../lib/netcom-category-content-pages.js";
import { PROJECT_NAV_CONTENT_PATHS } from "../lib/project-nav-links.js";

/** @type {readonly string[]} */
export const PROJECT_SHOWCASE_PATHS = [
  ...PROJECT_NAV_CONTENT_PATHS,
  "/sections/hero",
  "/sections/content",
  "/sections/features",
  "/sections/tabs",
  "/sections/accordion",
  "/sections/catalog",
  "/sections/social-proof",
  "/sections/data",
  "/sections/navigation",
  "/sections/overlays",
  "/sections/forms",
  "/sections/comparison",
  "/sections/media",
  "/sections/timeline",
  "/sections/pricing",
  "/sections/trust",
  "/sections/cta",
  "/sections/learning",
];

/** @type {readonly string[]} */
export { COMPONENT_PATHS, NETCOM_CATEGORY_PATHS, PROJECT_SHOWCASE_PATHS };

/** @type {readonly string[]} */
export const SOLUTION_PATHS = [
  "/solutions",
  "/solutions/business-ai",
  "/solutions/architecture-design",
  "/solutions/cloud",
  "/solutions/health",
  "/solutions/leadership",
  "/solutions/networking",
  "/solutions/security",
  "/solutions/technology",
  "/solutions/web",
];

/** @type {readonly string[]} */
export const SHOWCASE_PATHS = [
  "/showcase",
  "/showcase/cms-live-editing",
  "/showcase/section-library",
  "/showcase/themes-and-surfaces",
  "/showcase/entity-pages",
  "/showcase/content-feed",
  "/showcase/navigation",
];

/** @type {readonly string[]} */
export const CAMPAIGN_PATHS = [
  "/campaigns",
  "/campaigns/microsoft-skill-fest",
  "/campaigns/aws-cloud-day",
  "/campaigns/security-awareness-month",
  "/campaigns/ai-data-academy",
  "/campaigns/cisco-networking-sprint",
];

/** @type {readonly string[]} */
export const INSIGHT_PATHS = [
  "/insights",
  "/insights/ai-brain-compute",
  "/insights/ai-chatbots-workforce",
  "/insights/human-ai-collaboration",
  "/insights/remote-work-productivity",
  "/insights/smart-manufacturing",
  "/insights/ai-upskilling",
  "/insights/smart-cities",
  "/insights/ai-customer-support",
  "/insights/future-of-work",
  "/insights/data-driven-decisions",
  "/insights/ai-innovation",
  "/insights/responsible-ai",
  "/insights/ai-infrastructure",
  "/insights/mobile-learning",
  "/insights/ml-operations",
  "/insights/neuromorphic-computing",
  "/insights/digital-assistants",
  "/insights/data-driven-growth",
  "/insights/creative-ai-teams",
  "/insights/ai-knowledge-management",
];

/** @type {readonly string[]} */
export const PROMOTION_PATHS = [
  "/promotions",
  "/promotions/enterprise-pilot",
  "/promotions/certification-sprint",
  "/promotions/q3-learning-credit",
  "/promotions/healthcare-compliance-pack",
];

/** @type {readonly string[]} */
export const CORE_CONTENT_PATHS = [
  "/",
  "/about-us",
  "/our-team",
  "/company/careers",
  "/contact-us",
  "/get-started",
  "/courses",
  "/vendors",
  "/products",
  "/industries",
  "/skilling-areas",
  "/blogs",
  ...SOLUTION_PATHS,
  ...SHOWCASE_PATHS,
  ...CAMPAIGN_PATHS,
  ...PROMOTION_PATHS,
  ...INSIGHT_PATHS,
  ...COMPONENT_PATHS,
  ...NETCOM_CATEGORY_PATHS,
  ...PROJECT_SHOWCASE_PATHS,
];

export function isAllowedContentPath(pathname) {
  const p = String(pathname || "").trim();
  if (!p || p === "/") return true;
  return CORE_CONTENT_PATHS.includes(p);
}
