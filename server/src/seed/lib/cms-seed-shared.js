import Section from "../../modules/cms/section.model.js";

export function btn(label, opts = {}) {
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

export function item(fields, i = 0) {
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
export const PAGE_TEMPLATE_CONTENT = {
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
      buttons: [btn("Full catalog", { variant: "outline", target_url: "/courses" })],
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
      buttons: [btn("Browse catalog", { variant: "outline", target_url: "/courses" })],
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
      buttons: [btn("Browse courses", { target_url: "/courses" })],
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

function formatMetric(n, fallback = "50+") {
  const num = Number(n);
  if (!num || Number.isNaN(num)) return fallback;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M+`;
  if (num >= 10_000) return `${Math.round(num / 1000)}k+`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k+`;
  return `${num}+`;
}

const VENDOR_OVERVIEW_IMAGES = [
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=82",
];

function vendorOverviewImage(vendor) {
  const key = String(vendor.slug || vendor.name || "vendor");
  const hash = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return VENDOR_OVERVIEW_IMAGES[hash % VENDOR_OVERVIEW_IMAGES.length];
}

/**
 * Per-entity overrides for page_key=vendor.
 */
export function buildVendorOverrides(vendor, options = {}) {
  const name = vendor.name || "Vendor";
  const slug = vendor.slug || "";
  const overviewBody =
    vendor.overview ||
    vendor.description ||
    vendor.shortDescription ||
    `Explore authorized ${name} training with official curriculum, hands-on labs, and certification-aligned paths.`;

  return {
    overview: {
      section_title:
        vendor.overviewTitle || `Build skills with ${name} training`,
      sub_title:
        vendor.subHeading || `Official ${name} curricula taught by certified instructors.`,
      in_page_nav_title: "Overview",
      // Editorial card image; the vendor logo already appears in the page hero.
      section_img_url: vendorOverviewImage(vendor),
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
      data: { body: overviewBody },
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
                target_url: "/courses",
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
          },
          2
        ),
      ],
    },

    stats: {
      section_title: "Partner impact",
      in_page_nav_title: "Impact",
      items: [
        item(
          {
            value: formatMetric(vendor.learnersCount, "1k+"),
            label: `${name} learners`,
          },
          0
        ),
        item(
          {
            value: formatMetric(vendor.courseCount, "50+"),
            label: "Courses in catalog",
          },
          1
        ),
        item(
          {
            value: formatMetric(vendor.productCount, "10+"),
            label: "Learning products",
          },
          2
        ),
        item(
          {
            value: formatMetric(vendor.certificationCount, "12+"),
            label: "Certification paths",
          },
          3
        ),
      ],
    },

    testimonials: options.emptyTestimonials
      ? {
          section_title: "What customers say about us",
          in_page_nav_title: "Stories",
          items: [],
        }
      : {
          section_title: "What customers say",
          in_page_nav_title: "Stories",
          items: [
            item(
              {
                body: `${name} training helped us standardize skills across regions without slowing delivery.`,
                title: "Learning lead",
              },
              0
            ),
            item(
              {
                body: `Official ${name} curriculum kept our certification outcomes predictable.`,
                title: "Enablement manager",
              },
              1
            ),
          ],
        },

    faq: {
      section_title: `Frequently asked questions about ${name}`,
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: `Why choose an Authorized ${name} Training Partner?`,
            body: `Authorized partners deliver official curriculum with certified trainers, aligned to current ${name} exams and product updates.`,
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
            body: "Voucher policies vary by course — your advisor will confirm what is included at enrollment.",
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
      in_page_nav_title: "Products",
    },

    catalog: {
      section_title: `Popular ${name} courses`,
      sub_title: slug ? `Browse the ${name} catalog.` : null,
      in_page_nav_title: "Catalog",
    },
  };
}

