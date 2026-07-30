/**
 * Map NetCom CMS header URLs to SkillHub routes (entities + content).
 */

import { normalizeContentPath } from "../../modules/content/content.model.js";

export function normalizeNetcomPath(url) {
  return normalizeContentPath(String(url || "").split("?")[0]);
}

/** @type {Record<string, string>} */
export const NETCOM_PATH_ALIASES = {
  "/our-vendors": "/vendors",
  "/skilling": "/skilling-areas",
  "/industry": "/industries",
};

/** @type {Record<string, string>} */
export const NETCOM_VENDOR_SLUG_MAP = {
  "/vendor/microsoft-training": "/vendor/microsoft",
  "/vendor/aws-training": "/vendor/aws",
  "/vendor/google-cloud-training": "/vendor/google-cloud",
  "/vendor/cisco-training": "/vendor/cisco",
  "/vendor/comptia-training": "/vendor/comptia",
  "/vendor/autodesk-training": "/vendor/adobe",
  "/vendor/pmi-training": "/vendor/servicenow",
  "/vendor/ec-council-training": "/vendor/fortinet",
  "/vendor/isc2-training": "/vendor/check-point",
  "/vendor/itil-training": "/vendor/ibm",
  "/vendor/ai-certs-training": "/vendor/google-cloud",
};

/** @type {Record<string, string>} */
export const NETCOM_INDUSTRY_SLUG_MAP = {
  "/industry/technology": "/industry/information-technology",
  "/industry/financial": "/industry/finance-and-banking",
  "/industry/healthcare": "/industry/healthcare",
  "/industry/federal-government": "/industry/government",
  "/industry/retail": "/industry/retail-and-ecommerce",
  "/industry/manufacturing": "/industry/manufacturing",
};

export function mapNetcomNavUrl(url) {
  const base = normalizeNetcomPath(url);
  if (NETCOM_PATH_ALIASES[base]) return NETCOM_PATH_ALIASES[base];
  if (NETCOM_VENDOR_SLUG_MAP[base]) return NETCOM_VENDOR_SLUG_MAP[base];
  if (NETCOM_INDUSTRY_SLUG_MAP[base]) return NETCOM_INDUSTRY_SLUG_MAP[base];
  return base;
}

/** Paths that should exist as Content pages (not entity-only). */
export function isNetcomContentPagePath(path) {
  const p = normalizeNetcomPath(path);
  if (!p || p === "/") return false;
  if (NETCOM_PATH_ALIASES[p]) return false;
  if (/^\/vendor\//.test(p)) return false;
  if (/^\/product\//.test(p)) return false;
  if (/^\/course\//.test(p)) return false;
  if (NETCOM_INDUSTRY_SLUG_MAP[p]) return false;
  if (/^\/industry\/[^/]+$/.test(p) && p !== "/industry/slg") {
    const slug = p.slice("/industry/".length);
    const mapped = Object.entries(NETCOM_INDUSTRY_SLUG_MAP).find(([, v]) => v === p);
    if (mapped) return false;
    if (
      [
        "healthcare",
        "manufacturing",
        "government",
        "information-technology",
        "finance-and-banking",
        "retail-and-ecommerce",
      ].includes(slug)
    ) {
      return false;
    }
  }
  return true;
}

export function slugFromPath(path) {
  return String(path || "")
    .replace(/^\//, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 80);
}
