import netcomCategories from "../data/netcom-categories.json" with { type: "json" };
import { btn, item } from "./content-page-seed-helpers.js";
import { pickFolderImage, pickFolderImages, loadUploadsManifest } from "./upload-manifest.js";
import {
  isNetcomContentPagePath,
  mapNetcomNavUrl,
  normalizeNetcomPath,
  slugFromPath,
} from "./netcom-nav-map.js";

const FOLDER_BY_GROUP = {
  Company: "business-leadership",
  Resources: "business-tech",
  Solutions: "business-cloud",
  Trainings: "business-ai",
  Services: "business-architecture-design",
};

const FOLDER_BY_PREFIX = [
  { prefix: "/skilling-page/", folderId: "business-ai" },
  { prefix: "/solutions/", folderId: "business-cloud" },
  { prefix: "/industry/", folderId: "business-health" },
];

function folderForPath(path, group) {
  for (const row of FOLDER_BY_PREFIX) {
    if (path.startsWith(row.prefix)) return row.folderId;
  }
  return FOLDER_BY_GROUP[group] || "business-stock";
}

function collectPageDefs() {
  const defs = new Map();
  const usedNames = new Set();

  function uniquePageName(linkName, path) {
    let name = linkName || path.split("/").pop().replace(/-/g, " ");
    if (path.startsWith("/skilling-page/")) {
      name = `${name} Training`;
    }
    if (usedNames.has(name)) {
      const slug = path.split("/").filter(Boolean).pop();
      name = `${name} — ${slug}`;
    }
    usedNames.add(name);
    return name;
  }

  for (const nav of netcomCategories.navigation || []) {
    const group = nav.name;
    for (const col of nav.columns || []) {
      for (const link of col.links || []) {
        const path = normalizeNetcomPath(link.url);
        if (!isNetcomContentPagePath(path)) continue;
        if (defs.has(path)) continue;

        const name = uniquePageName(link.name, path);
        defs.set(path, {
          path,
          slug: slugFromPath(path),
          name,
          description: `${name} — programs, resources, and learning paths on SkillHub.`,
          group,
          sortOrder: 900 + defs.size,
        });
      }
    }
  }

  return [...defs.values()];
}

function skillingAreaHref(path) {
  const slug = path.replace("/skilling-page/", "");
  if (!slug) return "/skilling-areas";
  return `/skilling-area/${slug}`;
}

function pagePlacements(def) {
  const m = loadUploadsManifest();
  const folderId = folderForPath(def.path, def.group);
  const hero = pickFolderImage(folderId, m, 0);
  const imgs = pickFolderImages(folderId, m, 4, 1);

  const relatedCta =
    def.path.startsWith("/skilling-page/")
      ? btn("Browse skilling area", { target_url: skillingAreaHref(def.path), sort_order: 1 })
      : btn("Browse courses", { target_url: "/courses", sort_order: 1 });

  return [
    { section_key: "in_page_nav", sort_order: 0 },
    {
      section_key: "editorial_banner",
      sort_order: 1,
      section_title: def.name,
      sub_title: def.description,
      in_page_nav_title: def.group,
      section_img_url: hero,
      data: {
        body: `<p>${def.name} content aligned with the NetCom Learning site map — editable in CMS live mode.</p>`,
      },
      buttons: [
        btn("Contact us", { target_url: "/contact-us", sort_order: 0 }),
        relatedCta,
      ],
    },
    {
      section_key: "overview",
      sort_order: 2,
      section_title: "Overview",
      in_page_nav_title: "Overview",
      data: {
        body: `<p>SkillHub hosts this route so header navigation from the NetCom CMS category tree resolves on your server. Customize copy, imagery, and sections without redeploying.</p>`,
      },
      buttons: [btn("Get started", { target_url: "/get-started", variant: "link" })],
    },
    {
      section_key: "feature_spotlight",
      sort_order: 3,
      section_title: "What you can do next",
      in_page_nav_title: "Highlights",
      items: [
        item(
          {
            title: "Explore the catalog",
            body: "<p>Find vendor-authorized courses and certification paths.</p>",
            image_url: imgs[0] || hero,
          },
          0
        ),
        item(
          {
            title: "Talk to an advisor",
            body: "<p>Plan cohorts, private training, and enterprise academies.</p>",
            image_url: imgs[1] || hero,
          },
          1
        ),
        item(
          {
            title: "Edit this page live",
            body: "<p>Open with <code>?cms=1</code> to adjust sections in context.</p>",
            image_url: imgs[2] || hero,
          },
          2
        ),
      ],
    },
    {
      section_key: "cta_band",
      sort_order: 4,
      section_title: `Ready to explore ${def.name}?`,
      buttons: [
        btn("Contact sales", { target_url: "/contact-us", sort_order: 0 }),
        btn("All solutions", { variant: "secondary", target_url: "/solutions", sort_order: 1 }),
      ],
    },
  ];
}

export function allNetcomCategoryPageDefs() {
  return collectPageDefs().map((def) => ({
    ...def,
    placements: () => pagePlacements(def),
  }));
}

export const NETCOM_CATEGORY_PATHS = collectPageDefs().map((d) => d.path);

export function netcomNavigationSeedData() {
  return (netcomCategories.navigation || []).map((nav) => ({
    name: nav.name,
    language: nav.language || "EN",
    country: nav.country || "US",
    sort_order: nav.sort_order,
    columns: (nav.columns || []).map((col) => ({
      name: col.name,
      links: (col.links || []).map((link) => ({
        name: link.name,
        url: mapNetcomNavUrl(link.url),
        sort_order: link.sort_order ?? 0,
      })),
    })),
  }));
}

export { netcomCategories };
