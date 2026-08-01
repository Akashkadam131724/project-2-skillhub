/**
 * Static sample placements for /cms/section/* preview pages (no CMS / API).
 */
import {
  SECTION_CATALOG,
  SECTION_CATEGORIES,
  getSectionCatalogMeta,
} from "@/lib/sections/section-registry";
import { showcaseBtn as btn, showcaseItem as item, showcaseTabId } from "./helpers";

const IMG = {
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  hero: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
  gallery: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  story: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  capitol:
    "https://images.unsplash.com/photo-1564760055775-dcfcb245faf2?auto=format&fit=crop&w=1600&q=80",
  classroom:
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80",
  laptop:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  conference:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80",
  skyline:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  collaboration:
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80",
  workshop:
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
  dataViz:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
  campus:
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80",
};

const SHOWCASE_VIDEO = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

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
  promo_modal: "Promo Modal",
  newsletter_band: "Newsletter Band",
  form_split: "Form — Split column",
  comparison_table: "Comparison Table",
  media_mosaic: "Media Mosaic",
  timeline_vertical: "Timeline — Vertical",
  trust_badges: "Trust Badges",
  split_cta: "Split CTA",
  learning_path: "Learning Path",
  faq_two_column: "FAQ — Two column",
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
  overlays: "overlays",
  forms: "forms",
  comparison: "comparison",
  media: "media",
  timeline: "timeline",
  pricing: "pricing",
  trust: "trust",
  cta: "cta",
  learning: "learning",
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
    "horizon_gallery",
    "split_narrative",
    "template_gallery",
    "domain_search_band",
    "website_build_steps",
    "latest_blogs",
    "contact_us",
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
  accordion: ["faq", "faq_two_column"],
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
  overlays: ["promo_modal"],
  forms: ["contact_form", "newsletter_band", "form_split"],
  comparison: ["comparison_table"],
  media: ["media_mosaic"],
  timeline: ["timeline_vertical"],
  pricing: ["pricing_tiers"],
  trust: ["trust_badges"],
  cta: ["cta_band", "split_cta"],
  learning: ["learning_path"],
};

const RICH_CARD_TEMPLATES = [
  {
    title: "Authorized vendor paths",
    subtitle: "Microsoft · AWS · Google Cloud",
    body: "<p>Official curricula mapped to certification objectives, refreshed as vendors ship new releases.</p>",
    image_url: IMG.hero,
  },
  {
    title: "Role-based skilling maps",
    subtitle: "Engineer → architect → lead",
    body: "<p>Bundle courses by job family instead of one-off enrollments scattered across teams.</p>",
    image_url: IMG.laptop,
  },
  {
    title: "Live CMS publishing",
    subtitle: "Edit on the real URL",
    body: "<p>Enablement teams refine copy, imagery, and CTAs on public pages with <code>?cms=true</code>.</p>",
    image_url: IMG.gallery,
  },
  {
    title: "Enterprise reporting",
    subtitle: "Cohort progress & ROI",
    body: "<p>Track completion, exam readiness, and spend across business units from one place.</p>",
    image_url: IMG.dataViz,
  },
];

function defaultItems(n = 3) {
  return Array.from({ length: n }, (_, i) => {
    const template = RICH_CARD_TEMPLATES[i % RICH_CARD_TEMPLATES.length];
    return item({ ...template }, i);
  });
}

