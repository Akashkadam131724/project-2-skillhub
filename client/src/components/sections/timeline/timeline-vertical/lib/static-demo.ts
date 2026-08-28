import type { TimelineStepUiItem } from "./types";

/** Hard-coded timeline — used by {@link TimelineVerticalStatic}. */
export const TIMELINE_VERTICAL_STATIC_DEMO = {
  title: "How we onboard your team",
  subtitle: "Static demo via TimelineVerticalStatic — no API.",
  items: [
    {
      id: "t1",
      subtitle: "Week 1",
      title: "Discovery",
      body: "<p>Align on roles, timelines, and success metrics.</p>",
    },
    {
      id: "t2",
      subtitle: "Week 2–3",
      title: "Curate paths",
      body: "<p>Map vendors, products, and delivery format.</p>",
    },
    {
      id: "t3",
      subtitle: "Week 4+",
      title: "Launch & measure",
      body: "<p>Go live with reporting and advisor check-ins.</p>",
    },
  ] satisfies TimelineStepUiItem[],
};
