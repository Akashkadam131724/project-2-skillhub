import {
  fetchIndustries,
  fetchProducts,
  fetchSkillingAreas,
  fetchVendors,
} from "@/lib/api";
import type { DirectoryType } from "./directory-meta";

export async function fetchDirectory(
  type: DirectoryType,
  {
    page,
    q,
    limit,
  }: { page: number; q: string; limit: number }
) {
  const params = { page, limit, q, status: "active" };
  switch (type) {
    case "product":
      return fetchProducts(params);
    case "industry":
      return fetchIndustries({ ...params, limit: Math.max(limit, 50) });
    case "skilling_area":
      return fetchSkillingAreas({ ...params, limit: Math.max(limit, 50) });
    case "vendor":
    default:
      return fetchVendors(params);
  }
}
