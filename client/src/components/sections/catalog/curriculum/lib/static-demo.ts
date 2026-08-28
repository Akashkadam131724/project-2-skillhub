import type { CurriculumUiItem } from "./types";

export const CURRICULUM_STATIC_DEMO = {
  title: "Sample curriculum",
  subtitle: "Static demo via CurriculumStatic — no API.",
  items: [
    { id: "c1", title: "Platform overview" },
    { id: "c2", title: "Section library & CMS" },
    { id: "c3", title: "Catalog & course paths" },
    { id: "c4", title: "Launch checklist" },
  ] satisfies CurriculumUiItem[],
};
