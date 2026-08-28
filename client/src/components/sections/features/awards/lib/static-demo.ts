import type { AwardUiItem } from "./types";

/** Hard-coded awards — used by {@link AwardsStatic}. */
export const AWARDS_STATIC_DEMO = {
  title: "Awards & recognition",
  subtitle: "Static demo via AwardsStatic — no API.",
  items: [
    {
      id: "a1",
      title: "Training Provider of the Year",
      body: "<p>Recognized for enterprise learning outcomes and instructor quality.</p>",
    },
    {
      id: "a2",
      title: "CMS Innovation",
      body: "<p>Live page editing without redeploys — built for marketing teams.</p>",
    },
    {
      id: "a3",
      title: "Partner Excellence",
      body: "<p>Top-tier vendor authorization across cloud and security curricula.</p>",
    },
  ] satisfies AwardUiItem[],
};
