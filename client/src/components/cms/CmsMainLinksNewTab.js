"use client";

import { useEffect, useRef } from "react";

/**
 * Opens links in the CMS main panel in a new tab.
 * Sidebar navigation (outside this wrapper) keeps normal same-tab behavior.
 */
export default function CmsMainLinksNewTab({ children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    function onClick(event) {
      const anchor = event.target.closest("a[href]");
      if (!anchor || !root.contains(anchor)) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      event.stopPropagation();
      window.open(anchor.href, "_blank", "noopener,noreferrer");
    }

    root.addEventListener("click", onClick, true);
    return () => root.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div ref={rootRef} className="cms-main-content min-w-0">
      {children}
    </div>
  );
}
