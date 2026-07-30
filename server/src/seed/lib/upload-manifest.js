import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.join(__dirname, "../../../uploads/uploads-manifest.json");

const PHOTO_EXT = new Set(["jpg", "jpeg", "png", "webp"]);
const RASTER_EXT = new Set(["jpg", "jpeg", "png", "webp", "avif"]);

export function loadUploadsManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    throw new Error(
      `Missing ${MANIFEST_PATH}. Run: npm run uploads:manifest`
    );
  }
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
}

export function findAssetFolder(manifest, folderId) {
  const folders = [
    ...(manifest.pageAssetFolders || []),
    ...(manifest.systemFolders || []),
  ];
  return folders.find((f) => f.id === folderId) || null;
}

export function listFolderFiles(folder, { kinds = ["photo", "raster"], limit } = {}) {
  if (!folder?.files?.length) return [];
  const extOk = (ext) => {
    const e = String(ext || "").toLowerCase();
    if (kinds.includes("photo") && PHOTO_EXT.has(e)) return true;
    if (kinds.includes("raster") && RASTER_EXT.has(e)) return true;
    if (kinds.includes("svg") && e === "svg") return true;
    return false;
  };
  const files = folder.files.filter((f) => extOk(f.ext));
  return limit ? files.slice(0, limit) : files;
}

/** Pick image URLs from a manifest folder (prefers JPG/PNG). */
export function pickFolderImages(folderId, manifest, count = 1, offset = 0) {
  const folder = findAssetFolder(manifest, folderId);
  if (!folder) return [];
  const files = listFolderFiles(folder, { kinds: ["photo", "raster"] });
  return files.slice(offset, offset + count).map((f) => f.url);
}

export function pickFolderImage(folderId, manifest, offset = 0) {
  return pickFolderImages(folderId, manifest, 1, offset)[0] || "";
}

/** PNG asset libraries under uploads/PNGs (transparent illustrations). */
export const PNG_FOLDER_IDS = ["business-ai-pngs", "business-pngs", "business-general-pngs"];

/** Find first PNG URL in manifest folders whose filename contains `pattern`. */
export function findPngByPattern(folderIds, manifest, pattern) {
  const ids = Array.isArray(folderIds) ? folderIds : [folderIds];
  const needle = String(pattern || "").toLowerCase();
  if (!needle) return "";

  for (const folderId of ids) {
    const folder = findAssetFolder(manifest, folderId);
    const hit = listFolderFiles(folder, { kinds: ["raster"] }).find((f) =>
      f.name.toLowerCase().includes(needle)
    );
    if (hit?.url) return hit.url;
  }
  return "";
}

/** Resolve many PNG URLs from filename patterns (falls back to offset picks). */
export function pickPngsByPatterns(patterns, manifest, fallbackFolderId = "business-ai-pngs") {
  const urls = patterns.map((p) => findPngByPattern(PNG_FOLDER_IDS, manifest, p)).filter(Boolean);
  if (urls.length >= patterns.length) return urls;
  const fallback = pickFolderImages(fallbackFolderId, manifest, patterns.length, 0);
  return patterns.map((p, i) => findPngByPattern(PNG_FOLDER_IDS, manifest, p) || fallback[i] || "");
}

/** Solution pages only — excludes /resources/* asset libraries. */
export function solutionFolders(manifest) {
  return (manifest.pageAssetFolders || []).filter(
    (f) =>
      f.suggestedPage?.path &&
      f.id !== "cms-showcase" &&
      f.suggestedPage.path.startsWith("/solutions/") &&
      f.suggestedPage.path !== "/solutions"
  );
}
