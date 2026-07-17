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
  // Helps Lighthouse / DevTools map large first-party bundles
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Terminal: GET url 200 in Xms (cache hit | cache miss | cache skip)
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async redirects() {
    return [
      {
        source: "/course-catalog",
        destination: "/courses",
        permanent: true,
      },
      {
        source: "/course-catalog/:path*",
        destination: "/courses/:path*",
        permanent: true,
      },
      // Catalog indexes: singular → plural
      {
        source: "/vendor",
        destination: "/vendors",
        permanent: true,
      },
      {
        source: "/product",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/industry",
        destination: "/industries",
        permanent: true,
      },
      {
        source: "/skilling-area",
        destination: "/skilling-areas",
        permanent: true,
      },
      // Detail pages: plural → singular
      {
        source: "/vendors/:slug",
        destination: "/vendor/:slug",
        permanent: true,
      },
      {
        source: "/products/:slug",
        destination: "/product/:slug",
        permanent: true,
      },
      {
        source: "/industries/:slug",
        destination: "/industry/:slug",
        permanent: true,
      },
      {
        source: "/skilling-areas/:slug",
        destination: "/skilling-area/:slug",
        permanent: true,
      },
      {
        source: "/courses/:slug",
        destination: "/course/:slug",
        permanent: true,
      },
      {
        source: "/blogs/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
