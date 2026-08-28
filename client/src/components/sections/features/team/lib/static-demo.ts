import type { TeamUiItem } from "./types";

/** Hard-coded team — used by {@link TeamStatic}. */
export const TEAM_STATIC_DEMO = {
  section_title: "Meet the team",
  sub_title: "Static demo via TeamStatic — no API.",
  items: [
    {
      id: "t1",
      name: "Alex Rivera",
      role: "Head of Learning",
      body: "<p>Designs enterprise curricula and instructor programs.</p>",
    },
    {
      id: "t2",
      name: "Jordan Lee",
      role: "Solutions Architect",
      body: "<p>Leads cloud migration workshops and hands-on labs.</p>",
    },
    {
      id: "t3",
      name: "Sam Patel",
      role: "Customer Success",
      body: "<p>Partners with teams to measure training outcomes.</p>",
    },
  ] satisfies TeamUiItem[],
};
