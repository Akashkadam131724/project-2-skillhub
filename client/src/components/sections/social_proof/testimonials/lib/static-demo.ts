import type { TestimonialUiItem } from "./types";

export const TESTIMONIALS_STATIC_DEMO = {
  title: "What learners say",
  subtitle: "Static demo via TestimonialsStatic.",
  items: [
    {
      id: "t1",
      quote: "<p>SkillHub made it easy to compare vendors and launch training fast.</p>",
      author: "L&D Director",
    },
    {
      id: "t2",
      quote: "<p>Our teams finally have one catalog we trust for certification paths.</p>",
      author: "Enablement Lead",
    },
  ] satisfies TestimonialUiItem[],
};
