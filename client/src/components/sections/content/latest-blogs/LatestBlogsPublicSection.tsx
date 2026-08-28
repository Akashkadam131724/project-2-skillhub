import LatestBlogsClient from "./LatestBlogsClient";
import type { LatestBlogsSectionProps } from "./lib/types";

export default function LatestBlogsPublicSection(props: LatestBlogsSectionProps) {
  return <LatestBlogsClient {...props} />;
}
