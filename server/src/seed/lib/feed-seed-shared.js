import feedMappings from "../data/feed-mappings.json" with { type: "json" };
import { btn, item } from "./content-page-seed-helpers.js";
import { pickFolderImage, pickFolderImages } from "./upload-manifest.js";

export function solutionCopyForFolder(folderId) {
  return (
    feedMappings.solutionCopy[folderId] || {
      eyebrow: "SkillHub programs",
      headline: "Enterprise learning that compounds",
      subhead: "Role-based paths, labs, and measurable outcomes.",
      overview:
        "SkillHub partners with enterprises to design academies, cohorts, and certification journeys aligned to business priorities.",
      catalogQuery: "/courses",
    }
  );
}

export function folderIdForSkillingSlug(slug) {
  return feedMappings.skillingFolderBySlug[slug] || "business-tech";
}

export function folderIdForIndustrySlug(slug) {
  return feedMappings.industryFolderBySlug[slug] || "business-stock";
}

/** CMS placements for a manifest-driven content / solution page. */
export function buildSolutionPlacements(folder, manifest) {
  const folderId = folder.id;
  const copy = solutionCopyForFolder(folderId);
  const title = folder.suggestedPage?.title || folder.label || "Solutions";
  const path = folder.suggestedPage?.path || "/solutions";
  const hero = pickFolderImage(folderId, manifest, 0);
  const imgs = pickFolderImages(folderId, manifest, 6, 1);
  const [img1, img2, img3, img4, img5, img6] = imgs;

  return [
    { section_key: "in_page_nav", sort_order: 0 },
    {
      section_key: "editorial_banner",
      sort_order: 1,
      section_title: copy.headline,
      sub_title: copy.subhead,
      in_page_nav_title: copy.eyebrow || "Solutions",
      section_img_url: hero || img1 || "",
      data: {
        body: `<p>${copy.overview}</p>`,
      },
      buttons: [
        btn("Browse programs", {
          target_url: copy.catalogQuery || "/courses",
          sort_order: 0,
        }),
        btn("Talk to us", {
          variant: "secondary",
          target_url: "/contact-us",
          sort_order: 1,
        }),
      ],
    },
    {
      section_key: "overview",
      sort_order: 2,
      section_title: title,
      sub_title: copy.eyebrow,
      in_page_nav_title: "Overview",
      data: { body: `<p>${copy.overview}</p>` },
    },
    {
      section_key: "text_media",
      sort_order: 3,
      in_page_nav_title: "Approach",
      items: [
        item(
          {
            title: "Assess readiness",
            body: "<p>Baseline skills and role requirements with advisors who understand your stack and operating model.</p>",
            image_url: img2 || hero,
            value: "end",
          },
          0
        ),
        item(
          {
            title: "Deliver with practice",
            body: "<p>Instructor-led depth plus labs so teams apply skills in week one — not after the program ends.</p>",
            image_url: img3 || img1,
            value: "start",
          },
          1
        ),
      ],
    },
    {
      section_key: "feature_spotlight",
      sort_order: 4,
      section_title: "What teams gain",
      sub_title: "Outcomes we design every program around.",
      in_page_nav_title: "Outcomes",
      items: [
        item(
          {
            value: "01",
            title: "Role clarity",
            subtitle: "Paths mapped to jobs",
            body: "<p>Every cohort ties to a role profile — not a generic catalog dump.</p>",
            image_url: img4 || img2,
          },
          0
        ),
        item(
          {
            value: "02",
            title: "Hands-on labs",
            subtitle: "Practice environments",
            body: "<p>Labs mirror production patterns so skills transfer immediately.</p>",
            image_url: img5 || img3,
          },
          1
        ),
        item(
          {
            value: "03",
            title: "Executive visibility",
            subtitle: "Measure adoption",
            body: "<p>Leaders see completion, skill signals, and readiness — not vanity metrics.</p>",
            image_url: img6 || img4,
          },
          2
        ),
      ],
    },
    {
      section_key: "stats",
      sort_order: 5,
      section_title: "Program impact",
      in_page_nav_title: "Impact",
      items: [
        item({ value: "120+", label: "Enterprise clients" }, 0),
        item({ value: "8.5k+", label: "Learners per year" }, 1),
        item({ value: "92%", label: "Satisfaction score" }, 2),
        item({ value: "14d", label: "Typical pilot launch" }, 3),
      ],
    },
    {
      section_key: "process_steps",
      sort_order: 6,
      section_title: "How we partner",
      sub_title: "Discovery → design → deliver → measure",
      in_page_nav_title: "Process",
      items: [
        item(
          {
            title: "Discover",
            body: "<p>Align stakeholders on roles, timelines, and success metrics.</p>",
          },
          0
        ),
        item(
          {
            title: "Design",
            body: "<p>Curate paths from vendor catalogs and SkillHub academies.</p>",
          },
          1
        ),
        item(
          {
            title: "Deliver",
            body: "<p>Run cohorts with facilitators, labs, and office hours.</p>",
          },
          2
        ),
        item(
          {
            title: "Measure",
            body: "<p>Review adoption and refine the next wave of upskilling.</p>",
          },
          3
        ),
      ],
    },
    {
      section_key: "faq",
      sort_order: 7,
      section_title: "Common questions",
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: "Can we start with a pilot cohort?",
            body: "<p>Yes — most enterprises begin with a 4–8 week pilot before scaling.</p>",
          },
          0
        ),
        item(
          {
            title: "Do you support global teams?",
            body: "<p>Virtual instructor-led delivery spans regions with localized scheduling.</p>",
          },
          1
        ),
        item(
          {
            title: "How do paths connect to our vendors?",
            body: "<p>SkillHub maps official vendor curricula to your role profiles and certification goals.</p>",
          },
          2
        ),
      ],
    },
    {
      section_key: "cta_band",
      sort_order: 8,
      section_title: "Ready to scope your academy?",
      sub_title: "We will help you design the first cohort in two weeks.",
      buttons: [
        btn("Contact us", { target_url: "/contact-us", sort_order: 0 }),
        btn("View catalog", {
          variant: "secondary",
          target_url: copy.catalogQuery || "/courses",
          sort_order: 1,
        }),
      ],
    },
  ];
}

