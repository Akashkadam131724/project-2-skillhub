import { DIRECTORY_META, type DirectoryType } from "./directory-meta";
import type { CatalogPageContext } from "../../shared/lib/types";

type SectionData = {
  directory_type?: string;
  entity_type?: string;
  [key: string]: unknown;
};

export function resolveDirectoryType(
  sectionKey?: string,
  data?: SectionData | null,
  pageContext?: CatalogPageContext | null
): DirectoryType {
  const fromData = String(data?.directory_type || data?.entity_type || "")
    .trim()
    .toLowerCase();
  if (fromData in DIRECTORY_META) return fromData as DirectoryType;
  if (fromData === "skilling-area") return "skilling_area";

  const fromCtx = String(pageContext?.directoryType || "")
    .trim()
    .toLowerCase();
  if (fromCtx in DIRECTORY_META) return fromCtx as DirectoryType;

  const key = String(sectionKey || "").toLowerCase();
  if (key.includes("vendor")) return "vendor";
  if (key.includes("product")) return "product";
  if (key.includes("industry")) return "industry";
  if (key.includes("skilling")) return "skilling_area";
  return "vendor";
}

export function resolveEntityDirectoryTitle(
  sectionTitle?: string,
  metaLabel?: string
): string {
  return (
    (sectionTitle && String(sectionTitle).trim()) ||
    `${metaLabel || "Directory"} catalog`
  );
}
