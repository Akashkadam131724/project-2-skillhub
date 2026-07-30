import { btn, item } from "./content-page-seed-helpers.js";
import { loadUploadsManifest, pickFolderImage, pickFolderImages } from "./upload-manifest.js";

/** @typedef {{ path: string, slug: string, name: string, description: string, sortOrder: number, type: 'campaign'|'promotion', folderId: string, headline: string, subhead: string, badge?: string, highlights: object[], primaryCta: { label: string, url: string }, secondaryCta?: { label: string, url: string } }} PromoPageDef */

export const CAMPAIGN_CHILD_PAGES = [
  {
    path: "/campaigns/microsoft-skill-fest",
    slug: "campaign-microsoft-skill-fest",
    name: "Microsoft Skill Fest",
    description: "Limited-time Azure, security, and Copilot workshops with Microsoft-certified facilitators.",
    sortOrder: 210,
    type: "campaign",
    folderId: "business-cloud",
    badge: "Limited time",
    headline: "Microsoft Skill Fest — cloud & AI sprint",
    subhead: "Hands-on labs, certification prep, and office hours for enterprise teams.",
    primaryCta: { label: "Register your team", url: "/contact-us" },
    secondaryCta: { label: "Azure courses", url: "/vendor/microsoft" },
    highlights: [
      { title: "Azure foundations", body: "Architecture, identity, and cost governance labs for platform teams." },
      { title: "Security & compliance", body: "Zero-trust workshops aligned to Microsoft Secure best practices." },
      { title: "Copilot & AI", body: "Responsible AI patterns and Copilot readiness for knowledge workers." },
    ],
  },
  {
    path: "/campaigns/aws-cloud-day",
    slug: "campaign-aws-cloud-day",
    name: "AWS Cloud Day",
    description: "One-day intensive for teams migrating workloads or maturing their AWS estate.",
    sortOrder: 220,
    type: "campaign",
    folderId: "business-cloud",
    badge: "Regional event",
    headline: "AWS Cloud Day — build, secure, optimize",
    subhead: "Architecture reviews, Well-Architected labs, and FinOps clinics in a single sprint.",
    primaryCta: { label: "Book a seat", url: "/get-started" },
    secondaryCta: { label: "AWS vendor page", url: "/vendor/amazon-web-services" },
    highlights: [
      { title: "Migration playbooks", body: "Lift-and-shift vs. refactor decision frameworks with live examples." },
      { title: "Security track", body: "IAM, networking, and detective controls for multi-account estates." },
      { title: "Cost optimization", body: "FinOps dashboards and commitment strategies that finance will approve." },
    ],
  },
  {
    path: "/campaigns/security-awareness-month",
    slug: "campaign-security-awareness-month",
    name: "Security Awareness Month",
    description: "October-style security campaign — phishing drills, zero-trust literacy, and SOC workshops.",
    sortOrder: 230,
    type: "campaign",
    folderId: "business-security",
    badge: "Enterprise",
    headline: "Security Awareness Month",
    subhead: "Role-based security training for engineers, managers, and compliance teams.",
    primaryCta: { label: "Plan your campaign", url: "/contact-us" },
    secondaryCta: { label: "Security solutions", url: "/solutions/security" },
    highlights: [
      { title: "Engineering track", body: "Secure SDLC, secrets management, and incident response drills." },
      { title: "Leadership track", body: "Risk framing, board reporting, and investment prioritization." },
      { title: "Compliance modules", body: "Mappings to common frameworks without death-by-slide-deck." },
    ],
  },
  {
    path: "/campaigns/ai-data-academy",
    slug: "campaign-ai-data-academy",
    name: "AI & Data Academy Launch",
    description: "Launch your internal AI academy with curated paths for analysts, engineers, and product leaders.",
    sortOrder: 240,
    type: "campaign",
    folderId: "business-ai",
    badge: "New program",
    headline: "Launch your AI & Data Academy",
    subhead: "From literacy to production ML — cohort design included.",
    primaryCta: { label: "Start a pilot", url: "/get-started" },
    secondaryCta: { label: "AI solutions", url: "/solutions/business-ai" },
    highlights: [
      { title: "Role paths", body: "Analyst, ML engineer, and product leader tracks with capstone labs." },
      { title: "Governance", body: "Responsible AI, data contracts, and model risk basics for regulated teams." },
      { title: "Executive briefing", body: "Sponsor workshop to align funding and adoption metrics." },
    ],
  },
  {
    path: "/campaigns/cisco-networking-sprint",
    slug: "campaign-cisco-networking-sprint",
    name: "Cisco Networking Sprint",
    description: "Four-week networking intensive — routing, automation, and observability for hybrid estates.",
    sortOrder: 250,
    type: "campaign",
    folderId: "business-networking",
    badge: "4-week cohort",
    headline: "Cisco Networking Sprint",
    subhead: "Certification-aligned labs for NOC and platform networking teams.",
    primaryCta: { label: "Reserve cohort", url: "/contact-us" },
    secondaryCta: { label: "Cisco courses", url: "/vendor/cisco" },
    highlights: [
      { title: "Core routing", body: "BGP, OSPF, and policy in environments your engineers actually run." },
      { title: "Automation", body: "Ansible and API-driven operations for repeatable change windows." },
      { title: "Observability", body: "Telemetry, flow analysis, and runbooks for hybrid connectivity." },
    ],
  },
];

