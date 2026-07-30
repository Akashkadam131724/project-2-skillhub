import Content from "../../modules/content/content.model.js";
import Vendor from "../../modules/vendor/vendor.model.js";
import Product from "../../modules/product/product.model.js";
import SkillingArea from "../../modules/skilling-area/skilling-area.model.js";
import Industry from "../../modules/industry/industry.model.js";
import { CORE_CONTENT_PATHS } from "../data/content-site-map.js";
import { allShowcasePageDefs } from "./showcase-content-pages.js";
import { allCampaignPromotionPageDefs } from "./campaign-promotion-content-pages.js";
import { allPngInsightPageDefs } from "./png-insights-content-pages.js";
import { allComponentGalleryPageDefs } from "./component-gallery-content-pages.js";
import { allNetcomCategoryPageDefs } from "./netcom-category-content-pages.js";
import { ensureContent } from "./content-page-seed-helpers.js";
import { collectNavUrls, isStaticContentPath, normalizeNavUrl } from "./nav-urls.js";

const STATIC_META = {
  "/vendors": { slug: "vendors", name: "Vendors", description: "Browse technology training partners." },
  "/products": { slug: "products", name: "Products", description: "Learning products and certification paths." },
  "/courses": { slug: "courses", name: "Courses", description: "Search the full course catalog." },
  "/industries": { slug: "industries", name: "Industries", description: "Industry-specific skilling programs." },
  "/skilling-areas": {
    slug: "skilling-areas",
    name: "Skilling Areas",
    description: "Capability domains and learning paths.",
  },
  "/blogs": { slug: "blogs", name: "Blogs", description: "Insights on learning, skills, and transformation." },
  "/about-us": { slug: "about-us", name: "About Us", description: "Learn about SkillHub." },
  "/our-team": { slug: "our-team", name: "Our Team", description: "Meet the SkillHub team." },
  "/company/careers": { slug: "company-careers", name: "Careers", description: "Join SkillHub." },
  "/contact-us": { slug: "contact-us", name: "Contact Us", description: "Get in touch with SkillHub." },
  "/get-started": { slug: "get-started", name: "Get Started", description: "Launch a SkillHub pilot." },
  "/solutions": { slug: "solutions", name: "Solutions", description: "Enterprise learning solutions." },
  "/solutions/business-ai": { slug: "business-ai", name: "AI & Data Solutions", description: "AI and data academy programs." },
  "/solutions/architecture-design": {
    slug: "architecture-design",
    name: "Architecture & Design",
    description: "Solution architecture and design programs.",
  },
  "/solutions/cloud": { slug: "cloud", name: "Cloud Solutions", description: "Cloud transformation programs." },
  "/solutions/health": { slug: "health", name: "Healthcare Solutions", description: "Healthcare skilling programs." },
  "/solutions/leadership": { slug: "leadership", name: "Leadership Solutions", description: "Leadership and change programs." },
  "/solutions/networking": { slug: "networking", name: "Networking Solutions", description: "Networking and infrastructure programs." },
  "/solutions/security": { slug: "security", name: "Security Solutions", description: "Security and compliance programs." },
  "/solutions/technology": { slug: "technology", name: "Technology Solutions", description: "Technology delivery programs." },
  "/solutions/web": { slug: "web", name: "Digital Experience", description: "Web and product delivery programs." },
};

for (const page of allShowcasePageDefs()) {
  STATIC_META[page.path] = {
    slug: page.slug,
    name: page.name,
    description: page.description,
  };
}

for (const page of allCampaignPromotionPageDefs()) {
  STATIC_META[page.path] = {
    slug: page.slug,
    name: page.name,
    description: page.description,
  };
}

for (const page of allPngInsightPageDefs()) {
  STATIC_META[page.path] = {
    slug: page.slug,
    name: page.name,
    description: page.description,
  };
}

for (const page of allComponentGalleryPageDefs()) {
  STATIC_META[page.path] = {
    slug: page.slug,
    name: page.name,
    description: page.description,
  };
}

for (const page of allNetcomCategoryPageDefs()) {
  STATIC_META[page.path] = {
    slug: page.slug,
    name: page.name,
    description: page.description,
  };
}

/**
 * Upsert Content rows for every static path used in header navigation.
 */
export async function ensureNavContentPages(seedData) {
  const fromNav = collectNavUrls(seedData).filter(isStaticContentPath);
  const paths = [...new Set([...CORE_CONTENT_PATHS.filter((p) => p !== "/"), ...fromNav])];
  let upserted = 0;

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const meta = STATIC_META[path];
    if (!meta) continue;
    await ensureContent({
      name: meta.name,
      slug: meta.slug,
      path,
      description: meta.description,
      status: "active",
      sortOrder: 100 + i,
    });
    upserted += 1;
  }

  return upserted;
}

/**
 * Verify every nav URL resolves to active Content or a catalog entity.
 */
export async function validateNavUrls(seedData) {
  const urls = collectNavUrls(seedData);
  const contentPaths = new Set(
    (await Content.find({ status: "active" }).select("path").lean()).map((c) => c.path)
  );

  const [vendors, products, areas, industries] = await Promise.all([
    Vendor.find({ status: { $in: ["active", "pending"] } }).select("slug").lean(),
    Product.find({ status: { $in: ["active", "draft"] } }).select("slug").lean(),
    SkillingArea.find({ status: "active" }).select("slug").lean(),
    Industry.find({ status: "active" }).select("slug").lean(),
  ]);

  const vendorSlugs = new Set(vendors.map((v) => v.slug));
  const productSlugs = new Set(products.map((p) => p.slug));
  const areaSlugs = new Set(areas.map((a) => a.slug));
  const industrySlugs = new Set(industries.map((i) => i.slug));

  const missing = [];

  for (const url of urls) {
    if (contentPaths.has(url)) continue;

    const norm = normalizeNavUrl(url);

    if (norm.startsWith("/vendor/")) {
      const slug = norm.slice("/vendor/".length);
      if (vendorSlugs.has(slug)) continue;
      missing.push({ url, reason: `vendor slug not found: ${slug}` });
      continue;
    }
    if (norm.startsWith("/product/")) {
      const slug = norm.slice("/product/".length);
      if (productSlugs.has(slug)) continue;
      missing.push({ url, reason: `product slug not found: ${slug}` });
      continue;
    }
    if (norm.startsWith("/skilling-area/")) {
      const slug = norm.slice("/skilling-area/".length);
      if (areaSlugs.has(slug)) continue;
      missing.push({ url, reason: `skilling area slug not found: ${slug}` });
      continue;
    }
    if (norm.startsWith("/industry/")) {
      const slug = norm.slice("/industry/".length);
      if (industrySlugs.has(slug)) continue;
      missing.push({ url, reason: `industry slug not found: ${slug}` });
      continue;
    }

    missing.push({ url, reason: "no active Content page" });
  }

  return { total: urls.length, missing };
}
