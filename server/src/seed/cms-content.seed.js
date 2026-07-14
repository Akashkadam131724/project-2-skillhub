import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Section from "../modules/cms/section.model.js";
import EntityPageSection from "../modules/cms/entity-page-section.model.js";
import Vendor from "../modules/vendor/vendor.model.js";

/**
 * Seeds realistic CMS mapping content for EVERY page template’s sections,
 * then adds per-vendor entity overrides (with intentional blanks) so you can
 * compare live cascade vs CMS edit mode.
 *
 * Does NOT wipe pages/sections catalog — only fills content on existing tags.
 *
 * Usage:
 *   npm run seed:cms-content
 *   VENDOR_ID=6a53e652e1199e1507d50a36 npm run seed:cms-content
 *   VENDOR_SLUG=microsoft-training npm run seed:cms-content
 *
 * Defaults to Microsoft (microsoft-training) when no id/slug given.
 */

function btn(label, opts = {}) {
  return {
    label,
    variant: opts.variant || "primary",
    action_type: opts.action_type || "url",
    target_url: opts.target_url || "",
    target_id: opts.target_id || "",
    form_key: opts.form_key || "",
    open_in_new_tab: Boolean(opts.open_in_new_tab),
    sort_order: opts.sort_order ?? 0,
    status: opts.status !== false,
  };
}

function item(fields, i = 0) {
  return {
    title: "",
    subtitle: "",
    body: "",
    label: "",
    value: "",
    image_url: "",
    icon: "",
    href: "",
    buttons: [],
    sort_order: i,
    status: true,
    ...fields,
  };
}

/**
 * Template defaults keyed by page_key → section_key.
 * Applied onto Section.pages[] tags (shared by all entities of that page type).
 * Some fields intentionally omitted/null so entity overrides can demonstrate inheritance.
 */
