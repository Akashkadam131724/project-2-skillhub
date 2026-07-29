/**
 * Safe seeding: no global wipes of Section / Page / catalog / EntityPageSection.
 *
 * Set via pipeline:  npm run seed:replenish
 * Or manually:      SEED_SAFE=1 npm run seed:entity-cms
 */
export function seedSafeMode() {
  const v = String(process.env.SEED_SAFE || process.env.SEED_NO_WIPE || "")
    .trim()
    .toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function logSafeMode(context) {
  if (seedSafeMode()) {
    console.log(`[seed:safe] ${context}`);
  }
}