export const PROMOTION_CHILD_PAGES = [
  {
    path: "/promotions/enterprise-pilot",
    slug: "promotion-enterprise-pilot",
    name: "Enterprise Pilot Offer",
    description: "90-day pilot — one business unit, advisor hours, and executive readiness reporting included.",
    sortOrder: 310,
    type: "promotion",
    folderId: "business-leadership",
    badge: "Pilot offer",
    headline: "Enterprise pilot — prove value in 90 days",
    subhead: "Scoped cohort, adoption metrics, and a scale plan your sponsors can fund.",
    primaryCta: { label: "Claim pilot offer", url: "/contact-us" },
    secondaryCta: { label: "How we work", url: "/get-started" },
    highlights: [
      { title: "Advisor included", body: "Discovery, path design, and weekly office hours for pilot leads." },
      { title: "Executive dashboard", body: "Completion, skill signals, and manager sentiment — not vanity metrics." },
      { title: "Scale roadmap", body: "Exit report with recommended waves, vendors, and budget ranges." },
    ],
  },
  {
    path: "/promotions/certification-sprint",
    slug: "promotion-certification-sprint",
    name: "Certification Sprint Bundle",
    description: "Bundle instructor-led prep, labs, and exam vouchers for certification-heavy quarters.",
    sortOrder: 320,
    type: "promotion",
    folderId: "business-tech",
    badge: "Bundle",
    headline: "Certification sprint bundle",
    subhead: "Azure, AWS, or Security — pick a vendor track and run a 6-week sprint.",
    primaryCta: { label: "Request pricing", url: "/contact-us" },
    secondaryCta: { label: "Browse products", url: "/products" },
    highlights: [
      { title: "Official curriculum", body: "Vendor-authorized content with certified facilitators." },
      { title: "Exam readiness", body: "Practice assessments and office hours before voucher use." },
      { title: "Team pricing", body: "Volume tiers for cohorts of 12, 24, or 48 learners." },
    ],
  },
  {
    path: "/promotions/q3-learning-credit",
    slug: "promotion-q3-learning-credit",
    name: "Q3 Learning Credit",
    description: "Pre-purchase learning credits with bonus advisor time — use across vendors through year-end.",
    sortOrder: 330,
    type: "promotion",
    folderId: "business-stock",
    badge: "Seasonal",
    headline: "Q3 learning credit — 15% bonus advisor time",
    subhead: "Flexible credits across vendors, products, and private cohorts.",
    primaryCta: { label: "Talk to sales", url: "/contact-us" },
    secondaryCta: { label: "View catalog", url: "/courses" },
    highlights: [
      { title: "Flexible spend", body: "Apply credits to public schedules or private virtual rooms." },
      { title: "Bonus advisory", body: "15% extra strategist hours when purchased before quarter close." },
      { title: "Rollover options", body: "Unused credits roll with approval — no use-it-or-lose-it panic." },
    ],
  },
  {
    path: "/promotions/healthcare-compliance-pack",
    slug: "promotion-healthcare-compliance-pack",
    name: "Healthcare Compliance Pack",
    description: "Bundled security and compliance modules for healthcare IT and clinical engineering teams.",
    sortOrder: 340,
    type: "promotion",
    folderId: "business-health",
    badge: "Industry pack",
    headline: "Healthcare compliance learning pack",
    subhead: "Security, privacy, and platform skills for regulated delivery teams.",
    primaryCta: { label: "Get the pack", url: "/contact-us" },
    secondaryCta: { label: "Healthcare solutions", url: "/solutions/health" },
    highlights: [
      { title: "Privacy & PHI", body: "Role-based modules for clinical, IT, and vendor management staff." },
      { title: "Security operations", body: "Incident drills tailored to hospital and payer environments." },
      { title: "Platform literacy", body: "Cloud and EHR-adjacent skills without ignoring compliance constraints." },
    ],
  },
];

