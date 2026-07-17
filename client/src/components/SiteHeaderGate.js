"use client";

import { usePathname } from "next/navigation";

/** Hides the site header on CMS admin routes (/cms, /cms/*). */
export default function SiteHeaderGate({ children }) {
  const pathname = usePathname();
  const isCmsRoute = pathname === "/cms" || pathname?.startsWith("/cms/");
  if (isCmsRoute) return null;
  return children;
}
