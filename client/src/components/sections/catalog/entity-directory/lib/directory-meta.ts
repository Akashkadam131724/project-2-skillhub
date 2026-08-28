export type DirectoryType =
  | "vendor"
  | "product"
  | "industry"
  | "skilling_area";

export type DirectoryMeta = {
  label: string;
  searchPlaceholder: string;
  empty: string;
  grid: string;
};

export const DIRECTORY_META: Record<DirectoryType, DirectoryMeta> = {
  vendor: {
    label: "Vendors",
    searchPlaceholder: "Search vendors",
    empty: "No vendors match your search.",
    grid: "sm:grid-cols-2",
  },
  product: {
    label: "Products",
    searchPlaceholder: "Search products",
    empty: "No products match your search.",
    grid: "sm:grid-cols-2 lg:grid-cols-3",
  },
  industry: {
    label: "Industries",
    searchPlaceholder: "Search industries",
    empty: "No industries match your search.",
    grid: "sm:grid-cols-2 lg:grid-cols-3",
  },
  skilling_area: {
    label: "Skilling Areas",
    searchPlaceholder: "Search skilling areas",
    empty: "No skilling areas match your search.",
    grid: "sm:grid-cols-2 lg:grid-cols-3",
  },
};
