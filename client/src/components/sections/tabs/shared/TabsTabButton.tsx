import type { TabUiItem, TabsLayout } from "./lib/types";

export default function TabsTabButton({
  item,
  index,
  active,
  onClick,
  layout,
}: {
  item: TabUiItem;
  index: number;
  active: boolean;
  onClick: () => void;
  layout: TabsLayout;
}) {
  const childCount = Array.isArray(item.children) ? item.children.length : 0;
  const label = item.value || String(index + 1).padStart(2, "0");
  const title = item.title || `Feature ${index + 1}`;
  const layoutClass =
    layout === "horizontal"
      ? "section-tab--horizontal"
      : layout === "underline"
        ? "section-tab--underline"
        : "section-tab--vertical";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`section-tab ${layoutClass}${active ? " is-active" : ""}`}
    >
      {layout !== "underline" ? (
        <span className="section-tab__eyebrow">{label}</span>
      ) : null}
      <span className="section-tab__title">{title}</span>
      {item.subtitle ? (
        <span className="section-tab__subtitle">{item.subtitle}</span>
      ) : null}
      {layout === "vertical" && childCount ? (
        <span className="section-tab__meta">
          {childCount} item{childCount === 1 ? "" : "s"}
        </span>
      ) : null}
    </button>
  );
}
