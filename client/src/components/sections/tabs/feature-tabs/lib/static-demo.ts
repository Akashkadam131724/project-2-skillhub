import type { TabUiItem } from "../../shared/lib/types";

export const FEATURE_TABS_STATIC_DEMO = {
  title: "Vertical tabs — catalog paths",
  subtitle: "Compare vendors, products, and certification tracks in one view.",
  tabs: [
    {
      id: "ft1",
      value: "01",
      title: "Vendors",
      subtitle: "Technology partners",
      body: "<p>Start with authorized training vendors.</p>",
      children: [
        {
          id: "ft1c1",
          title: "Cloud catalog",
          subtitle: "AWS · Azure · GCP",
          body: "<p>Compare certification paths side by side.</p>",
        },
      ],
    },
    {
      id: "ft2",
      value: "02",
      title: "Products",
      subtitle: "Training bundles",
      body: "<p>Bundle courses by role or certification track.</p>",
    },
  ] satisfies TabUiItem[],
};
