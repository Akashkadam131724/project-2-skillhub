#!/usr/bin/env node
/**
 * Run seed steps in manifest order.
 *
 *   npm run seed:pipeline
 *   npm run seed:pipeline -- --profile=core
 *   npm run seed:pipeline -- --only=entity-cms,content-pages
 *   npm run seed:pipeline -- --from=entity-cms
 *   npm run seed:pipeline -- --list
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SEED_STEPS,
  stepsForProfile,
  stepById,
  PROFILE_ALIASES,
} from "./manifest.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_ROOT = path.resolve(__dirname, "..");
const SERVER_ROOT = path.resolve(SEED_ROOT, "../..");

function parseArgs(argv) {
  const opts = {
    profile: "core",
    only: null,
    from: null,
    list: false,
    dryRun: false,
    safe: false,
  };
  for (const arg of argv) {
    if (arg === "--list" || arg === "-l") opts.list = true;
    if (arg === "--dry-run") opts.dryRun = true;
    if (arg === "--safe") opts.safe = true;
    if (arg.startsWith("--profile=")) {
      opts.profile = arg.slice("--profile=".length);
    }
    if (arg.startsWith("--only=")) {
      opts.only = arg
        .slice("--only=".length)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (arg.startsWith("--from=")) {
      opts.from = arg.slice("--from=".length).trim();
    }
  }
  return opts;
}

function resolveSteps(opts) {
  if (opts.only?.length) {
    const picked = [];
    for (const id of opts.only) {
      const step = stepById(id);
      if (!step) {
        console.error(`Unknown step id: ${id}`);
        process.exit(1);
      }
      picked.push(step);
    }
    return picked;
  }

  let steps = stepsForProfile(opts.profile);
  if (!steps.length) {
    const alias = PROFILE_ALIASES[opts.profile];
    if (alias) steps = stepsForProfile(alias);
  }
  if (!steps.length) {
    console.error(
      `Unknown profile "${opts.profile}". Try: core, showcase, full`
    );
    process.exit(1);
  }

  if (opts.from) {
    const idx = steps.findIndex((s) => s.id === opts.from);
    if (idx === -1) {
      console.error(`--from id not in profile: ${opts.from}`);
      process.exit(1);
    }
    steps = steps.slice(idx);
  }
  return steps;
}

function runStep(step, env) {
  const scriptPath = path.join(SEED_ROOT, step.script);
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ["--env-file=.env", scriptPath],
      {
        cwd: SERVER_ROOT,
        stdio: "inherit",
        env: { ...process.env, ...env },
      }
    );
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${step.id} exited with code ${code}`));
    });
  });
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.safe && opts.profile === "core") {
    opts.profile = "replenish";
  }

  const childEnv = {};
  if (opts.safe || opts.profile === "replenish") {
    childEnv.SEED_SAFE = "1";
  }

  if (opts.list) {
    console.log("Seed pipeline steps:\n");
    for (const step of SEED_STEPS) {
      const profiles = step.profiles.length ? step.profiles.join(", ") : "(manual)";
      console.log(`  ${step.id.padEnd(22)} [${profiles}]`);
      console.log(`    ${step.label}`);
      console.log(`    ${step.script}\n`);
    }
    return;
  }

  const steps = resolveSteps(opts);
  const modeLabel =
    childEnv.SEED_SAFE === "1" ? " (SEED_SAFE — no global wipes)" : "";
  console.log(
    `Running ${steps.length} seed step(s) (profile=${opts.profile})${modeLabel}…\n`
  );

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    console.log(
      `\n========== [${i + 1}/${steps.length}] ${step.id}: ${step.label} ==========\n`
    );
    if (opts.dryRun) {
      console.log(`  would run: node --env-file=.env ${step.script}`);
      continue;
    }
    await runStep(step, childEnv);
  }

  console.log("\nPipeline finished.\n");
}

main().catch((err) => {
  console.error("\nPipeline failed:", err.message || err);
  process.exit(1);
});
