/**
 * Scan server/uploads and write uploads-manifest.json with folder + file paths.
 *
 * Usage (from server/):
 *   node scripts/generate-uploads-manifest.mjs
 *   node scripts/generate-uploads-manifest.mjs --include-system
 */
import { existsSync, readdirSync, statSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_ROOT = path.join(__dirname, "../uploads");
const OUT_FILE = path.join(UPLOADS_ROOT, "uploads-manifest.json");

const SYSTEM_FOLDERS = new Set(["cms-showcase", "section-previews"]);

const FOLDER_HINTS = {
  "Buisness ai vectors, photos and PSD files _ Free download": {
    id: "business-ai",
    label: "Business AI",
    pagePath: "/solutions/business-ai",
    pageTitle: "Business AI Solutions",
  },
  "Buisness architure and design vectors, photos and PSD files _ Free download": {
    id: "business-architecture-design",
    label: "Business Architecture & Design",
    pagePath: "/solutions/architecture-design",
    pageTitle: "Architecture & Design",
  },
  "Buisness cloud vectors, photos and PSD files _ Free download": {
    id: "business-cloud",
    label: "Business Cloud",
    pagePath: "/solutions/cloud",
    pageTitle: "Cloud Solutions",
  },
  "Buisness health vectors, photos and PSD files _ Free download": {
    id: "business-health",
    label: "Business Health",
    pagePath: "/solutions/health",
    pageTitle: "Health & Wellness",
  },
  "Buisness leadership vectors, photos and PSD files _ Free download": {
    id: "business-leadership",
    label: "Business Leadership",
    pagePath: "/solutions/leadership",
    pageTitle: "Leadership Programs",
  },
  "Buisness networkig vectors, photos and PSD files _ Free download": {
    id: "business-networking",
    label: "Business Networking",
    pagePath: "/solutions/networking",
    pageTitle: "Networking & Collaboration",
  },
  "Buisness security vectors, photos and PSD files _ Free download": {
    id: "business-security",
    label: "Business Security",
    pagePath: "/solutions/security",
    pageTitle: "Security Solutions",
  },
  "Buisness tech vectors, photos and PSD files _ Free download": {
    id: "business-tech",
    label: "Business Technology",
    pagePath: "/solutions/technology",
    pageTitle: "Technology Solutions",
  },
  "Buisness web vectors, photos and PSD files _ Free download": {
    id: "business-web",
    label: "Business Web",
    pagePath: "/solutions/web",
    pageTitle: "Web & Digital",
  },
  "Business Stock Photos, Images and Backgrounds for Free Download": {
    id: "business-stock",
    label: "Business Stock Photos",
    pagePath: "/resources/business-stock",
    pageTitle: "Business Stock Library",
  },
  PNGs: {
    id: "business-pngs",
    label: "Business PNG Assets",
    pagePath: "/resources/business-pngs",
    pageTitle: "Business PNG Assets",
  },
  "PNGs/Business Ai PNGs for Free Download": {
    id: "business-ai-pngs",
    label: "Business AI PNGs",
    pagePath: "/resources/business-ai-pngs",
    pageTitle: "Business AI PNG Assets",
  },
  "PNGs/Business PNGs for Free Download": {
    id: "business-general-pngs",
    label: "Business PNGs",
    pagePath: "/resources/business-pngs-general",
    pageTitle: "General Business PNGs",
  },
};

const IMAGE_EXT = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "svg",
  "avif",
]);

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function publicUrl(relativePosix) {
  const segments = relativePosix.split("/").filter(Boolean);
  return `/uploads/${segments.map((s) => encodeURIComponent(s)).join("/")}`;
}

function mediaType(ext) {
  const e = ext.toLowerCase();
  if (e === "svg") return "image/svg+xml";
  if (e === "jpg" || e === "jpeg") return "image/jpeg";
  if (e === "png") return "image/png";
  if (e === "webp") return "image/webp";
  if (e === "gif") return "image/gif";
  if (e === "avif") return "image/avif";
  return "application/octet-stream";
}

function assetKind(ext) {
  const e = ext.toLowerCase();
  if (e === "svg") return "vector";
  if (["jpg", "jpeg", "webp", "avif"].includes(e)) return "photo";
  if (e === "png") return "png";
  return "other";
}