function promoPlacements(def, hubPath, hubLabel) {
  const m = loadUploadsManifest();
  const hero = pickFolderImage(def.folderId, m, 0);
  const imgs = pickFolderImages(def.folderId, m, 3, 1);

  return [
    { section_key: "in_page_nav", sort_order: 0 },
    {
      section_key: "editorial_banner",
      sort_order: 1,
      section_title: def.headline,
      sub_title: def.subhead,
      in_page_nav_title: def.badge || (def.type === "campaign" ? "Campaign" : "Offer"),
      section_img_url: hero,
      data: {
        body: `<p>${def.description}</p>`,
        eyebrow: def.badge || "",
      },
      buttons: [
        btn(def.primaryCta.label, { target_url: def.primaryCta.url, sort_order: 0 }),
        ...(def.secondaryCta
          ? [btn(def.secondaryCta.label, { variant: "secondary", target_url: def.secondaryCta.url, sort_order: 1 })]
          : []),
      ],
    },
    {
      section_key: "stats",
      sort_order: 2,
      section_title: "Offer at a glance",
      in_page_nav_title: "Details",
      items: [
        item({ value: def.badge || "Live", label: "Status" }, 0),
        item({ value: "14d", label: "Typical kickoff" }, 1),
        item({ value: "Virtual", label: "Delivery" }, 2),
        item({ value: "Global", label: "Regions" }, 3),
      ],
    },
    {
      section_key: "feature_spotlight",
      sort_order: 3,
      section_title: "What's included",
      in_page_nav_title: "Includes",
      items: def.highlights.map((h, i) =>
        item(
          {
            value: String(i + 1).padStart(2, "0"),
            title: h.title,
            body: `<p>${h.body}</p>`,
            image_url: imgs[i] || hero,
          },
          i
        )
      ),
    },
    {
      section_key: "process_steps",
      sort_order: 4,
      section_title: "How to join",
      in_page_nav_title: "Join",
      items: [
        item({ title: "Contact us", body: "<p>Tell us your team size, region, and target skills.</p>" }, 0),
        item({ title: "Scope the offer", body: "<p>We tailor modules and dates to your fiscal calendar.</p>" }, 1),
        item({ title: "Launch cohort", body: "<p>Instructor-led delivery with labs and office hours.</p>" }, 2),
        item({ title: "Measure & scale", body: "<p>Review adoption and plan the next wave.</p>" }, 3),
      ],
    },
    {
      section_key: "faq",
      sort_order: 5,
      section_title: "Questions",
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: "Can we combine with existing credits?",
            body: "<p>Yes — promotions stack with learning credits where noted in your order form.</p>",
          },
          0
        ),
        item(
          {
            title: "Is this available globally?",
            body: "<p>Virtual delivery spans regions; onsite options depend on facilitator availability.</p>",
          },
          1
        ),
      ],
    },
    {
      section_key: "cta_band",
      sort_order: 6,
      section_title: "Ready to move?",
      buttons: [
        btn(def.primaryCta.label, { target_url: def.primaryCta.url, sort_order: 0 }),
        btn(`All ${hubLabel}`, { variant: "secondary", target_url: hubPath, sort_order: 1 }),
      ],
    },
  ];
}

