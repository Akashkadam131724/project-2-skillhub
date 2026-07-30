import { btn, item } from "./content-page-seed-helpers.js";
import { buildSolutionPlacements, solutionCopyForFolder } from "./feed-seed-shared.js";
import { loadUploadsManifest, pickFolderImage, pickFolderImages } from "./upload-manifest.js";

function hubHero(folderId, title, subhead, body) {
  const m = loadUploadsManifest();
  const hero = pickFolderImage(folderId, m, 0);
  const imgs = pickFolderImages(folderId, m, 4, 1);
  return { hero, imgs, m };
}

export function aboutUsPlacements() {
  const { hero, imgs } = hubHero(
    "business-leadership",
    "About SkillHub",
    "Enterprise learning that compounds",
    "SkillHub partners with global enterprises to design academies, run cohorts, and measure skill lift — not just course completion."
  );
  return [
    { section_key: "in_page_nav", sort_order: 0 },
    {
      section_key: "editorial_banner",
      sort_order: 1,
      section_title: "Enterprise learning built for outcomes",
      sub_title: "We help leaders close capability gaps with role-based programs, labs, and measurable adoption.",
      in_page_nav_title: "About",
      section_img_url: hero,
      data: {
        body: "<p>SkillHub combines authorized vendor curriculum with program design, facilitation, and executive visibility — so upskilling sticks after launch.</p>",
      },
      buttons: [
        btn("Talk to us", { target_url: "/contact-us", sort_order: 0 }),
        btn("Our team", { variant: "secondary", target_url: "/our-team", sort_order: 1 }),
      ],
    },
    {
      section_key: "overview",
      sort_order: 2,
      section_title: "Why enterprises choose SkillHub",
      in_page_nav_title: "Story",
      data: {
        body: "<p>From discovery to delivery, we align learning paths to business priorities — cloud migration, security readiness, data literacy, and leadership at scale.</p>",
      },
    },
    {
      section_key: "stats",
      sort_order: 3,
      section_title: "Impact at a glance",
      in_page_nav_title: "Impact",
      items: [
        item({ value: "120+", label: "Enterprise clients" }, 0),
        item({ value: "8.5k+", label: "Learners annually" }, 1),
        item({ value: "92%", label: "Satisfaction score" }, 2),
        item({ value: "14d", label: "Typical pilot launch" }, 3),
      ],
    },
    {
      section_key: "text_media",
      sort_order: 4,
      in_page_nav_title: "Approach",
      items: [
        item(
          {
            title: "Advisory-led design",
            body: "<p>We map roles, skills, and certification goals before selecting modules from vendor catalogs.</p>",
            image_url: imgs[0] || hero,
            value: "end",
          },
          0
        ),
        item(
          {
            title: "Delivery that ships",
            body: "<p>Instructor-led cohorts with labs your engineers recognize — virtual, onsite, or blended.</p>",
            image_url: imgs[1] || imgs[0],
            value: "start",
          },
          1
        ),
      ],
    },
    {
      section_key: "why_choose",
      sort_order: 5,
      section_title: "What sets us apart",
      in_page_nav_title: "Why us",
      items: [
        item({ title: "Authorized partners", body: "Official curriculum from Microsoft, AWS, Cisco, and more." }, 0),
        item({ title: "Program operations", body: "Cohort scheduling, comms, and adoption loops built in." }, 1),
        item({ title: "Executive reporting", body: "Leaders see readiness — not vanity completion metrics." }, 2),
      ],
    },
    {
      section_key: "faq",
      sort_order: 6,
      section_title: "About SkillHub",
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: "Do you work globally?",
            body: "<p>Yes — virtual delivery spans regions with localized scheduling.</p>",
          },
          0
        ),
        item(
          {
            title: "Can we start with a pilot?",
            body: "<p>Most enterprises begin with a 4–8 week pilot before scaling.</p>",
          },
          1
        ),
      ],
    },
    {
      section_key: "cta_band",
      sort_order: 7,
      section_title: "Ready to scope your academy?",
      sub_title: "We will help you design the first cohort in two weeks.",
      buttons: [
        btn("Contact us", { target_url: "/contact-us", sort_order: 0 }),
        btn("Get started", { variant: "secondary", target_url: "/get-started", sort_order: 1 }),
      ],
    },
  ];
}