function walkFiles(dirAbs, relativeDir = "") {
  const entries = readdirSync(dirAbs, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const rel = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
    const abs = path.join(dirAbs, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(abs, rel));
      continue;
    }
    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name).replace(/^\./, "").toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;

    files.push({
      name: entry.name,
      relativePath: rel.replace(/\\/g, "/"),
      url: publicUrl(rel),
      ext,
      mediaType: mediaType(ext),
      kind: assetKind(ext),
      bytes: statSync(abs).size,
    });
  }

  files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  return files;
}

function countByExt(files) {
  const counts = { total: files.length };
  for (const f of files) {
    counts[f.ext] = (counts[f.ext] || 0) + 1;
  }
  return counts;
}

function folderMeta(relativeDir, files) {
  const hint = FOLDER_HINTS[relativeDir] || {};
  const baseName = path.basename(relativeDir);
  const id = hint.id || slugify(baseName);
  const label =
    hint.label ||
    baseName.replace(/\s+vectors.*$/i, "").replace(/_/g, " ").trim();

  return {
    id,
    label,
    folderName: baseName,
    relativeDir,
    publicDir: publicUrl(relativeDir),
    suggestedPage: {
      pageKey: "content",
      title: hint.pageTitle || label,
      path: hint.pagePath || `/resources/${id}`,
    },
    counts: countByExt(files),
    files,
  };
}

function collectAssetFolders(includeSystem) {
  const folders = [];

  function scan(relativeDir = "") {
    const abs = relativeDir
      ? path.join(UPLOADS_ROOT, relativeDir)
      : UPLOADS_ROOT;
    if (!existsSync(abs)) return;

    const entries = readdirSync(abs, { withFileTypes: true });
    const subdirs = entries.filter((e) => e.isDirectory() && !e.name.startsWith("."));

    if (relativeDir) {
      const top = relativeDir.split("/")[0];
      const isSystem = SYSTEM_FOLDERS.has(top) || SYSTEM_FOLDERS.has(relativeDir);
      if (!includeSystem && isSystem) return;

      const files = walkFiles(abs, relativeDir);
      if (files.length > 0) {
        folders.push(folderMeta(relativeDir, files));
      }
      return;
    }

    for (const entry of subdirs) {
      if (entry.name === "PNGs") {
        scan("PNGs");
        for (const sub of readdirSync(path.join(UPLOADS_ROOT, "PNGs"), {
          withFileTypes: true,
        })) {
          if (sub.isDirectory() && !sub.name.startsWith(".")) {
            scan(`PNGs/${sub.name}`);
          }
        }
        continue;
      }
      scan(entry.name);
    }
  }

  scan("");
  folders.sort((a, b) => a.label.localeCompare(b.label));
  return folders;
}

function main() {
  const includeSystem = process.argv.includes("--include-system");
  const pageAssetFolders = collectAssetFolders(includeSystem);

  const systemFolders = [];
  for (const name of SYSTEM_FOLDERS) {
    const abs = path.join(UPLOADS_ROOT, name);
    if (!existsSync(abs)) continue;
    const files = walkFiles(abs, name);
    systemFolders.push({
      id: slugify(name),
      label: name,
      relativeDir: name,
      publicDir: publicUrl(name),
      counts: countByExt(files),
      files,
    });
  }

  const totalFiles =
    pageAssetFolders.reduce((n, f) => n + f.files.length, 0) +
    systemFolders.reduce((n, f) => n + f.files.length, 0);

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    description:
      "Upload folder catalog for CMS page creation. Use `url` values in section images / items.",
    basePath: "/uploads",
    uploadsRoot: "server/uploads",
    stats: {
      pageAssetFolders: pageAssetFolders.length,
      systemFolders: systemFolders.length,
      files: totalFiles,
    },
    pageAssetFolders,
    systemFolders,
  };

  writeFileSync(OUT_FILE, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Wrote ${OUT_FILE}`);
  console.log(
    `  ${manifest.stats.pageAssetFolders} page asset folders, ${manifest.stats.files} files`
  );
}

main();
