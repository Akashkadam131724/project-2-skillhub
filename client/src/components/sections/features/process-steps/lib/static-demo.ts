import type { ProcessStepUiItem } from "./types";

/** Hard-coded process steps — used by {@link ProcessStepsStatic}. */
export const PROCESS_STEPS_STATIC_DEMO = {
  title: "From catalog to capability",
  subtitle: "From discovery to certified—in four clear stages.",
  items: [
    {
      id: "p1",
      title: "Discover",
      subtitle: "Browse",
      body: "<p>Browse vendors and skilling areas.</p>",
    },
    {
      id: "p2",
      title: "Evaluate",
      subtitle: "Compare",
      body: "<p>Compare products and course paths.</p>",
    },
    {
      id: "p3",
      title: "Enroll",
      subtitle: "Launch",
      body: "<p>Launch learning with clear next steps.</p>",
    },
    {
      id: "p4",
      title: "Measure",
      subtitle: "Prove",
      body: "<p>Track outcomes and iterate on what works.</p>",
    },
  ] satisfies ProcessStepUiItem[],
};
