/**
 * Sample placements for /sections/* showcase content pages.
 */
import mongoose from "mongoose";
import {
  SECTION_CATEGORIES,
  SECTION_CATALOG_META,
} from "../../modules/cms/section.catalog.js";
import { btn, item } from "./cms-seed-shared.js";

const IMG = {
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  hero: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
  gallery: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  story: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  capitol:
    "https://images.unsplash.com/photo-1564760055775-dcfcb245faf2?auto=format&fit=crop&w=1600&q=80",
};

/** Human-readable names (mirrors client SECTION_CATALOG). */
export const SECTION_NAMES = {
  overview: "Overview",
  text_media: "Text + Media",
  key_benefits: "Key Benefits",
  team: "Team",
  editorial_banner: "Editorial Banner",
  feature_spotlight: "Feature Spotlight",
  process_steps: "Process Steps",
  cta_band: "CTA Band",
  contact_us: "Contact Us",
  contact_form: "Contact Form",
  statement_band: "Statement Band",
  bento_grid: "Bento Grid",
  horizon_gallery: "Horizon Gallery",
  split_narrative: "Split Narrative",
  pillar_destinations: "Pillar Destinations",
  orbit_hero: "Orbit Hero",
  card_stack: "Card Stack",
  feature_tabs: "Tabs — Vertical",
  tabs_vertical: "Tabs — Vertical (alt)",
  tabs_horizontal: "Tabs — Horizontal",
  tabs_underline: "Tabs — Underline",
  tabs_success_stories: "Tabs — Success Stories",
  pricing_tiers: "Pricing Tiers",
  masonry_quotes: "Masonry Quotes",
  metric_rail: "Metric Rail",
  site_builder_hero: "Site Builder Hero",
  template_gallery: "Template Gallery",
  builder_feature_cards: "Builder Feature Cards",
  domain_search_band: "Domain Search Band",
  website_build_steps: "Website Build Steps",
  video_banner: "Video Banner",
  cast_profiles: "Cast Profiles",
  why_choose: "Why Choose",
  stats: "Stats Strip",
  related_courses: "Related Courses",
  curriculum: "Curriculum",
  partners: "Partners",
  partners_marquee: "Partners — Logo Marquee",
  training_options: "Training Options",
  awards: "Awards & Recognition",
  in_page_nav: "In-Page Navigation",
  testimonials: "Testimonials",
  customer_testimonials: "Customer Testimonials",
  faq: "FAQ",
  resources: "Resources",
  products: "Products Grid",
  catalog: "Course Catalog",
  entity_directory: "Entity Directory",
  latest_blogs: "Latest Blogs",
  blog_directory: "Blog Directory",
  hero_classic: "Hero — Classic",
  hero_split: "Hero — Split",
  hero_centered: "Hero — Centered",
  hero_minimal: "Hero — Minimal",
  hero_media: "Hero — Media Slider",
  hero_stats: "Hero — Stats",
  hero_asymmetric: "Hero — Asymmetric",
  hero_dual_cta: "Hero — Dual CTA",
};

/** URL slug per category key */
export const CATEGORY_SLUG = {
  hero: "hero",
  content: "content",
  features: "features",
  tabs: "tabs",
  accordion: "accordion",
  catalog: "catalog",
  social_proof: "social-proof",
  data: "data",
  navigation: "navigation",
};

/** Preferred render order within each category */
export const SECTIONS_BY_CATEGORY = {
  hero: [
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
  ],
  content: [
    "overview",
    "text_media",
    "cta_band",
    "horizon_gallery",
    "split_narrative",
    "pricing_tiers",
    "template_gallery",
    "domain_search_band",
    "website_build_steps",
    "latest_blogs",
    "contact_us",
    "contact_form",
  ],
  features: [
    "key_benefits",
    "why_choose",
    "feature_spotlight",
    "process_steps",
    "training_options",
    "team",
    "bento_grid",
    "pillar_destinations",
    "card_stack",
    "builder_feature_cards",
    "cast_profiles",
  ],
  tabs: [
    "feature_tabs",
    "tabs_vertical",
    "tabs_horizontal",
    "tabs_underline",
    "tabs_success_stories",
  ],
  accordion: ["faq"],
  catalog: [
    "related_courses",
    "curriculum",
    "resources",
    "products",
    "catalog",
    "entity_directory",
    "blog_directory",
  ],
  social_proof: [
    "testimonials",
    "customer_testimonials",
    "masonry_quotes",
    "partners",
    "partners_marquee",
    "awards",
  ],
  data: ["stats", "metric_rail"],
  navigation: ["in_page_nav"],
};

