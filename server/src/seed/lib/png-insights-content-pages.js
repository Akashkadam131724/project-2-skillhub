import { btn, item } from "./content-page-seed-helpers.js";
import {
  loadUploadsManifest,
  PNG_FOLDER_IDS,
  findPngByPattern,
  pickFolderImages,
} from "./upload-manifest.js";

/** @typedef {{ path: string, slug: string, name: string, description: string, sortOrder: number, eyebrow: string, pngPattern: string, headline: string, subhead: string, intro: string, sections: { title: string, subtitle?: string, body: string }[], highlights: { title: string, body: string }[], steps: { title: string, body: string }[], faqs: { title: string, body: string }[] }} InsightPageDef */

export const INSIGHT_CHILD_PAGES = [
  {
    path: "/insights/ai-brain-compute",
    slug: "insight-ai-brain-compute",
    name: "AI Brain & Compute",
    description: "How neural architectures and modern chips shape enterprise AI strategy and workforce readiness.",
    sortOrder: 410,
    eyebrow: "AI Foundations",
    pngPattern: "brain-and-a-computer-ai-chip",
    headline: "From silicon to skills — building an AI-ready organization",
    subhead: "Compute capacity is only half the equation. Teams need literacy, governance, and hands-on practice.",
    intro:
      "Enterprise AI programs stall when leaders treat GPUs as the finish line. The illustration of a brain fused with a processor captures the real challenge: aligning human judgment with machine scale. SkillHub helps you map roles, design academies, and connect labs to the workloads your teams will actually run.",
    sections: [
      {
        title: "Why compute strategy must include people",
        subtitle: "Hardware budgets without enablement rarely ship production value.",
        body:
          "<p>Platform teams procure accelerators, data teams experiment with models, and business sponsors expect ROI within two quarters. Without a shared vocabulary, each group optimizes locally — leading to shadow projects, duplicated spend, and fragile proofs of concept.</p><p>SkillHub structures learning around the same lifecycle your architects use: data readiness, model selection, deployment guardrails, and operational monitoring. Learners practice on scenarios tied to your cloud estate instead of generic toy datasets.</p>",
      },
      {
        title: "Design academies that respect depth and pace",
        body:
          "<p>Not everyone needs to train foundation models. Analysts need prompt and evaluation skills; engineers need MLOps patterns; leaders need investment framing. Layer cohorts so specialists go deep while adjacent roles build enough fluency to collaborate.</p><p>Transparent PNG heroes work well in editorial layouts because they sit cleanly on brand surfaces — the same visual language we use across these insight pages.</p>",
      },
    ],
    highlights: [
      { title: "Role-based paths", body: "Separate tracks for analysts, ML engineers, and product leaders with shared capstones." },
      { title: "Lab-aligned curriculum", body: "Exercises reference your identity, networking, and data platforms — not abstract sandboxes." },
      { title: "Executive briefings", body: "Sponsor workshops that translate chip roadmaps into hiring and vendor decisions." },
    ],
    steps: [
      { title: "Assess readiness", body: "Inventory data contracts, toolchain maturity, and regulatory constraints." },
      { title: "Prioritize use cases", body: "Pick two production-adjacent scenarios with measurable outcomes." },
      { title: "Launch cohorts", body: "Blend live facilitation with async labs paced for delivery teams." },
      { title: "Review & scale", body: "Publish playbooks and expand to the next business unit." },
    ],
    faqs: [
      { title: "Do we need custom hardware training?", body: "<p>Most teams start with cloud GPUs and vendor labs; we tailor examples to your provider mix.</p>" },
      { title: "How long is a typical academy?", body: "<p>Pilots run 6–10 weeks; enterprise rollouts span quarters with modular waves.</p>" },
    ],
  },
  {
    path: "/insights/ai-chatbots-workforce",
    slug: "insight-ai-chatbots-workforce",
    name: "AI Chatbots in the Workforce",
    description: "Deploy conversational AI responsibly — from support bots to internal copilots that augment teams.",
    sortOrder: 420,
    eyebrow: "Conversational AI",
    pngPattern: "ai-chatbot-mascot",
    headline: "Chatbots that earn trust — not just deflection metrics",
    subhead: "Design, train, and govern assistants that help employees and customers without creating risk.",
    intro:
      "The friendly robot mascot in our artwork represents how accessible AI feels — until something goes wrong in production. Workforce chatbots need grounding data, escalation paths, and clear ownership. SkillHub teaches teams to build copilots that complement human expertise rather than replace judgment calls.",
    sections: [
      {
        title: "Internal copilots vs. customer-facing bots",
        body:
          "<p>Internal assistants can leverage richer context — HR policies, engineering runbooks, sales playbooks — with stricter access controls. Customer bots must prioritize accuracy, tone, and compliance on every turn. Mixing the two without boundaries creates leakage and brand risk.</p><p>Training should cover retrieval design, evaluation harnesses, and human-in-the-loop review — skills that transfer across vendors whether you build on Azure OpenAI, Bedrock, or open models.</p>",
      },
      {
        title: "Change management for conversational AI",
        subtitle: "Adoption dies when teams fear replacement or cannot verify answers.",
        body:
          "<p>Run manager briefings alongside builder workshops. Show how copilots cite sources, when to escalate, and how feedback loops improve responses. Measure quality and time saved — not only ticket volume.</p>",
      },
    ],
    highlights: [
      { title: "Grounding & RAG labs", body: "Hands-on indexing, chunking, and retrieval evaluation with your document types." },
      { title: "Safety & policy modules", body: "PII handling, prompt injection awareness, and audit-friendly logging patterns." },
      { title: "Service desk integration", body: "Playbooks for ITSM handoff, SLA alignment, and analytics dashboards." },
    ],
    steps: [
      { title: "Define intents", body: "List top questions, failure modes, and escalation triggers." },
      { title: "Prototype & evaluate", body: "Score responses against golden sets before any pilot launch." },
      { title: "Pilot with champions", body: "Start with a team that will give candid feedback." },
      { title: "Operationalize", body: "Assign owners for content refresh, model updates, and incident response." },
    ],
    faqs: [
      { title: "Can non-developers maintain bots?", body: "<p>Yes — we train content owners on guardrails, analytics, and safe update workflows.</p>" },
      { title: "What about multilingual support?", body: "<p>Modules cover localization, cultural tone, and testing across locales.</p>" },
    ],
  },
  {
    path: "/insights/human-ai-collaboration",
    slug: "insight-human-ai-collaboration",
    name: "Human–AI Collaboration",
    description: "Analytics meetings, decision support, and hybrid teams where people and AI share the workload.",
    sortOrder: 430,
    eyebrow: "Collaboration",
    pngPattern: "ai-robot-business-meeting",
    headline: "Better decisions when humans stay in the loop",
    subhead: "Use AI for synthesis and exploration — keep accountability with people who know the business.",
    intro:
      "The meeting-room illustration shows what high-performing teams aim for: AI surfacing patterns while humans debate trade-offs. SkillHub programs teach facilitators, analysts, and leaders to run working sessions where models accelerate insight without bypassing governance.",
    sections: [
      {
        title: "Collaboration patterns that actually stick",
        body:
          "<p>Successful teams assign roles in every session: a driver, a skeptic, and a documenter. AI drafts scenarios, summarizes lengthy reports, and stress-tests assumptions — but humans approve recommendations. Training encodes these rituals so they survive turnover.</p>",
      },
      {
        title: "Metrics beyond automation rate",
        body:
          "<p>Track decision latency, forecast accuracy, and stakeholder confidence — not just hours saved. Pair qualitative interviews with quantitative dashboards so sponsors see cultural adoption, not only tool logins.</p>",
      },
    ],
    highlights: [
      { title: "Workshop facilitation", body: "Run AI-assisted design sessions with clear agendas and outputs." },
      { title: "Decision frameworks", body: "Teach when to trust model output vs. when to demand primary research." },
      { title: "Cross-functional cohorts", body: "Mix finance, product, and engineering in shared capstones." },
    ],
    steps: [
      { title: "Map decisions", body: "Identify recurring choices that benefit from faster analysis." },
      { title: "Instrument workflows", body: "Embed assistants into slides, spreadsheets, and BI tools teams already use." },
      { title: "Train facilitators", body: "Upskill program managers and analysts who run rituals." },
      { title: "Iterate rituals", body: "Retrospect after each cycle and publish improved playbooks." },
    ],
    faqs: [
      { title: "Will this replace analysts?", body: "<p>No — it elevates analysts to orchestrate models and validate outcomes.</p>" },
      { title: "How do we handle bias?", body: "<p>Dedicated modules on dataset bias, disparate impact, and review boards.</p>" },
    ],
  },
  {
    path: "/insights/remote-work-productivity",
    slug: "insight-remote-work-productivity",
    name: "Remote Work & Productivity",
    description: "Distributed collaboration, async learning, and tooling that keeps hybrid teams aligned.",
    sortOrder: 440,
    eyebrow: "Modern Work",
    pngPattern: "remote-work-networking",
    headline: "Learning systems built for distributed teams",
    subhead: "Remote work is permanent — your enablement model should be too.",
    intro:
      "Networking and collaboration artwork reflects how today's workforce connects across time zones. SkillHub delivery formats — live cohorts, async labs, and blended academies — mirror how your teams already work, so learning does not require everyone in one room.",
    sections: [
      {
        title: "Async-first does not mean alone",
        body:
          "<p>Structure modules with optional sync touchpoints: office hours, peer reviews, and demo days. Managers receive lightweight briefings on progress without micromanaging screen time.</p>",
      },
      {
        title: "Tooling integration",
        body:
          "<p>Embed reminders and deep links in Slack, Teams, or email digests. Reduce friction between where work happens and where skills grow.</p>",
      },
    ],
    highlights: [
      { title: "Timezone-friendly cohorts", body: "Regional waves with shared artifacts and recorded highlights." },
      { title: "Manager enablement", body: "Guides for coaching remote learners through plateaus." },
      { title: "Collaboration labs", body: "Pair programming, whiteboarding, and documentation practices." },
    ],
    steps: [
      { title: "Survey constraints", body: "Capture availability, connectivity, and language needs." },
      { title: "Design rhythm", body: "Balance self-paced depth with live connection." },
      { title: "Launch pilots", body: "Test with one distributed squad before enterprise rollout." },
      { title: "Scale support", body: "Add office hours and community channels as enrollment grows." },
    ],
    faqs: [
      { title: "Are live sessions required?", body: "<p>Recommended but flexible — recordings and async substitutes are supported.</p>" },
      { title: "How do you measure engagement?", body: "<p>Completion, lab submissions, peer activity, and manager check-ins.</p>" },
    ],
  },
  {
    path: "/insights/smart-manufacturing",
    slug: "insight-smart-manufacturing",
    name: "Smart Manufacturing & ML",
    description: "Machine learning on the plant floor — predictive maintenance, quality, and Industry 4.0 skills.",
    sortOrder: 450,
    eyebrow: "Industry 4.0",
    pngPattern: "machine-learning-algorithms-smart-manufacturing",
    headline: "Bring ML literacy to operations — safely and practically",
    subhead: "OT and IT converge when teams share data vocabulary and deployment discipline.",
    intro:
      "Gear-and-algorithm imagery signals smart manufacturing: sensors, models, and people monitoring real assets. SkillHub connects OT engineers, data scientists, and plant managers through scenarios grounded in uptime, yield, and safety — not generic Kaggle exercises.",
    sections: [
      {
        title: "Bridging OT and IT cultures",
        body:
          "<p>Plant teams prioritize safety and uptime; data teams prioritize experimentation velocity. Training creates shared language for edge devices, time-series features, and change windows that respect production freezes.</p>",
      },
      {
        title: "From pilot to scaled monitoring",
        body:
          "<p>Start with one line or asset class. Document data lineage, model drift checks, and rollback plans before expanding. Transparent illustrations help explain architectures to sponsors unfamiliar with factory networks.</p>",
      },
    ],
    highlights: [
      { title: "Predictive maintenance labs", body: "Feature engineering on vibration, temperature, and throughput signals." },
      { title: "Quality analytics", body: "Vision and statistical process control modules for QA leads." },
      { title: "Safety-first governance", body: "Change management aligned to maintenance calendars." },
    ],
    steps: [
      { title: "Pick a line", body: "Choose a asset with rich telemetry and engaged operators." },
      { title: "Stand up data access", body: "Work with OT on secure read paths and retention." },
      { title: "Train cross-functional pods", body: "Pair engineers with operators on shared dashboards." },
      { title: "Expand playbooks", body: "Replicate patterns to additional sites with local tuning." },
    ],
    faqs: [
      { title: "Do operators need to code?", body: "<p>No — we teach interpretation, alerting, and escalation; specialists handle models.</p>" },
      { title: "Cloud or edge?", body: "<p>Modules cover both; labs adapt to your connectivity constraints.</p>" },
    ],
  },
  {
    path: "/insights/ai-upskilling",
    slug: "insight-ai-upskilling",
    name: "AI Upskilling for Teams",
    description: "Structured paths for employees learning alongside intelligent tools and guided practice.",
    sortOrder: 460,
    eyebrow: "Learning",
    pngPattern: "man-learning-with-ai",
    headline: "Upskilling that keeps pace with AI adoption",
    subhead: "When tools evolve monthly, static course catalogs fall behind.",
    intro:
      "The learner-with-machine illustration is the heart of SkillHub: people growing capability while AI handles repetitive lift. We design rolling curricula with refresh modules, office hours, and project checkpoints so skills stay current.",
    sections: [
      {
        title: "Competency maps tied to tools",
        body:
          "<p>Map Copilot, analytics assistants, and automation platforms to explicit competencies. Learners see which module unlocks which workplace task — reducing anxiety about opaque AI magic.</p>",
      },
      {
        title: "Practice over passive video",
        body:
          "<p>Every path includes labs, peer review, and manager-visible milestones. Completion means demonstrated behavior change, not just hours watched.</p>",
      },
    ],
    highlights: [
      { title: "Rolling refresh", body: "Quarterly update packs when vendors ship major features." },
      { title: "Project checkpoints", body: "Capstones tied to real backlog items where possible." },
      { title: "Manager dashboards", body: "Visibility into progress without surveillance culture." },
    ],
    steps: [
      { title: "Baseline skills", body: "Short assessments by role family." },
      { title: "Assign paths", body: "Recommend modules based on gaps and projects." },
      { title: "Coach through plateaus", body: "Office hours and communities of practice." },
      { title: "Celebrate application", body: "Showcase internal wins to reinforce adoption." },
    ],
    faqs: [
      { title: "How often should content update?", body: "<p>We recommend quarterly reviews minimum; critical security topics faster.</p>" },
      { title: "Can paths be customized?", body: "<p>Yes — SkillHub advisors tailor labs to your stack and policies.</p>" },
    ],
  },
  {
    path: "/insights/smart-cities",
    slug: "insight-smart-cities",
    name: "Smart Cities & Urban AI",
    description: "Data-driven urban planning, civic technology, and public-sector skilling for smart infrastructure.",
    sortOrder: 470,
    eyebrow: "Public Sector",
    pngPattern: "urban-planning-smart-city",
    headline: "Urban innovation with accountable data practice",
    subhead: "Smart city initiatives succeed when citizens and civil servants share transparency.",
    intro:
      "Skyline and planning visuals represent civic analytics — mobility, utilities, and sustainability. SkillHub supports government and partner ecosystems with procurement-friendly academies covering data ethics, open standards, and cross-agency collaboration.",
    sections: [
      {
        title: "Ethics in civic data",
        body:
          "<p>Public datasets affect real communities. Training emphasizes consent, anonymization, equitable outcomes, and communication with residents — not only technical dashboards.</p>",
      },
      {
        title: "Partner ecosystems",
        body:
          "<p>Vendors, agencies, and universities often co-deliver programs. SkillHub provides shared curricula so terminology aligns across RFPs, pilots, and operations.</p>",
      },
    ],
    highlights: [
      { title: "Mobility analytics", body: "Modules for transit, traffic, and multimodal planning teams." },
      { title: "Sustainability metrics", body: "Carbon, energy, and resilience storytelling for executives." },
      { title: "Procurement literacy", body: "Help buyers evaluate AI claims in vendor proposals." },
    ],
    steps: [
      { title: "Align stakeholders", body: "Bring policy, IT, and community liaisons into scoping." },
      { title: "Pilot transparently", body: "Publish metrics and limitations alongside launches." },
      { title: "Train operators", body: "Upskill civil servants who maintain systems daily." },
      { title: "Iterate with feedback", body: "Formal channels for resident input on data programs." },
    ],
    faqs: [
      { title: "Is this only for mega-cities?", body: "<p>No — regional authorities and utilities use the same frameworks at smaller scale.</p>" },
      { title: "Compliance support?", body: "<p>Modules reference common public-sector data handling expectations.</p>" },
    ],
  },
  {
    path: "/insights/ai-customer-support",
    slug: "insight-ai-customer-support",
    name: "AI Customer Support",
    description: "Automated assistance, agent copilots, and quality programs that improve CSAT — not just handle time.",
    sortOrder: 480,
    eyebrow: "Service",
    pngPattern: "ai-chatbot-automated-customer-support",
    headline: "Support automation with empathy and accuracy",
    subhead: "Customers notice when bots guess. Train teams to deploy assistive AI that knows its limits.",
    intro:
      "Support-themed artwork highlights the tension between speed and care. SkillHub helps service leaders train agents, designers, and engineers on triage flows, knowledge base hygiene, and copilots that draft — but do not auto-send — sensitive replies.",
    sections: [
      {
        title: "Agent copilots first",
        body:
          "<p>Many enterprises succeed by augmenting agents before full automation. Copilots suggest replies, surface policies, and summarize threads while humans maintain tone and compliance.</p>",
      },
      {
        title: "Quality loops",
        body:
          "<p>Sample conversations weekly, tag failure modes, and feed updates to content and models. Training teaches QA analysts to run these loops systematically.</p>",
      },
    ],
    highlights: [
      { title: "KB governance", body: "Workflows for article ownership, expiry, and verification." },
      { title: "Escalation design", body: "Clear triggers for fraud, legal, and executive cases." },
      { title: "CSAT analytics", body: "Link automation rates to satisfaction — not against it." },
    ],
    steps: [
      { title: "Audit intents", body: "Rank contact reasons by volume and risk." },
      { title: "Augment agents", body: "Pilot copilots on high-volume, low-risk intents." },
      { title: "Expand automation", body: "Add deflection only where accuracy thresholds hold." },
      { title: "Refresh content", body: "Keep articles and models aligned with product changes." },
    ],
    faqs: [
      { title: "What about regulated industries?", body: "<p>We include modules on disclosures, retention, and supervised review.</p>" },
      { title: "Integration training?", body: "<p>Labs cover CRM, telephony, and ticketing platforms conceptually and practically.</p>" },
    ],
  },
  {
    path: "/insights/future-of-work",
    slug: "insight-future-of-work",
    name: "Future of Work",
    description: "Modern workspaces, mood-aware design, and skills for hybrid collaboration at scale.",
    sortOrder: 490,
    eyebrow: "Workplace",
    pngPattern: "future-office-modern-workspace",
    headline: "Design workplaces — and skills — for how teams actually work",
    subhead: "Physical space and digital capability evolve together.",
    intro:
      "Future-office illustrations with mood pods and flexible layouts mirror the cultural shift SkillHub enables: learning embedded in flow, not bolted on quarterly. Programs address hybrid etiquette, focus time, and leadership habits for distributed excellence.",
    sections: [
      {
        title: "Space + systems thinking",
        body:
          "<p>Facilities teams and IT jointly own experience. Training helps workplace strategists understand collaboration tools, while technologists learn how environment affects adoption.</p>",
      },
      {
        title: "Leadership in hybrid models",
        body:
          "<p>Managers need new rituals: async updates, inclusive meetings, and career visibility for remote contributors. SkillHub bundles these into leadership paths.</p>",
      },
    ],
    highlights: [
      { title: "Hybrid rituals", body: "Playbooks for standups, retros, and planning across sites." },
      { title: "Focus & wellbeing", body: "Modules on sustainable pace and burnout signals." },
      { title: "Workplace analytics", body: "Interpret utilization data without surveillance overreach." },
    ],
    steps: [
      { title: "Listen to teams", body: "Surveys and interviews on friction points." },
      { title: "Pilot new rituals", body: "Test with volunteer squads and measure sentiment." },
      { title: "Train managers", body: "Equip leads to model inclusive hybrid behavior." },
      { title: "Embed in onboarding", body: "Make norms explicit for every new hire." },
    ],
    faqs: [
      { title: "Is this only for HR?", body: "<p>No — IT, facilities, and line managers all have dedicated modules.</p>" },
      { title: "Remote-first companies?", body: "<p>Content adapts to digital-native rituals without physical office assumptions.</p>" },
    ],
  },
  {
    path: "/insights/data-driven-decisions",
    slug: "insight-data-driven-decisions",
    name: "Data-Driven Decisions",
    description: "Analytics collaboration, dashboards that drive action, and literacy for business leaders.",
    sortOrder: 500,
    eyebrow: "Analytics",
    pngPattern: "robot-and-human-collaboration",
    headline: "Analytics that change behavior — not just slide decks",
    subhead: "Human–robot collaboration in data work means faster insight with accountable decisions.",
    intro:
      "Business analytics artwork shows humans and intelligent systems reviewing charts together. SkillHub teaches analysts to tell stories, leaders to ask better questions, and teams to operationalize metrics without dashboard fatigue.",
    sections: [
      {
        title: "From reporting to decisions",
        body:
          "<p>Shift KPI reviews toward decisions: what we will stop, start, or fund based on evidence. Training includes facilitation templates and bias checks for metric selection.</p>",
      },
      {
        title: "Self-serve with guardrails",
        body:
          "<p>Empower business users with certified datasets and glossary tools while data teams retain governance. Everyone learns the same definitions.</p>",
      },
    ],
    highlights: [
      { title: "Executive dashboards", body: "Design principles for clarity and action triggers." },
      { title: "Analyst storytelling", body: "Narrative structures that survive leadership meetings." },
      { title: "Metric governance", body: "Owners, lineage, and change control for KPIs." },
    ],
    steps: [
      { title: "Inventory metrics", body: "Catalog definitions and eliminate duplicates." },
      { title: "Train consumers", body: "Short modules for business users on reading charts responsibly." },
      { title: "Run decision forums", body: "Monthly sessions with pre-reads and outcomes logged." },
      { title: "Refine models", body: "Iterate definitions when the business changes." },
    ],
    faqs: [
      { title: "Tool-specific courses?", body: "<p>We map concepts to Power BI, Tableau, Looker, and warehouse SQL as needed.</p>" },
      { title: "Data literacy for all?", body: "<p>Yes — tiered depth by role is recommended.</p>" },
    ],
  },
  {
    path: "/insights/ai-innovation",
    slug: "insight-ai-innovation",
    name: "AI Innovation Culture",
    description: "Ideation, experimentation, and lightbulb moments — turning AI curiosity into governed innovation.",
    sortOrder: 510,
    eyebrow: "Innovation",
    pngPattern: "lightbulb-with-ai",
    headline: "Innovation programs that ship — not just brainstorm",
    subhead: "The lightbulb is the easy part. Execution needs skills, sandboxes, and sponsors.",
    intro:
      "AI lightbulb motifs capture ideation energy. SkillHub innovation academies add stage gates: hypothesis, experiment design, ethics review, and scale criteria — so hackathons produce portfolios leadership can fund.",
    sections: [
      {
        title: "Governed sandboxes",
        body:
          "<p>Give teams safe environments with synthetic or anonymized data, pre-approved models, and time-boxed experiments. Training covers how to document results for portfolio review.</p>",
      },
      {
        title: "Sponsor alignment",
        body:
          "<p>Executives learn to evaluate experiments on learning value and optionality — not only immediate ROI — while still demanding rigor.</p>",
      },
    ],
    highlights: [
      { title: "Hackathon kits", body: "Templates, judging rubrics, and post-event scale paths." },
      { title: "Ethics checkpoints", body: "Lightweight reviews before pilots touch customer data." },
      { title: "Portfolio management", body: "Track experiments from idea to production candidate." },
    ],
    steps: [
      { title: "Charter innovation", body: "Define scope, budget, and success signals." },
      { title: "Train facilitators", body: "Equip program managers to run disciplined sprints." },
      { title: "Run waves", body: "Quarterly cycles with demo days." },
      { title: "Fund winners", body: "Connect top experiments to product and platform roadmaps." },
    ],
    faqs: [
      { title: "Only for engineers?", body: "<p>No — business, design, and operations roles are core participants.</p>" },
      { title: "IP concerns?", body: "<p>Modules cover contribution policies and vendor terms.</p>" },
    ],
  },
  {
    path: "/insights/responsible-ai",
    slug: "insight-responsible-ai",
    name: "Responsible AI",
    description: "Humanoid AI, governance, fairness, and operational policies for trustworthy intelligent systems.",
    sortOrder: 520,
    eyebrow: "Governance",
    pngPattern: "artificial-intelligence-in-humanoid-robot",
    headline: "Humanoid hype meets human accountability",
    subhead: "Responsible AI is a discipline — not a disclaimer in the footer.",
    intro:
      "Humanoid robot imagery reminds us how viscerally people react to AI. SkillHub responsible-AI tracks cover policy, testing, documentation, and incident response so teams earn trust proactively.",
    sections: [
      {
        title: "Policy to practice",
        body:
          "<p>Translate principles into checklists: data provenance, model cards, red-team results, and monitoring plans. Every role knows their gate in the lifecycle.</p>",
      },
      {
        title: "Regulatory awareness",
        body:
          "<p>Modules summarize emerging obligations without pretending to be legal advice — enough literacy to involve counsel early.</p>",
      },
    ],
    highlights: [
      { title: "Model documentation", body: "Templates for cards, datasheets, and change logs." },
      { title: "Bias testing labs", body: "Hands-on evaluation across representative segments." },
      { title: "Incident playbooks", body: "Roles, comms, and rollback when models misbehave." },
    ],
    steps: [
      { title: "Publish principles", body: "Executive-signed statements with teeth." },
      { title: "Embed in SDLC", body: "Gates in design, build, deploy, and monitor." },
      { title: "Train reviewers", body: "Ethics champions in each business unit." },
      { title: "Audit annually", body: "External or internal reviews with published summaries." },
    ],
    faqs: [
      { title: "Small teams too?", body: "<p>Yes — lightweight RACI scales down without dropping essentials.</p>" },
      { title: "Vendor models?", body: "<p>We cover shared responsibility for API and SaaS AI services.</p>" },
    ],
  },
  {
    path: "/insights/ai-infrastructure",
    slug: "insight-ai-infrastructure",
    name: "AI Infrastructure",
    description: "Brains on motherboards — data platforms, networking, and MLOps foundations for reliable AI.",
    sortOrder: 530,
    eyebrow: "Platform",
    pngPattern: "artificial-intelligence-brain-and-motherboard",
    headline: "Infrastructure literacy for the AI era",
    subhead: "Models fail quietly when data pipes and compute fabrics are fragile.",
    intro:
      "Motherboard-and-brain art symbolizes the stack beneath every model. SkillHub trains platform engineers, data engineers, and architects on resilient pipelines, observability, and cost-aware scaling.",
    sections: [
      {
        title: "Data platform readiness",
        body:
          "<p>Feature stores, streaming ingestion, and cataloging are prerequisites — not nice-to-haves. Labs walk through failure injection and recovery drills.</p>",
      },
      {
        title: "MLOps maturity",
        body:
          "<p>Version models, data, and configs together. Training covers CI/CD for ML, canary releases, and rollback tied to business KPIs.</p>",
      },
    ],
    highlights: [
      { title: "Pipeline labs", body: "End-to-end flows from raw events to monitored endpoints." },
      { title: "Observability", body: "Metrics, logs, traces, and model drift dashboards." },
      { title: "FinOps for AI", body: "Right-size compute and spot opportunities for savings." },
    ],
    steps: [
      { title: "Assess stack", body: "Map tools, owners, and single points of failure." },
      { title: "Standardize patterns", body: "Reference architectures per cloud or on-prem mix." },
      { title: "Upskill teams", body: "Role-based paths for data, ML, and SRE collaborators." },
      { title: "Automate guardrails", body: "Policy-as-code for deployments." },
    ],
    faqs: [
      { title: "Multi-cloud?", body: "<p>Modules compare patterns; labs adapt to your primary provider.</p>" },
      { title: "Legacy integration?", body: "<p>We address batch bridges and gradual modernization." },
    ],
  },
  {
    path: "/insights/mobile-learning",
    slug: "insight-mobile-learning",
    name: "Mobile Learning & Micro-skills",
    description: "Learning in the flow of work — mobile moments, bite-sized practice, and just-in-time enablement.",
    sortOrder: 540,
    eyebrow: "Enablement",
    pngPattern: "hand-holding-a-smartphone-with-a-light-bulb",
    headline: "Micro-learning that fits between meetings",
    subhead: "The smartphone lightbulb is a metaphor for insight on demand — if content is designed for thumbs, not theater screens.",
    intro:
      "Mobile learning succeeds when modules respect context: short, searchable, and tied to tasks. SkillHub helps you repackage academies into micro-paths with spaced repetition and manager nudges.",
    sections: [
      {
        title: "Design for interruption",
        body:
          "<p>Three- to seven-minute segments with clear outcomes. Save deep dives for optional sync labs when learners have focus time.</p>",
      },
      {
        title: "Measure application",
        body:
          "<p>Prompt learners to apply one idea within 48 hours. Managers receive conversation starters, not surveillance scores.</p>",
      },
    ],
    highlights: [
      { title: "Micro-path authoring", body: "Guidelines for splitting long courses without losing narrative." },
      { title: "Push & nudge design", body: "Ethical notification patterns that help rather than harass." },
      { title: "Offline-friendly assets", body: "PDF job aids and downloadable checklists." },
    ],
    steps: [
      { title: "Identify moments", body: "Map tasks where a two-minute tip prevents errors." },
      { title: "Produce micro-modules", body: "Script, record, and caption for accessibility." },
      { title: "Pilot with field teams", body: "Iterate based on completion and feedback." },
      { title: "Integrate LMS/LXP", body: "Track progress alongside longer academies." },
    ],
    faqs: [
      { title: "Replace full courses?", body: "<p>No — micro-learning complements depth; it does not replace it.</p>" },
      { title: "BYOD policies?", body: "<p>We address security expectations for mobile access.</p>" },
    ],
  },
  {
    path: "/insights/ml-operations",
    slug: "insight-ml-operations",
    name: "MLOps & Reliability",
    description: "Gears, automation, and machine learning operations that keep models healthy in production.",
    sortOrder: 550,
    eyebrow: "MLOps",
    pngPattern: "hand-drawn-gear-with-ai",
    headline: "Operational excellence for machine learning",
    subhead: "Training models is a sprint; operating them is a marathon.",
    intro:
      "Gear-and-AI sketches represent the machinery of MLOps — pipelines, alerts, and ownership. SkillHub paths align with platform engineering and data science leads who need shared runbooks.",
    sections: [
      {
        title: "Ownership models",
        body:
          "<p>Clarify who owns data quality, model performance, and customer impact. RACI exercises prevent midnight pages with no responder.</p>",
      },
      {
        title: "Release discipline",
        body:
          "<p>Shadow deployments, champion/challenger tests, and automated rollback criteria should be as normal as app releases.</p>",
      },
    ],
    highlights: [
      { title: "CI/CD for ML", body: "Build pipelines that test data and models together." },
      { title: "Drift detection", body: "Labs on statistical and business-metric drift." },
      { title: "On-call readiness", body: "Runbooks and simulations for model incidents." },
    ],
    steps: [
      { title: "Inventory models", body: "Catalog owners, SLAs, and dependencies." },
      { title: "Standardize tooling", body: "Pick a coherent MLOps stack per environment." },
      { title: "Train on-call", body: "Rotate data scientists through operational weeks." },
      { title: "Review quarterly", body: "Postmortems and reliability targets." },
    ],
    faqs: [
      { title: "Kubernetes required?", body: "<p>Helpful but not mandatory — patterns translate across runtimes.</p>" },
      { title: "Batch-only models?", body: "<p>We cover batch monitoring and backfill strategies too.</p>" },
    ],
  },
  {
    path: "/insights/neuromorphic-computing",
    slug: "insight-neuromorphic-computing",
    name: "Neuromorphic & Edge AI",
    description: "Brain chips, edge inference, and specialized hardware — what teams need to know now.",
    sortOrder: 560,
    eyebrow: "Edge AI",
    pngPattern: "3d-illustration-of-brain-chip",
    headline: "Edge intelligence without edge-case outages",
    subhead: "3D brain-chip art signals specialized hardware — and the skills gap that comes with it.",
    intro:
      "Neuromorphic and edge AI push inference closer to sensors and users. SkillHub introduces architects and developers to latency trade-offs, power budgets, and update mechanisms for devices that cannot phone home every second.",
    sections: [
      {
        title: "When edge beats cloud",
        body:
          "<p>Privacy, latency, and connectivity gaps drive edge decisions. Training helps teams model total cost including operations, not only unit economics.</p>",
      },
      {
        title: "Update and security",
        body:
          "<p>OTA updates, key rotation, and tamper detection are part of ML literacy at the edge — not optional security extras.</p>",
      },
    ],
    highlights: [
      { title: "Architecture patterns", body: "Split inference, federated learning, and sync strategies." },
      { title: "Hardware survey", body: "Non-vendor-specific overview of accelerators and NPUs." },
      { title: "Field operations", body: "Playbooks for technicians deploying models on-site." },
    ],
    steps: [
      { title: "Profile workloads", body: "Latency, privacy, and power constraints per use case." },
      { title: "Prototype on dev kits", body: "Short labs before production hardware commits." },
      { title: "Plan updates", body: "Design safe rollout and rollback for fleets." },
      { title: "Monitor fleets", body: "Telemetry without crushing bandwidth." },
    ],
    faqs: [
      { title: "Cutting-edge only?", body: "<p>Concepts apply to any edge deployment, not only neuromorphic chips.</p>" },
      { title: "OT security overlap?", body: "<p>Yes — modules cross-reference ICS security basics.</p>" },
    ],
  },
  {
    path: "/insights/digital-assistants",
    slug: "insight-digital-assistants",
    name: "Digital Assistants",
    description: "3D chat icons, voice, and multimodal assistants — design and deploy helpful digital teammates.",
    sortOrder: 570,
    eyebrow: "Assistants",
    pngPattern: "3d-chat-symbol-icon-talking-to-ai-robot",
    headline: "Assistants people actually want to use",
    subhead: "Chat icons are everywhere — usefulness is rare.",
    intro:
      "3D chat-and-robot artwork reflects multimodal assistants entering workplace tools. SkillHub covers conversation design, persona guidelines, accessibility, and analytics so assistants feel helpful rather than gimmicky.",
    sections: [
      {
        title: "Conversation design",
        body:
          "<p>Script happy paths, graceful failures, and personality boundaries. Designers and engineers pair on utterance libraries and test sets.</p>",
      },
      {
        title: "Multimodal futures",
        body:
          "<p>Voice, text, and visual inputs combine in new ways. Training previews patterns without locking you to a single vendor stack.</p>",
      },
    ],
    highlights: [
      { title: "Persona & tone", body: "Brand-aligned voice without over-promising capabilities." },
      { title: "Accessibility", body: "Captions, screen reader flows, and inclusive language." },
      { title: "Analytics", body: "Funnel metrics from intent through resolution." },
    ],
    steps: [
      { title: "Research intents", body: "Shadow users and catalog real questions." },
      { title: "Design dialogs", body: "Prototype flows with designers and SMEs." },
      { title: "Test with users", body: "Moderated sessions before broad launch." },
      { title: "Iterate weekly", body: "Ship content updates on a cadence." },
    ],
    faqs: [
      { title: "Voice-only teams?", body: "<p>Modules split text-first and voice-specific considerations.</p>" },
      { title: "Global rollout?", body: "<p>Localization and cultural review are built into the path.</p>" },
    ],
  },
  {
    path: "/insights/data-driven-growth",
    slug: "insight-data-driven-growth",
    name: "Data-Driven Growth",
    description: "Urban development and growth strategies powered by analytics — from cities to commercial teams.",
    sortOrder: 580,
    eyebrow: "Growth",
    pngPattern: "data-driven-growth",
    headline: "Growth strategies anchored in evidence",
    subhead: "Data-driven growth is a team sport across marketing, product, and operations.",
    intro:
      "Growth-strategy illustrations tie analytics to expansion — whether geographic or commercial. SkillHub helps revenue and product teams build shared metrics, experimentation literacy, and ethical targeting practices.",
    sections: [
      {
        title: "Experimentation culture",
        body:
          "<p>Teach hypothesis formation, sample size basics, and when not to experiment. Reduce HiPPO decisions with transparent results archives.</p>",
      },
      {
        title: "Alignment workshops",
        body:
          "<p>Marketing, sales, and product agree on funnel definitions once — then learning modules reinforce the same math.</p>",
      },
    ],
    highlights: [
      { title: "Growth analytics", body: "Cohort, attribution, and unit economics modules." },
      { title: "Experiment design", body: "Templates for A/B and quasi-experiments." },
      { title: "Ethical targeting", body: "Guardrails for personalization and consent." },
    ],
    steps: [
      { title: "Unify metrics", body: "Single glossary across growth teams." },
      { title: "Train experimenters", body: "Certify owners before they launch tests." },
      { title: "Review results", body: "Monthly forums with decision logs." },
      { title: "Scale winners", body: "Playbooks to roll successful tests globally." },
    ],
    faqs: [
      { title: "B2B vs B2C?", body: "<p>Examples adapt; statistical principles stay constant.</p>" },
      { title: "Tooling?", body: "<p>Concept-first with optional labs in your analytics stack.</p>" },
    ],
  },
  {
    path: "/insights/creative-ai-teams",
    slug: "insight-creative-ai-teams",
    name: "Creative AI for Teams",
    description: "Robots, ideas, and digital data — how creative and product teams collaborate with generative AI.",
    sortOrder: 590,
    eyebrow: "Creativity",
    pngPattern: "ai-robot-with-digital-data",
    headline: "Generative AI as a creative partner",
    subhead: "Robots holding idea clouds symbolize augmented creativity — with guardrails.",
    intro:
      "Creative-AI artwork captures generative tools in marketing, design, and product discovery. SkillHub teaches prompt craft, brand compliance, asset rights, and human review workflows so speed does not sacrifice quality.",
    sections: [
      {
        title: "Brand-safe generation",
        body:
          "<p>Style guides, forbidden topics, and approval chains belong in every creative workflow. Training embeds legal and brand partners early.</p>",
      },
      {
        title: "Human finishing",
        body:
          "<p>AI drafts; humans refine tone, accessibility, and cultural nuance. Modules celebrate craft rather than one-click publishing.</p>",
      },
    ],
    highlights: [
      { title: "Prompt libraries", body: "Reusable patterns by channel and audience." },
      { title: "Rights & licensing", body: "What teams must verify before shipping assets." },
      { title: "Review workflows", body: "Checklists for campaign launches." },
    ],
    steps: [
      { title: "Publish policy", body: "Approved tools, data boundaries, and attribution." },
      { title: "Train creators", body: "Workshops for copy, design, and video teams." },
      { title: "Pilot campaigns", body: "Measure quality and cycle time vs. baseline." },
      { title: "Expand carefully", body: "Add channels as review muscle strengthens." },
    ],
    faqs: [
      { title: "Replace agencies?", body: "<p>No — AI augments internal and partner creative work.</p>" },
      { title: "Industry regulations?", body: "<p>Healthcare and finance get additional compliance modules.</p>" },
    ],
  },
  {
    path: "/insights/ai-knowledge-management",
    slug: "insight-ai-knowledge-management",
    name: "AI Knowledge Management",
    description: "Document icons, file intelligence, and enterprise search — organize institutional knowledge for AI.",
    sortOrder: 600,
    eyebrow: "Knowledge",
    pngPattern: "3d-ai-file-extension",
    headline: "Knowledge bases ready for AI — and humans",
    subhead: "The AI file icon reminds us: models are only as good as the documents you curate.",
    intro:
      "Document-and-AI iconography represents enterprise knowledge management reborn. SkillHub trains librarians, engineers, and team leads to structure wikis, tickets, and policies so retrieval-augmented systems return trustworthy answers.",
    sections: [
      {
        title: "Content hygiene",
        body:
          "<p>Archive stale pages, assign owners, and tag consistently. AI magnifies mess — cleaning first yields better ROI than bigger models.</p>",
      },
      {
        title: "Search and chat together",
        body:
          "<p>Users should move seamlessly from keyword search to conversational follow-ups. Training covers UX patterns and logging for improvement.</p>",
      },
    ],
    highlights: [
      { title: "Taxonomy design", body: "Practical tagging without bureaucracy paralysis." },
      { title: "RAG readiness", body: "Chunking, metadata, and access control labs." },
      { title: "Librarian skills", body: "Upskill knowledge managers for the AI era." },
    ],
    steps: [
      { title: "Audit content", body: "Find duplicates, orphans, and sensitive material." },
      { title: "Assign stewards", body: "Named owners per domain." },
      { title: "Index safely", body: "Respect permissions in vector stores." },
      { title: "Measure findability", body: "Track search success and deflection quality." },
    ],
    faqs: [
      { title: "SharePoint / Confluence?", body: "<p>Patterns apply across major KM platforms.</p>" },
      { title: "Sensitive data?", body: "<p>Modules on classification, redaction, and access tiers.</p>" },
    ],
  },
];

