/**
 * Seeds:
 *   - Blog posts (active journal articles)
 *   - Page template `blog` for detail pages
 *   - Sections `latest_blogs` + `blog_directory`
 *   - Content page `/blogs` with CMS placements
 *   - Tags `latest_blogs` onto home when present
 *
 * Usage:
 *   npm run seed:blogs
 */
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Blog from "../modules/blog/blog.model.js";
import Content from "../modules/content/content.model.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";
import EntityPageSection from "../modules/cms/entity-page-section.model.js";
import { getSectionCatalogMeta } from "../modules/cms/section.catalog.js";

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

function img(src, alt) {
  return `<img src="${src}" alt="${alt}" class="cms-rich-img" />`;
}

function video(youtubeId, provider = "youtube") {
  const src =
    provider === "vimeo"
      ? `https://player.vimeo.com/video/${youtubeId}`
      : `https://www.youtube.com/embed/${youtubeId}`;
  return `<div data-video-embed="true" data-provider="${provider}" data-src="${src}" class="cms-rich-video"><iframe src="${src}" title="Embedded video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" frameborder="0" class="cms-rich-video-el"></iframe></div>`;
}

const BLOGS = [
  {
    title:
      "From course completion to capability: what learning leaders measure next",
    slug: "from-course-completion-to-capability",
    excerpt:
      "The strongest learning programs connect activity to observable performance. Here is a full playbook for designing evidence chains, manager loops, and dashboards leaders actually trust.",
    category: "learning strategy",
    tags: ["capability", "measurement", "learning strategy", "roi", "managers"],
    featuredImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=82",
    imageAlt: "Team collaborating around a table",
    author: {
      name: "Maya Chen",
      role: "Learning Strategy Lead",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    },
    status: "active",
    featured: true,
    publishedAt: new Date("2026-07-10T09:00:00.000Z"),
    seoTitle: "From course completion to capability | SkillHub Insights",
    metaDescription:
      "Move beyond completion rates. Build an evidence chain from participation to performance outcomes with a practical measurement framework.",
    content: `<p>Organizations have become very good at measuring learning activity. Completion rates, attendance, assessment scores, and satisfaction all tell us whether people participated. They do not tell us whether the organization can now do something it could not do before.</p>
<p>That gap is where most learning ROI conversations stall. Leaders ask for proof of impact; L&amp;D teams hand over dashboards full of activity. Both sides are right—and both are incomplete. Capability is the missing middle: the durable ability to perform under real constraints, with real customers, tools, and timelines.</p>
${img("https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80", "Analytics dashboard on a laptop during a strategy meeting")}
<h2>Start with the performance moment</h2>
<p>Before selecting content, define the moment in which a learner must perform differently. That might be a cloud engineer resolving an incident, a manager running a useful coaching conversation, or a sales team translating a new product capability into customer value.</p>
<p>Write the moment as a short story: who is involved, what pressure they face, what “good” looks like, and what evidence would convince a skeptical leader that performance improved. The clearer this moment becomes, the easier it is to identify useful learning design and useful measurement.</p>
<blockquote>If you cannot describe the performance moment in one paragraph, you are not ready to pick a course—or a KPI.</blockquote>
<h2>Build an evidence chain</h2>
<p>No single metric proves impact. Chain four signals so each one makes the next more credible:</p>
<ol>
<li><p><strong>Participation</strong> — the opportunity reached the right audience at the right time.</p></li>
<li><p><strong>Practice</strong> — learners can apply the behavior in a realistic setting (labs, simulations, role-plays).</p></li>
<li><p><strong>Performance</strong> — the behavior shows up in day-to-day work (tickets resolved, coaching notes, win rates).</p></li>
<li><p><strong>Outcomes</strong> — the changed performance matters to the business (cycle time, quality, revenue, risk).</p></li>
</ol>
${video("u4ZoJKF_VuA")}
<p>Use the video above as a shared language with executives: activity is necessary, but the story only lands when practice and performance are visible in the same frame.</p>
<h3>What to collect in the first 90 days</h3>
<ul>
<li><p>Baseline performance for one priority role before the program launches.</p></li>
<li><p>A short application checklist managers can complete after real work moments.</p></li>
<li><p>Two leading indicators (practice quality, manager follow-through) and one lagging outcome.</p></li>
<li><p>A monthly review where L&amp;D and the business owner decide what to reinforce or retire.</p></li>
</ul>
${img("https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80", "Workshop sticky notes mapping a customer journey")}
<h2>Make measurement part of the design</h2>
<p>Measurement should not be bolted on after launch. When evidence is defined up front, learning teams choose better practice activities, involve managers earlier, and create reinforcement around the work that matters most.</p>
<p>Design the program backwards from the evidence chain:</p>
<ol>
<li><p>Agree the outcome with a business sponsor.</p></li>
<li><p>Define observable performance behaviors.</p></li>
<li><p>Design practice that produces those behaviors.</p></li>
<li><p>Only then select or build content that fuels the practice.</p></li>
</ol>
<h2>Manager loops beat more modules</h2>
<p>Capability sticks when managers rehearse conversations, spot application in the wild, and give timely feedback. A two-minute check-in after a real customer call often beats another hour of e-learning.</p>
${img("https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80", "Manager and teammate in a one-to-one coaching conversation")}
<h3>A simple operating cadence</h3>
<ul>
<li><p><strong>Weekly:</strong> managers sample one application moment per learner.</p></li>
<li><p><strong>Monthly:</strong> L&amp;D reviews leading indicators with the sponsor.</p></li>
<li><p><strong>Quarterly:</strong> retire weak paths; double down on paths with performance lift.</p></li>
</ul>
<h2>Putting it together</h2>
<p>Completion still matters—it proves access. Capability is what leaders actually buy. Build the evidence chain into the brief, the design, and the dashboard, and the ROI conversation stops being a debate about vanity metrics and becomes a shared plan for better work.</p>
<h2>Common measurement traps</h2>
<p>Even careful teams fall into patterns that look rigorous and still miss capability:</p>
<ul>
<li><p><strong>Vanity volume</strong> — celebrating enrollments while application stays flat.</p></li>
<li><p><strong>Survey theater</strong> — high satisfaction with no change in work quality.</p></li>
<li><p><strong>Lag-only dashboards</strong> — waiting a year for outcomes with no leading signals to steer.</p></li>
<li><p><strong>One-size KPIs</strong> — forcing the same metric onto every role and program.</p></li>
</ul>
${img("https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1400&q=80", "Team reviewing charts on a wall display")}
<p>Counter each trap with a paired leading and lagging indicator owned jointly by L&amp;D and the business sponsor. If nobody owns the performance signal, it will not survive the next budget cycle.</p>
<h2>A sample evidence brief</h2>
<p>Use a one-page brief for every major program before content is selected:</p>
<ol>
<li><p>Performance moment (who, when, what “good” looks like).</p></li>
<li><p>Baseline and target for one outcome metric.</p></li>
<li><p>Practice design and how quality will be scored.</p></li>
<li><p>Manager loop — what they do weekly and what they report.</p></li>
<li><p>Stop criteria — when to pause or redesign.</p></li>
</ol>
<p>Teams that write this brief consistently ship fewer courses and more capability. That is the point of measurement that serves the work.</p>`,
  },
  {
    title: "A practical operating model for responsible AI upskilling",
    slug: "responsible-ai-upskilling-operating-model",
    excerpt:
      "AI fluency needs more than tool demos. This operating model covers role paths, governed practice spaces, review rituals, and how to keep policy and capability moving together.",
    category: "ai and technology",
    tags: ["ai", "governance", "workforce", "security", "prompting"],
    featuredImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=82",
    imageAlt: "Professionals working with technology",
    author: {
      name: "Daniel Okafor",
      role: "Technology Practice Director",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    status: "active",
    featured: true,
    publishedAt: new Date("2026-07-06T09:00:00.000Z"),
    seoTitle: "Responsible AI upskilling operating model | SkillHub",
    metaDescription:
      "Segment AI learning by decisions, create governed practice spaces, and reinforce with communities so capability and governance stay in sync.",
    content: `<p>AI adoption is moving through organizations faster than traditional training cycles. A useful upskilling model must help people experiment quickly while preserving security, quality, and accountability.</p>
<p>Most failed AI learning programs share the same pattern: a generic awareness course, a tool tour, and a policy PDF. People finish the modules, then improvise in production with customer data, weak prompts, and no review path. Responsible AI upskilling is an operating system—not a single course.</p>
${img("https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80", "Abstract visualization of AI neural network concepts")}
<h2>Segment learning by decisions, not job titles</h2>
<p>Executives, builders, domain experts, and everyday users make different decisions with AI. Their learning paths should reflect the risks and responsibilities attached to those decisions.</p>
<ul>
<li><p><strong>Executives</strong> decide where AI is allowed, what risk appetite looks like, and how success is measured.</p></li>
<li><p><strong>Builders</strong> integrate models, evaluate outputs, and own technical controls.</p></li>
<li><p><strong>Domain experts</strong> judge whether outputs are fit for regulated or customer-facing work.</p></li>
<li><p><strong>Everyday users</strong> need safe defaults: what data is off-limits, how to verify, when to escalate.</p></li>
</ul>
${video("aircAruvnKk")}
<p>Pair conceptual literacy (like the overview above) with role labs. Awareness without practice creates false confidence; practice without framing creates chaos.</p>
<h2>Create governed spaces for practice</h2>
<p>People need a safe environment where they can test prompts, inspect outputs, discuss failure modes, and learn when not to use a tool. Practice without guardrails creates risk; guardrails without practice create avoidance.</p>
${img("https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1400&q=80", "Developer pairing at a dual-monitor workstation")}
<h3>Minimum viable practice sandbox</h3>
<ol>
<li><p>Approved tools with logged access and clear data boundaries.</p></li>
<li><p>Sample tasks tied to real roles (support replies, code review, research briefs).</p></li>
<li><p>A lightweight rubric: accuracy, citation, privacy, tone, escalation.</p></li>
<li><p>Office hours with an expert who can override “clever but unsafe” patterns.</p></li>
</ol>
<h2>Reinforce with communities</h2>
<p>Policy documents decay the week a new model ships. Communities keep guidance alive:</p>
<ul>
<li><p>Publish approved patterns and reusable prompt libraries.</p></li>
<li><p>Give experts a route to review difficult use cases.</p></li>
<li><p>Turn incidents and near misses into learning artifacts.</p></li>
<li><p>Refresh guidance on a fixed cadence as tools and regulations change.</p></li>
</ul>
${img("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80", "Cross-functional team collaborating in an open office")}
${video("hVimVzgtD6w")}
<h2>Governance rituals that scale</h2>
<p>Treat governance as a weekly muscle, not an annual audit:</p>
<ol>
<li><p><strong>Prompt clinics</strong> — 30 minutes reviewing good and bad examples from the sandbox.</p></li>
<li><p><strong>Red-team Friday</strong> — deliberately break an assistant with edge cases.</p></li>
<li><p><strong>Change log</strong> — announce model or policy updates the same way you announce product releases.</p></li>
</ol>
<blockquote>Responsible AI capability is the ability to move fast <em>and</em> know when to stop.</blockquote>
<h2>What “done” looks like</h2>
<p>You are not done when everyone finishes a course. You are done when each segment can demonstrate safe decisions under pressure, when reviews catch weak outputs before customers see them, and when the organization can update guidance without freezing experimentation. That is an operating rhythm—capability and governance moving together.</p>
<h2>Rollout phases that avoid chaos</h2>
<p>Treat AI upskilling like a product launch with explicit phases:</p>
<ol>
<li><p><strong>Pilot</strong> — one function, approved tools only, weekly prompt clinics.</p></li>
<li><p><strong>Expand</strong> — add adjacent roles once review quality is stable.</p></li>
<li><p><strong>Industrialize</strong> — shared libraries, automated logging where needed, clear escalation paths.</p></li>
</ol>
${img("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80", "Modern technology workspace with multiple screens")}
<p>Skip phases and you get shadow AI: people invent workflows in private accounts with customer data. Sequence the phases and you get speed with a safety net.</p>
<h2>Metrics for the operating model</h2>
<ul>
<li><p>Percent of AI tasks completed inside approved tools.</p></li>
<li><p>Review catch-rate for privacy or accuracy issues.</p></li>
<li><p>Time-to-update guidance after a model or policy change.</p></li>
<li><p>Manager confidence that their team knows when not to use AI.</p></li>
</ul>
<p>Publish these monthly. Celebrating only course completions will recreate the gap this model was built to close.</p>`,
  },
  {
    title: "Why skills taxonomies fail—and how to make them useful",
    slug: "making-skills-taxonomies-useful",
    excerpt:
      "A taxonomy earns its keep when it improves staffing, mobility, and learning decisions. Here is how to shrink the library, speak human language, and run it like a product.",
    category: "workforce transformation",
    tags: ["skills", "talent", "taxonomy", "mobility", "assessment"],
    featuredImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=82",
    imageAlt: "Business team reviewing a planning board",
    author: {
      name: "Priya Raman",
      role: "Workforce Transformation Advisor",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    status: "active",
    featured: false,
    publishedAt: new Date("2026-06-28T09:00:00.000Z"),
    seoTitle: "Make skills taxonomies useful | SkillHub Insights",
    metaDescription:
      "Stop building endless skill libraries. Start with one decision, use language people recognize, and treat the taxonomy as a living product.",
    content: `<p>Many skills programs begin by trying to describe every skill in the organization. The result is often a large, technically correct library that managers and employees rarely use.</p>
<p>Unused taxonomies create a special kind of failure: expensive maintenance, political debates about definitions, and almost no lift in hiring, mobility, or learning prioritization. Usefulness beats completeness.</p>
${img("https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80", "Leadership team reviewing sticky notes on a glass wall")}
<h2>Begin with a decision</h2>
<p>Choose one decision the taxonomy must improve:</p>
<ul>
<li><p>Staffing a strategic initiative with the right mix of skills.</p></li>
<li><p>Identifying readiness for a critical role.</p></li>
<li><p>Targeting a learning investment where gaps actually hurt.</p></li>
<li><p>Creating internal mobility pathways people trust.</p></li>
</ul>
<p>That decision determines the level of detail you need and the evidence that makes a skill credible. Everything else can wait.</p>
${video("iYhCn0jf46U")}
<h2>Use language people recognize</h2>
<p>A useful taxonomy bridges enterprise consistency and local meaning. Keep a stable core, then let functions add context through examples, proficiency signals, and role-specific applications.</p>
${img("https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=80", "Professional reviewing documents in a modern office")}
<h3>Design principles that prevent bloat</h3>
<ol>
<li><p><strong>Prefer verbs of work</strong> over abstract nouns (“facilitate discovery interviews” beats “soft skills”).</p></li>
<li><p><strong>Attach evidence</strong> — what would a manager observe at each proficiency level?</p></li>
<li><p><strong>Limit depth</strong> — three to five levels is usually enough for decision-making.</p></li>
<li><p><strong>Alias synonyms</strong> instead of creating near-duplicate skills.</p></li>
</ol>
<h2>Treat the taxonomy as a product</h2>
<p>Products have owners, usage analytics, release notes, and retirement plans. Taxonomies need the same:</p>
<ul>
<li><p>Track which skills are searched, assessed, and used in decisions.</p></li>
<li><p>Remove duplicates and concepts that create confusion.</p></li>
<li><p>Assign owners who can respond when the work changes.</p></li>
<li><p>Test updates with the people expected to use them.</p></li>
</ul>
${img("https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80", "Product team planning on a whiteboard")}
${video("W3GMAqHklnE")}
<h2>A 60-day path to a useful v1</h2>
<ol>
<li><p><strong>Days 1–10:</strong> pick one decision and one business unit.</p></li>
<li><p><strong>Days 11–25:</strong> draft 40–80 skills max with evidence examples.</p></li>
<li><p><strong>Days 26–40:</strong> pilot with managers on real staffing or development decisions.</p></li>
<li><p><strong>Days 41–60:</strong> cut what was unused; publish a changelog; set a quarterly review.</p></li>
</ol>
<blockquote>The best taxonomy is not the biggest. It is the smallest shared language that reliably improves workforce decisions.</blockquote>
<h2>Close the loop with learning</h2>
<p>Once the taxonomy guides decisions, map learning paths to the skills that appear in those decisions—not to every node in the library. That is how a taxonomy stops being a filing cabinet and starts being an operating advantage.</p>
<h2>Governance without bureaucracy</h2>
<p>Taxonomy change requests should be easy to file and hard to approve without evidence. Require a short rationale: which decision improves, who will use the skill, and what duplicates it replaces. A monthly triage meeting with HR, L&amp;D, and one business partner is enough for most organizations.</p>
${img("https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1400&q=80", "Professionals collaborating over printed reports")}
<ul>
<li><p>Reject vague additions (“communication skills”) without role evidence.</p></li>
<li><p>Merge near-duplicates aggressively.</p></li>
<li><p>Sunset skills that no longer appear in decisions for two review cycles.</p></li>
</ul>
<h2>Signals that the taxonomy is working</h2>
<ol>
<li><p>Managers use skill language in staffing and development conversations.</p></li>
<li><p>Internal mobility requests reference taxonomy nodes without translation.</p></li>
<li><p>Learning spend concentrates on skills tied to active decisions.</p></li>
<li><p>Search and assessment volume rises for a stable core—not for the long tail of unused terms.</p></li>
</ol>
<p>When those signals appear, resist the urge to grow the library. Protect the small shared language that already improves work.</p>`,
  },
  {
    title: "Manager coaching that sticks after the workshop ends",
    slug: "manager-coaching-that-sticks",
    excerpt:
      "Workshops create awareness. Habits form when managers rehearse conversations, get feedback, and practice with real team moments. A complete system for making coaching stick.",
    category: "leadership",
    tags: ["managers", "coaching", "habits", "feedback", "culture"],
    featuredImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=82",
    imageAlt: "Managers collaborating in a workshop",
    author: {
      name: "Elena Vargas",
      role: "Leadership Practice Lead",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    },
    status: "active",
    featured: false,
    publishedAt: new Date("2026-06-18T09:00:00.000Z"),
    seoTitle: "Manager coaching that sticks | SkillHub Leadership",
    metaDescription:
      "Design coaching for the calendar, give managers language and structure, and measure the conversations that matter after the workshop ends.",
    content: `<p>Most coaching programs fail in the quiet weeks after a workshop. Managers leave inspired, then return to calendars that leave little room for deliberate practice.</p>
<p>The fix is not a longer workshop. It is a system that fits the work week: short rehearsals, shared language, peer feedback, and sponsorship from the manager of managers.</p>
${img("https://images.unsplash.com/photo-1542744173-8e2bd585f281?auto=format&fit=crop&w=1400&q=80", "Facilitator leading a leadership workshop")}
<h2>Design for the calendar, not the classroom</h2>
<p>Coaching skills need short rehearsal loops that fit into existing rhythms: one-to-ones, project reviews, and performance conversations. If the practice only happens in a hotel ballroom, it will not survive Monday.</p>
<ul>
<li><p>Ten-minute conversation drills before 1:1s.</p></li>
<li><p>One “coachable moment” noted after each team standup.</p></li>
<li><p>Biweekly peer practice with a recorded scenario.</p></li>
</ul>
${video("W3I3kAg2J7w")}
<h2>Give managers language and structure</h2>
<p>Ambiguity kills habit formation. Equip managers with a shared conversation map:</p>
<ol>
<li><p><strong>Open</strong> — name the purpose without blame.</p></li>
<li><p><strong>Explore</strong> — ask for the other person’s view first.</p></li>
<li><p><strong>Focus</strong> — agree one behavior or outcome to change.</p></li>
<li><p><strong>Commit</strong> — set a small next step and a check-in date.</p></li>
</ol>
${img("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80", "Team discussion around a conference table")}
<blockquote>A shared conversation map reduces cognitive load. Peer practice builds confidence faster than solo reflection. Manager-of-manager sponsorship keeps the habit visible.</blockquote>
<h2>Practice that feels like real work</h2>
<p>Replace generic role-plays with scenarios from the team’s current quarter: a missed deadline, a stakeholder conflict, a promotion conversation, a performance concern. Record short practices (with consent) and review two minutes of tape—not the whole conversation.</p>
${img("https://images.unsplash.com/photo-1573164713714-d95e4369651d?auto=format&fit=crop&w=1400&q=80", "Two colleagues in a focused mentoring conversation")}
${video("1hpiWrOZ6IM")}
<h2>Measure the conversations that matter</h2>
<p>Workshop satisfaction is a weak signal. Track:</p>
<ul>
<li><p>Whether coaching conversations happen (self-report + employee pulse).</p></li>
<li><p>Whether employees feel supported and clear on next steps.</p></li>
<li><p>Whether performance issues are addressed earlier.</p></li>
<li><p>Whether managers of managers ask about coaching in their own 1:1s.</p></li>
</ul>
<h3>90-day habit stack</h3>
<ol>
<li><p><strong>Weeks 1–2:</strong> workshop + conversation map.</p></li>
<li><p><strong>Weeks 3–6:</strong> weekly micro-drills + peer pairs.</p></li>
<li><p><strong>Weeks 7–12:</strong> live application reviews with sponsors.</p></li>
</ol>
<h2>Culture is what gets practiced</h2>
<p>Coaching becomes culture when leaders treat it as work, not as an optional soft skill. Design for the calendar, give people language, rehearse under real pressure, and measure the conversations—not just the workshop glow.</p>
<h2>What good sponsorship looks like</h2>
<p>Manager-of-manager sponsorship is the difference between a workshop memory and a habit. Sponsors should:</p>
<ul>
<li><p>Ask about one coaching conversation in every skip-level 1:1.</p></li>
<li><p>Model the conversation map in their own meetings.</p></li>
<li><p>Protect time for peer practice on the team calendar.</p></li>
<li><p>Celebrate early problem-solving, not only firefighting heroics.</p></li>
</ul>
${img("https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80", "Leader facilitating a standing team huddle")}
<h2>Troubleshooting stalled programs</h2>
<ol>
<li><p><strong>No time:</strong> shrink drills to five minutes before existing 1:1s.</p></li>
<li><p><strong>No confidence:</strong> increase peer practice before live application.</p></li>
<li><p><strong>No follow-through:</strong> make sponsorship visible in performance reviews for managers.</p></li>
<li><p><strong>No impact signal:</strong> pick one team metric (clarity, engagement, escalation lag) and track it for a quarter.</p></li>
</ol>
<p>Coaching that sticks is less about inspiration and more about repetition under real constraints. Build the system around the calendar, and the habit will outlast the workshop.</p>`,
  },
  {
    title: "Closing skill gaps without building another unused catalog",
    slug: "closing-skill-gaps-without-unused-catalogs",
    excerpt:
      "Catalogs grow quickly. Capability grows when learning is tied to roles, projects, and weekly decisions. A full guide to focus, application, and ruthless retirement.",
    category: "learning strategy",
    tags: ["catalog", "roles", "capability", "curriculum", "paths"],
    featuredImage:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=82",
    imageAlt: "Person studying with notebooks and laptop",
    author: {
      name: "Samir Patel",
      role: "Curriculum Architect",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    },
    status: "active",
    featured: false,
    publishedAt: new Date("2026-06-08T09:00:00.000Z"),
    seoTitle: "Close skill gaps without unused catalogs | SkillHub",
    metaDescription:
      "Map role-critical work, pair content with application, and retire low-value assets so your catalog stays readable and your capability grows.",
    content: `<p>A large catalog can feel like progress. In practice, unused content creates noise, raises maintenance costs, and makes it harder for learners to find what matters.</p>
<p>Skill gaps close when people practice the right work under real conditions—not when the LMS inventory grows. This playbook shows how to focus the catalog, attach learning to roles and projects, and retire assets that no longer earn their place.</p>
${img("https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1400&q=80", "Laptop and notebooks on a desk for focused study")}
<h2>Start with role-critical work</h2>
<p>Map the few capabilities that change outcomes for each priority role. Build learning around those moments first. Ask:</p>
<ul>
<li><p>What decisions does this role make weekly?</p></li>
<li><p>Where do errors, delays, or risk concentrate?</p></li>
<li><p>Which skills, if improved, would a manager notice in 30 days?</p></li>
</ul>
${video("arj7oStGLkU")}
<h2>Pair content with application</h2>
<p>Courses become useful when they connect to projects, labs, certifications, or manager-supported practice. Every path should answer: <em>What will the learner do differently next week?</em></p>
${img("https://images.unsplash.com/photo-1516321497487-eaa40c6b7b3e?auto=format&fit=crop&w=1400&q=80", "Learners collaborating on laptops in a classroom")}
<ol>
<li><p><strong>Assign</strong> a real work artifact (runbook, customer brief, code review).</p></li>
<li><p><strong>Practice</strong> in a lab or simulation that mirrors production constraints.</p></li>
<li><p><strong>Review</strong> with a peer or manager using a short rubric.</p></li>
<li><p><strong>Ship</strong> the artifact into the workflow so learning leaves a trail.</p></li>
</ol>
<h2>Design paths, not piles</h2>
<p>Busy people need readable journeys. Prefer a small set of role paths over a flat sea of titles:</p>
<ul>
<li><p>One flagship path per priority role.</p></li>
<li><p>Optional deep-dives linked from the path, not competing with it.</p></li>
<li><p>Clear entry criteria and exit evidence (not just a completion badge).</p></li>
</ul>
${img("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80", "Students collaborating around a shared laptop")}
${video("rfscVS0vtbw")}
<h2>Retire ruthlessly</h2>
<p>Catalog hygiene is a capability practice of its own:</p>
<ul>
<li><p>Remove low-use content that no longer maps to a role decision.</p></li>
<li><p>Promote paths that show completion <strong>plus</strong> application.</p></li>
<li><p>Archive duplicates and outdated vendor modules on a schedule.</p></li>
<li><p>Publish a quarterly “what we retired and why” note so stakeholders trust the process.</p></li>
</ul>
<blockquote>Capability grows from focus, not volume.</blockquote>
<h3>A lightweight catalog scorecard</h3>
<ol>
<li><p>Usage in the last 90 days.</p></li>
<li><p>Link to a live role path or project.</p></li>
<li><p>Evidence of application (not only completion).</p></li>
<li><p>Owner accountable for updates.</p></li>
</ol>
${img("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80", "Data charts on a screen representing catalog analytics")}
<h2>What leaders should ask next</h2>
<p>Instead of “How many courses do we have?” ask “Which role gaps are closing, and which assets earned their keep?” When the catalog serves decisions and projects, skill gaps shrink—and the LMS stops being a warehouse of unused potential.</p>
<h2>Build a retirement pipeline</h2>
<p>Set a standing process so retirement is not a political fight every year:</p>
<ol>
<li><p>Flag assets with low usage and no role-path link each quarter.</p></li>
<li><p>Give owners 30 days to attach application evidence or accept archive.</p></li>
<li><p>Publish the retired list with replacements when relevant.</p></li>
<li><p>Redirect bookmarks and search aliases to the surviving path.</p></li>
</ol>
${img("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80", "Planner and laptop used for curriculum prioritization")}
<h2>From catalog to capability system</h2>
<p>The end state is not a smaller LMS for its own sake. It is a readable set of role paths, clear application expectations, and analytics that show which gaps are closing. Content becomes a means. Capability is the product.</p>
<ul>
<li><p>Priority roles have one flagship path each.</p></li>
<li><p>Every path ends in a work artifact or observed behavior.</p></li>
<li><p>Managers know how to reinforce application without another course.</p></li>
<li><p>Finance can see maintenance cost falling as unused assets retire.</p></li>
</ul>
<p>Start with one role, one path, and one retirement batch. Momentum beats a multi-year catalog clean-up that never ships.</p>`,
  },
];

const MANAGED_SECTIONS = [
  {
    key: "latest_blogs",
    name: "Latest Blogs",
    description: "Dynamic grid of the latest published editorial articles",
    section_title: "Ideas worth sharing",
    sub_title:
      "Fresh thinking on workforce learning, technology, and organizational capability.",
    in_page_nav_title: "Insights",
    target_url: "/blogs",
    content_scope: "global",
    status: true,
    buttons: [],
    items: [],
    data: { limit: 3 },
  },
  {
    key: "blog_directory",
    name: "Blog Directory",
    description: "Searchable journal listing with featured story and pagination",
    section_title: "Fresh from the journal",
    sub_title:
      "Research, playbooks, and perspectives on learning, technology, and organizational capability.",
    in_page_nav_title: "Articles",
    content_scope: "page",
    status: true,
    buttons: [],
    items: [],
    data: { limit: 10 },
  },
  {
    key: "cta_band",
    name: "CTA Band",
    description: "Full-bleed ink CTA band with strong call to action",
    section_title: "Ready to build capability that ships?",
    sub_title:
      "Talk with our team about a pilot, a catalog path, or an enterprise learning roadmap.",
    in_page_nav_title: "Get started",
    content_scope: "page",
    status: true,
    buttons: [
      btn("Talk to us", { target_url: "/get-started", sort_order: 0 }),
      btn("Browse courses", {
        variant: "secondary",
        target_url: "/courses",
        sort_order: 1,
      }),
    ],
    items: [],
    data: {},
  },
];

const REQUIRED_EXISTING_KEYS = [
  "hero_classic",
  "in_page_nav",
  "partners_marquee",
  "stats",
  "customer_testimonials",
  "cta_band",
  "related_courses",
];

function withShell(corePlacements) {
  const core = corePlacements.map((placement, index) => ({
    ...placement,
    sort_order: index + 1,
  }));
  return [
    {
      section_key: "in_page_nav",
      sort_order: 0,
      section_title: "",
      in_page_nav_title: "",
    },
    ...core,
    {
      section_key: "partners_marquee",
      sort_order: core.length + 1,
      section_title: null,
      sub_title: null,
      in_page_nav_title: "Partners",
    },
    {
      section_key: "stats",
      sort_order: core.length + 2,
      section_title: null,
      sub_title: null,
      in_page_nav_title: "By the numbers",
    },
    {
      section_key: "customer_testimonials",
      sort_order: core.length + 3,
      section_title: null,
      sub_title: null,
      in_page_nav_title: "Testimonials",
    },
    {
      section_key: "cta_band",
      sort_order: core.length + 4,
      section_title: "Ready to build capability that ships?",
      sub_title:
        "Talk with our team about a pilot, a catalog path, or an enterprise learning roadmap.",
      in_page_nav_title: "Get started",
      buttons: [
        btn("Talk to us", { target_url: "/get-started", sort_order: 0 }),
        btn("Browse courses", {
          variant: "secondary",
          target_url: "/courses",
          sort_order: 1,
        }),
      ],
    },
  ];
}

const BLOGS_PAGE_PLACEMENTS = withShell([
  {
    section_key: "hero_classic",
    section_title: "Ideas for building a workforce ready for what’s next",
    sub_title:
      "Research, practical playbooks, and perspectives on learning, technology, and organizational capability.",
    in_page_nav_title: "Overview",
    buttons: [
      btn("Browse articles", { target_url: "#blogs", sort_order: 0 }),
      btn("Talk to us", {
        variant: "secondary",
        target_url: "/get-started",
        sort_order: 1,
      }),
    ],
  },
  {
    section_key: "blog_directory",
    section_title: "Fresh from the journal",
    sub_title:
      "Search insights, open featured stories, and explore the full SkillHub journal.",
    in_page_nav_title: "Articles",
    data: { limit: 10 },
  },
]);

const BLOG_DETAIL_TEMPLATE_TAGS = [
  {
    section_key: "cta_band",
    sort_order: 1,
    section_title: "Want learning that changes how teams perform?",
    sub_title:
      "Talk with SkillHub about a pilot, a catalog path, or an enterprise learning roadmap.",
    in_page_nav_title: "Next step",
    buttons: [
      btn("Talk to us", { target_url: "/get-started", sort_order: 0 }),
      btn("Browse courses", {
        variant: "secondary",
        target_url: "/courses",
        sort_order: 1,
      }),
    ],
  },
];

async function ensureSection(def) {
  const catalog = getSectionCatalogMeta(def.key);
  let section = await Section.findOne({ key: def.key });
  if (!section) {
    section = await Section.create({
      ...def,
      category: catalog?.category || "",
      tags: catalog?.tags || [],
      pages: [],
    });
    console.log(`  + created section ${def.key}`);
  } else {
    section.name = def.name;
    section.description = def.description;
    section.section_title = def.section_title ?? section.section_title;
    section.sub_title = def.sub_title ?? section.sub_title;
    section.in_page_nav_title =
      def.in_page_nav_title ?? section.in_page_nav_title;
    section.target_url = def.target_url ?? section.target_url;
    section.content_scope = def.content_scope;
    section.data = def.data ?? section.data;
    section.status = true;
    if (catalog) {
      section.category = catalog.category;
      section.tags = catalog.tags;
    }
    await section.save();
    console.log(`  ~ updated section ${def.key}`);
  }
  return section;
}

async function ensureContentPageTemplate() {
  return Page.findOneAndUpdate(
    { key: "content" },
    {
      $set: {
        key: "content",
        name: "Content page",
        description:
          "Free-form content pages (about-us, catalogs, blogs…). No predefined sections.",
        entity_type: "content",
        status: true,
        is_sort_disabled: false,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function ensureBlogPageTemplate() {
  return Page.findOneAndUpdate(
    { key: "blog" },
    {
      $set: {
        name: "Blog Detail",
        description: "Single editorial article page",
        entity_type: "blog",
        status: true,
        is_sort_disabled: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );
}

async function replaceExtras(pageKey, entityId, placements, sectionByKey) {
  await EntityPageSection.deleteMany({
    page_key: pageKey,
    entity_id: entityId,
    page_tag_id: null,
  });

  for (const placement of placements) {
    const section = sectionByKey.get(placement.section_key);
    if (!section) {
      console.warn(`  ! missing section ${placement.section_key} — skip`);
      continue;
    }
    await EntityPageSection.create({
      page_key: pageKey,
      entity_id: entityId,
      page_tag_id: null,
      section: section._id,
      section_key: section.key,
      sort_order: placement.sort_order,
      status: placement.status !== false,
      section_title: placement.section_title ?? null,
      sub_title: placement.sub_title ?? null,
      in_page_nav_title: placement.in_page_nav_title ?? null,
      section_bg_img: placement.section_bg_img ?? null,
      section_bg_color: placement.section_bg_color ?? null,
      section_img_url: placement.section_img_url ?? null,
      data: placement.data ?? null,
      buttons: Array.isArray(placement.buttons) ? placement.buttons : undefined,
      items: Array.isArray(placement.items) ? placement.items : undefined,
    });
  }
}

async function tagSectionToPage(section, page, tag) {
  const payload = {
    page: page._id,
    page_key: page.key,
    sort_order: tag.sort_order ?? 0,
    status: tag.status !== false,
    section_title: tag.section_title ?? null,
    sub_title: tag.sub_title ?? null,
    in_page_nav_title: tag.in_page_nav_title ?? null,
    data: tag.data ?? null,
    buttons: Array.isArray(tag.buttons) ? tag.buttons : undefined,
    items: Array.isArray(tag.items) ? tag.items : undefined,
  };
  const index = section.pages.findIndex((entry) => entry.page_key === page.key);
  if (index >= 0) {
    const existing = section.pages[index].toObject
      ? section.pages[index].toObject()
      : section.pages[index];
    section.pages[index] = {
      ...existing,
      ...payload,
      sort_order: existing.sort_order ?? payload.sort_order,
      status: existing.status !== false,
    };
  } else {
    section.pages.push(payload);
  }
  await section.save();
}

async function seed() {
  await connectDB();
  console.log("Seeding blogs, sections, and /blogs Content page…");

  await ensureContentPageTemplate();
  const blogPage = await ensureBlogPageTemplate();
  console.log(`  ✓ page template blog (${blogPage._id})`);

  const sectionByKey = new Map();
  for (const def of MANAGED_SECTIONS) {
    const section = await ensureSection(def);
    sectionByKey.set(section.key, section);
  }

  for (const key of REQUIRED_EXISTING_KEYS) {
    if (sectionByKey.has(key)) continue;
    const existing = await Section.findOne({ key });
    if (existing) sectionByKey.set(key, existing);
    else
      console.warn(
        `  ! missing section ${key} — run seed:pages / seed:partners / seed:stats / seed:testimonials first`
      );
  }

  const home = await Page.findOne({ key: "home" });
  const latest = sectionByKey.get("latest_blogs");
  if (home && latest) {
    await tagSectionToPage(latest, home, {
      sort_order: 14,
      in_page_nav_title: "Insights",
    });
    console.log("  ✓ latest_blogs tagged on home");
  }

  const cta = sectionByKey.get("cta_band");
  if (blogPage && cta) {
    for (const tag of BLOG_DETAIL_TEMPLATE_TAGS) {
      await tagSectionToPage(cta, blogPage, tag);
    }
    console.log("  ✓ cta_band tagged on blog template");
  }

  for (const blog of BLOGS) {
    const words = String(blog.content || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(words / 220));
    await Blog.findOneAndUpdate(
      { slug: blog.slug },
      { $set: { ...blog, readingTime } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ blog ${blog.slug} (~${readingTime} min)`);
  }

  const blogsContent = await Content.findOneAndUpdate(
    { path: "/blogs" },
    {
      $set: {
        path: "/blogs",
        slug: "blogs",
        name: "Insights & Ideas",
        description:
          "Practical thinking on workforce learning, capability building, and the future of skills.",
        status: "active",
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  await replaceExtras(
    "content",
    blogsContent._id,
    BLOGS_PAGE_PLACEMENTS,
    sectionByKey
  );
  console.log(
    `  ✓ /blogs Content page (${BLOGS_PAGE_PLACEMENTS.length} sections)`
  );

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
