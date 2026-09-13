import mongoose from "mongoose";
import { btn, item } from "./cms-seed-shared.js";

export const HERO_GRADIENT_SLIDER_IMAGES = {
  program: "https://images.netcomlearning.com/cms/banners/pprogrambanner-2.png",
  nplus: "https://images.netcomlearning.com/cms/banners/nplus-2.png",
  microsoftAwards:
    "https://images.netcomlearning.com/cms/banners/microsoft-awards-slider-02.png",
  aiFace:
    "https://images.netcomlearning.com/cms/banners/homepagebannerimagewithface.png",
};

const FIRST_VIDEO = "https://youtu.be/m1Te82oeQX4?si=BqlE77S3ksSF__x4";
const FOURTH_VIDEO = "https://www.youtube.com/watch?v=RPAITnl5lCA";

/**
 * Nested slides + optional stats (item_type tab / item).
 * Stat `icon` is a key from the shared button icon catalog.
 */
export function buildHeroGradientSliderItems() {
  let order = 0;
  const next = () => order++;
  const items = [];

  const slides = [
    {
      title: "Accelerate workforce transformation with AI-driven learning",
      body:
        "<p>Authorized training paths, live CMS editing, and learner analytics in one platform your teams will actually use.</p>",
      image_url: HERO_GRADIENT_SLIDER_IMAGES.program,
      buttons: [
        btn("Get Started", { target_url: "/get-started", sort_order: 0 }),
        {
          ...btn("Watch video", {
            variant: "outline",
            action_type: "youtube",
            target_url: FIRST_VIDEO,
            sort_order: 1,
          }),
          icon: "youtube",
        },
      ],
      stats: [
        {
          value: "28+",
          label: "Years of Business Experience",
          icon: "calendar",
        },
        {
          value: "80%",
          label: "Of Fortune 1000 companies served",
          icon: "building",
        },
        {
          value: "96%",
          label: "Of Customers Recommended Us",
          icon: "chat",
        },
      ],
    },
    {
      title: "Role-based certification paths for cloud, security, and data",
      body:
        "<p>Compare AWS, Azure, and GCP curricula side by side — then assign learning paths by job family.</p>",
      image_url: HERO_GRADIENT_SLIDER_IMAGES.nplus,
      buttons: [
        btn("Browse catalog", { target_url: "/catalog", sort_order: 0 }),
      ],
    },
    {
      title: "Enterprise learning that scales with your business",
      body:
        "<p>From onboarding to executive cohorts — one destination for marketing, L&D, and learners.</p>",
      image_url: HERO_GRADIENT_SLIDER_IMAGES.microsoftAwards,
    },
    {
      title: "See how leading teams deliver measurable outcomes",
      body:
        "<p>Watch how SkillHub connects marketing, L&D, and learners in a single experience.</p>",
      image_url: HERO_GRADIENT_SLIDER_IMAGES.aiFace,
      buttons: [
        btn("View case studies", {
          target_url: "/case-studies",
          sort_order: 0,
        }),
        {
          ...btn("Watch video", {
            variant: "outline",
            action_type: "youtube",
            target_url: FOURTH_VIDEO,
            sort_order: 1,
          }),
          icon: "youtube",
        },
      ],
    },
  ];

  for (const slide of slides) {
    const tabId = new mongoose.Types.ObjectId().toString();
    items.push(
      item(
        {
          _id: tabId,
          item_type: "tab",
          title: slide.title,
          body: slide.body,
          image_url: slide.image_url,
          buttons: slide.buttons || [],
        },
        next()
      )
    );

    for (const stat of slide.stats || []) {
      items.push(
        item(
          {
            item_type: "item",
            parent_id: tabId,
            value: stat.value,
            label: stat.label,
            icon: stat.icon || "",
          },
          next()
        )
      );
    }
  }

  return items;
}
