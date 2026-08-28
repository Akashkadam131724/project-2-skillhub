import type { LearningPathStepUiItem } from "./types";

export const LEARNING_PATH_STATIC_DEMO = {
  title: "Azure administrator path",
  subtitle: "Structured paths from fundamentals to role-ready credentials.",
  items: [
    {
      id: "lp1",
      stepNumber: "1",
      title: "Cloud fundamentals",
      subtitle: "8 hrs · self-paced",
      body: "<p>Core Azure concepts and governance.</p>",
    },
    {
      id: "lp2",
      stepNumber: "2",
      title: "Compute & networking",
      subtitle: "16 hrs · blended",
      body: "<p>VMs, VNets, and load balancing labs.</p>",
    },
  ] satisfies LearningPathStepUiItem[],
};
