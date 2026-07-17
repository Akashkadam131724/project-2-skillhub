import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Content from "../modules/content/content.model.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";

/**
 * Rewrites homepage CMS copy/images with original SkillHub content.
 *
 * The existing homepage had vendor-specific copied copy and image/logo URLs.
 * This keeps the same enabled sections and replaces their editable DB data.
 */

const HOME_KEY = "home";

function button(label, target_url, variant = "primary", sort_order = 0) {
  return {
    label,
    variant,
    action_type: "url",
    target_url,
    target_id: "",
    form_key: "",
    open_in_new_tab: false,
    sort_order,
    status: true,
  };
}

function item(fields, sort_order = 0) {
  return {
    title: "",
    subtitle: "",
    body: "",
    label: "",
    value: "",
    image_url: "",
    bg_color: "",
    icon: "",
    href: "",
    buttons: [],
    sort_order,
    status: true,
    ...fields,
  };
}

function svgDataUri(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22")}`;
}

function logoSvg(label, fill = "#1b4de4") {
  const initials = label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120" viewBox="0 0 320 120">
  <rect width="320" height="120" rx="24" fill="#ffffff"/>
  <rect x="22" y="28" width="64" height="64" rx="18" fill="${fill}"/>
  <text x="54" y="68" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#ffffff">${initials}</text>
  <text x="106" y="67" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#0f172a">${label}</text>
</svg>`);
}

function badgeSvg(title, accent = "#1b4de4") {
  return svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="520" height="320" viewBox="0 0 520 320">
  <rect width="520" height="320" rx="34" fill="#f8fafc"/>
  <circle cx="260" cy="120" r="70" fill="${accent}" opacity="0.14"/>
  <path d="M260 54l18 43 46 4-35 30 11 45-40-24-40 24 11-45-35-30 46-4z" fill="${accent}"/>
  <text x="260" y="238" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="800" fill="#0f172a">${title}</text>
  <text x="260" y="272" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="3" fill="#64748b">SKILLHUB STANDARD</text>
</svg>`);
}