const PAGE_TEMPLATE_CONTENT = {
  product: {
    overview: {
      section_title: "About this product",
      sub_title: "What this learning product covers.",
      in_page_nav_title: "Overview",
      data: {
        body: "This product bundles role-based courses, labs, and certification prep into a clear path for your team.",
      },
      buttons: [
        btn("View related courses", {
          action_type: "anchor",
          target_id: "related-courses",
          variant: "secondary",
        }),
      ],
    },
    key_benefits: {
      section_title: "Product benefits",
      in_page_nav_title: "Benefits",
      items: [
        item({ title: "Role-aligned paths", body: "Mapped to job outcomes, not just exam objectives." }, 0),
        item({ title: "Hands-on labs", body: "Practice environments that mirror production scenarios." }, 1),
        item(
          {
            title: "Advisor support",
            body: "Guidance on sequencing and delivery options for your cohort size.",
            buttons: [btn("Talk to us", { variant: "link", target_url: "/contact" })],
          },
          2
        ),
      ],
    },
    related_courses: {
      section_title: "Related courses",
      sub_title: "Continue with these programs.",
      in_page_nav_title: "Courses",
      buttons: [btn("Full catalog", { variant: "outline", target_url: "/course-catalog" })],
    },
    curriculum: {
      section_title: "Learning path",
      sub_title: "Typical modules in this product.",
      in_page_nav_title: "Path",
      items: [
        item({ title: "Foundations & platform orientation" }, 0),
        item({ title: "Core services deep dive" }, 1),
        item({ title: "Security & governance" }, 2),
        item({ title: "Capstone lab & assessment prep" }, 3),
      ],
    },
    testimonials: {
      section_title: "Customer feedback",
      in_page_nav_title: "Feedback",
      items: [
        item(
          {
            body: "The product path cut onboarding time for new cloud engineers by half.",
            title: "Cloud Enablement Lead",
          },
          0
        ),
      ],
    },
    faq: {
      section_title: "Product FAQ",
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: "Is this suitable for beginners?",
            body: "Most products include a foundations module; check skill level on each course.",
          },
          0
        ),
        item(
          {
            title: "Can we customize the path?",
            body: "Yes — advisors can swap modules or add vendor electives for your stack.",
          },
          1
        ),
      ],
    },
    resources: {
      section_title: "Resources",
      in_page_nav_title: "Resources",
      items: [
        item(
          {
            title: "Product datasheet",
            body: "Overview of outcomes, roles, and delivery options.",
            href: "/contact",
            buttons: [btn("Request PDF", { variant: "link", target_url: "/contact" })],
          },
          0
        ),
        item(
          {
            title: "Sample agenda",
            body: "Day-by-day outline for a typical private cohort.",
            href: "",
          },
          1
        ),
      ],
    },
    products: {
      section_title: "Related products",
      in_page_nav_title: "Products",
    },
    catalog: {
      section_title: "Courses in this product",
      // sub_title left blank on purpose
      sub_title: null,
      in_page_nav_title: "Catalog",
    },
  },

  course: {
    overview: {
      section_title: "Course overview",
      sub_title: "Outcomes, audience, and how you’ll learn.",
      in_page_nav_title: "Overview",
      data: {
        body: "Instructor-led training with official curriculum, labs, and exam-aligned objectives. Ideal for practitioners ready to apply skills on the job.",
      },
      buttons: [
        btn("Watch preview", {
          action_type: "youtube",
          target_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          variant: "outline",
        }),
      ],
    },
    key_benefits: {
      section_title: "What you’ll gain",
      in_page_nav_title: "Benefits",
      items: [
        item({ title: "Official curriculum", body: "Content aligned to current vendor exams and best practices." }, 0),
        item({ title: "Lab time", body: "Guided exercises that reinforce each module." }, 1),
        item({ title: "Expert MCT / instructors", body: "Practitioners who teach what they ship." }, 2),
      ],
    },
    curriculum: {
      section_title: "Modules",
      in_page_nav_title: "Modules",
      items: [
        item({ title: "Module 1 — Introduction & setup" }, 0),
        item({ title: "Module 2 — Core workloads" }, 1),
        item({ title: "Module 3 — Security & identity" }, 2),
        item({ title: "Module 4 — Monitoring & operations" }, 3),
        item({ title: "Module 5 — Capstone & next steps" }, 4),
      ],
    },
    related_courses: {
      section_title: "Related courses",
      in_page_nav_title: "Related",
      buttons: [btn("Browse catalog", { variant: "outline", target_url: "/course-catalog" })],
    },
    faq: {
      section_title: "Course FAQ",
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: "What are the prerequisites?",
            body: "Basic familiarity with the platform is recommended. See the course page for specifics.",
          },
          0
        ),
        item(
          {
            title: "Does tuition include the exam voucher?",
            body: "Varies by course — ask your advisor when you enroll.",
            buttons: [
              btn("Ask an advisor", { variant: "link", target_url: "/contact" }),
            ],
          },
          1
        ),
      ],
    },
    resources: {
      section_title: "Course resources",
      in_page_nav_title: "Resources",
      items: [
        item(
          {
            title: "Official learning guide",
            body: "Vendor documentation and study outline.",
            href: "https://learn.microsoft.com",
            buttons: [
              btn("Open guide", {
                variant: "link",
                target_url: "https://learn.microsoft.com",
                open_in_new_tab: true,
              }),
            ],
          },
          0
        ),
      ],
    },
  },

  vendor: {
    overview: {
      section_title: "Vendor overview",
      sub_title: "Authorized training for this technology partner.",
      in_page_nav_title: "Overview",
      // Generic template — entity override will replace for Microsoft
      data: {
        body: "Explore authorized courses, certifications, and delivery options from this technology partner.",
      },
      buttons: [
        btn("Browse courses", { action_type: "anchor", target_id: "catalog", variant: "primary" }),
      ],
    },
    key_benefits: {
      section_title: "Why train with an authorized partner",
      sub_title: "Outcomes enterprises expect.",
      in_page_nav_title: "Benefits",
      items: [
        item(
          {
            title: "Official curriculum",
            body: "Content maintained by the vendor and delivered by certified instructors.",
          },
          0
        ),
        item(
          {
            title: "Certification pathways",
            body: "Clear routes from fundamentals to expert-level credentials.",
          },
          1
        ),
        item(
          {
            title: "Enterprise delivery",
            body: "Public schedules plus private cohorts for your locations and time zones.",
          },
          2
        ),
      ],
    },
    stats: {
      section_title: "Partner impact",
      in_page_nav_title: "Impact",
      items: [
        item({ value: "500+", label: "Courses available" }, 0),
        item({ value: "40+", label: "Countries served" }, 1),
        item({ value: "24/7", label: "Lab access options" }, 2),
      ],
    },
    related_courses: {
      section_title: "Featured courses",
      sub_title: "Popular picks for this vendor.",
      in_page_nav_title: "Featured",
      // No buttons on template — entity may add
    },
    testimonials: {
      section_title: "Customer stories",
      in_page_nav_title: "Stories",
      items: [
        item(
          {
            body: "Authorized training kept our platform upgrades on schedule across three regions.",
            title: "VP Engineering, SaaS",
          },
          0
        ),
        item(
          {
            body: "We finally have a repeatable path from fundamentals to specialty certs.",
            title: "Learning Manager, Retail",
          },
          1
        ),
      ],
    },
    faq: {
      section_title: "Vendor FAQ",
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: "Are instructors certified by the vendor?",
            body: "Yes — authorized deliveries use vendor-certified trainers and official materials.",
          },
          0
        ),
        item(
          {
            title: "Can we run private classes?",
            body: "Private virtual and onsite cohorts are available for most catalog titles.",
            buttons: [
              btn("Request private training", {
                variant: "link",
                target_url: "/contact",
              }),
            ],
          },
          1
        ),
      ],
    },
    products: {
      section_title: "Products",
      sub_title: "Learning products for this vendor.",
      in_page_nav_title: "Products",
    },
    catalog: {
      section_title: "Course catalog",
      sub_title: "Filter and find the right title.",
      in_page_nav_title: "Catalog",
    },
  },

  industry: {
    overview: {
      section_title: "Industry skilling",
      sub_title: "Role-based training for this sector.",
      in_page_nav_title: "Overview",
      data: {
        body: "Programs tailored to the compliance, platforms, and workflows common in this industry.",
      },
      buttons: [btn("Browse courses", { target_url: "/course-catalog" })],
    },
    related_courses: {
      section_title: "Recommended courses",
      in_page_nav_title: "Courses",
    },
    faq: {
      section_title: "Industry FAQ",
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: "Do you cover compliance topics?",
            body: "Many paths include governance and security modules relevant to regulated environments.",
          },
          0
        ),
        // Blank body — CMS can complete
        item({ title: "Can training be localized?", body: "" }, 1),
      ],
    },
    catalog: {
      section_title: "Industry catalog",
      in_page_nav_title: "Catalog",
    },
  },

  skilling_area: {
    overview: {
      section_title: "Skilling area overview",
      sub_title: "Build depth in this capability domain.",
      in_page_nav_title: "Overview",
      data: {
        body: "Curated courses and paths that develop this skill area from foundations through advanced practice.",
      },
    },
    related_courses: {
      section_title: "Courses in this area",
      in_page_nav_title: "Courses",
    },
    faq: {
      section_title: "Skilling FAQ",
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: "Where should beginners start?",
            body: "Start with fundamentals courses, then move into specialty or certification tracks.",
          },
          0
        ),
      ],
    },
    catalog: {
      section_title: "Area catalog",
      in_page_nav_title: "Catalog",
    },
  },
};

