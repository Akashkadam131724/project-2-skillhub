import { existsSync, readdirSync } from "fs";
import path from "path";
import { UPLOADS_ROOT } from "../../modules/uploads/upload.routes.js";

export const SECTION_PREVIEW_FOLDER = "section-previews";

export function sectionPreviewAbsPath(key) {
  const normalized = String(key || "").toLowerCase().trim();
  if (!normalized) return null;
  return path.join(UPLOADS_ROOT, SECTION_PREVIEW_FOLDER, `${normalized}.png`);
}

export function sectionPreviewUrlForKey(key) {
  const abs = sectionPreviewAbsPath(key);
  if (!abs || !existsSync(abs)) return null;
  const file = path.basename(abs);
  return `/uploads/${SECTION_PREVIEW_FOLDER}/${file}`;
}

/** Keys discovered from `uploads/section-previews/*.png` (basename without extension). */
export function listSectionPreviewFilesOnDisk() {
  const dir = path.join(UPLOADS_ROOT, SECTION_PREVIEW_FOLDER);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => /\.png$/i.test(name))
    .map((name) => name.replace(/\.png$/i, "").toLowerCase())
    .sort();
}
