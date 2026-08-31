import { CONTENT_DIRECTORY_BY_PATH } from "./content-pages";

/** Global catalog hub — content only for now. */
export const CATALOG_HUB_ITEMS = [
  {
    id: "content",
    name: "Content pages",
    description:
      "Every CMS marketing route — solutions, showcases, insights, components, and more. Open any page in a fullscreen gallery.",
    href: "/catalog/content",
    countLabel: "pages",
    active: true,
  },
];

const EXCLUDED_GALLERY_PATHS = new Set([
  "/",
  ...Object.keys(CONTENT_DIRECTORY_BY_PATH),
]);

export function isGalleryContentPage(content: {
  status?: string;
  path?: string;
} | null | undefined) {
  if (!content || content.status === "inactive") return false;
  const path = String(content.path || "/").trim();
  return path !== "/" && !EXCLUDED_GALLERY_PATHS.has(path);
}

export function groupLabelForPath(path: string) {
  const parts = String(path || "")
    .split("/")
    .filter(Boolean);
  if (!parts.length) return "Site";
  const first = parts[0];
  const labels: Record<string, string> = {
    insights: "Visual guides",
    showcase: "Platform showcase",
    components: "Component gallery",
    solutions: "Solutions",
    sections: "Section library",
    campaigns: "Campaigns",
    promotions: "Promotions",
    company: "Company",
    skilling: "Skilling",
    "skilling-page": "Skilling pages",
    industry: "Industry",
  };
  if (labels[first]) return labels[first];
  return first
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function groupContentPages<T extends { path?: string }>(pages: T[]) {
  const groups = new Map<string, T[]>();
  for (const page of pages) {
    const label = groupLabelForPath(page.path || "");
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(page);
  }
  for (const items of groups.values()) {
    items.sort((a, b) => String(a.path || "").localeCompare(String(b.path || "")));
  }
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

export function accentForPath(path: string) {
  const hash = String(path || "")
    .split("")
    .reduce((n, c) => n + c.charCodeAt(0), 0);
  const accents = [
    "from-ink to-brand",
    "from-brand to-ink",
    "from-slate-800 to-brand",
    "from-brand via-ink to-brand",
  ];
  return accents[hash % accents.length];
}