function defaultItems(n = 3) {
  return Array.from({ length: n }, (_, i) =>
    item(
      {
        title: `Sample card ${i + 1}`,
        subtitle: "Supporting detail for showcase",
        body: "<p>Example copy so this section renders on the public page.</p>",
        image_url: i === 0 ? IMG.team : "",
      },
      i
    )
  );
}

function nestedTabPair(label, title, imageUrl) {
  const tabId = new mongoose.Types.ObjectId().toString();
  return [
    item(
      {
        _id: tabId,
        item_type: "tab",
        label,
        value: label,
        title,
        subtitle: "Tab preview panel",
        body: "<p>Switch tabs to compare layouts in this category showcase.</p>",
        image_url: imageUrl,
        buttons: [btn("Learn more", { variant: "inverse", target_url: "/courses" })],
      },
      0
    ),
    item(
      {
        item_type: "item",
        parent_id: tabId,
        title: "Nested child card",
        subtitle: "Optional detail under the tab",
        body: "<p>Child items appear below the preview panel.</p>",
      },
      1
    ),
  ];
}

function sampleForKey(key) {
  const k = String(key).toLowerCase();

  const heroCopy = {
    section_title: "Enterprise learning that scales",
    sub_title:
      "Authorized vendor training, role-based paths, and live CMS pages — preview of this hero layout.",
    buttons: [btn("Browse catalog", { target_url: "/courses" })],
  };

  switch (k) {
    case "overview":
      return {
        section_title: "Overview section",
        sub_title: "Rich text block with optional image and CTAs.",
        in_page_nav_title: "Overview",
        data: {
          body: "<p>The overview section combines a title, subtitle, rich body, and optional buttons — ideal for entity detail pages under the banner.</p>",
        },
        buttons: [btn("See courses", { target_url: "/courses" })],
      };

    case "text_media":
      return {
        section_title: "Text + media rows",
        sub_title: "Stacked editorial rows with alternating image placement.",
        in_page_nav_title: "Text media",
        items: [
          item(
            {
              title: "Align teams on outcomes",
              subtitle: "Strategy before scheduling",
              body: "<p>Map skilling areas to business goals before picking individual courses.</p>",
              image_url: IMG.team,
              label: "left",
            },
            0
          ),
          item(
            {
              title: "Ship pages without engineering",
              subtitle: "Live CMS editing",
              body: "<p>Marketers update copy on public URLs with <code>?cms=true</code>.</p>",
              image_url: IMG.gallery,
              label: "right",
            },
            1
          ),
        ],
      };

    case "cta_band":
      return {
        section_title: "Ready to explore the catalog?",
        sub_title: "CTA band — full-bleed call to action with buttons.",
        in_page_nav_title: "CTA",
        buttons: [
          btn("Open courses", { target_url: "/courses" }),
          btn("Contact us", { variant: "secondary", target_url: "/contact-us" }),
        ],
      };

    case "contact_us":
      return {
        section_title: "Contact SkillHub",
        sub_title: "Global contact band with channels.",
        in_page_nav_title: "Contact",
        data: {
          body: "<p>Reach our advisors for cohort planning, vendor enablement, or CMS walkthroughs.</p>",
        },
        items: [
          item({ title: "Email", subtitle: "hello@skillhub.example", href: "mailto:hello@skillhub.example", icon: "email" }, 0),
          item({ title: "Phone", subtitle: "+1 (555) 010-2000", href: "tel:+15550102000", icon: "phone" }, 1),
        ],
      };

    case "contact_form":
      return {
        section_title: "Enterprise inquiry",
        sub_title: "Structured lead form section.",
        in_page_nav_title: "Form",
        data: { form_key: "enterprise" },
      };

    case "horizon_gallery":
      return {
        section_title: "CMS admin gallery",
        sub_title: "Horizontal snap gallery of cards.",
        in_page_nav_title: "Gallery",
        items: [
          item({ title: "Section library", subtitle: "Filter by category", image_url: IMG.gallery }, 0),
          item({ title: "Live edit mode", subtitle: "On-page CMS", image_url: IMG.story }, 1),
          item({ title: "Entity pages", subtitle: "Vendor & product CMS", image_url: IMG.hero }, 2),
        ],
      };

    case "split_narrative":
      return {
        section_title: "How teams publish",
        sub_title: "Sticky media with chapter items.",
        in_page_nav_title: "Narrative",
        section_img_url: IMG.hero,
        items: [
          item({ title: "Register sections", body: "<p>Define each layout once in the global catalog.</p>" }, 0),
          item({ title: "Place on templates", body: "<p>Attach sections to home, vendor, or content pages.</p>" }, 1),
          item({ title: "Edit live", body: "<p>Refine copy on the public URL in CMS mode.</p>" }, 2),
        ],
      };

    case "pricing_tiers":
      return {
        section_title: "Delivery options",
        sub_title: "Pricing / plan tier cards.",
        in_page_nav_title: "Pricing",
        items: [
          item({ title: "Team", value: "$299", subtitle: "Per learner / year", body: "<p>Self-serve catalog access.</p>", buttons: [btn("Get started", { target_url: "/courses" })] }, 0),
          item({ title: "Enterprise", value: "Custom", subtitle: "Private cohorts", body: "<p>Dedicated advisors and reporting.</p>", buttons: [btn("Talk to us", { variant: "outline", target_url: "/contact-us" })] }, 1),
        ],
      };

    case "template_gallery":
      return {
        section_title: "Page templates",
        sub_title: "Template picker gallery.",
        in_page_nav_title: "Templates",
        items: [
          item({ title: "Home", subtitle: "Marketing landing", image_url: IMG.hero, href: "/" }, 0),
          item({ title: "Content", subtitle: "Free-form pages", image_url: IMG.gallery, href: "/about-us" }, 1),
          item({ title: "Vendor", subtitle: "Partner detail", image_url: IMG.story, href: "/vendors" }, 2),
        ],
      };

    case "domain_search_band":
      return {
        section_title: "Find your learning path",
        sub_title: "Domain-style search band.",
        in_page_nav_title: "Search",
        data: { placeholder: "Search courses, vendors, or skills…" },
      };

    case "website_build_steps":
      return {
        section_title: "Launch in four steps",
        sub_title: "Numbered website build guide.",
        in_page_nav_title: "Steps",
        items: [
          item({ value: "01", title: "Pick sections", body: "<p>Choose layouts from the library.</p>" }, 0),
          item({ value: "02", title: "Map content", body: "<p>Create a content page and attach sections.</p>" }, 1),
          item({ value: "03", title: "Seed sample data", body: "<p>Run seeds or edit in live CMS.</p>" }, 2),
          item({ value: "04", title: "Publish", body: "<p>Share the URL with stakeholders.</p>" }, 3),
        ],
      };

    case "latest_blogs":
      return {
        section_title: "Latest from the journal",
        sub_title: "Pulls recent blog posts from the catalog.",
        in_page_nav_title: "Blogs",
      };

    case "key_benefits":
      return {
        section_title: "Why teams choose SkillHub",
        in_page_nav_title: "Benefits",
        items: [
          item({ title: "Authorized curricula", body: "<p>Official vendor training paths.</p>" }, 0),
          item({ title: "Live CMS", body: "<p>Edit marketing pages without deploys.</p>" }, 1),
          item({ title: "Structured catalog", body: "<p>Vendors, products, courses, and blogs linked.</p>" }, 2),
        ],
      };

    case "why_choose":
      return {
        section_title: "Why Choose SkillHub?",
        in_page_nav_title: "Why choose",
        items: defaultItems(4),
      };

    case "feature_spotlight":
      return {
        section_title: "Feature spotlight",
        sub_title: "Asymmetric spotlight cards.",
        in_page_nav_title: "Spotlight",
        items: [
          item({ title: "Live CMS mode", subtitle: "Edit on the real page", body: "<p>Emerald toolbar unlocks section editing.</p>", image_url: IMG.gallery, href: "/?cms=true" }, 0),
          item({ title: "Section library", subtitle: "58 registered layouts", body: "<p>Filter by category and preview screenshots.</p>", image_url: IMG.hero, href: "/cms/sections" }, 1),
        ],
      };

    case "process_steps":
      return {
        section_title: "From catalog to capability",
        in_page_nav_title: "Process",
        items: [
          item({ value: "1", title: "Discover", body: "<p>Browse vendors and skilling areas.</p>" }, 0),
          item({ value: "2", title: "Evaluate", body: "<p>Compare products and course paths.</p>" }, 1),
          item({ value: "3", title: "Enroll", body: "<p>Launch learning with clear next steps.</p>" }, 2),
        ],
      };

    case "training_options":
      return {
        section_title: "Flexible training options",
        in_page_nav_title: "Training",
        items: defaultItems(3),
      };

    case "team":
      return {
        section_title: "Meet the team",
        in_page_nav_title: "Team",
        items: [
          item({ title: "Alex Rivera", subtitle: "Head of Learning", body: "<p>Enterprise curriculum strategy.</p>", image_url: IMG.team }, 0),
          item({ title: "Jordan Lee", subtitle: "CMS Product", body: "<p>Live editing and section library.</p>", image_url: IMG.story }, 1),
        ],
      };

    case "bento_grid":
      return {
        section_title: "Capability mosaic",
        in_page_nav_title: "Bento",
        items: [
          item({ title: "Cloud", subtitle: "Platform skills", image_url: IMG.hero }, 0),
          item({ title: "Security", subtitle: "Zero trust", image_url: IMG.gallery }, 1),
          item({ title: "Data", subtitle: "Analytics paths", image_url: IMG.story }, 2),
          item({ title: "AI", subtitle: "Emerging stack", image_url: IMG.team }, 3),
        ],
      };

    case "pillar_destinations":
      return {
        section_title: "Explore by pillar",
        in_page_nav_title: "Pillars",
        items: [
          item({ title: "Vendors", subtitle: "Partner ecosystems", href: "/vendors", value: "50+" }, 0),
          item({ title: "Products", subtitle: "Learning bundles", href: "/products", value: "120+" }, 1),
          item({ title: "Courses", subtitle: "Full catalog", href: "/courses", value: "500+" }, 2),
        ],
      };

    case "card_stack":
      return {
        section_title: "Stacked story cards",
        in_page_nav_title: "Stack",
        items: defaultItems(4),
      };

    case "builder_feature_cards":
      return {
        section_title: "CMS feature checklist",
        in_page_nav_title: "Features",
        items: [
          item({ title: "Section library", body: "<p>58 layouts across 9 categories.</p>" }, 0),
          item({ title: "Live edit", body: "<p>On-page CMS for any public URL.</p>" }, 1),
          item({ title: "Entity pages", body: "<p>Vendors through blogs.</p>" }, 2),
        ],
      };

    case "cast_profiles":
      return {
        section_title: "Featured practitioners",
        in_page_nav_title: "Cast",
        items: [
          item({ title: "Morgan Chen", subtitle: "Cloud architect", image_url: IMG.team }, 0),
          item({ title: "Sam Ortiz", subtitle: "Security lead", image_url: IMG.story }, 1),
        ],
      };

    case "feature_tabs":
      return {
        section_title: "Vertical tabs — catalog paths",
        in_page_nav_title: "Vertical",
        items: nestedTabPair("Vendors", "Start with technology partners", IMG.hero),
      };

    case "tabs_vertical":
      return {
        section_title: "Vertical tabs — delivery modes",
        in_page_nav_title: "Vertical alt",
        items: nestedTabPair("Self-paced", "Learn on your schedule", IMG.story),
      };

    case "tabs_horizontal":
      return {
        section_title: "Horizontal pill tabs",
        in_page_nav_title: "Horizontal",
        items: nestedTabPair("L&D leaders", "Curate a trustworthy catalog", IMG.gallery),
      };

    case "tabs_underline":
      return {
        section_title: "Underline editorial tabs",
        in_page_nav_title: "Underline",
        items: nestedTabPair("Cloud engineer", "Build cloud platforms", IMG.hero),
      };

    case "tabs_success_stories":
      return {
        section_title: "Client Success Stories: How We Empower Teams",
        in_page_nav_title: "Stories",
        items: [
          item(
            {
              icon: "government",
              label: "Federal Government",
              subtitle: "AWS",
              title: "Federal agency upskilled 2,400 engineers on cloud-native architecture",
              image_url: IMG.capitol,
              href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              buttons: [btn("Read the story", { variant: "outline", target_url: "/blogs" })],
            },
            0
          ),
          item(
            {
              icon: "healthcare",
              label: "Healthcare",
              subtitle: "Microsoft",
              title: "Health system trained clinical IT on secure cloud compliance",
              image_url: IMG.story,
              buttons: [btn("Read the story", { variant: "outline", target_url: "/blogs" })],
            },
            1
          ),
        ],
      };

    case "faq":
      return {
        section_title: "Frequently asked questions",
        in_page_nav_title: "FAQ",
        items: [
          item({ title: "How do I add a section to a content page?", body: "<p>Open the page in CMS mode and use Page settings → Add section.</p>" }, 0),
          item({ title: "Can I preview all section types?", body: "<p>Yes — browse <strong>/sections</strong> and each category page.</p>" }, 1),
        ],
      };

    case "related_courses":
      return {
        section_title: "Related courses",
        sub_title: "Live course cards from the catalog API.",
        in_page_nav_title: "Courses",
        buttons: [btn("Full catalog", { variant: "outline", target_url: "/courses" })],
      };

    case "curriculum":
      return {
        section_title: "Sample curriculum",
        in_page_nav_title: "Curriculum",
        items: [
          item({ title: "Module 1 — Foundations" }, 0),
          item({ title: "Module 2 — Core services" }, 1),
          item({ title: "Module 3 — Security" }, 2),
        ],
      };

    case "resources":
      return {
        section_title: "Learning resources",
        in_page_nav_title: "Resources",
        items: [
          item({ title: "Study guide", body: "<p>Official vendor outline.</p>", href: "/courses" }, 0),
          item({ title: "Lab access", body: "<p>Hands-on environment details.</p>" }, 1),
        ],
      };

    case "products":
      return {
        section_title: "Products grid",
        sub_title: "Live products from the catalog.",
        in_page_nav_title: "Products",
      };

    case "catalog":
      return {
        section_title: "Course catalog",
        sub_title: "Filterable course grid.",
        in_page_nav_title: "Catalog",
      };

    case "entity_directory":
      return {
        section_title: "Vendor directory",
        sub_title: "Listing grid driven by directory_type.",
        in_page_nav_title: "Directory",
        data: { directory_type: "vendor" },
      };

    case "blog_directory":
      return {
        section_title: "Blog directory",
        sub_title: "Searchable editorial index.",
        in_page_nav_title: "Blog dir",
      };

    case "testimonials":
      return {
        section_title: "What learners say",
        in_page_nav_title: "Quotes",
        items: [
          item({ body: "SkillHub cut our vendor onboarding time in half.", title: "L&D Director, FinServ" }, 0),
          item({ body: "The live CMS let us ship campaign pages same-day.", title: "Marketing Lead" }, 1),
        ],
      };

    case "customer_testimonials":
      return {
        section_title: "Customer testimonials",
        in_page_nav_title: "Carousel",
        items: [
          item({ title: "Enterprise scale", body: "<p>Trusted by global training teams.</p>", image_url: IMG.team }, 0),
          item({ title: "Partner enablement", body: "<p>Vendors manage their own live pages.</p>", image_url: IMG.gallery }, 1),
        ],
      };

    case "masonry_quotes":
      return {
        section_title: "Masonry quotes",
        in_page_nav_title: "Masonry",
        items: [
          item({ body: "Best structured catalog we have used.", title: "CTO" }, 0),
          item({ body: "Live editing changed our release cadence.", title: "VP Marketing" }, 1),
          item({ body: "Clear paths from vendor to certification.", title: "Enablement" }, 2),
        ],
      };

    case "partners":
      return {
        section_title: "Technology partners",
        in_page_nav_title: "Partners",
      };

    case "partners_marquee":
      return {
        section_title: "Partner logo marquee",
        in_page_nav_title: "Marquee",
      };

    case "awards":
      return {
        section_title: "Awards & recognition",
        in_page_nav_title: "Awards",
        items: [
          item({ title: "Training Provider of the Year", subtitle: "2025", image_url: IMG.gallery }, 0),
          item({ title: "CMS Innovation", subtitle: "2024", image_url: IMG.hero }, 1),
        ],
      };

    case "stats":
      return {
        section_title: "SkillHub by the numbers",
        in_page_nav_title: "Stats",
        items: [
          item({ value: "1M+", title: "Learners trained" }, 0),
          item({ value: "50+", title: "Vendor partners" }, 1),
          item({ value: "58", title: "Section layouts" }, 2),
        ],
      };

    case "metric_rail":
      return {
        section_title: "Platform metrics",
        in_page_nav_title: "Metrics",
        items: [
          item({ value: "58", title: "Sections" }, 0),
          item({ value: "9", title: "Categories" }, 1),
          item({ value: "Live", title: "CMS editing" }, 2),
          item({ value: "3", title: "Content layers" }, 3),
        ],
      };

    case "in_page_nav":
      return {
        section_title: "",
        sub_title: "",
        in_page_nav_title: "",
      };

    case "editorial_banner":
      return {
        section_title: "Editorial banner hero",
        sub_title: "Full-bleed display type over imagery.",
        in_page_nav_title: "Editorial",
        section_bg_img: IMG.hero,
      };

    case "statement_band":
      return {
        section_title: "Capability compounds when learning is structured.",
        sub_title: "Statement band — typography-led hero strip.",
        in_page_nav_title: "Statement",
      };

    case "orbit_hero":
      return {
        section_title: "Orbit hero frame",
        sub_title: "Product frame with floating cards.",
        in_page_nav_title: "Orbit",
        section_img_url: IMG.hero,
      };

    case "site_builder_hero":
      return {
        section_title: "Build your learning site",
        sub_title: "Site builder marketing hero.",
        in_page_nav_title: "Builder",
        buttons: [btn("See templates", { target_url: "/cms/pages" })],
      };

    case "video_banner":
      return {
        section_title: "See SkillHub in action",
        sub_title: "Full-bleed video banner.",
        in_page_nav_title: "Video",
        section_bg_img: IMG.hero,
        buttons: [
          btn("Watch demo", {
            action_type: "youtube",
            target_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          }),
        ],
      };

    case "hero_classic":
    case "hero_split":
    case "hero_centered":
    case "hero_minimal":
    case "hero_asymmetric":
    case "hero_dual_cta":
      return {
        ...heroCopy,
        in_page_nav_title: SECTION_NAMES[k]?.replace("Hero — ", "") || k,
        section_img_url: k === "hero_split" || k === "hero_asymmetric" ? IMG.hero : undefined,
      };

    case "hero_media":
      return {
        section_title: "",
        sub_title: "",
        in_page_nav_title: "Slider",
        items: [
          item(
            {
              title: "Enterprise learning that scales",
              subtitle: "Authorized vendor training worldwide.",
              buttons: [btn("Browse catalog", { variant: "inverse", target_url: "/courses" })],
            },
            0
          ),
          item(
            {
              title: "Close skill gaps faster",
              body: "<p>Role-based paths with labs and certification prep.</p>",
              buttons: [btn("View vendors", { variant: "inverse", target_url: "/vendors" })],
            },
            1
          ),
        ],
      };

    case "hero_stats":
      return {
        ...heroCopy,
        in_page_nav_title: "Stats hero",
        items: [
          item({ value: "58", label: "Section types" }, 0),
          item({ value: "9", label: "Categories" }, 1),
          item({ value: "Live", label: "CMS mode" }, 2),
        ],
      };

    default:
      return {
        section_title: SECTION_NAMES[k] || k,
        sub_title: `Preview of the ${k} section.`,
        in_page_nav_title: (SECTION_NAMES[k] || k).slice(0, 18),
        items: defaultItems(2),
      };
  }
}

