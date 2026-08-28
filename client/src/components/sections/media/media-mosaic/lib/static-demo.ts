import type { MediaMosaicTileUiItem } from "./types";

export const MEDIA_MOSAIC_STATIC_DEMO = {
  title: "Media mosaic",
  subtitle: "Static demo via MediaMosaicStatic.",
  items: [
    {
      id: "m1",
      title: "Instructor-led labs",
      subtitle: "Hands-on cohorts",
      featured: true,
    },
    {
      id: "m2",
      title: "Self-paced paths",
      subtitle: "Learn on your schedule",
    },
    {
      id: "m3",
      title: "Certification prep",
      subtitle: "Exam-ready practice",
    },
  ] satisfies MediaMosaicTileUiItem[],
};