function resolveInsightImages(def, manifest) {
  const hero = findPngByPattern(PNG_FOLDER_IDS, manifest, def.pngPattern);
  const extras = pickFolderImages("business-ai-pngs", manifest, 4, def.sortOrder % 200);
  return {
    hero: hero || extras[0] || "",
    accents: [
      hero,
      findPngByPattern(PNG_FOLDER_IDS, manifest, def.highlights[0]?.title?.slice(0, 8) || "") || extras[1],
      extras[2],
      extras[3],
    ].filter(Boolean),
  };
}

function insightPlacements(def) {
  const m = loadUploadsManifest();
  const { hero, accents } = resolveInsightImages(def, m);

  return [
    { section_key: "in_page_nav", sort_order: 0 },
    {
      section_key: "editorial_banner",
      sort_order: 1,
      section_title: def.headline,
      sub_title: def.subhead,
      in_page_nav_title: def.eyebrow,
      section_img_url: hero,
      data: { body: `<p>${def.intro}</p>` },
      buttons: [
        btn("All visual guides", { target_url: "/insights", sort_order: 0 }),
        btn("Talk to SkillHub", { variant: "secondary", target_url: "/contact-us", sort_order: 1 }),
      ],
    },
    {
      section_key: "text_media",
      sort_order: 2,
      section_title: "Deep dive",
      in_page_nav_title: "Overview",
      items: def.sections.map((s, i) =>
        item(
          {
            title: s.title,
            subtitle: s.subtitle || "",
            body: s.body,
            image_url: accents[i % accents.length] || hero,
            value: i % 2 === 0 ? "end" : "start",
          },
          i
        )
      ),
    },
    {
      section_key: "feature_spotlight",
      sort_order: 3,
      section_title: "What teams gain",
      sub_title: "Practical outcomes from structured learning.",
      in_page_nav_title: "Outcomes",
      items: def.highlights.map((h, i) =>
        item(
          {
            value: String(i + 1).padStart(2, "0"),
            title: h.title,
            body: `<p>${h.body}</p>`,
            image_url: accents[i % accents.length] || hero,
          },
          i
        )
      ),
    },
    {
      section_key: "process_steps",
      sort_order: 4,
      section_title: "How to get started",
      in_page_nav_title: "Steps",
      items: def.steps.map((s, i) => item({ title: s.title, body: `<p>${s.body}</p>` }, i)),
    },
    {
      section_key: "faq",
      sort_order: 5,
      section_title: "Common questions",
      in_page_nav_title: "FAQ",
      items: def.faqs.map((f, i) => item({ title: f.title, body: f.body }, i)),
    },
    {
      section_key: "cta_band",
      sort_order: 6,
      section_title: "Build this capability with SkillHub",
      sub_title: "We design cohorts, labs, and executive briefings around your stack and timeline.",
      buttons: [
        btn("Get started", { target_url: "/get-started", sort_order: 0 }),
        btn("Browse courses", { variant: "secondary", target_url: "/courses", sort_order: 1 }),
      ],
    },
  ];
}

