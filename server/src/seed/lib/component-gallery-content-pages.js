import { btn, item } from "./content-page-seed-helpers.js";
import { SECTION_CATEGORIES } from "../../modules/cms/section.catalog.js";
import {
  buildShowcasePlacement,
  sectionsInCategory,
  SECTION_NAMES,
  CATEGORY_SLUG,
} from "./section-showcase-samples.js";
import {
  loadUploadsManifest,
  findAssetFolder,
  pickFolderImages,
  listFolderFiles,
} from "./upload-manifest.js";

/** Section keys that use a band-level hero image. */
const HERO_IMAGE_KEYS = new Set([
  "hero_classic",
  "hero_split",
  "hero_centered",
  "hero_minimal",
  "hero_media",
  "hero_stats",
  "hero_asymmetric",
  "hero_dual_cta",
  "editorial_banner",
  "statement_band",
  "orbit_hero",
  "site_builder_hero",
  "video_banner",
  "split_narrative",
  "form_split",
]);

/** @typedef {{ id: string, label: string, folderId: string, path: string, slug: string, name: string, description: string, sortOrder: number, pageIndex: number }} ComponentThemePageDef */

/** Theme pages — one per uploads manifest asset library. */
export const COMPONENT_THEME_PAGES = [
  {
    id: "business-ai",
    folderId: "business-ai",
    path: "/components/business-ai",
    slug: "components-business-ai",
    name: "Business AI Components",
    description: "Full-page layout demo — one section from every CMS category, themed with Business AI photography.",
    sortOrder: 710,
    pageIndex: 0,
  },
  {
    id: "business-ai-pngs",
    folderId: "business-ai-pngs",
    path: "/components/business-ai-pngs",
    slug: "components-business-ai-pngs",
    name: "Business AI PNG Components",
    description: "Transparent PNG artwork across every section category — AI illustrations from uploads/PNGs.",
    sortOrder: 720,
    pageIndex: 1,
  },
  {
    id: "business-architecture-design",
    folderId: "business-architecture-design",
    path: "/components/architecture-design",
    slug: "components-architecture-design",
    name: "Architecture & Design Components",
    description: "Section library walkthrough with architecture and design imagery from local uploads.",
    sortOrder: 730,
    pageIndex: 2,
  },
  {
    id: "business-cloud",
    folderId: "business-cloud",
    path: "/components/cloud",
    slug: "components-cloud",
    name: "Cloud Components",
    description: "Every CMS section category on one page — cloud-themed heroes, cards, and galleries.",
    sortOrder: 740,
    pageIndex: 3,
  },
  {
    id: "business-health",
    folderId: "business-health",
    path: "/components/health",
    slug: "components-health",
    name: "Healthcare Components",
    description: "Healthcare skilling imagery wired into all 18 section categories.",
    sortOrder: 750,
    pageIndex: 4,
  },
  {
    id: "business-leadership",
    folderId: "business-leadership",
    path: "/components/leadership",
    slug: "components-leadership",
    name: "Leadership Components",
    description: "Leadership and business imagery across the full section component catalog.",
    sortOrder: 760,
    pageIndex: 5,
  },
  {
    id: "business-networking",
    folderId: "business-networking",
    path: "/components/networking",
    slug: "components-networking",
    name: "Networking Components",
    description: "Networking-themed component page — hero, tabs, catalog, social proof, and more.",
    sortOrder: 770,
    pageIndex: 6,
  },
  {
    id: "business-pngs",
    folderId: "business-pngs",
    path: "/components/business-pngs",
    slug: "components-business-pngs",
    name: "Business PNG Components",
    description: "General business PNG illustrations applied to every section category.",
    sortOrder: 780,
    pageIndex: 7,
  },
  {
    id: "business-general-pngs",
    folderId: "business-general-pngs",
    path: "/components/general-pngs",
    slug: "components-general-pngs",
    name: "General PNG Components",
    description: "Transparent PNG assets from the general business library on a full category stack.",
    sortOrder: 790,
    pageIndex: 8,
  },
  {
    id: "business-security",
    folderId: "business-security",
    path: "/components/security",
    slug: "components-security",
    name: "Security Components",
    description: "Security-themed section showcase — one layout per CMS category.",
    sortOrder: 800,
    pageIndex: 9,
  },
  {
    id: "business-stock",
    folderId: "business-stock",
    path: "/components/stock",
    slug: "components-stock",
    name: "Stock Photo Components",
    description: "Stock photography from uploads applied across all section types.",
    sortOrder: 810,
    pageIndex: 10,
  },
  {
    id: "business-tech",
    folderId: "business-tech",
    path: "/components/technology",
    slug: "components-technology",
    name: "Technology Components",
    description: "Technology imagery on a page that exercises every section category.",
    sortOrder: 820,
    pageIndex: 11,
  },
  {
    id: "business-web",
    folderId: "business-web",
    path: "/components/web",
    slug: "components-web",
    name: "Web & Digital Components",
    description: "Digital and web-themed assets across the complete section library.",
    sortOrder: 830,
    pageIndex: 12,
  },
];

