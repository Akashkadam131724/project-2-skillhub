import type { FaqUiItem } from "../../shared/lib/types";

/** Hard-coded single-column FAQ — used by {@link FaqStatic}. */
export const FAQ_STATIC_DEMO = {
  title: "Static FAQ",
  subtitle: "Hard-coded props via FaqStatic — no API, no CMS adapter.",
  items: [
    {
      id: "s1",
      question: "What is FaqUi?",
      answer:
        "<p>A pure layout component. Pass <code>title</code>, <code>subtitle</code>, and <code>items</code> — no CMS imports.</p>",
    },
    {
      id: "s2",
      question: "When should I use FaqStatic?",
      answer:
        "<p>Demos, section library previews, and Storybook — anywhere you want the layout without fetching CMS data.</p>",
    },
    {
      id: "s3",
      question: "Public vs CMS vs Static?",
      answer:
        "<p><strong>Static</strong> = demo data. <strong>Public</strong> = resolved API → Ui. <strong>Cms</strong> = live-edit chrome → Ui.</p>",
    },
  ] satisfies FaqUiItem[],
};
