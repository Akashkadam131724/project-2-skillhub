/**
 * Single source of truth for npm scripts. Merged into package.json via sync.
 *
 *   node scripts/sync-package-scripts.mjs
 */
import { SEED_STEPS } from "../src/seed/pipeline/manifest.js";

const RUN_SEED = "node --env-file=.env scripts/run-seed.mjs";

/** Core app + pipeline — always present in package.json */
export const coreScripts = {
  test: 'echo "Error: no test specified" && exit 1',
  dev: "node --watch --env-file=.env index.js",

  seed: `${RUN_SEED} vendors`,
  "seed:step": RUN_SEED,
  "seed:pipeline": "node --env-file=.env src/seed/pipeline/run.js",
  "seed:list": "npm run seed:pipeline -- --list",
  "seed:all": "npm run seed:pipeline -- --profile=core",
  "seed:full": "npm run seed:pipeline -- --profile=full",
  "seed:replenish": "npm run seed:pipeline -- --profile=replenish",
  "seed:feed":
    "npm run seed:pipeline -- --only=content-pages-from-manifest,entity-skilling-industry-cms",

  "uploads:manifest": "node scripts/generate-uploads-manifest.mjs",
  "netcom:categories": "node scripts/fetch-netcom-categories.mjs",
  "seed:image-urls": "node scripts/extract-seed-image-urls.mjs",
  "seed:1m":
    "TOTAL=1000000 BATCH_SIZE=5000 node --env-file=.env --max-old-space-size=4096 src/seed/steps/01-catalog/vendor.seed.js",

  "migrate:remove-product-sku-price-stock":
    "node --env-file=.env src/migrations/2026-07-12-remove-product-sku-price-stock.js",

  "scripts:sync": "node scripts/sync-package-scripts.mjs",
};

/** Per-step aliases: npm run seed:vendors → run-seed.mjs vendors */
export function seedStepScripts() {
  const scripts = {};
  for (const step of SEED_STEPS) {
    scripts[`seed:${step.id}`] = `${RUN_SEED} ${step.id}`;
  }
  return scripts;
}

export function buildPackageScripts({ includeStepAliases = false } = {}) {
  return {
    ...coreScripts,
    ...(includeStepAliases ? seedStepScripts() : {}),
  };
}