export function buildShowcasePlacement(sectionKey, sortOrder) {
  const key = String(sectionKey).toLowerCase();
  const name = SECTION_NAMES[key] || key;
  const sample = sampleForKey(key);
  const nav =
    sample.in_page_nav_title ??
    name.replace(/^Hero — /, "").replace(/^Tabs — /, "").slice(0, 22);

  return {
    section_key: key,
    sort_order: sortOrder,
    in_page_nav_title: nav || name.slice(0, 18),
    section_title: sample.section_title ?? name,
    sub_title:
      sample.sub_title ??
      `Live preview · section key \`${key}\` · ${getSectionCatalogMeta(key)?.category || "cms"}`,
    ...sample,
  };
}

function getSectionCatalogMeta(key) {
  return SECTION_CATALOG_META[String(key).toLowerCase()] || null;
}

export function sectionsInCategory(categoryKey) {
  const keys = SECTIONS_BY_CATEGORY[categoryKey];
  if (keys?.length) return keys;
  return Object.entries(SECTION_CATALOG_META)
    .filter(([, meta]) => meta.category === categoryKey)
    .map(([key]) => key)
    .sort();
}

export function buildCategoryPagePlacements(categoryKey) {
  const cat = SECTION_CATEGORIES.find((c) => c.key === categoryKey);
  const keys = sectionsInCategory(categoryKey);
  const placements = [
    { section_key: "in_page_nav", sort_order: 0 },
    {
      section_key: "hero_centered",
      sort_order: 1,
      in_page_nav_title: "About",
      section_title: `${cat?.name || categoryKey} sections`,
      sub_title: `${keys.length} registered layouts in the SkillHub section library. Scroll to preview each component with sample content.`,
      buttons: [
        btn("All categories", { target_url: "/sections" }),
        btn("Section admin", {
          variant: "secondary",
          target_url: `/cms/sections?category=${categoryKey}`,
        }),
      ],
    },
  ];

  keys.forEach((key, i) => {
    placements.push(buildShowcasePlacement(key, i + 2));
  });

  placements.push({
    section_key: "cta_band",
    sort_order: placements.length,
    in_page_nav_title: "More",
    section_title: "Explore other categories",
    sub_title: "Every section type has a dedicated showcase page under /sections.",
    buttons: [
      btn("Section library home", { target_url: "/sections" }),
      btn("Edit this page", {
        variant: "secondary",
        target_url: `/sections/${CATEGORY_SLUG[categoryKey] || categoryKey}?cms=true`,
      }),
    ],
  });

  return placements;
}

