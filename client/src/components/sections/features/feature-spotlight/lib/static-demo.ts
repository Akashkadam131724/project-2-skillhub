import type { FeatureSpotlightUiItem } from "./types";

/** Hard-coded spotlight — used by {@link FeatureSpotlightStatic}. */
export const FEATURE_SPOTLIGHT_STATIC_DEMO = {
  section_title: "Platform highlights",
  sub_title: "Static demo via FeatureSpotlightStatic — no API.",
  items: [
    {
      id: "fs1",
      value: "98%",
      title: "Completion rate",
      subtitle: "Enterprise cohorts",
      body: "<p>Teams finish structured paths on schedule.</p>",
      large: true,
    },
    {
      id: "fs2",
      value: "24/7",
      title: "Lab access",
      subtitle: "Cloud sandboxes",
    },
    {
      id: "fs3",
      value: "50+",
      title: "Cert paths",
      subtitle: "Vendor aligned",
    },
  ] satisfies FeatureSpotlightUiItem[],
};
