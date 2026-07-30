/**
 * Seed all static header showcase pages (project demo routes).
 *
 *   npm run seed:step -- static-showcase-pages
 *
 * Also seeds /components, /insights, /showcase via sibling steps when run in full pipeline.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PROJECT_NAV_SHOWCASE_SEED_STEPS } from "../../lib/project-nav-links.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, "../../../..");

function runStep(stepId) {
  console.log(`\n========== static-showcase → ${stepId} ==========\n`);
  const result = spawnSync("npm", ["run", "seed:step", "--", stepId], {
    cwd: serverRoot,
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) {
    throw new Error(`${stepId} exited with code ${result.status ?? 1}`);
  }
}

console.log(
  `Seeding ${PROJECT_NAV_SHOWCASE_SEED_STEPS.length} static showcase page step(s)…`
);

for (const stepId of PROJECT_NAV_SHOWCASE_SEED_STEPS) {
  runStep(stepId);
}

console.log("\nDone. Static showcase pages:");
for (const stepId of PROJECT_NAV_SHOWCASE_SEED_STEPS) {
  console.log(`  ✓ ${stepId}`);
}
console.log("\nAlso available after full seed: /components, /insights, /showcase");