export function buildIndexPagePlacements() {
  const categoryCards = SECTION_CATEGORIES.map((cat, i) => {
    const count = sectionsInCategory(cat.key).length;
    const slug = CATEGORY_SLUG[cat.key] || cat.key;
    return item(
      {
        title: cat.name,
        subtitle: `${count} section${count === 1 ? "" : "s"}`,
        value: String(count),
        href: `/sections/${slug}`,
        body: `<p>Browse live previews for every <strong>${cat.name}</strong> layout.</p>`,
      },
      i
    );
  });

  return [
    { section_key: "in_page_nav", sort_order: 0 },
    {
      section_key: "hero_centered",
      sort_order: 1,
      in_page_nav_title: "Overview",
      section_title: "SkillHub section library",
      sub_title:
        "58 CMS section components across 9 categories — each with a live preview on a content page. Pick a category below or open the admin library to map sections onto your pages.",
      buttons: [
        btn("Open CMS sections", { target_url: "/cms/sections" }),
        btn("Tabs showcase", {
          variant: "secondary",
          target_url: "/tabs-showcase",
        }),
      ],
    },
    {
      section_key: "metric_rail",
      sort_order: 2,
      in_page_nav_title: "Counts",
      section_title: "Library at a glance",
      items: SECTION_CATEGORIES.map((cat, i) =>
        item(
          {
            value: String(sectionsInCategory(cat.key).length),
            title: cat.name,
            subtitle: `/sections/${CATEGORY_SLUG[cat.key] || cat.key}`,
          },
          i
        )
      ),
    },
    {
      section_key: "pillar_destinations",
      sort_order: 3,
      in_page_nav_title: "Categories",
      section_title: "Browse by category",
      sub_title: "Content pages under /sections/* — one page per CMS category.",
      items: categoryCards,
    },
    {
      section_key: "builder_feature_cards",
      sort_order: 4,
      in_page_nav_title: "How to",
      section_title: "Using these pages",
      items: [
        item(
          {
            title: "Preview before mapping",
            body: "<p>Stakeholders review layout and sample copy on these public URLs.</p>",
          },
          0
        ),
        item(
          {
            title: "Map on content pages",
            body: "<p>Add any section to a free-form content page via CMS mode.</p>",
          },
          1
        ),
        item(
          {
            title: "Edit live",
            body: "<p>Open any showcase URL with <code>?cms=true</code> to tweak copy.</p>",
          },
          2
        ),
      ],
    },
    {
      section_key: "cta_band",
      sort_order: 5,
      in_page_nav_title: "Start",
      section_title: "Ready to build a page?",
      sub_title: "Create a content page in the CMS and attach sections from the library.",
      buttons: [
        btn("CMS dashboard", { target_url: "/cms" }),
        btn("Content pages", {
          variant: "secondary",
          target_url: "/cms/contents",
        }),
      ],
    },
  ];
}

export { SECTION_CATEGORIES };
