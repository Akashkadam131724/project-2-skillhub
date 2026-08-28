import type { WhyChooseUiItem } from "./types";

/** Hard-coded why choose — used by {@link WhyChooseStatic}. */
export const WHY_CHOOSE_STATIC_DEMO = {
  eyebrow: "Why SkillHub",
  title: "Built for training teams that move fast",
  subtitle: "Static demo via WhyChooseStatic — no API.",
  items: [
    {
      id: "w1",
      title: "Authorized curricula",
      body: "<p>Official vendor paths from Microsoft, AWS, Google Cloud, and more.</p>",
    },
    {
      id: "w2",
      title: "Live page editing",
      body: "<p>Update marketing pages on the live URL without waiting for a deploy.</p>",
    },
    {
      id: "w3",
      title: "Reusable sections",
      body: "<p>Drop layouts from the section library onto any page template.</p>",
    },
  ] satisfies WhyChooseUiItem[],
};
