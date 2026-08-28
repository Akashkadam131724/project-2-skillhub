import type { CastProfileUiItem } from "./types";

/** Hard-coded cast profiles — used by {@link CastProfilesStatic}. */
export const CAST_PROFILES_STATIC_DEMO = {
  title: "Featured practitioners",
  subtitle: "Static demo via CastProfilesStatic — no API.",
  items: [
    {
      id: "cp1",
      imageUrl: "/images/placeholders/team.jpg",
      value: "Lead",
      title: "Morgan Chen",
      subtitle: "Cloud architect",
      body: "<p>Enterprise migration specialist with 12 years in platform engineering.</p>",
    },
    {
      id: "cp2",
      imageUrl: "/images/placeholders/story.jpg",
      title: "Sam Ortiz",
      subtitle: "Security lead",
      body: "<p>Zero-trust advocate and incident response lead.</p>",
    },
    {
      id: "cp3",
      imageUrl: "/images/placeholders/gallery-2.jpg",
      title: "Elena Park",
      subtitle: "Data strategist",
    },
  ] satisfies CastProfileUiItem[],
};
