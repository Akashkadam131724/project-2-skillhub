/**
 * Backfill careers page EPS (uploads images). No showcase or /sections/* routes.
 */
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import {
  btn,
  item,
  ensureContentPageTemplate,
  ensureContent,
  applyContentPlacements,
} from "../../lib/content-page-seed-helpers.js";
import { pickUploadImage } from "../../lib/entity-upload-images.js";

const careersHero = pickUploadImage("careers-hero", 0);

const CAREERS_PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "editorial_banner",
    sort_order: 1,
    section_title: "Build learning programs that ship",
    sub_title:
      "Join SkillHub — design curricula, run cohorts, and help enterprises close skill gaps.",
    in_page_nav_title: "Careers",
    section_img_url: careersHero,
    buttons: [
      btn("Contact recruiting", { target_url: "/contact-us", sort_order: 0 }),
      btn("About us", {
        variant: "secondary",
        target_url: "/about-us",
        sort_order: 1,
      }),
    ],
  },
  {
    section_key: "overview",
    sort_order: 2,
    section_title: "How we hire",
    in_page_nav_title: "Culture",
    data: {
      body: "<p>We look for people who blend learning design, technical depth, and program operations. Remote-friendly teams across customer success, facilitation, and engineering.</p>",
    },
  },
  {
    section_key: "why_choose",
    sort_order: 3,
    section_title: "Why SkillHub",
    in_page_nav_title: "Benefits",
    items: [
      item(
        {
          title: "Impact at scale",
          body: "<p>Work on programs that reach thousands of learners across global enterprises.</p>",
        },
        0
      ),
      item(
        {
          title: "Craft & autonomy",
          body: "<p>Own outcomes with a team that values clear writing, sharp facilitation, and measurable delivery.</p>",
        },
        1
      ),
      item(
        {
          title: "Growth paths",
          body: "<p>Certifications, conference budget, and internal learning credits.</p>",
        },
        2
      ),
    ],
  },
  {
    section_key: "faq",
    sort_order: 4,
    section_title: "Hiring FAQ",
    items: [
      item(
        {
          title: "Remote work?",
          body: "<p>Yes — many roles are remote-first with optional hub days.</p>",
        },
        0
      ),
      item(
        {
          title: "How to apply?",
          body: "<p>Reach out via Contact — include your focus area and portfolio or LinkedIn.</p>",
        },
        1
      ),
    ],
  },
  {
    section_key: "cta_band",
    sort_order: 5,
    section_title: "Ready to talk?",
    buttons: [btn("Contact recruiting", { target_url: "/contact-us" })],
  },
];

async function seed() {
  await connectDB();
  console.log("Seeding careers page…");

  await ensureContentPageTemplate();

  const doc = await ensureContent({
    name: "Careers",
    slug: "company-careers",
    path: "/company/careers",
    description: "Join SkillHub — open roles and life at the company.",
    status: "active",
    sortOrder: 32,
  });
  const n = await applyContentPlacements(doc, CAREERS_PLACEMENTS);
  console.log(`  ✓ /company/careers (${n} placements)`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
