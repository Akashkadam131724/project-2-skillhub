import type { TrainingOptionUiItem } from "./types";

/** Hard-coded training options — used by {@link TrainingOptionsStatic}. */
export const TRAINING_OPTIONS_STATIC_DEMO = {
  title: "Flexible training options",
  subtitle: "Static demo via TrainingOptionsStatic — no API.",
  items: [
    {
      id: "t1",
      title: "Self-paced on demand",
      body: "<p>Labs, knowledge checks, and exam prep on your schedule.</p>",
    },
    {
      id: "t2",
      title: "Virtual instructor-led",
      body: "<p>Live sessions with certified trainers and real-time Q&amp;A.</p>",
    },
    {
      id: "t3",
      title: "Private cohorts",
      body: "<p>Custom curricula and schedules for teams of any size.</p>",
    },
    {
      id: "t4",
      title: "Blended paths",
      body: "<p>Mix on-demand modules with live workshops for deeper mastery.</p>",
    },
  ] satisfies TrainingOptionUiItem[],
};
