export function normalizeFormContentSide(
  data?: { content_side?: string } | null
): "left" | "right" {
  const raw = String(data?.content_side || "left").toLowerCase();
  return raw === "right" ? "right" : "left";
}
