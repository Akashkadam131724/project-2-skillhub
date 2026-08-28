import type { SuccessStoryUiItem } from "../../shared/lib/types";

export const SUCCESS_STORIES_STATIC_DEMO = {
  title: "Client Success Stories: How We Empower Teams",
  subtitle: "Customer wins across cloud migration, security, and leadership.",
  stories: [
    {
      id: "ss1",
      icon: "government",
      label: "Federal Government",
      subtitle: "AWS",
      title:
        "Federal agency upskilled 2,400 engineers on cloud-native architecture",
      gradient: "linear-gradient(135deg, #2e1064 0%, #4c1d95 45%, #312e81 100%)",
    },
    {
      id: "ss2",
      icon: "healthcare",
      label: "Healthcare",
      subtitle: "Microsoft",
      title:
        "Health system trained clinical IT on secure cloud compliance",
      gradient: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #1d4ed8 100%)",
    },
  ] satisfies SuccessStoryUiItem[],
};
