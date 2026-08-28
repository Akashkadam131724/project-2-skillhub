import type { PromoModalConfig, PromoModalData } from "./types";

export function resolvePromoModalConfig(
  data: PromoModalData = {}
): PromoModalConfig {
  return {
    delayMs: Math.max(0, Number(data.open_delay_ms) || 2500),
    storageKey: String(data.storage_key || "skillhub_promo_modal").trim(),
    body: data.body || "",
  };
}
