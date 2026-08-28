import type { FaqUiItem } from "../../shared/lib/types";

/** Hard-coded two-column FAQ — used by {@link FaqTwoColumnStatic}. */
export const FAQ_TWO_COLUMN_STATIC_DEMO = {
  title: "Static FAQ — two column",
  subtitle: "Title sticky on one side; accordion list on the other.",
  headerSide: "left" as const,
  items: [
    {
      id: "t1",
      question: "Why split the layout?",
      answer:
        "<p>Long FAQ lists stay scannable while the title and CTAs stay visible on desktop.</p>",
    },
    {
      id: "t2",
      question: "Can the title sit on the right?",
      answer:
        "<p>Yes — set <code>headerSide</code> to <code>right</code> (CMS uses the Title column control).</p>",
    },
    {
      id: "t3",
      question: "Same items as single-column FAQ?",
      answer:
        "<p>Yes — both variants share <code>FaqUiItem</code> and <code>FaqItemCard</code>.</p>",
    },
  ] satisfies FaqUiItem[],
};