/**
 * Per-vendor entity overrides for page_key=vendor.
 * null / omitted fields inherit the page-tag template (live vs CMS difference).
 */
function buildVendorOverrides(vendor) {
  const name = vendor.name || "Vendor";
  const slug = vendor.slug || "";

  return {
    // Full vendor-specific overview
    overview: {
      section_title: `Build skills with award-winning ${name} training`,
      sub_title: `Official ${name} curricula taught by certified instructors.`,
      in_page_nav_title: "Overview",
      // Leave image blank on purpose — CMS can upload later
      section_img_url: null,
      section_bg_img: null,
      buttons: [
        btn(`Browse ${name} courses`, {
          action_type: "anchor",
          target_id: "catalog",
          sort_order: 0,
        }),
        btn("Talk to an advisor", {
          variant: "outline",
          target_url: "/contact",
          sort_order: 1,
        }),
      ],
      data: {
        body: `${name} authorized training from SkillHub helps enterprises adopt the platform with official content, hands-on labs, and certification-aligned paths. Whether you need public schedule seats or private cohorts, we deliver consistent quality worldwide.`,
      },
    },

    key_benefits: {
      section_title: "Delivery options",
      sub_title: `How teams consume ${name} training.`,
      in_page_nav_title: "Delivery",
      items: [
        item(
          {
            title: "Virtual instructor-led",
            body: "Live online classes with labs — ideal for distributed teams.",
            buttons: [
              btn("See schedules", {
                variant: "link",
                target_url: "/course-catalog",
              }),
            ],
          },
          0
        ),
        item(
          {
            title: "Onsite / private",
            body: "Dedicated cohorts at your location or virtual private rooms.",
          },
          1
        ),
        item(
          {
            title: "Blended paths",
            body: "Mix self-paced prep with live workshops for certification sprints.",
            // No buttons — intentional blank for CMS polish
          },
          2
        ),
      ],
    },

    stats: {
      // Title left null → inherit template “Partner impact”
      section_title: null,
      sub_title: null,
      in_page_nav_title: null,
      items: [
        item({ value: "1,200+", label: `${name} learners / year` }, 0),
        item({ value: "180+", label: "Catalog titles" }, 1),
        item({ value: "45", label: "Countries delivered" }, 2),
      ],
    },

    // Intentionally NO related_courses override → full template inherit on live

    // Testimonials: empty items → section hidden on live, empty hint in CMS
    testimonials: {
      section_title: "What customers say about us",
      sub_title: null,
      in_page_nav_title: "Stories",
      items: [],
    },

    faq: {
      section_title: `Frequently asked questions about ${name}`,
      // sub_title blank → inherit or empty
      sub_title: null,
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: `Why choose an Authorized ${name} Training Partner?`,
            body: `Authorized partners deliver Official Curriculum with certified trainers, ensuring content stays aligned with the latest ${name} exams and product updates.`,
            buttons: [
              btn("Explore courses", {
                variant: "link",
                action_type: "anchor",
                target_id: "catalog",
              }),
            ],
          },
          0
        ),
        item(
          {
            title: "Do you offer private corporate training?",
            body: "Yes. We schedule private virtual or onsite cohorts tailored to your roles, time zones, and project timelines.",
            buttons: [
              btn("Request private training", {
                variant: "link",
                target_url: "/contact",
              }),
            ],
          },
          1
        ),
        item(
          {
            title: "How do certification vouchers work?",
            body: "", // blank answer — CMS / live difference
          },
          2
        ),
      ],
      buttons: [
        btn("Still have questions?", {
          variant: "secondary",
          target_url: "/contact",
        }),
      ],
    },

    products: {
      section_title: `${name} products`,
      // leave sub_title / nav blank
      sub_title: null,
      in_page_nav_title: null,
    },

    catalog: {
      section_title: `Popular ${name} courses`,
      sub_title: slug
        ? `Browse the ${name} catalog.`
        : null,
      in_page_nav_title: "Catalog",
    },
  };
}

