"use client";

import { useEffect } from "react";
import { getSiteTheme } from "@/lib/cms-api";
import { themeCssVars, defaultSiteTheme } from "@/lib/theme";

/**
 * Applies global site theme CSS vars on the document root.
 * PageThemeShell can override locally for a template.
 */
export default function SiteThemeBootstrap() {
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getSiteTheme();
        if (!alive) return;
        const vars = themeCssVars(res?.data || defaultSiteTheme());
        const root = document.documentElement;
        Object.entries(vars).forEach(([key, value]) => {
          root.style.setProperty(key, value);
        });
        if (res?.data?.preset) {
          root.setAttribute("data-theme", res.data.preset);
        }
      } catch {
        /* keep layout defaults */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return null;
}
