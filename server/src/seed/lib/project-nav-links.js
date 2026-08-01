/**
 * Static project / showcase nav — keep in sync with client/src/lib/project-nav-links.js
 */

export const PROJECT_NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Catalog", href: "/catalog" },
  { name: "How it works", href: "/how-it-works" },
  { name: "Catalog guide", href: "/catalog-guide" },
  { name: "Sections", href: "/sections" },
  { name: "Components", href: "/components" },
  { name: "Visual guides", href: "/insights" },
  { name: "Showcase", href: "/showcase" },
  { name: "Learning campus", href: "/learning-campus" },
  { name: "Odyssey", href: "/odyssey" },
];

/** Showcase seed steps that back the static nav (run via static-showcase-pages). */
export const PROJECT_NAV_SHOWCASE_SEED_STEPS = [
  "how-it-works",
  "catalog-guide",
  "cms-preview",
  "odyssey",
  "learning-campus",
  "sections-showcase",
];

/** Content paths for static nav (excludes Home and CMS admin routes). */
export const PROJECT_NAV_CONTENT_PATHS = PROJECT_NAV_LINKS.map((l) => l.href).filter(
  (href) => href !== "/" && !href.startsWith("/cms")
);
