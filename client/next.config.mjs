import path from "path";
import { fileURLToPath } from "url";
import bundleAnalyzer from "@next/bundle-analyzer";

const clientRoot = path.dirname(fileURLToPath(import.meta.url));

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

function uploadRemotePatterns() {
  const patterns = [];
  const seen = new Set();
  const add = (pattern) => {
    const key = `${pattern.protocol}://${pattern.hostname}:${pattern.port || ""}${pattern.pathname}`;
    if (seen.has(key)) return;
    seen.add(key);
    patterns.push(pattern);
  };

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const url = new URL(apiBase);
    const protocol = url.protocol.replace(":", "");
    const hosts =
      url.hostname === "localhost" ? ["localhost", "127.0.0.1"] : [url.hostname];
    for (const hostname of hosts) {
      add({
        protocol,
        hostname,
        ...(url.port ? { port: url.port } : {}),
        pathname: "/uploads/**",
      });
    }
  } catch {
    /* fall through to dev defaults */
  }

  if (process.env.NODE_ENV !== "production") {
    for (const port of ["3000", "3005"]) {
      for (const hostname of ["localhost", "127.0.0.1"]) {
        add({
          protocol: "http",
          hostname,
          port,
          pathname: "/uploads/**",
        });
      }
    }
  }

  return patterns;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Parent workspace has its own package-lock; pin Turbopack to this app
  // so CSS @imports like ./section-theme.css resolve from src/app/, not client/.
  turbopack: {
    root: clientRoot,
  },
  productionBrowserSourceMaps: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1400],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 80],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.netcomlearning.com",
      },
      {
        protocol: "https",
        hostname: "media.craiyon.com",
      },
      {
        protocol: "https",
        hostname: "www.motionpictures.org",
      },
      {
        protocol: "https",
        hostname: "cdn.moviefone.com",
      },
      {
        protocol: "https",
        hostname: "dx35vtwkllhj9.cloudfront.net",
      },
      ...uploadRemotePatterns(),
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
      // CMS admin: plural metadata → singular
      {
        source: "/cms/vendors/:slug",
        destination: "/cms/vendor/:slug",
        permanent: true,
      },
      {
        source: "/cms/products/:slug",
        destination: "/cms/product/:slug",
        permanent: true,
      },
      {
        source: "/cms/courses/:slug",
        destination: "/cms/course/:slug",
        permanent: true,
      },
      {
        source: "/cms/industries/:slug",
        destination: "/cms/industry/:slug",
        permanent: true,
      },
      {
        source: "/cms/skilling-areas/:slug",
        destination: "/cms/skilling-area/:slug",
        permanent: true,
      },
      {
        source: "/cms/blogs/:slug",
        destination: "/cms/blog/:slug",
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
