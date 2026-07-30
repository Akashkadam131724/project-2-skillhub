import {
  findAssetFolder,
  listFolderFiles,
  loadUploadsManifest,
  pickFolderImage,
  pickFolderImages,
} from "./upload-manifest.js";

const FOLDER_POOL = [
  "business-ai",
  "business-cloud",
  "business-security",
  "business-networking",
  "business-architecture-design",
  "business-leadership",
  "business-tech",
  "business-web",
  "business-health",
  "business-stock",
];

let _manifest = null;
let _globalPool = null;

function manifest() {
  if (!_manifest) _manifest = loadUploadsManifest();
  return _manifest;
}

function hashKey(key) {
  return [...String(key || "x")].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
}

function buildGlobalPool() {
  const m = manifest();
  const urls = [];
  for (const folderId of FOLDER_POOL) {
    const folder = findAssetFolder(m, folderId);
    if (!folder) continue;
    for (const file of listFolderFiles(folder, { kinds: ["photo", "raster"] })) {
      urls.push(file.url);
    }
  }
  return urls;
}

function globalPool() {
  if (!_globalPool) _globalPool = buildGlobalPool();
  return _globalPool;
}

export function pickUploadImage(seedKey, slot = 0) {
  const pool = globalPool();
  if (!pool.length) return "";
  return pool[(hashKey(seedKey) + slot) % pool.length];
}

export function folderForVendor(vendor) {
  const text = `${vendor?.name || ""} ${vendor?.slug || ""}`.toLowerCase();
  if (/(aws|amazon|azure|microsoft|google|cloud|oracle|ibm|vmware|citrix)/.test(text)) {
    return "business-cloud";
  }
  if (/(cisco|security|fortinet|check point|isc2|comptia|ec-council|mcafee)/.test(text)) {
    return "business-security";
  }
  if (/(network|juniper|f5|brocade|cwnp)/.test(text)) {
    return "business-networking";
  }
  if (/(pmi|leadership|business|netcom|itil|hrci)/.test(text)) {
    return "business-leadership";
  }
  if (/(design|architecture|adobe)/.test(text)) {
    return "business-architecture-design";
  }
  if (/(ai|data|analytics)/.test(text)) {
    return "business-ai";
  }
  return "business-tech";
}

export function folderForProduct(product, vendor = null) {
  const text = `${product?.name || ""} ${product?.category || ""} ${vendor?.name || ""}`.toLowerCase();
  if (/security|zero.?trust|identity/.test(text)) return "business-security";
  if (/cloud|azure|aws|gcp|platform/.test(text)) return "business-cloud";
  if (/data|ai|analytics|ml/.test(text)) return "business-ai";
  if (/network|routing|firewall/.test(text)) return "business-networking";
  if (/leadership|business|management/.test(text)) return "business-leadership";
  return folderForVendor(vendor || { name: text, slug: product?.slug });
}

export function pickVendorImages(vendor, count = 4) {
  const m = manifest();
  const folderId = folderForVendor(vendor);
  const offset = hashKey(vendor?.slug || vendor?.name) % 12;
  const imgs = pickFolderImages(folderId, m, count, offset);
  if (imgs.length >= count) return imgs;
  const fallback = pickUploadImage(vendor?.slug, 0);
  while (imgs.length < count) imgs.push(fallback);
  return imgs;
}

export function pickProductImages(product, vendor = null, count = 3) {
  const m = manifest();
  const folderId = folderForProduct(product, vendor);
  const offset = hashKey(product?.slug || product?.name) % 10;
  const imgs = pickFolderImages(folderId, m, count, offset);
  if (imgs.length >= count) return imgs;
  return pickVendorImages(vendor || { slug: product?.slug }, count);
}

export function pickCourseImages(course, product = null, vendor = null, count = 2) {
  const key = course?.slug || course?.name;
  const offset = hashKey(key) % 8;
  const m = manifest();
  const folderId = folderForProduct(product || {}, vendor);
  const imgs = pickFolderImages(folderId, m, count, offset + 2);
  if (imgs.length >= count) return imgs;
  return pickProductImages(product || {}, vendor, count);
}

export function pickHomeExploreImage(tabKey) {
  const map = {
    vendors: "business-tech",
    products: "business-cloud",
    courses: "business-ai",
    blogs: "business-leadership",
  };
  const m = manifest();
  return (
    pickFolderImage(map[tabKey] || "business-stock", m, hashKey(tabKey) % 6) ||
    pickUploadImage(tabKey)
  );
}