export function buildProductOverrides(product, vendor = null) {
  const name = product.name || "Product";
  const vendorName = vendor?.name || "";
  const category = product.category || "learning";
  const body =
    product.description?.trim() ||
    `${name} bundles role-aligned courses, labs, and certification prep${
      vendorName ? ` from ${vendorName}` : ""
    }.`;

  return {
    overview: {
      section_title: `About ${name}`,
      sub_title: vendorName ? `${vendorName} learning product` : "Product overview",
      in_page_nav_title: "Overview",
      data: { body },
      buttons: [
        btn("View courses", { action_type: "anchor", target_id: "catalog" }),
        btn("Contact us", { variant: "outline", target_url: "/contact" }),
      ],
    },
    key_benefits: {
      section_title: `${name} benefits`,
      in_page_nav_title: "Benefits",
      items: [
        item(
          {
            title: "Role-aligned paths",
            body: `Mapped to ${category} outcomes, not just exam objectives.`,
          },
          0
        ),
        item(
          {
            title: "Hands-on labs",
            body: "Practice environments that mirror production scenarios.",
          },
          1
        ),
        item(
          {
            title: "Advisor support",
            body: "Guidance on sequencing modules for your cohort size.",
          },
          2
        ),
      ],
    },
    curriculum: {
      section_title: `${name} learning path`,
      in_page_nav_title: "Path",
      items: [
        item({ title: `${name} — foundations & orientation` }, 0),
        item({ title: `${name} — core services` }, 1),
        item({ title: `${name} — security & governance` }, 2),
        item({ title: `${name} — capstone & assessment prep` }, 3),
      ],
    },
    testimonials: {
      section_title: "Customer feedback",
      in_page_nav_title: "Feedback",
      items: [
        item(
          {
            body: `${name} cut our onboarding time for new engineers.`,
            title: "Cloud enablement lead",
          },
          0
        ),
      ],
    },
    faq: {
      section_title: `${name} FAQ`,
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: "Who is this product for?",
            body: `Teams building ${category} capability with structured modules.`,
          },
          0
        ),
        item(
          {
            title: "Can we customize the path?",
            body: "Advisors can swap modules or add vendor electives for your stack.",
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
            title: "Product overview",
            body: "Outcomes, roles, and typical delivery options.",
            href: "/contact",
          },
          0
        ),
      ],
    },
    catalog: {
      section_title: `Courses in ${name}`,
      in_page_nav_title: "Catalog",
    },
    products: {
      section_title: vendorName ? `More from ${vendorName}` : "Related products",
      in_page_nav_title: "Products",
    },
  };
}

export function buildCourseOverrides(course, product = null, vendor = null) {
  const name = course.name || "Course";
  const productName = product?.name || "";
  const vendorName = vendor?.name || "";
  const body =
    course.description?.trim() ||
    `${name} is instructor-led training with official curriculum and hands-on labs${
      productName ? ` as part of ${productName}` : ""
    }${vendorName ? ` from ${vendorName}` : ""}.`;

  return {
    overview: {
      section_title: `${name} overview`,
      sub_title: productName || vendorName || "Course details",
      in_page_nav_title: "Overview",
      data: { body },
      buttons: [
        btn("Browse catalog", { variant: "outline", target_url: "/courses" }),
        btn("Enroll", { target_url: "/contact" }),
      ],
    },
    key_benefits: {
      section_title: "What you'll gain",
      in_page_nav_title: "Benefits",
      items: [
        item(
          {
            title: "Official curriculum",
            body: "Content aligned to current vendor exams and best practices.",
          },
          0
        ),
        item(
          {
            title: "Lab time",
            body: "Guided exercises that reinforce each module.",
          },
          1
        ),
        item(
          {
            title: "Expert instructors",
            body: "Practitioners who teach what they ship.",
          },
          2
        ),
      ],
    },
    curriculum: {
      section_title: "Modules",
      in_page_nav_title: "Modules",
      items: [
        item({ title: `${name} — introduction & setup` }, 0),
        item({ title: `${name} — core workloads` }, 1),
        item({ title: `${name} — security & operations` }, 2),
        item({ title: `${name} — capstone & next steps` }, 3),
      ],
    },
    faq: {
      section_title: `${name} FAQ`,
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: "What are the prerequisites?",
            body: "Basic familiarity with the platform is recommended. Ask your advisor for specifics.",
          },
          0
        ),
        item(
          {
            title: "Does tuition include the exam voucher?",
            body: "Varies by course — confirm with your advisor when you enroll.",
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
            title: "Study guide",
            body: "Vendor documentation and module outline.",
            href: vendor?.redirectUrl || "https://learn.microsoft.com",
          },
          0
        ),
      ],
    },
    catalog: {
      section_title: productName
        ? `More courses in ${productName}`
        : "Related courses",
      in_page_nav_title: "Related",
    },
  };
}

export const CONTENT_KEYS = [
  "section_title",
  "sub_title",
  "in_page_nav_title",
  "section_bg_img",
  "section_img_url",
  "data",
  "buttons",
  "items",
];

export function applyContent(target, content) {
  if (!content) return;
  for (const key of CONTENT_KEYS) {
    if (content[key] === undefined) continue;
    target[key] = content[key];
  }
}

export async function seedTemplateContent() {
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

export function overridesToDocs(pageKey, entityId, overrides, tagIndex) {
  const docs = [];
  for (const [sectionKey, patch] of Object.entries(overrides)) {
    const meta = tagIndex.get(sectionKey);
    if (!meta) continue;
    const doc = {
      page_key: pageKey,
      entity_id: entityId,
      page_tag_id: meta.tagId,
      section: meta.sectionId,
      section_key: sectionKey,
      status: true,
    };
    applyContent(doc, patch);
    docs.push(doc);
  }
  return docs;
}

export async function buildTagIndex(pageKeys) {
  const sections = await Section.find({
    "pages.page_key": { $in: pageKeys },
  }).lean();

  const byPage = new Map(pageKeys.map((k) => [k, new Map()]));

  for (const section of sections) {
    for (const tag of section.pages || []) {
      const pk = tag.page_key;
      const map = byPage.get(pk);
      if (!map || map.has(section.key)) continue;
      map.set(section.key, {
        sectionId: section._id,
        tagId: tag._id,
      });
    }
  }

  return byPage;
}
