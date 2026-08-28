import type { MasonryQuoteUiItem } from "./types";

export const MASONRY_QUOTES_STATIC_DEMO = {
  title: "Loved by teams everywhere",
  subtitle: "Voices from practitioners, managers, and program owners.",
  items: [
    {
      id: "mq1",
      quote: "<p>We shipped our first certification program in weeks, not months.</p>",
      author: "Program Manager",
      role: "Enterprise L&D",
    },
    {
      id: "mq2",
      quote: "<p>The catalog quality and vendor coverage is unmatched for our industry.</p>",
      author: "VP Operations",
      role: "Healthcare",
    },
    {
      id: "mq3",
      quote: "<p>Finally one place to compare training paths and prove ROI.</p>",
      author: "Director of Enablement",
      role: "SaaS",
    },
  ] satisfies MasonryQuoteUiItem[],
};
