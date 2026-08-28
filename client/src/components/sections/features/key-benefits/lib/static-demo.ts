import type { KeyBenefitsUiItem } from "./types";

/** Hard-coded key benefits — used by {@link KeyBenefitsStatic}. */
export const KEY_BENEFITS_STATIC_DEMO = {
  title: "Why teams choose SkillHub",
  subtitle: "Static demo via KeyBenefitsStatic — no API.",
  items: [
    {
      id: "b1",
      title: "Authorized curricula",
      body: "<p>Official vendor training paths from Microsoft, AWS, Google Cloud, and more.</p>",
    },
    {
      id: "b2",
      title: "Live CMS",
      body: "<p>Edit marketing pages on the live URL without waiting for a deploy.</p>",
    },
    {
      id: "b3",
      title: "Structured catalog",
      body: "<p>Vendors, products, courses, and blogs stay linked and filterable.</p>",
    },
    {
      id: "b4",
      title: "Reusable sections",
      body: "<p>Pick layouts from the section library and drop them on any page template.</p>",
    },
  ] satisfies KeyBenefitsUiItem[],
};
