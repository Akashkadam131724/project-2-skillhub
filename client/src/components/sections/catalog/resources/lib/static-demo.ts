import type { ResourcesUiItem } from "./types";

export const RESOURCES_STATIC_DEMO = {
  title: "Learning resources",
  subtitle: "Static demo via ResourcesStatic — no API.",
  items: [
    {
      id: "r1",
      title: "Course syllabus (PDF)",
      body: "<p>Week-by-week outline and lab objectives.</p>",
      href: "#",
    },
    {
      id: "r2",
      title: "Practice exam guide",
      body: "<p>How to schedule and prepare for certification.</p>",
      href: "#",
    },
    {
      id: "r3",
      title: "Lab environment setup",
      body: "<p>Access instructions for hands-on exercises.</p>",
    },
  ] satisfies ResourcesUiItem[],
};
