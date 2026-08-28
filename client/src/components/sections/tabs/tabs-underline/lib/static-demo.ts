import type { TabUiItem } from "../../shared/lib/types";

export const TABS_UNDERLINE_STATIC_DEMO = {
  title: "Underline editorial tabs",
  subtitle: "Editorial tab strip for programs, resources, and outcomes.",
  tabs: [
    {
      id: "tu1",
      title: "Cloud engineer",
      subtitle: "Build platforms",
      body: "<p>Design and operate cloud-native systems.</p>",
    },
    {
      id: "tu2",
      title: "Security analyst",
      subtitle: "Protect workloads",
      body: "<p>Threat modeling and compliance for modern stacks.</p>",
    },
  ] satisfies TabUiItem[],
};
