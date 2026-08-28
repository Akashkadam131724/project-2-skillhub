/** @returns {"left"|"right"} */
export function normalizeFaqHeaderSide(data: unknown): "left" | "right" {
  const raw = String(
    (data as { header_side?: string; title_side?: string } | null | undefined)
      ?.header_side ||
      (data as { title_side?: string } | null | undefined)?.title_side ||
      "left"
  )
    .toLowerCase()
    .trim();
  return raw === "right" ? "right" : "left";
}
