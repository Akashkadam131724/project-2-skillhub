import type { ComparisonUiItem } from "./types";

export const COMPARISON_TABLE_STATIC_DEMO = {
  title: "Compare training formats",
  subtitle: "Static demo via ComparisonTableStatic — no API.",
  items: [
    {
      id: "c1",
      option: "Instructor-led",
      highlight: "Live cohort",
      notes: "<p>Best for teams that want guided labs and Q&amp;A.</p>",
    },
    {
      id: "c2",
      option: "Self-paced",
      highlight: "On demand",
      notes: "<p>Flexible schedule with practice environments included.</p>",
    },
    {
      id: "c3",
      option: "Blended",
      highlight: "Hybrid",
      notes: "<p>Combine live kickoff with self-paced modules.</p>",
    },
  ] satisfies ComparisonUiItem[],
};