function themeImages(folderId, count = 24) {
  const m = loadUploadsManifest();
  const folder = findAssetFolder(m, folderId);
  if (!folder) return pickFolderImages("business-ai", m, count, 0);
  const files = listFolderFiles(folder, { kinds: ["photo", "raster"] });
  if (files.length >= count) {
    return files.slice(0, count).map((f) => f.url);
  }
  const picked = pickFolderImages(folderId, m, count, 0);
  return picked.length ? picked : pickFolderImages("business-ai", m, count, 0);
}

function nextImage(images, state) {
  const url = images[state.i % images.length] || "";
  state.i += 1;
  return url;
}

function applyUploadImages(placement, images, state) {
  const key = placement.section_key;

  if (HERO_IMAGE_KEYS.has(key) || placement.section_img_url) {
    placement.section_img_url = nextImage(images, state);
  }

  if (Array.isArray(placement.items)) {
    for (const row of placement.items) {
      const usesImage =
        row.image_url ||
        HERO_IMAGE_KEYS.has(key) ||
        [
          "text_media",
          "feature_spotlight",
          "training_options",
          "team",
          "bento_grid",
          "pillar_destinations",
          "media_mosaic",
          "horizon_gallery",
          "template_gallery",
          "cast_profiles",
          "partners",
          "partners_marquee",
          "awards",
          "testimonials",
          "customer_testimonials",
          "masonry_quotes",
          "learning_path",
          "feature_tabs",
          "tabs_vertical",
          "tabs_horizontal",
          "tabs_underline",
          "tabs_success_stories",
        ].includes(key);

      if (usesImage) {
        row.image_url = nextImage(images, state);
      }
    }
  }
}

function pickSectionForCategory(categoryKey, pageIndex) {
  const keys = sectionsInCategory(categoryKey).filter((k) => k !== "in_page_nav");
  if (!keys.length) return null;
  return keys[pageIndex % keys.length];
}

function themePlacement(sectionKey, sortOrder, theme, categoryKey) {
  const cat = SECTION_CATEGORIES.find((c) => c.key === categoryKey);
  const base = buildShowcasePlacement(sectionKey, sortOrder);
  const sectionLabel = SECTION_NAMES[sectionKey] || sectionKey;

  base.section_title = `${theme.name} · ${sectionLabel}`;
  base.sub_title = `${cat?.name || categoryKey} category — ${sectionLabel} with ${theme.label} imagery from /uploads.`;
  base.in_page_nav_title =
    base.in_page_nav_title?.slice(0, 18) || cat?.name?.slice(0, 18) || sectionLabel.slice(0, 18);

  return base;
}

/**
 * Build placements: in_page_nav + one section per CMS category + closing CTA.
 * @param {ComponentThemePageDef} theme
 */
export function buildComponentCategoryPagePlacements(theme) {
  const images = themeImages(theme.folderId, 32);
  const imgState = { i: theme.pageIndex * 3 };
  const placements = [{ section_key: "in_page_nav", sort_order: 0 }];
  let sortOrder = 1;
  let closingCta = null;

  for (const cat of SECTION_CATEGORIES) {
    if (cat.key === "navigation") continue;

    const sectionKey = pickSectionForCategory(cat.key, theme.pageIndex);
    if (!sectionKey) continue;

    if (sectionKey === "cta_band" || sectionKey === "split_cta") {
      closingCta = themePlacement(sectionKey, sortOrder, theme, cat.key);
      continue;
    }

    const placement = themePlacement(sectionKey, sortOrder, theme, cat.key);
    applyUploadImages(placement, images, imgState);
    placements.push(placement);
    sortOrder += 1;
  }

  if (!closingCta) {
    closingCta = {
      section_key: "cta_band",
      sort_order: sortOrder,
      in_page_nav_title: "Next",
      section_title: `Build with ${theme.name}`,
      sub_title: "Map any section category onto your content pages in CMS live mode.",
      buttons: [
        btn("Section library", { target_url: "/cms/section", sort_order: 0 }),
        btn("All themes", { variant: "secondary", target_url: "/components", sort_order: 1 }),
        btn("Contact us", { variant: "secondary", target_url: "/contact-us", sort_order: 2 }),
      ],
    };
  } else {
    closingCta.sort_order = sortOrder;
    applyUploadImages(closingCta, images, imgState);
  }
  placements.push(closingCta);

  return placements;
}