export function buildSkillingAreaOverrides(area, manifest) {
  const name = area.name || "Skilling area";
  const folderId = folderIdForSkillingSlug(area.slug);
  const copy = solutionCopyForFolder(folderId);
  const hero = pickFolderImage(folderId, manifest, 0);

  return {
    overview: {
      section_title: `${name} overview`,
      sub_title: copy.subhead,
      in_page_nav_title: "Overview",
      section_img_url: hero,
      data: {
        body:
          area.description ||
          copy.overview ||
          `Build depth in ${name} with curated courses and certification paths.`,
      },
      buttons: [
        btn("Browse courses", {
          target_url: `/skilling-areas/${area.slug}`,
          sort_order: 0,
        }),
        btn("View programs", {
          variant: "outline",
          target_url: copy.catalogQuery || "/courses",
          sort_order: 1,
        }),
      ],
    },
    related_courses: {
      section_title: `Courses in ${name}`,
      sub_title: "Curated paths from foundations to advanced practice.",
      in_page_nav_title: "Courses",
    },
    faq: {
      section_title: `${name} FAQ`,
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: "Where should beginners start?",
            body: "<p>Begin with fundamentals courses, then specialty or certification tracks.</p>",
          },
          0
        ),
        item(
          {
            title: "Can we customize a cohort?",
            body: "<p>Yes — advisors tailor modules and labs to your stack and compliance needs.</p>",
          },
          1
        ),
      ],
    },
  };
}

export function buildIndustryOverrides(industry, manifest) {
  const name = industry.name || "Industry";
  const folderId = folderIdForIndustrySlug(industry.slug);
  const copy = solutionCopyForFolder(folderId);
  const hero = pickFolderImage(folderId, manifest, 0);

  return {
    overview: {
      section_title: `${name} skilling`,
      sub_title: "Role-based training for this sector.",
      in_page_nav_title: "Overview",
      section_img_url: hero,
      data: {
        body:
          industry.description ||
          copy.overview ||
          `Programs tailored to the compliance, platforms, and workflows common in ${name}.`,
      },
      buttons: [
        btn("Browse courses", { target_url: "/courses", sort_order: 0 }),
        btn("Contact us", {
          variant: "outline",
          target_url: "/contact-us",
          sort_order: 1,
        }),
      ],
    },
    related_courses: {
      section_title: `Recommended for ${name}`,
      sub_title: "Courses filtered for sector-relevant skills.",
      in_page_nav_title: "Courses",
    },
    faq: {
      section_title: `${name} FAQ`,
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: "Do you cover compliance topics?",
            body: "<p>Many paths include governance and security modules relevant to regulated environments.</p>",
          },
          0
        ),
        item(
          {
            title: "Can training be localized?",
            body: "<p>Virtual and hybrid delivery supports global teams with regional scheduling.</p>",
          },
          1
        ),
      ],
    },
  };
}
