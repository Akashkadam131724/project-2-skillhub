#!/usr/bin/env node
/**
 * Write scripts from scripts/package-scripts.mjs into package.json.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPackageScripts } from "./package-scripts.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.join(__dirname, "..", "package.json");

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const scripts = buildPackageScripts({ includeStepAliases: true });

pkg.scripts = Object.fromEntries(
  Object.entries(scripts).sort(([a], [b]) => a.localeCompare(b))
);

writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
console.log(`Updated ${pkgPath} with ${Object.keys(scripts).length} script(s).`);