const CONTENT_KEYS = [
  "section_title",
  "sub_title",
  "in_page_nav_title",
  "section_bg_img",
  "section_img_url",
  "data",
  "buttons",
  "items",
];

function applyContent(target, content) {
  if (!content) return;
  for (const key of CONTENT_KEYS) {
    if (content[key] === undefined) continue;
    target[key] = content[key];
  }
}

async function resolveVendor() {
  const id = process.env.VENDOR_ID || process.argv[2];
  const slug = process.env.VENDOR_SLUG;

  if (id && mongoose.Types.ObjectId.isValid(id)) {
    const v = await Vendor.findById(id);
    if (!v) throw new Error(`Vendor not found for id ${id}`);
    return v;
  }
  if (slug) {
    const v = await Vendor.findOne({ slug: String(slug).toLowerCase() });
    if (!v) throw new Error(`Vendor not found for slug ${slug}`);
    return v;
  }

  const fallback =
    (await Vendor.findOne({ slug: "microsoft-training" })) ||
    (await Vendor.findOne({ name: /microsoft/i })) ||
    (await Vendor.findOne({}));

  if (!fallback) {
    throw new Error("No vendors in DB — run npm run seed:vendors first");
  }
  return fallback;
}

async function seedTemplateContent() {
  const sections = await Section.find({});
  let tagUpdates = 0;

  for (const section of sections) {
    let dirty = false;
    for (const tag of section.pages || []) {
      const pageContent = PAGE_TEMPLATE_CONTENT[tag.page_key]?.[section.key];
      if (!pageContent) continue;
      applyContent(tag, pageContent);
      dirty = true;
      tagUpdates += 1;
    }
    if (dirty) await section.save();
  }

  return tagUpdates;
}