export function componentsHubPlacements() {
  const m = loadUploadsManifest();
  const hero = pickFolderImages("business-tech", m, 1, 0)[0] || "";

  const cards = COMPONENT_THEME_PAGES.map((theme, i) => {
    const img = themeImages(theme.folderId, 1)[0] || hero;
    const categories = SECTION_CATEGORIES.length;
    return item(
      {
        value: String(categories),
        title: theme.name,
        subtitle: theme.path,
        body: `<p>${theme.description}</p><p><strong>${categories}</strong> section categories · local /uploads imagery</p>`,
        image_url: img,
        href: theme.path,
        buttons: [btn("Open page", { target_url: theme.path, variant: "link" })],
      },
      i
    );
  });

  const categoryPillars = SECTION_CATEGORIES.map((cat, i) => {
    const slug = CATEGORY_SLUG[cat.key] || cat.key;
    const count = sectionsInCategory(cat.key).length;
    return item(
      {
        title: cat.name,
        subtitle: `${count} section${count === 1 ? "" : "s"}`,
        value: String(count),
        body: `<p>Preview all <strong>${cat.name}</strong> layouts on <code>/cms/section/${slug}</code>.</p>`,
        href: `/cms/section/${slug}`,
        buttons: [btn("Category preview", { target_url: `/cms/section/${slug}`, variant: "link" })],
      },
      i
    );
  });

  return [
    { section_key: "in_page_nav", sort_order: 0 },
    {
      section_key: "editorial_banner",
      sort_order: 1,
      section_title: "Component gallery — every category on one page",
      sub_title: "13 themed pages, each stacking one section from every CMS category with images from your /uploads folder.",
      in_page_nav_title: "Components",
      section_img_url: hero,
      data: {
        body: "<p>Pick a theme below to see hero, content, features, tabs, accordion, catalog, social proof, data, forms, media, timeline, pricing, trust, CTA, and learning sections on a single long page.</p>",
      },
      buttons: [
        btn("CMS section library", { target_url: "/cms/section", sort_order: 0 }),
        btn("Edit live", { variant: "secondary", target_url: "/components/business-ai?cms=1", sort_order: 1 }),
      ],
    },
    {
      section_key: "stats",
      sort_order: 2,
      section_title: "Gallery at a glance",
      in_page_nav_title: "Stats",
      items: [
        item({ value: String(COMPONENT_THEME_PAGES.length), label: "Themed pages" }, 0),
        item({ value: String(SECTION_CATEGORIES.length), label: "CMS categories" }, 1),
        item({ value: "1+", label: "Section per category" }, 2),
        item({ value: "/uploads", label: "Local image source" }, 3),
      ],
    },
    {
      section_key: "pillar_destinations",
      sort_order: 3,
      section_title: "Browse by upload theme",
      sub_title: "Each page uses a different folder from uploads-manifest.json.",
      in_page_nav_title: "Themes",
      items: cards,
    },
    {
      section_key: "feature_spotlight",
      sort_order: 4,
      section_title: "CMS section categories",
      sub_title: "Every category is represented on each themed component page.",
      in_page_nav_title: "Categories",
      items: categoryPillars.slice(0, 6),
    },
    {
      section_key: "cta_band",
      sort_order: 5,
      section_title: "Map sections onto your pages",
      sub_title: "Use CMS live editing to attach any category to marketing or catalog routes.",
      buttons: [
        btn("Open CMS", { target_url: "/cms", sort_order: 0 }),
        btn("Visual guides", { variant: "secondary", target_url: "/insights", sort_order: 1 }),
      ],
    },
  ];
}

export function allComponentGalleryPageDefs() {
  const hub = {
    path: "/components",
    slug: "components",
    name: "Component Gallery",
    description: "Themed pages with one section from every CMS category — images from /uploads.",
    sortOrder: 700,
    placements: componentsHubPlacements,
  };

  const children = COMPONENT_THEME_PAGES.map((theme) => ({
    ...theme,
    label: theme.name.replace(/ Components$/, ""),
    placements: () => buildComponentCategoryPagePlacements(theme),
  }));

  return [hub, ...children];
}

export const COMPONENT_PATHS = ["/components", ...COMPONENT_THEME_PAGES.map((p) => p.path)];
