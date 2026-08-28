import type { TextMediaUiItem } from "./types";

export const TEXT_MEDIA_STATIC_DEMO = {
  title: "Learning paths",
  subtitle: "Static demo via TextMediaStatic — no API.",
  items: [
    {
      id: "tm1",
      title: "Foundations",
      body: "<p>Core concepts and vocabulary for your team.</p>",
      imageUrl: "",
      mediaPosition: "end" as const,
    },
    {
      id: "tm2",
      title: "Hands-on labs",
      body: "<p>Practice in environments that mirror production.</p>",
      imageUrl: "",
      mediaPosition: "start" as const,
    },
  ] satisfies TextMediaUiItem[],
};
