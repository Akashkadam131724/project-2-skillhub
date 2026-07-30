#!/usr/bin/env node
/**
 * Run a single seed step by manifest id.
 *
 *   npm run seed:step -- vendors
 *   npm run seed:step -- entity-cms
 *   node scripts/run-seed.mjs content-pages-from-manifest
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stepById, SEED_STEPS } from "../src/seed/pipeline/manifest.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(__dirname, "..");
const SEED_ROOT = path.join(SERVER_ROOT, "src/seed");

function normalizeId(raw) {
  const id = String(raw || "").trim();
  if (!id) return "";
  return id.startsWith("seed:") ? id.slice("seed:".length) : id;
}

function printUsage() {
  console.log(`Usage: npm run seed:step -- <step-id>

Examples:
  npm run seed:step -- vendors
  npm run seed:step -- content-pages-from-manifest

All step ids (npm run seed:list):
`);
  for (const step of SEED_STEPS) {
    console.log(`  ${step.id}`);
  }
}

const stepId = normalizeId(process.argv[2]);

if (!stepId || stepId === "--help" || stepId === "-h") {
  printUsage();
  process.exit(stepId ? 0 : 1);
}

const step = stepById(stepId);
if (!step) {
  console.error(`Unknown seed step: ${stepId}\n`);
  printUsage();
  process.exit(1);
}

const scriptPath = path.join(SEED_ROOT, step.script);
const child = spawn(process.execPath, ["--env-file=.env", scriptPath], {
  cwd: SERVER_ROOT,
  stdio: "inherit",
  env: process.env,
});

child.on("close", (code) => process.exit(code ?? 1));