const copy = {
  hero_classic: {
    section_title: "Build workforce capability that moves with your business",
    sub_title:
      "SkillHub helps teams find the right learning path, practice with real projects, and turn new skills into measurable business outcomes.",
    in_page_nav_title: "",
    section_img_url:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=80",
    section_bg_img: "",
    section_bg_color: "",
    data: {},
    buttons: [
      button("Explore courses", "/courses", "primary", 0),
      button("Plan a team program", "/get-started", "secondary", 1),
    ],
    items: [],
  },

  partners_marquee: {
    section_title: "Designed for every team building modern capability",
    sub_title:
      "From cloud and data teams to leaders and operators, SkillHub gives each group a focused path to learn, apply, and improve.",
    in_page_nav_title: "Teams",
    buttons: [],
    data: {},
    items: [
      item({ title: "Cloud Teams", image_url: logoSvg("Cloud Teams") }, 0),
      item({ title: "Data Teams", image_url: logoSvg("Data Teams", "#0f766e") }, 1),
      item({ title: "Security Teams", image_url: logoSvg("Security Teams", "#7c3aed") }, 2),
      item({ title: "Product Teams", image_url: logoSvg("Product Teams", "#0284c7") }, 3),
      item({ title: "Operations", image_url: logoSvg("Operations", "#475569") }, 4),
      item({ title: "AI Guilds", image_url: logoSvg("AI Guilds", "#0891b2") }, 5),
      item({ title: "Customer Teams", image_url: logoSvg("Customer Teams", "#059669") }, 6),
      item({ title: "Leadership", image_url: logoSvg("Leadership", "#1e3a8a") }, 7),
    ],
  },

  training_options: {
    section_title: "Flexible learning formats for every schedule",
    sub_title:
      "Choose live coaching, self-paced practice, or blended programs that keep teams learning without slowing delivery.",
    in_page_nav_title: "Learning Formats",
    buttons: [button("Compare formats", "/courses", "secondary", 0)],
    data: {},
    items: [
      item(
        {
          title: "Live Cohorts",
          body:
            "<p>Expert-led sessions with discussion, guided labs, and direct feedback for teams that learn best together.</p>",
          image_url:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
        },
        0
      ),
      item(
        {
          title: "Self-Paced Labs",
          body:
            "<p>Structured modules and hands-on exercises people can complete between meetings, releases, and customer work.</p>",
          image_url:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
        },
        1
      ),
      item(
        {
          title: "Team Workshops",
          body:
            "<p>Focused enablement days built around your tools, your goals, and the decisions your team needs to make next.</p>",
          image_url:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
        },
        2
      ),
      item(
        {
          title: "Blended Academies",
          body:
            "<p>Combine live instruction, digital learning, project checkpoints, and manager visibility in one repeatable program.</p>",
          image_url:
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
        },
        3
      ),
    ],
  },

  awards: {
    section_title: "Built around quality, relevance, and measurable progress",
    sub_title:
      "Our programs are designed to be practical from day one, with clear outcomes and learning experiences teams want to finish.",
    in_page_nav_title: "Quality",
    buttons: [button("See how it works", "/solutions", "secondary", 0)],
    data: {},
    items: [
      item(
        {
          title: "Learning Experience Quality",
          body:
            "Programs are reviewed for clarity, pacing, accessibility, and practical application before they reach learners.",
          image_url: badgeSvg("Quality", "#1b4de4"),
        },
        0
      ),
      item(
        {
          title: "Role-Based Enablement",
          body:
            "Paths are organized around the work people actually do, so teams can focus on the skills that matter now.",
          image_url: badgeSvg("Role-Based", "#0f766e"),
        },
        1
      ),
      item(
        {
          title: "Outcome Tracking",
          body:
            "Leaders can connect learning activity to progress signals like completion, readiness, and project application.",
          image_url: badgeSvg("Outcomes", "#7c3aed"),
        },
        2
      ),
    ],
  },

  text_media: {
    section_title: "Turn learning plans into visible progress",
    sub_title:
      "Give every learner a clear next step and every manager a simple way to see where capability is growing.",
    in_page_nav_title: "Learning Paths",
    buttons: [],
    data: {},
    items: [
      item(
        {
          title: "Map skill gaps before you assign training",
          subtitle: "Start with the roles, tools, and outcomes your team owns.",
          body:
            "<p>SkillHub helps you organize learning around real roles instead of generic course lists. Build paths for cloud, data, security, AI, leadership, and operations, then connect each path to the work your team needs to deliver.</p><p>Each path can combine guided lessons, practice labs, workshops, and checkpoints so learners know what to do next and managers can spot where support is needed.</p>",
          image_url:
            "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1100&q=80",
          value: "end",
        },
        0
      ),
      item(
        {
          title: "Launch programs that feel custom without starting from zero",
          subtitle: "Use repeatable academies, then tune them for each team.",
          body:
            "<p>Create academies for onboarding, platform adoption, certification readiness, or major transformation initiatives. Keep the structure consistent while adapting examples, labs, and milestones to the audience.</p><p>The result is a cleaner learner experience, fewer one-off spreadsheets, and a program your team can improve every cycle.</p>",
          image_url:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1100&q=80",
          value: "start",
        },
        1
      ),
    ],
  },

  stats: {
    section_title: "A practical way to scale learning",
    sub_title:
      "Keep the numbers focused on operating value: speed, coverage, clarity, and repeatability.",
    in_page_nav_title: "By the Numbers",
    section_bg_color: null,
    buttons: [],
    data: {},
    items: [
      item({ value: "12+", label: "Skill domains ready to organize" }, 0),
      item({ value: "4", label: "Flexible delivery formats" }, 1),
      item({ value: "30 days", label: "Typical first academy launch plan" }, 2),
      item({ value: "100%", label: "Theme-aware CMS sections" }, 3),
      item({ value: "Role-based", label: "Paths for every learner group" }, 4),
      item({ value: "Live + async", label: "Learning that fits work schedules" }, 5),
      item({ value: "Reusable", label: "Templates for future programs" }, 6),
      item({ value: "Visible", label: "Progress signals for managers" }, 7),
    ],
  },

  customer_testimonials: {
    section_title: "What teams notice first",
    sub_title:
      "Cleaner paths, better momentum, and learning that connects back to the work.",
    in_page_nav_title: "Feedback",
    buttons: [],
    data: {},
    items: [
      item(
        {
          title: "Learning Operations Lead",
          body:
            "<p>SkillHub gave us one place to explain the path, run the program, and keep managers informed. The experience feels much easier for learners than our old spreadsheet-based process.</p>",
          value: "5",
          image_url: logoSvg("Ops"),
        },
        0
      ),
      item(
        {
          title: "Cloud Enablement Manager",
          body:
            "<p>The best part is how quickly we can shape a path around a team goal. We can start broad, add labs, then tune the next cohort based on what people actually need.</p>",
          value: "5",
          image_url: logoSvg("Cloud"),
        },
        1
      ),
      item(
        {
          title: "Data Platform Director",
          body:
            "<p>Our teams finally have a learning flow that connects training to platform adoption. People understand why each module matters before they start it.</p>",
          value: "5",
          image_url: logoSvg("Data"),
        },
        2
      ),
      item(
        {
          title: "People Development Partner",
          body:
            "<p>It feels modern, clear, and much easier to maintain. We can reuse the structure for onboarding, certification, and leadership programs without rebuilding every time.</p>",
          value: "5",
          image_url: logoSvg("People"),
        },
        3
      ),
    ],
  },
};

