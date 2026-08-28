import type { StatUiItem } from "./types";

/** Hard-coded stats — used by {@link StatsStatic}. */
export const STATS_STATIC_DEMO = {
  title: "SkillHub by the numbers",
  subtitle: "Completion, engagement, and credential velocity at a glance.",
  items: [
    { id: "s1", value: "1M+", label: "Learners trained" },
    { id: "s2", value: "50+", label: "Vendor partners" },
    { id: "s3", value: "58", label: "Section layouts" },
    { id: "s4", value: "24/7", label: "Live CMS editing" },
  ] satisfies StatUiItem[],
};
