import { sortActiveButtons } from "@/lib/utils/button-types";
import type { TabChildUiItem } from "./types";

type TabPanelSource = {
  buttons?: unknown[];
  href?: string;
  label?: string;
};

export function tabPanelButtons(item?: TabPanelSource | null): unknown[] {
  const fromButtons = sortActiveButtons(
    Array.isArray(item?.buttons) ? item.buttons : []
  );
  if (fromButtons.length) return fromButtons;

  const href = String(item?.href || "").trim();
  if (!href) return [];

  return [
    {
      label: item?.label || "Explore",
      variant: "inverse",
      action_type: "url",
      target_url: href,
      status: true,
      sort_order: 0,
    },
  ];
}

export function tabChildPanelButtons(child?: TabChildUiItem | null): unknown[] {
  return tabPanelButtons({
    buttons: child?.buttons,
    href: child?.href,
    label: child?.label,
  });
}
