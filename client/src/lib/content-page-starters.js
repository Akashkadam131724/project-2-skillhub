/** Quick layouts when creating a new content page. */
export const CONTENT_PAGE_STARTERS = [
  {
    key: "blank",
    label: "Blank",
    description: "Start empty — add sections manually.",
    sections: [],
  },
  {
    key: "marketing",
    label: "Marketing",
    description: "Hero, spotlight, and CTA.",
    sections: [
      "in_page_nav",
      "hero_centered",
      "feature_spotlight",
      "cta_band",
    ],
  },
  {
    key: "about",
    label: "About",
    description: "Intro, text rows, team.",
    sections: ["hero_centered", "text_media", "team", "cta_band"],
  },
  {
    key: "showcase",
    label: "Showcase",
    description: "Nav, hero, gallery.",
    sections: [
      "in_page_nav",
      "hero_centered",
      "horizon_gallery",
      "cta_band",
    ],
  },
];

export function starterSectionKeys(starterKey) {
  const starter = CONTENT_PAGE_STARTERS.find((s) => s.key === starterKey);
  return starter?.sections ? [...starter.sections] : [];
}
