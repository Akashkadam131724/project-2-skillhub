"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PencilIcon from "@/components/icons/PencilIcon";
import { cmsEditHrefFromPublicPath } from "@/lib/cms/cms-edit-routes";

/**
 * Centered bottom edit FAB — links to CMS live-edit for the current public page.
 *
 * Client-only after mount: pathname in the public layout must not run during SSR
 * or it can trigger repeated RSC refetches on dynamic content pages (Next 16).
 */
export default function PublicCmsEditLink() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!pathname || pathname === "/cms" || pathname.startsWith("/cms/")) {
    return null;
  }

  const href = cmsEditHrefFromPublicPath(pathname);
  if (!href) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center p-5 pb-6">
      <Link
        href={href}
        prefetch={false}
        className="pointer-events-auto inline-flex size-14 items-center justify-center rounded-full bg-ink text-white shadow-[0_12px_40px_-12px_rgba(11,31,77,0.55)] ring-1 ring-black/10 transition hover:scale-105 hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:bg-white dark:text-ink dark:ring-white/20 dark:hover:bg-brand dark:hover:text-white"
        aria-label="Edit this page"
        title="Edit this page in CMS"
      >
        <PencilIcon className="size-5" />
      </Link>
    </div>
  );
}
