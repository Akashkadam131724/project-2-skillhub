import type { TabUiItem } from "../../shared/lib/types";

export const TABS_HORIZONTAL_STATIC_DEMO = {
  title: "Horizontal pill tabs",
  subtitle: "Static demo via TabsHorizontalStatic.",
  tabs: [
    {
      id: "th1",
      value: "01",
      title: "L&D leaders",
      subtitle: "Curate catalog",
      body: "<p>Build a trustworthy training catalog for your org.</p>",
    },
    {
      id: "th2",
      value: "02",
      title: "Enablement teams",
      subtitle: "Launch faster",
      body: "<p>Publish curated paths with live CMS editing.</p>",
    },
  ] satisfies TabUiItem[],
};
