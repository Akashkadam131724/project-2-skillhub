/**
 * Ordered seed pipeline. Paths are relative to `src/seed/`.
 *
 * Profiles:
 *   core     — full reset path (catalog replace, pages wipe, …)
 *   replenish — same order as core but SEED_SAFE=1 (no section/catalog/nav wipe)
 *   showcase — optional demo/marketing content pages (heavy)
 *   full     — same as core (use showcase profile for demo pages)
 *
 * Warning: `cms/page-section` wipes ALL Page, Section, and EntityPageSection rows.
 * Run entity + layout steps after it in the same pipeline.
 */

/** @typedef {{ id: string, label: string, script: string, profiles: string[] }} SeedStep */

/** @type {SeedStep[]} */
export const SEED_STEPS = [
  // —— 1. Catalog data (no CMS placements) ——
  {
    id: "vendors",
    label: "Vendors",
    script: "steps/01-catalog/vendor.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "products",
    label: "Products",
    script: "steps/01-catalog/product.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "skilling-areas",
    label: "Skilling areas",
    script: "steps/01-catalog/skilling-area.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "skill-levels",
    label: "Skill levels",
    script: "steps/01-catalog/skill-level.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "industries",
    label: "Industries",
    script: "steps/01-catalog/industry.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "courses",
    label: "Courses",
    script: "steps/01-catalog/course.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "blogs",
    label: "Blogs (+ blog detail EntityPageSection)",
    script: "steps/01-catalog/blog.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "contents",
    label: "Content routes (home, etc.)",
    script: "steps/01-catalog/content.seed.js",
    profiles: ["core", "full", "replenish"],
  },

  // —— 2. CMS foundation (destructive: pages + sections + all EPS) ——
  {
    id: "pages",
    label: "Page templates + section catalog (WIPES CMS)",
    script: "steps/02-cms/page-section.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "section-categories",
    label: "Section categories from catalog meta",
    script: "steps/02-cms/section-categories.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "section-tags",
    label: "Section category/tags backfill",
    script: "steps/02-cms/section-tags.seed.js",
    profiles: ["core", "full", "replenish"],
  },

  // —— 3. Home template section upserts (Section.pages tags) ——
  {
    id: "heroes",
    label: "Home hero section variants",
    script: "steps/03-home/hero.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "partners",
    label: "Partners sections",
    script: "steps/03-home/partners.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "cards",
    label: "Card sections",
    script: "steps/03-home/cards.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "in-page-nav",
    label: "In-page nav sections",
    script: "steps/03-home/in-page-nav.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "testimonials",
    label: "Testimonials sections",
    script: "steps/03-home/testimonials.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "page-testimonials",
    label: "Page testimonials section",
    script: "steps/03-home/page-testimonials.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "stats",
    label: "Stats sections",
    script: "steps/03-home/stats.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "why-choose",
    label: "Why choose sections",
    script: "steps/03-home/why-choose.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "text-media",
    label: "Text/media sections",
    script: "steps/03-home/text-media.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "home-explore-tabs",
    label: "Home explore tabs",
    script: "steps/03-home/home-explore-tabs.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "tabs-sections",
    label: "Tab section definitions",
    script: "steps/03-home/tabs-sections.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "homepage-cleanup",
    label: "Homepage copy/images cleanup",
    script: "steps/03-home/homepage-cleanup.seed.js",
    profiles: ["core", "full", "replenish"],
  },

  // —— 4. EntityPageSection for vendor / product / course ——
  {
    id: "entity-cms",
    label: "Entity CMS overrides (vendor, product, course)",
    script: "steps/04-entity/entity-cms.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "entity-skilling-industry-cms",
    label: "Entity CMS overrides (skilling area, industry)",
    script: "steps/04-entity/entity-skilling-industry-cms.seed.js",
    profiles: ["core", "full", "replenish"],
  },

  // —— 5. Content & catalog page layouts (EntityPageSection per Content) ——
  {
    id: "content-pages",
    label: "Marketing content pages (/about-us, …)",
    script: "steps/05-layouts/content-pages.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "content-pages-from-manifest",
    label: "Solution pages from uploads manifest",
    script: "steps/05-layouts/content-pages-from-manifest.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "showcase-pages",
    label: "Platform showcase content pages",
    script: "steps/05-layouts/showcase-pages.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "campaign-promotion-pages",
    label: "Campaign & promotion content pages",
    script: "steps/05-layouts/campaign-promotion-pages.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "png-insights-pages",
    label: "PNG visual insight pages (/insights)",
    script: "steps/05-layouts/png-insights-pages.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "component-gallery-pages",
    label: "Component gallery (all categories per page)",
    script: "steps/05-layouts/component-gallery-pages.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "netcom-category-pages",
    label: "NetCom CMS category content pages",
    script: "steps/05-layouts/netcom-category-pages.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "static-showcase-pages",
    label: "Static nav showcase pages (how-it-works, sections, …)",
    script: "steps/05-layouts/static-showcase-pages.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "home-insights-spotlight",
    label: "Homepage insights spotlight",
    script: "steps/03-home/home-insights-spotlight.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "home-project-links",
    label: "Homepage project / showcase link cards",
    script: "steps/03-home/home-project-links.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "catalog-pages",
    label: "Catalog hub content pages",
    script: "steps/05-layouts/catalog-pages.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "contact-us",
    label: "Contact us section tags",
    script: "steps/05-layouts/contact-us.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "contact-page",
    label: "Contact page content + EPS",
    script: "steps/05-layouts/contact-page.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "content-missing-eps",
    label: "Backfill EPS for empty content URLs",
    script: "steps/05-layouts/content-missing-eps.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "content-purge",
    label: "Remove non-business content pages",
    script: "steps/05-layouts/content-purge.seed.js",
    profiles: ["core", "full", "replenish"],
  },

  // —— 6. Section library + site chrome ——
  {
    id: "section-library",
    label: "Section library showcase (page_key section)",
    script: "steps/06-site/section-library.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "section-previews",
    label: "Section catalog previews (uploads/section-previews)",
    script: "steps/06-site/section-preview-images.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "site-theme",
    label: "Site theme defaults",
    script: "steps/06-site/site-theme.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "theme-inherit-reset",
    label: "Reset themes to inherit site (clears entity overrides)",
    script: "steps/06-site/theme-inherit-reset.seed.js",
    profiles: ["core", "full", "replenish"],
  },
  {
    id: "navigation",
    label: "Header/footer navigation",
    script: "steps/06-site/navigation.seed.js",
    profiles: ["core", "full", "replenish"],
  },

  // —— Optional / dev-only ——
  {
    id: "cms-content",
    label: "Single-vendor CMS demo (Microsoft)",
    script: "steps/04-entity/cms-content.seed.js",
    profiles: [],
  },
  {
    id: "restore-home-page",
    label: "Restore home vs content template split",
    script: "steps/03-home/restore-home-page.seed.js",
    profiles: [],
  },
  {
    id: "blogs-batch",
    label: "50 extra blog posts",
    script: "steps/01-catalog/blog-batch.seed.js",
    profiles: [],
  },

  // —— Showcase demo pages (optional) ——
  {
    id: "modern-pages",
    label: "Modern pages demo",
    script: "steps/07-showcase/modern-pages.seed.js",
    profiles: ["showcase"],
  },
  {
    id: "trend-pages",
    label: "Trend pages demo",
    script: "steps/07-showcase/trend-pages.seed.js",
    profiles: ["showcase"],
  },
  {
    id: "squarespace-inspired",
    label: "Squarespace-inspired demo",
    script: "steps/07-showcase/squarespace-inspired.seed.js",
    profiles: ["showcase"],
  },
  {
    id: "learning-campus",
    label: "Learning campus demo",
    script: "steps/07-showcase/learning-campus.seed.js",
    profiles: ["showcase"],
  },
  {
    id: "how-it-works",
    label: "How it works long-form page",
    script: "steps/07-showcase/how-it-works.seed.js",
    profiles: ["showcase"],
  },
  {
    id: "odyssey",
    label: "Odyssey promo page",
    script: "steps/07-showcase/odyssey.seed.js",
    profiles: ["showcase"],
  },
  {
    id: "catalog-guide",
    label: "Catalog guide page",
    script: "steps/07-showcase/catalog-guide.seed.js",
    profiles: ["showcase"],
  },
  {
    id: "sections-showcase",
    label: "Sections showcase page",
    script: "steps/07-showcase/sections-showcase.seed.js",
    profiles: ["showcase"],
  },
  {
    id: "tabs-showcase",
    label: "Tabs showcase page",
    script: "steps/07-showcase/tabs-showcase.seed.js",
    profiles: ["showcase"],
  },
  {
    id: "cms-preview",
    label: "CMS preview marketing page",
    script: "steps/07-showcase/cms-preview.seed.js",
    profiles: ["showcase"],
  },
  {
    id: "home-how-it-works",
    label: "Home how-it-works block",
    script: "steps/03-home/home-how-it-works.seed.js",
    profiles: ["showcase"],
  },
];

export const PROFILE_ALIASES = {
  all: "full",
  default: "core",
  safe: "replenish",
};

export function stepsForProfile(profile) {
  const key = PROFILE_ALIASES[profile] || profile;
  return SEED_STEPS.filter((s) => s.profiles.includes(key));
}

export function stepById(id) {
  return SEED_STEPS.find((s) => s.id === id);
}
