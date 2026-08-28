import type { CustomerTestimonialUiItem } from "./types";

export const CUSTOMER_TESTIMONIALS_STATIC_DEMO = {
  title: "Customer stories",
  subtitle: "How global teams consolidated vendors and launched faster.",
  items: [
    {
      id: "ct1",
      quote:
        "<p>SkillHub helped us consolidate vendors and launch role-based learning paths in record time.</p>",
      author: "Director of L&D",
      rating: 5,
    },
  ] satisfies CustomerTestimonialUiItem[],
};
