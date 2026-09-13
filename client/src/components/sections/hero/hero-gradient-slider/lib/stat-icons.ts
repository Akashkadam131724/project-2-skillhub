import {
  BUTTON_ICON_GROUPS,
  BUTTON_ICON_LABELS,
} from "@/lib/ui/button-icon-catalog";

/** Shared SkillHub icon keys — store the key on the stat, render from the catalog. */
export const HERO_GRADIENT_SLIDER_STAT_ICON_OPTIONS = [
  { value: "", label: "No icon" },
  ...BUTTON_ICON_GROUPS.filter((group) => group.id !== "system").flatMap(
    (group) =>
      group.icons.map((id) => ({
        value: id,
        label: BUTTON_ICON_LABELS[id as keyof typeof BUTTON_ICON_LABELS] || id,
      }))
  ),
];
