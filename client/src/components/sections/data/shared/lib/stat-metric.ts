import {
  itemStatLabel,
  itemStatValue,
} from "@/lib/sections/item-types";

/** Shared showability for stats / metric_rail items (value + label). */
export function isStatMetricShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  return Boolean(
    String(itemStatValue(item) || "").trim() &&
      String(itemStatLabel(item) || "").trim()
  );
}
