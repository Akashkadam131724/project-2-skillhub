import type { CardStackUiItem } from "./types";

/** Hard-coded card stack — used by {@link CardStackStatic}. */
export const CARD_STACK_STATIC_DEMO = {
  title: "How modern L&D teams ship faster",
  subtitle: "Sticky stacking story cards — scroll to reveal each chapter.",
  items: [
    {
      id: "c1",
      imageUrl: "/images/placeholders/hero.jpg",
      value: "01",
      title: "Discover the catalog",
      subtitle: "Step 01",
      body: "<p>Filter by vendor, skilling area, delivery format, and certification level.</p>",
    },
    {
      id: "c2",
      imageUrl: "/images/placeholders/gallery-1.jpg",
      value: "02",
      title: "Curate learning paths",
      subtitle: "Step 02",
      body: "<p>Bundle courses into role-based journeys.</p>",
    },
    {
      id: "c3",
      imageUrl: "/images/placeholders/laptop.jpg",
      value: "03",
      title: "Publish landing pages",
      subtitle: "Step 03",
      body: "<p>Attach section layouts and refine copy in live CMS mode.</p>",
    },
    {
      id: "c4",
      imageUrl: "/images/placeholders/data-viz.jpg",
      value: "04",
      title: "Measure outcomes",
      subtitle: "Step 04",
      body: "<p>Track enrollments, completions, and exam pass rates.</p>",
    },
  ] satisfies CardStackUiItem[],
};
