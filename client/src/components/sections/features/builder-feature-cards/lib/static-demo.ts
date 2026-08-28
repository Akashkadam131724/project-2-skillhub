import type { BuilderFeatureCardUiItem } from "./types";

/** Hard-coded builder feature cards — used by {@link BuilderFeatureCardsStatic}. */
export const BUILDER_FEATURE_CARDS_STATIC_DEMO = {
  title: "CMS feature checklist",
  subtitle: "Static demo via BuilderFeatureCardsStatic — no API.",
  items: [
    {
      id: "f1",
      value: "01",
      title: "Section library",
      body: "<p>58 layouts across 9 categories.</p>",
    },
    {
      id: "f2",
      value: "02",
      title: "Live edit",
      body: "<p>On-page CMS for any public URL.</p>",
    },
    {
      id: "f3",
      value: "03",
      title: "Entity pages",
      body: "<p>Vendors through blogs.</p>",
    },
    {
      id: "f4",
      value: "04",
      title: "Analytics",
      body: "<p>Measure engagement across every section.</p>",
    },
  ] satisfies BuilderFeatureCardUiItem[],
};
