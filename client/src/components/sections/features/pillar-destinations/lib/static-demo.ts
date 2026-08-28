import type { PillarDestinationsUiItem } from "./types";

/** Hard-coded pillar destinations — used by {@link PillarDestinationsStatic}. */
export const PILLAR_DESTINATIONS_STATIC_DEMO = {
  section_title: "Explore destinations",
  sub_title: "Static demo via PillarDestinationsStatic — no API.",
  items: [
    {
      id: "pd1",
      title: "Cloud foundations",
      subtitle: "Core infrastructure skills",
      body: "<p>Start with architecture, networking, and security basics.</p>",
      href: "#cloud",
    },
    {
      id: "pd2",
      title: "Data & analytics",
      subtitle: "From pipelines to insights",
      body: "<p>Modern data platforms and visualization workflows.</p>",
      href: "#data",
    },
    {
      id: "pd3",
      title: "Security operations",
      subtitle: "Defensive and offensive tracks",
      body: "<p>Threat detection, response, and compliance programs.</p>",
      href: "#security",
    },
  ] satisfies PillarDestinationsUiItem[],
};