function hubPlacements(config) {
  const m = loadUploadsManifest();
  const hero = pickFolderImage(config.folderId, m, 0);
  const imgs = pickFolderImages(config.folderId, m, 8, 0);

  const cards = config.children.map((child, i) =>
    item(
      {
        value: child.badge || "",
        title: child.name,
        subtitle: child.path,
        body: `<p>${child.description}</p>`,
        image_url: imgs[i % imgs.length] || hero,
        buttons: [btn("View offer", { target_url: child.path, variant: "link" })],
      },
      i
    )
  );

  return [
    { section_key: "in_page_nav", sort_order: 0 },
    {
      section_key: "editorial_banner",
      sort_order: 1,
      section_title: config.headline,
      sub_title: config.subhead,
      in_page_nav_title: config.navTitle,
      section_img_url: hero,
      data: { body: `<p>${config.description}</p>` },
      buttons: [
        btn(config.primaryCta.label, { target_url: config.primaryCta.url, sort_order: 0 }),
        btn(config.secondaryCta.label, {
          variant: "secondary",
          target_url: config.secondaryCta.url,
          sort_order: 1,
        }),
      ],
    },
    {
      section_key: "feature_spotlight",
      sort_order: 2,
      section_title: config.spotlightTitle,
      sub_title: "Current offers with local imagery and CMS-managed copy.",
      in_page_nav_title: "Offers",
      items: cards,
    },
    {
      section_key: "cta_band",
      sort_order: 3,
      section_title: config.ctaTitle,
      sub_title: config.ctaSubhead,
      buttons: [
        btn("Contact sales", { target_url: "/contact-us", sort_order: 0 }),
        btn("Get started", { variant: "secondary", target_url: "/get-started", sort_order: 1 }),
      ],
    },
  ];
}

export function allCampaignPromotionPageDefs() {
  const campaignsHub = {
    path: "/campaigns",
    slug: "campaigns",
    name: "Campaigns",
    description: "Seasonal campaigns and vendor sprints — Azure, AWS, security, AI, and networking.",
    sortOrder: 200,
    placements: () =>
      hubPlacements({
        folderId: "business-cloud",
        navTitle: "Campaigns",
        headline: "Active learning campaigns",
        subhead: "Time-bound programs with labs, certification prep, and facilitator office hours.",
        description:
          "SkillHub campaigns bundle official vendor curriculum with cohort operations — so your teams ship skills on a deadline.",
        spotlightTitle: "Current campaigns",
        ctaTitle: "Run a campaign with SkillHub",
        ctaSubhead: "We design the cohort, schedule facilitators, and report adoption to your sponsors.",
        primaryCta: { label: "Plan a campaign", url: "/contact-us" },
        secondaryCta: { label: "Browse solutions", url: "/solutions" },
        children: CAMPAIGN_CHILD_PAGES,
      }),
  };

  const promotionsHub = {
    path: "/promotions",
    slug: "promotions",
    name: "Promotions",
    description: "Pilot offers, certification bundles, learning credits, and industry packs.",
    sortOrder: 300,
    placements: () =>
      hubPlacements({
        folderId: "business-leadership",
        navTitle: "Promotions",
        headline: "Promotions & special offers",
        subhead: "Enterprise pilots, bundles, and seasonal credits — designed for procurement cycles.",
        description:
          "Promotions make it easier to fund the first wave of upskilling — with clear scope, pricing, and scale paths.",
        spotlightTitle: "Active promotions",
        ctaTitle: "Redeem an offer",
        ctaSubhead: "Talk to SkillHub sales — we will map the right promotion to your team size and timeline.",
        primaryCta: { label: "Contact sales", url: "/contact-us" },
        secondaryCta: { label: "View campaigns", url: "/campaigns" },
        children: PROMOTION_CHILD_PAGES,
      }),
  };

  const campaignChildren = CAMPAIGN_CHILD_PAGES.map((child) => ({
    ...child,
    placements: () => promoPlacements(child, "/campaigns", "campaigns"),
  }));

  const promotionChildren = PROMOTION_CHILD_PAGES.map((child) => ({
    ...child,
    placements: () => promoPlacements(child, "/promotions", "promotions"),
  }));

  return [campaignsHub, promotionsHub, ...campaignChildren, ...promotionChildren];
}

export const CAMPAIGN_PATHS = ["/campaigns", ...CAMPAIGN_CHILD_PAGES.map((p) => p.path)];
export const PROMOTION_PATHS = ["/promotions", ...PROMOTION_CHILD_PAGES.map((p) => p.path)];