export function insightsHubPlacements() {
  const m = loadUploadsManifest();
  const hero = findPngByPattern(PNG_FOLDER_IDS, m, "robot-and-human-collaboration") || pickFolderImages("business-ai-pngs", m, 1, 0)[0];

  const cards = INSIGHT_CHILD_PAGES.map((child, i) => {
    const img = findPngByPattern(PNG_FOLDER_IDS, m, child.pngPattern);
    return item(
      {
        value: child.eyebrow,
        title: child.name,
        subtitle: child.path,
        body: `<p>${child.description}</p>`,
        image_url: img || hero,
        href: child.path,
        buttons: [btn("Read guide", { target_url: child.path, variant: "link" })],
      },
      i
    );
  });

  return [
    { section_key: "in_page_nav", sort_order: 0 },
    {
      section_key: "editorial_banner",
      sort_order: 1,
      section_title: "Visual learning guides",
      sub_title: "Twenty long-form insight pages illustrated with transparent PNG artwork from our uploads library.",
      in_page_nav_title: "Insights",
      section_img_url: hero,
      data: {
        body: "<p>Each guide pairs editorial copy with AI, workplace, and industry illustrations — designed for readable long pages with in-page navigation, FAQs, and clear next steps toward SkillHub programs.</p>",
      },
      buttons: [
        btn("Explore courses", { target_url: "/courses", sort_order: 0 }),
        btn("Contact us", { variant: "secondary", target_url: "/contact-us", sort_order: 1 }),
      ],
    },
    {
      section_key: "stats",
      sort_order: 2,
      section_title: "Library at a glance",
      in_page_nav_title: "Stats",
      items: [
        item({ value: "20", label: "In-depth guides" }, 0),
        item({ value: "1,400+", label: "Transparent PNG assets" }, 1),
        item({ value: "7", label: "Sections per guide" }, 2),
        item({ value: "CMS", label: "Editable in live editor" }, 3),
      ],
    },
    {
      section_key: "feature_spotlight",
      sort_order: 3,
      section_title: "Browse by topic",
      sub_title: "AI, operations, analytics, service, and workplace transformation.",
      in_page_nav_title: "Topics",
      items: cards,
    },
    {
      section_key: "cta_band",
      sort_order: 4,
      section_title: "Turn insights into programs",
      sub_title: "Pick a guide, then talk to us about cohort design and vendor-aligned labs.",
      buttons: [
        btn("Plan a program", { target_url: "/get-started", sort_order: 0 }),
        btn("View solutions", { variant: "secondary", target_url: "/solutions", sort_order: 1 }),
      ],
    },
  ];
}

export function allPngInsightPageDefs() {
  const hub = {
    path: "/insights",
    slug: "insights",
    name: "Visual Learning Guides",
    description: "Long-form insight pages with transparent PNG illustrations — AI, work, and industry topics.",
    sortOrder: 400,
    placements: insightsHubPlacements,
  };

  const children = INSIGHT_CHILD_PAGES.map((child) => ({
    ...child,
    placements: () => insightPlacements(child),
  }));

  return [hub, ...children];
}

export const INSIGHT_PATHS = ["/insights", ...INSIGHT_CHILD_PAGES.map((p) => p.path)];
