import { useParams } from "next/navigation";

export function useSlugParam(): string {
  const { slug } = useParams<{ slug: string }>();
  return String(slug || "");
}

export function useKeyTagParams(): { pageKey: string; placementId: string } {
  const { key, tagId } = useParams<{ key: string; tagId: string }>();
  return { pageKey: String(key || ""), placementId: String(tagId || "") };
}

export function useKeyParam(): string {
  const { key } = useParams<{ key: string }>();
  return String(key || "");
}
