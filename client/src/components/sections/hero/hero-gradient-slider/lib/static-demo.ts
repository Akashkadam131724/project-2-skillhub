import type { HeroGradientSliderSlide } from "./types";

/** NetCom CMS banner art — static homepage banner demo */
export const HERO_GRADIENT_SLIDER_DEMO_IMAGES = {
  program: "https://images.netcomlearning.com/cms/banners/pprogrambanner-2.png",
  nplus: "https://images.netcomlearning.com/cms/banners/nplus-2.png",
  microsoftAwards:
    "https://images.netcomlearning.com/cms/banners/microsoft-awards-slider-02.png",
  aiFace:
    "https://images.netcomlearning.com/cms/banners/homepagebannerimagewithface.png",
} as const;

const DEFAULT_FIRST_VIDEO =
  "https://youtu.be/m1Te82oeQX4?si=BqlE77S3ksSF__x4";
const DEFAULT_FOURTH_VIDEO =
  "https://www.youtube.com/watch?v=RPAITnl5lCA";

export const HERO_GRADIENT_SLIDER_DEFAULT_BG =
  "linear-gradient(157.967deg, rgb(15, 23, 42) 0%, rgb(0, 35, 109) 50%, rgb(15, 23, 42) 100%)";

export const HERO_GRADIENT_SLIDER_STATIC_SLIDES: HeroGradientSliderSlide[] = [
  {
    id: "hp-1",
    title: "Accelerate workforce transformation with AI-driven learning",
    body:
      "<p>Authorized training paths, live CMS editing, and learner analytics in one platform your teams will actually use.</p>",
    sideImageUrl: HERO_GRADIENT_SLIDER_DEMO_IMAGES.program,
    videoUrl: DEFAULT_FIRST_VIDEO,
    showStats: true,
    buttons: [
      {
        label: "Get Started",
        variant: "primary",
        action_type: "url",
        target_url: "/get-started",
        sort_order: 0,
        status: true,
      },
      {
        label: "Talk to sales",
        variant: "outline",
        action_type: "url",
        target_url: "/contact-us",
        sort_order: 1,
        status: true,
      },
    ],
  },
  {
    id: "hp-2",
    title: "Role-based certification paths for cloud, security, and data",
    body:
      "<p>Compare AWS, Azure, and GCP curricula side by side — then assign learning paths by job family.</p>",
    sideImageUrl: HERO_GRADIENT_SLIDER_DEMO_IMAGES.nplus,
    buttons: [
      {
        label: "Browse catalog",
        variant: "primary",
        action_type: "url",
        target_url: "/catalog",
        sort_order: 0,
        status: true,
      },
    ],
  },
  {
    id: "hp-3",
    title: "Enterprise learning that scales with your business",
    body:
      "<p>From onboarding to executive cohorts — one destination for marketing, L&D, and learners.</p>",
    sideImageUrl: HERO_GRADIENT_SLIDER_DEMO_IMAGES.microsoftAwards,
  },
  {
    id: "hp-4",
    title: "See how leading teams deliver measurable outcomes",
    body:
      "<p>Watch how SkillHub connects marketing, L&D, and learners in a single experience.</p>",
    sideImageUrl: HERO_GRADIENT_SLIDER_DEMO_IMAGES.aiFace,
    videoUrl: DEFAULT_FOURTH_VIDEO,
    buttons: [
      {
        label: "View case studies",
        variant: "primary",
        action_type: "url",
        target_url: "/case-studies",
        sort_order: 0,
        status: true,
      },
    ],
  },
];