async function seedVendorEntityOverrides(vendor) {
  const pageKey = "vendor";
  const entityId = vendor._id;
  const overrides = buildVendorOverrides(vendor);

  // Refresh sections so we have current page_tag ids after template save
  const sections = await Section.find({ "pages.page_key": pageKey });

  await EntityPageSection.deleteMany({
    page_key: pageKey,
    entity_id: entityId,
  });

  let created = 0;
  const skipped = [];

  for (const section of sections) {
    const tags = (section.pages || []).filter((t) => t.page_key === pageKey);
    for (const tag of tags) {
      const patch = overrides[section.key];
      if (!patch) {
        skipped.push(section.key);
        continue;
      }

      const doc = {
        page_key: pageKey,
        entity_id: entityId,
        page_tag_id: tag._id,
        section: section._id,
        section_key: section.key,
        status: true,
      };

      applyContent(doc, patch);
      await EntityPageSection.create(doc);
      created += 1;
    }
  }

  return { created, skipped };
}

async function seed() {
  await connectDB();

  const vendor = await resolveVendor();
  console.log(
    `Seeding CMS content · vendor=${vendor.name} (${vendor._id}) slug=${vendor.slug}`
  );

  const tagUpdates = await seedTemplateContent();
  console.log(`Updated ${tagUpdates} page-tag placements with template content`);

  const { created, skipped } = await seedVendorEntityOverrides(vendor);
  console.log(
    `Created ${created} entity overrides for ${vendor.name} on page "vendor"`
  );
  if (skipped.length) {
    console.log(
      `  Left blank (inherit template only): ${[...new Set(skipped)].join(", ")}`
    );
  }

  console.log(`
Intentional blanks / differences to try:
  • Live vendor page: testimonials hidden (entity items = [])
  • CMS mode: testimonials shows empty hint — add quotes there
  • related_courses: no entity override → inherits template titles
  • FAQ item “certification vouchers” has empty body
  • overview section_img_url left blank for CMS upload
  • stats: 3 metrics only (add a 4th in CMS)

Open: /vendors/${vendor.slug}?cms=true
`);

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch(async (err) => {
  console.error("CMS content seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