export function ourTeamPlacements() {
  const { hero, imgs } = hubHero("business-stock", "Our team", "", "");
  const members = [
    ["Priya Sharma", "CEO & Co-founder", "Program strategy and enterprise partnerships."],
    ["James Okonkwo", "VP Delivery", "Cohort design and facilitator networks."],
    ["Elena Vasquez", "Head of Curriculum", "Vendor paths and certification alignment."],
    ["Marcus Chen", "Director, Cloud Practice", "Architecture academies and labs."],
    ["Sarah Mitchell", "Director, Security", "Zero-trust and compliance programs."],
    ["David Park", "Customer Success", "Adoption metrics and executive reporting."],
  ];
  return [
    { section_key: "in_page_nav", sort_order: 0 },
    {
      section_key: "editorial_banner",
      sort_order: 1,
      section_title: "People behind the programs",
      sub_title: "Practitioners, program operators, and advisors who have shipped at scale.",
      in_page_nav_title: "Team",
      section_img_url: hero,
      data: { body: "<p>SkillHub teams blend learning design, technical depth, and customer success.</p>" },
    },
    {
      section_key: "team",
      sort_order: 2,
      section_title: "Leadership & delivery",
      in_page_nav_title: "Leaders",
      items: members.map(([title, subtitle, body], i) =>
        item(
          {
            title,
            subtitle,
            body: `<p>${body}</p>`,
            image_url: imgs[i % imgs.length] || hero,
          },
          i
        )
      ),
    },
    {
      section_key: "cta_band",
      sort_order: 3,
      section_title: "Join the team",
      sub_title: "We are hiring program operators and technical facilitators.",
      buttons: [btn("View careers", { target_url: "/company/careers", sort_order: 0 })],
    },
  ];
}

export function solutionsHubPlacements() {
  const m = loadUploadsManifest();
  const folder = { id: "business-cloud", suggestedPage: { title: "Solutions", path: "/solutions" } };
  return buildSolutionPlacements(folder, m).map((p) => {
    if (p.section_key === "editorial_banner") {
      return {
        ...p,
        section_title: "Solutions for every capability domain",
        sub_title: "Cloud, security, data, networking, and leadership — programs designed around outcomes.",
        in_page_nav_title: "Solutions",
      };
    }
    return p;
  });
}

export function getStartedPlacements() {
  const copy = solutionCopyForFolder("business-leadership");
  const { hero, imgs } = hubHero("business-leadership", "Get started", copy.subhead, copy.overview);
  return [
    { section_key: "in_page_nav", sort_order: 0 },
    {
      section_key: "editorial_banner",
      sort_order: 1,
      section_title: "Launch your SkillHub pilot",
      sub_title: "Discovery → design → deliver → measure in as little as two weeks.",
      in_page_nav_title: "Start",
      section_img_url: hero,
      data: { body: `<p>${copy.overview}</p>` },
      buttons: [
        btn("Contact us", { target_url: "/contact-us", sort_order: 0 }),
        btn("Browse catalog", { variant: "secondary", target_url: "/courses", sort_order: 1 }),
      ],
    },
    {
      section_key: "process_steps",
      sort_order: 2,
      section_title: "How onboarding works",
      in_page_nav_title: "Process",
      items: [
        item({ title: "Discovery call", body: "<p>Align on roles, timelines, and success metrics.</p>" }, 0),
        item({ title: "Path design", body: "<p>Curate vendor modules and academy tracks.</p>" }, 1),
        item({ title: "Pilot cohort", body: "<p>Run a focused group with labs and office hours.</p>" }, 2),
        item({ title: "Scale & measure", body: "<p>Review adoption and plan the next wave.</p>" }, 3),
      ],
    },
    {
      section_key: "text_media",
      sort_order: 3,
      in_page_nav_title: "Why pilot",
      items: [
        item(
          {
            title: "Prove value fast",
            body: "<p>A pilot de-risks investment before enterprise rollout.</p>",
            image_url: imgs[0] || hero,
            value: "end",
          },
          0
        ),
      ],
    },
    {
      section_key: "faq",
      sort_order: 4,
      section_title: "Getting started FAQ",
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: "How long does setup take?",
            body: "<p>Most pilots launch within 14 days of discovery.</p>",
          },
          0
        ),
      ],
    },
    {
      section_key: "cta_band",
      sort_order: 5,
      section_title: "Book a discovery session",
      buttons: [btn("Contact us", { target_url: "/contact-us", sort_order: 0 })],
    },
  ];
}

export const BUSINESS_CONTENT_PAGES = [
  {
    path: "/about-us",
    slug: "about-us",
    name: "About Us",
    description: "Learn about SkillHub — mission, story, and approach.",
    sortOrder: 10,
    placements: aboutUsPlacements,
  },
  {
    path: "/our-team",
    slug: "our-team",
    name: "Our Team",
    description: "Meet the people behind SkillHub.",
    sortOrder: 20,
    placements: ourTeamPlacements,
  },
  {
    path: "/solutions",
    slug: "solutions",
    name: "Solutions",
    description: "Enterprise learning solutions across cloud, security, data, and transformation.",
    sortOrder: 30,
    placements: solutionsHubPlacements,
  },
  {
    path: "/get-started",
    slug: "get-started",
    name: "Get Started",
    description: "Launch a SkillHub pilot — discovery to measurable outcomes.",
    sortOrder: 40,
    placements: getStartedPlacements,
  },
];
