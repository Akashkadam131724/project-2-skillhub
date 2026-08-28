import type { BentoGridUiItem } from "./types";

/** Hard-coded bento grid — used by {@link BentoGridStatic}. */
export const BENTO_GRID_STATIC_DEMO = {
  title: "Capability mosaic",
  subtitle: "Static demo via BentoGridStatic — no API.",
  items: [
    {
      id: "b1",
      imageUrl: "/images/placeholders/gallery-1.jpg",
      title: "Cloud",
      subtitle: "Platform skills",
      value: "24+",
    },
    {
      id: "b2",
      imageUrl: "/images/placeholders/gallery-2.jpg",
      title: "Security",
      subtitle: "Zero trust",
    },
    {
      id: "b3",
      imageUrl: "/images/placeholders/gallery-3.jpg",
      title: "Data",
      subtitle: "Analytics paths",
    },
    {
      id: "b4",
      imageUrl: "/images/placeholders/story.jpg",
      title: "AI",
      subtitle: "Emerging stack",
      value: "New",
    },
  ] satisfies BentoGridUiItem[],
};
