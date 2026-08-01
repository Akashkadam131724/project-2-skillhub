/**
 * Static header links — SkillHub project & showcase pages (not API / mega-menu).
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

/** Links for homepage spotlight cards (everything except Home). */
export const PROJECT_HOME_LINKS = PROJECT_NAV_LINKS.filter((l) => l.href !== "/");
