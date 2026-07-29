"use client";

import { usePathname } from "next/navigation";

/** Hides the site footer on CMS admin routes (/cms, /cms/*). */
export default function SiteFooterGate({ children }) {
  const pathname = usePathname();
  const isCmsRoute = pathname === "/cms" || pathname?.startsWith("/cms/");
  if (isCmsRoute) return null;
  return children;
}