function nestedTabPair(label, title, imageUrl) {
  const tabId = showcaseTabId();
  return [
    item(
      {
        _id: tabId,
        item_type: "tab",
        label,
        value: label,
        title,
        subtitle: "Tab preview panel",
        body: "<p>Switch tabs to compare layouts. Each tab can include a hero image, rich body, nested child cards, and CTA buttons — mirroring real product marketing pages.</p>",
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
    section_title: "Enterprise learning that scales with your roadmap",
    sub_title:
      "Authorized vendor curricula, hands-on labs, and role-based certification paths — discoverable through one structured catalog with live CMS pages.",
    buttons: [
      btn("Browse catalog", { target_url: "/courses" }),
      btn("Talk to an advisor", {
        variant: "secondary",
        target_url: "/contact-us",
      }),
    ],
  };

  const heroImages = {
    hero_classic: IMG.hero,
    hero_split: IMG.laptop,
    hero_centered: IMG.conference,
    hero_minimal: "",
    hero_asymmetric: IMG.skyline,
    hero_dual_cta: IMG.collaboration,
  };

  switch (k) {
    case "overview":
      return {
        section_title: "Platform overview",
        sub_title: "Rich text block with optional imagery and CTAs — ideal for entity detail pages below the banner.",
        in_page_nav_title: "Overview",
        data: {
          body: "<p>SkillHub connects <strong>vendors</strong>, <strong>products</strong>, and <strong>courses</strong> into one searchable catalog. Marketing teams publish landing pages from the section library while L&D leaders map skilling areas to business outcomes.</p><p>Use this section for long-form narrative, bullet lists, and embedded links without building a custom layout.</p>",
        },
        buttons: [
          btn("See courses", { target_url: "/courses" }),
          btn("Vendor partners", { variant: "outline", target_url: "/vendors" }),
        ],
      };

    case "text_media":
      return {
        section_title: "Text + media rows",
        sub_title: "Stacked editorial rows with alternating image placement.",
        in_page_nav_title: "Text media",
        items: [
          item(
            {
              title: "Align teams on measurable outcomes",
              subtitle: "Strategy before scheduling",
              body: "<p>Map skilling areas to quarterly OKRs. Identify prerequisite courses before opening enrollment to hundreds of engineers.</p>",
              image_url: IMG.team,
              label: "left",
            },
            0
          ),
          item(
            {
              title: "Ship pages without engineering tickets",
              subtitle: "Live CMS editing",
              body: "<p>Marketers update hero copy, testimonials, and CTAs on public URLs. Changes appear instantly — no deploy pipeline required.</p>",
              image_url: IMG.gallery,
              label: "right",
            },
            1
          ),
          item(
            {
              title: "Report progress to leadership",
              subtitle: "Cohort analytics",
              body: "<p>Export completion rates, exam readiness, and spend by business unit for quarterly business reviews.</p>",
              image_url: IMG.dataViz,
              label: "left",
            },
            2
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
        items: [
          item({ title: "Email", subtitle: "hello@skillhub.example", href: "mailto:hello@skillhub.example", icon: "email" }, 0),
          item({ title: "Phone", subtitle: "+1 (555) 010-2000", href: "tel:+15550102000", icon: "phone" }, 1),
        ],
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
          item({ title: "Course catalog", subtitle: "Filterable grid", image_url: IMG.classroom }, 3),
          item({ title: "Blog journal", subtitle: "Editorial hub", image_url: IMG.campus }, 4),
        ],
      };

    case "split_narrative":
      return {
        section_title: "How teams publish",
        sub_title: "Sticky media with chapter items.",
        in_page_nav_title: "Narrative",
        section_img_url: IMG.workshop,
        items: [
          item({ title: "Register sections", body: "<p>Define each layout once in the global catalog — hero, tabs, catalog grids, and social proof blocks.</p>" }, 0),
          item({ title: "Place on templates", body: "<p>Attach sections to home, vendor, product, or free-form content pages with drag-and-drop ordering.</p>" }, 1),
          item({ title: "Seed or edit content", body: "<p>Run database seeds for demo data, then refine copy in live CMS mode on the public URL.</p>" }, 2),
          item({ title: "Publish & measure", body: "<p>Share URLs with stakeholders and track enrollments from linked catalog sections.</p>" }, 3),
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
        data: { placeholder: "Search courses, vendors, or skills…", domain: "skillhub-learning.com" },
        items: [
          item({ value: ".com", label: "skillhub-learning.com" }, 0),
          item({ value: ".io", label: "skillhub.io" }, 1),
          item({ value: ".cloud", label: "skillhub.cloud" }, 2),
        ],
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
        section_title: "Why teams choose SkillHub",
        sub_title: "Compare delivery quality, catalog depth, and time-to-launch against traditional LMS rollouts.",
        in_page_nav_title: "Why choose",
        items: [
          item(
            {
              title: "Vendor-authorized content",
              subtitle: "No outdated third-party copies",
              body: "<p>Every path links to official curricula from Microsoft, AWS, Google Cloud, and 50+ technology partners.</p>",
              image_url: IMG.hero,
            },
            0
          ),
          item(
            {
              title: "Faster page launches",
              subtitle: "Section library + live CMS",
              body: "<p>Pick from 58 registered layouts, drop them on a content page, and edit copy on the live URL the same day.</p>",
              image_url: IMG.laptop,
            },
            1
          ),
          item(
            {
              title: "Advisor-led rollouts",
              subtitle: "Enterprise onboarding",
              body: "<p>Dedicated learning advisors help scope cohorts, negotiate vendor bundles, and report ROI to leadership.</p>",
              image_url: IMG.collaboration,
            },
            2
          ),
          item(
            {
              title: "Flexible delivery formats",
              subtitle: "ILT · virtual · self-paced",
              body: "<p>Mix instructor-led bootcamps with on-demand modules so global teams learn in the format that fits their schedule.</p>",
              image_url: IMG.classroom,
            },
            3
          ),
        ],
      };

    case "feature_spotlight":
      return {
        section_title: "Feature spotlight",
        sub_title: "Asymmetric spotlight cards.",
        in_page_nav_title: "Spotlight",
        items: [
          item({ title: "Live CMS mode", subtitle: "Edit on the real page", body: "<p>Emerald toolbar unlocks section editing.</p>", image_url: IMG.gallery, href: "/?cms=true" }, 0),
          item({ title: "Section library", subtitle: "58 registered layouts", body: "<p>Filter by category and preview screenshots.</p>", image_url: IMG.hero, href: "/cms/section" }, 1),
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
        sub_title: "Self-paced, virtual instructor-led, and private cohort formats for every team size.",
        in_page_nav_title: "Training",
        items: [
          item(
            {
              title: "Self-paced on demand",
              subtitle: "Start anytime",
              body: "<p>Access labs, knowledge checks, and exam prep on your schedule. Ideal for individual contributors upskilling between projects.</p>",
              image_url: IMG.laptop,
              buttons: [btn("Browse self-paced", { target_url: "/courses" })],
            },
            0
          ),
          item(
            {
              title: "Virtual instructor-led",
              subtitle: "Live facilitation",
              body: "<p>Join scheduled sessions with certified instructors, breakout rooms, and Q&A — without travel costs.</p>",
              image_url: IMG.classroom,
              buttons: [btn("View schedule", { variant: "outline", target_url: "/contact-us" })],
            },
            1
          ),
          item(
            {
              title: "Private enterprise cohort",
              subtitle: "Dedicated advisor",
              body: "<p>Custom runbooks, branded portals, and weekly progress reviews for teams of 25–2,500 learners.</p>",
              image_url: IMG.conference,
              buttons: [btn("Request proposal", { target_url: "/contact-us" })],
            },
            2
          ),
        ],
      };

    case "team":
      return {
        section_title: "Meet the team",
        in_page_nav_title: "Team",
        items: [
          item({ title: "Alex Rivera", subtitle: "Head of Learning Strategy", body: "<p>Leads enterprise curriculum design and vendor partnerships across North America and EMEA.</p>", image_url: IMG.team }, 0),
          item({ title: "Jordan Lee", subtitle: "CMS Product Lead", body: "<p>Owns the section library, live editing experience, and content page workflows.</p>", image_url: IMG.story }, 1),
          item({ title: "Priya Nair", subtitle: "Principal Advisor", body: "<p>Guides Fortune 500 cohort planning, certification roadmaps, and executive reporting.</p>", image_url: IMG.collaboration }, 2),
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
        section_title: "How modern L&D teams ship faster",
        sub_title: "Sticky stacking story cards — scroll to reveal each chapter.",
        in_page_nav_title: "Stack",
        items: [
          item(
            {
              title: "Discover the catalog",
              subtitle: "Step 01",
              body: "<p>Filter by vendor, skilling area, delivery format, and certification level. Save shortlists for stakeholder review.</p>",
              image_url: IMG.hero,
            },
            0
          ),
          item(
            {
              title: "Curate learning paths",
              subtitle: "Step 02",
              body: "<p>Bundle courses into role-based journeys — cloud engineer, security analyst, data platform lead.</p>",
              image_url: IMG.gallery,
            },
            1
          ),
          item(
            {
              title: "Publish landing pages",
              subtitle: "Step 03",
              body: "<p>Attach section layouts to content pages and refine copy in live CMS mode on the public URL.</p>",
              image_url: IMG.laptop,
            },
            2
          ),
          item(
            {
              title: "Measure outcomes",
              subtitle: "Step 04",
              body: "<p>Track enrollments, completions, and exam pass rates. Report ROI to leadership each quarter.</p>",
              image_url: IMG.dataViz,
            },
            3
          ),
        ],
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
          item({ title: "How do I add a section to a content page?", body: "<p>Open the page in CMS mode and use <strong>Page settings → Add section</strong>. Pick a layout from the global catalog or create a variant from an existing type.</p>" }, 0),
          item({ title: "Can I preview all section types?", body: "<p>Yes — browse <strong>/cms/section</strong> and each category page for static, read-only previews with sample content.</p>" }, 1),
          item({ title: "How does live editing work?", body: "<p>Append <code>?cms=true</code> to any public URL when signed in as an admin. The emerald toolbar unlocks inline editing for sections, items, and buttons.</p>" }, 2),
          item({ title: "What is a section variant?", body: "<p>Variants share a <code>render_key</code> with the base layout but have their own unique <code>key</code> and default content — useful for reusable templates.</p>" }, 3),
          item({ title: "Can I hide filters on catalog sections?", body: "<p>Yes — lock filter params in the section's page context so vendor or skilling-area pages show a pre-filtered course grid.</p>" }, 4),
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
          item({ title: "Module 1 — Cloud foundations", subtitle: "8 hours · self-paced", body: "<p>Core concepts, shared responsibility model, and identity basics.</p>" }, 0),
          item({ title: "Module 2 — Core services", subtitle: "12 hours · labs", body: "<p>Compute, storage, networking, and monitoring hands-on exercises.</p>" }, 1),
          item({ title: "Module 3 — Security & compliance", subtitle: "10 hours · blended", body: "<p>Zero trust patterns, encryption, and audit logging workshops.</p>" }, 2),
          item({ title: "Module 4 — Certification prep", subtitle: "ILT · exam voucher", body: "<p>Instructor-led review sessions, practice tests, and exam scheduling support.</p>", buttons: [btn("Schedule exam", { target_url: "/contact-us" })] }, 3),
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
          item({ body: "SkillHub cut our vendor onboarding time in half. We went from spreadsheet chaos to a single source of truth for 200+ courses.", title: "L&D Director, Global FinServ" }, 0),
          item({ body: "The live CMS let us ship campaign landing pages same-day. Marketing no longer waits on engineering for copy tweaks.", title: "VP Marketing, SaaS" }, 1),
          item({ body: "Our cloud engineering cohort achieved a 94% certification pass rate after following the structured path SkillHub advisors built.", title: "Head of Cloud Enablement" }, 2),
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
          item({ body: "Best structured catalog we have evaluated — vendor metadata is actually accurate.", title: "CTO, Healthcare" }, 0),
          item({ body: "Live editing changed our release cadence from monthly deploys to same-day iterations.", title: "VP Marketing" }, 1),
          item({ body: "Clear paths from vendor certification to internal role requirements.", title: "Director of Enablement" }, 2),
          item({ body: "Advisors helped us negotiate a better Microsoft EA bundle tied to skilling outcomes.", title: "Procurement Lead" }, 3),
          item({ body: "Section library previews saved weeks of design exploration before we committed to layouts.", title: "Product Designer" }, 4),
        ],
      };

    case "partners":
      return {
        section_title: "Technology partners",
        sub_title: "Authorized training partners trusted by enterprise teams.",
        in_page_nav_title: "Partners",
        items: [
          item({ title: "Amazon", image_url: "https://images.netcomlearning.com/cms/logos/amazon-logo-training-partner.png" }, 0),
          item({ title: "Microsoft", image_url: "https://images.netcomlearning.com/cms/logos/microsoft-logo-training-partner.png" }, 1),
          item({ title: "Google Cloud", image_url: "https://images.netcomlearning.com/cms/logos/google-cloud-logo-training-partner.png" }, 2),
        ],
      };

    case "partners_marquee":
      return {
        section_title: "Partner logo marquee",
        sub_title: "Infinite-scroll partner strip with soft edge fade.",
        in_page_nav_title: "Marquee",
        items: [
          item({ title: "Amazon", image_url: "https://images.netcomlearning.com/cms/logos/amazon-logo-training-partner.png" }, 0),
          item({ title: "Bank of America", image_url: "https://images.netcomlearning.com/cms/logos/bank-of-america-logo-training-partner.png" }, 1),
          item({ title: "BMO", image_url: "https://images.netcomlearning.com/cms/logos/bmo-logo-training-partner.png" }, 2),
        ],
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
        section_title: "Transform how your organization learns",
        sub_title: "Full-bleed editorial hero with display typography over photography — built for campaign landing pages.",
        in_page_nav_title: "Editorial",
        section_img_url: IMG.workshop,
        data: {
          body: "<p>Pair this layout with in-page navigation and a course catalog section to turn awareness into enrollment.</p>",
        },
        buttons: [
          btn("Explore courses", { variant: "inverse", target_url: "/courses" }),
          btn("See vendors", { variant: "outline", target_url: "/vendors" }),
        ],
      };

    case "statement_band":
      return {
        section_title: "Capability compounds when learning is deliberate, measurable, and tied to outcomes.",
        sub_title: "Typography-led manifesto band over a soft image wash.",
        in_page_nav_title: "Statement",
        section_img_url: IMG.skyline,
        data: {
          eyebrow: "SkillHub philosophy",
          body: "<p>We help L&D teams move from one-off course purchases to durable skilling programs aligned with vendor roadmaps and business priorities.</p>",
        },
        buttons: [btn("Our approach", { variant: "inverse", target_url: "/about-us" })],
      };

    case "orbit_hero":
      return {
        section_title: "Launch your learning hub in days, not quarters",
        sub_title: "SaaS-style product frame with badge, dual CTAs, and browser preview imagery.",
        in_page_nav_title: "Orbit",
        section_img_url: IMG.laptop,
        data: {
          eyebrow: "New · Section library",
          body: "<p>58 registered layouts across hero, content, catalog, and social proof categories — all editable in live CMS mode.</p>",
        },
        buttons: [
          btn("Browse layouts", { target_url: "/cms/section" }),
          btn("Open CMS", { variant: "secondary", target_url: "/cms/pages" }),
        ],
      };

    case "site_builder_hero":
      return {
        section_title: "Build your branded learning site",
        sub_title: "Website-builder marketing hero with layered previews and bold display type.",
        in_page_nav_title: "Builder",
        section_img_url: IMG.campus,
        data: {
          eyebrow: "Website builder",
          body: "<p>Launch vendor hubs, product landing pages, and editorial journals without a custom front-end project.</p>",
        },
        buttons: [
          btn("See templates", { target_url: "/cms/pages" }),
          btn("Section library", { variant: "secondary", target_url: "/cms/section" }),
        ],
      };

    case "video_banner":
      return {
        in_page_nav_title: "Video",
        items: [
          item(
            {
              title: "See SkillHub in action",
              subtitle:
                "Watch how enterprise teams discover authorized training, map skilling paths, and publish live CMS pages — without a separate staging environment.",
              image_url: IMG.conference,
              href: SHOWCASE_VIDEO,
              buttons: [
                btn("Browse catalog", { variant: "inverse", target_url: "/courses" }),
                btn("Watch full demo", {
                  variant: "outline",
                  target_url: SHOWCASE_VIDEO,
                  open_in_new_tab: true,
                }),
              ],
            },
            0
          ),
        ],
      };

    case "faq_two_column":
      return {
        section_title: "FAQ — two columns",
        sub_title: "Title on one side, all questions stacked on the other. Set header_side to left or right.",
        in_page_nav_title: "FAQ 2-col",
        data: { header_side: "left" },
        buttons: [btn("Contact support", { variant: "outline", target_url: "/contact-us" })],
        items: [
          item(
            {
              title: "Can I use card-level buttons?",
              body: "<p>Yes — add buttons on each FAQ item for deep links.</p>",
              buttons: [btn("Docs", { variant: "link", target_url: "/cms" })],
            },
            0
          ),
          item(
            {
              title: "Where are previews?",
              body: "<p>Browse <strong>/cms/section</strong> by category.</p>",
            },
            1
          ),
          item(
            {
              title: "How do modals work?",
              body: "<p>See the Overlays category — timed promo modal with session dismiss.</p>",
            },
            2
          ),
          item(
            {
              title: "Section vs card CTAs?",
              body: "<p>Most item-driven sections support both section buttons and per-item buttons.</p>",
            },
            3
          ),
        ],
      };

    case "promo_modal":
      return {
        section_title: "Spring skill fest — 20% off cohorts",
        sub_title: "Limited-time offer for enterprise teams.",
        in_page_nav_title: "Modal",
        data: {
          body: "<p>Book a planning call this month and save on instructor-led delivery.</p>",
          open_delay_ms: 1200,
          storage_key: "showcase_promo_modal",
        },
        buttons: [
          btn("Claim offer", { target_url: "/contact-us" }),
          btn("Maybe later", { variant: "secondary", action_type: "anchor", target_id: "cms-section" }),
        ],
      };

    case "newsletter_band":
      return {
        section_title: "Product updates for L&D leaders",
        sub_title: "Monthly digest — no spam.",
        in_page_nav_title: "Newsletter",
        data: { email_placeholder: "you@company.com" },
        buttons: [btn("Subscribe", { target_url: "/contact-us" })],
      };

    case "form_split":
      return {
        section_title: "Talk to a learning advisor",
        sub_title:
          "Content on one side, a short static form on the other — flip columns in CMS.",
        in_page_nav_title: "Form",
        data: {
          content_side: "left",
          form_key: "lead",
          form_title: "Request a callback",
          form_subtitle: "Share a few details and we will reach out.",
          submit_label: "Send message",
          success_message:
            "Thanks — your message is in. We will respond within one business day.",
          body: "<p>Prefer a call? Mention your timezone in the message field.</p>",
        },
        buttons: [
          btn("View catalog", { variant: "outline", target_url: "/courses" }),
        ],
        items: [
          item(
            {
              title: "Enterprise rollouts",
              subtitle: "Cohort planning & vendor alignment",
            },
            0
          ),
          item(
            {
              title: "CMS & content pages",
              subtitle: "Live editing on public URLs",
            },
            1
          ),
        ],
      };

    case "comparison_table":
      return {
        section_title: "Delivery formats compared",
        in_page_nav_title: "Compare",
        buttons: [btn("Talk to an advisor", { target_url: "/contact-us" })],
        items: [
          item(
            {
              title: "Instructor-led",
              value: "Best for cohorts",
              body: "<p>Live facilitation, Q&A, and labs.</p>",
              buttons: [btn("ILT catalog", { variant: "link", target_url: "/courses" })],
            },
            0
          ),
          item(
            {
              title: "Self-paced",
              value: "Flexible",
              body: "<p>On-demand modules with knowledge checks.</p>",
              buttons: [btn("Browse", { variant: "link", target_url: "/courses" })],
            },
            1
          ),
          item(
            {
              title: "Blended",
              value: "Recommended",
              body: "<p>Mix live sessions with async practice.</p>",
            },
            2
          ),
        ],
      };

    case "media_mosaic":
      return {
        section_title: "Moments from the field",
        sub_title: "Image mosaic with optional tile CTAs.",
        in_page_nav_title: "Mosaic",
        items: [
          item(
            {
              title: "Cohort kickoff",
              subtitle: "Enterprise rollout · 240 learners",
              image_url: IMG.conference,
              buttons: [btn("Case study", { variant: "inverse", target_url: "/blogs" })],
            },
            0
          ),
          item({ title: "Hands-on lab day", subtitle: "Azure fundamentals", image_url: IMG.classroom }, 1),
          item({ title: "Certification week", subtitle: "Exam prep intensive", image_url: IMG.workshop }, 2),
          item({ title: "Advisor workshop", subtitle: "Skilling roadmap", image_url: IMG.collaboration }, 3),
          item({ title: "Leadership briefing", subtitle: "ROI review", image_url: IMG.skyline }, 4),
        ],
      };

    case "timeline_vertical":
      return {
        section_title: "How we onboard your team",
        in_page_nav_title: "Timeline",
        items: [
          item(
            {
              subtitle: "Week 1",
              title: "Discovery",
              body: "<p>Align on roles, timelines, and success metrics.</p>",
              buttons: [btn("Workshop", { variant: "outline", target_url: "/contact-us" })],
            },
            0
          ),
          item(
            {
              subtitle: "Week 2–3",
              title: "Curate paths",
              body: "<p>Map vendors, products, and delivery format.</p>",
            },
            1
          ),
          item(
            {
              subtitle: "Week 4+",
              title: "Launch & measure",
              body: "<p>Go live with reporting and advisor check-ins.</p>",
              buttons: [btn("View analytics", { variant: "link", target_url: "/cms" })],
            },
            2
          ),
        ],
      };

    case "trust_badges":
      return {
        section_title: "Enterprise-ready",
        sub_title: "Compliance and security signals.",
        in_page_nav_title: "Trust",
        buttons: [btn("Security pack", { variant: "outline", target_url: "/contact-us" })],
        items: [
          item({ title: "SOC 2", subtitle: "Type II", value: "SOC2" }, 0),
          item({ title: "GDPR", subtitle: "EU ready", value: "GDPR" }, 1),
          item({ title: "ISO 27001", subtitle: "Certified", value: "ISO" }, 2),
          item({ title: "WCAG", subtitle: "AA target", value: "A11y" }, 3),
        ],
      };

    case "split_cta":
      return {
        section_title: "Accelerate growth with structured learning",
        sub_title:
          "Build expertise across AI, cloud, security, and data with vendor-aligned paths — outcomes for teams and enterprises.",
        in_page_nav_title: "Contact",
        section_img_url:
          "https://images.netcomlearning.com/cms/images/cloud-connect.webp",
        data: { image_side: "right" },
        buttons: [
          btn("Contact Us", {
            target_url: "/contact-us",
            variant: "primary",
          }),
        ],
      };

    case "learning_path":
      return {
        section_title: "Azure administrator path",
        in_page_nav_title: "Path",
        buttons: [btn("Enroll team", { target_url: "/courses" })],
        items: [
          item(
            {
              value: "1",
              title: "Cloud fundamentals",
              subtitle: "8 hrs · self-paced",
              body: "<p>Core Azure concepts and governance.</p>",
              buttons: [btn("Start", { variant: "outline", target_url: "/courses" })],
            },
            0
          ),
          item(
            {
              value: "2",
              title: "Compute & networking",
              subtitle: "16 hrs · blended",
              body: "<p>VMs, VNets, and load balancing labs.</p>",
            },
            1
          ),
          item(
            {
              value: "3",
              title: "Certification prep",
              subtitle: "ILT · exam voucher",
              body: "<p>Instructor-led review and practice tests.</p>",
              buttons: [btn("Schedule", { target_url: "/contact-us" })],
            },
            2
          ),
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
        section_img_url: heroImages[k] || undefined,
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
              image_url: IMG.hero,
              buttons: [btn("Browse catalog", { variant: "inverse", target_url: "/courses" })],
            },
            0
          ),
          item(
            {
              title: "Close skill gaps faster",
              subtitle: "Role-based paths with labs and certification prep.",
              body: "<p>Map cloud, security, and data competencies to the roles on your hiring plan.</p>",
              image_url: IMG.classroom,
              buttons: [btn("View vendors", { variant: "inverse", target_url: "/vendors" })],
            },
            1
          ),
          item(
            {
              title: "Publish pages without deploys",
              subtitle: "Live CMS on every public URL.",
              image_url: IMG.laptop,
              buttons: [btn("Try CMS mode", { variant: "inverse", target_url: "/?cms=true" })],
            },
            2
          ),
        ],
      };

    case "hero_stats":
      return {
        ...heroCopy,
        in_page_nav_title: "Stats hero",
        items: [
          item({ value: "67+", label: "Section types" }, 0),
          item({ value: "18", label: "Categories" }, 1),
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

export function sectionsInCategory(categoryKey) {
  const keys = SECTIONS_BY_CATEGORY[categoryKey];
  if (keys?.length) return keys;
  return SECTION_CATALOG.filter((entry) => entry.category === categoryKey)
    .map((entry) => entry.key)
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
      sub_title: `${keys.length} registered layouts in the SkillHub section library. Scroll to preview each component with realistic sample content, imagery, and CTAs.`,
      section_img_url: IMG.hero,
      buttons: [
        btn("All categories", { target_url: "/cms/section" }),
        btn("Section admin", {
          variant: "secondary",
          target_url: `/cms/pages-content-sections?category=${categoryKey}`,
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
    sub_title: "Every section type has a dedicated showcase page under /cms/section.",
    buttons: [
      btn("Section library home", { target_url: "/cms/section" }),
      btn("Section admin", {
        variant: "secondary",
        target_url: `/cms/pages-content-sections?category=${categoryKey}`,
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
        href: `/cms/section/${slug}`,
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
        "CMS section components across 18 categories — each with a live preview on a content page. Pick a category below or open the admin library to map sections onto your pages.",
      buttons: [
        btn("Open CMS sections", { target_url: "/cms/pages-content-sections" }),
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
            subtitle: `/cms/section/${CATEGORY_SLUG[cat.key] || cat.key}`,
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
      sub_title: "Public previews under /cms/section/* — one page per CMS category.",
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
            body: "<p>Add any section to a free-form content page from the CMS section catalog.</p>",
          },
          1
        ),
        item(
          {
            title: "Browse by category",
            body: "<p>Each category page shows every registered layout with sample copy.</p>",
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