async function ensureHomePage() {
  return Page.findOneAndUpdate(
    { key: HOME_KEY },
    {
      $set: {
        key: HOME_KEY,
        name: "Home",
        description: "SkillHub homepage",
        entity_type: "content",
        status: true,
        is_sort_disabled: true,
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );
}

function applyToHomeTag(section, page, fields) {
  const idx = (section.pages || []).findIndex((p) => p.page_key === HOME_KEY);
  const existing =
    idx >= 0 && section.pages[idx]?.toObject
      ? section.pages[idx].toObject()
      : idx >= 0
        ? section.pages[idx]
        : {};

  const tag = {
    ...existing,
    page: page._id,
    page_key: HOME_KEY,
    status: existing.status !== false,
    section_title: fields.section_title ?? "",
    sub_title: fields.sub_title ?? "",
    in_page_nav_title: fields.in_page_nav_title ?? "",
    section_img_url: fields.section_img_url ?? "",
    section_bg_img: fields.section_bg_img ?? "",
    section_bg_color: fields.section_bg_color ?? null,
    data: fields.data ?? {},
    buttons: fields.buttons ?? [],
    items: fields.items ?? [],
  };

  if (idx >= 0) section.pages[idx] = tag;
  else section.pages.push({ ...tag, sort_order: 99 });
}

async function updateSection(page, key, fields) {
  const section = await Section.findOne({ key });
  if (!section) {
    console.log(`skip missing section: ${key}`);
    return false;
  }

  const ownsContent = section.content_scope === "global";
  if (ownsContent) {
    section.section_title = fields.section_title ?? "";
    section.sub_title = fields.sub_title ?? "";
    section.in_page_nav_title = fields.in_page_nav_title ?? "";
    section.section_img_url = fields.section_img_url ?? "";
    section.section_bg_img = fields.section_bg_img ?? "";
    section.section_bg_color = fields.section_bg_color ?? "";
    section.data = fields.data ?? {};
    section.buttons = fields.buttons ?? [];
    section.items = fields.items ?? [];
  }

  applyToHomeTag(section, page, fields);
  await section.save();
  console.log(
    `${key}: updated ${ownsContent ? "global content + home placement" : "home placement"}`
  );
  return true;
}

async function main() {
  await connectDB();
  const page = await ensureHomePage();

  await Content.findOneAndUpdate(
    { $or: [{ path: "/" }, { slug: "home" }] },
    {
      $set: {
        name: "SkillHub Learning Platform",
        title: "SkillHub Learning Platform",
        path: "/",
        slug: "home",
        status: true,
      },
    },
    { returnDocument: "after" }
  );

  let updated = 0;
  for (const [key, fields] of Object.entries(copy)) {
    if (await updateSection(page, key, fields)) updated += 1;
  }

  console.log(`Homepage cleanup complete: ${updated} section(s) updated.`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
