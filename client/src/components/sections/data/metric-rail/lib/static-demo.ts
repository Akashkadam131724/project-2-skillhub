import type { MetricRailUiItem } from "./types";

/** Hard-coded metric rail — used by {@link MetricRailStatic}. */
export const METRIC_RAIL_STATIC_DEMO = {
  title: "Platform metrics",
  subtitle: "Static demo via MetricRailStatic — no API.",
  items: [
    { id: "m1", value: "58", label: "Sections" },
    { id: "m2", value: "9", label: "Categories" },
    { id: "m3", value: "Live", label: "CMS editing" },
    { id: "m4", value: "1M+", label: "Learners" },
  ] satisfies MetricRailUiItem[],
};
