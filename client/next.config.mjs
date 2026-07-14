import bundleAnalyzer from "@next/bundle-analyzer";

/**
 * Next 16 notes:
 * - Default `next build` uses Turbopack and no longer prints “First Load JS”.
 * - Prefer: `npm run analyze` → `next experimental-analyze` (interactive UI).
 * - Optional webpack treemap: `npm run analyze:webpack` then open
 *   `.next/analyze/client.html` (or `npm run analyze:open`).
 */
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
  analyzerMode: "static",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Terminal: GET url 200 in Xms (cache hit | cache miss | cache skip)
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default withBundleAnalyzer(nextConfig);
