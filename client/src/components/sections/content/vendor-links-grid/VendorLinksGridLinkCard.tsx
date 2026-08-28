"use client";

import Link from "next/link";
import {
  vendorLinkAccent,
  vendorLinkLetterLogo,
} from "./lib/link-accent";
import type { VendorLinksGridLink } from "./lib/types";

export default function VendorLinksGridLinkCard({
  link,
  index,
}: {
  link: VendorLinksGridLink;
  index: number;
}) {
  const accent = vendorLinkAccent(index);
  const href = link.href?.trim() || "#";
  const external = href.startsWith("http");
  const letter = vendorLinkLetterLogo(link.label);

  const className = `group flex cursor-pointer items-center justify-between bg-white p-4 transition-colors duration-200 sm:p-5 lg:p-6 ${accent.hover}`;

  const inner = (
    <>
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <div
          className={`flex size-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 sm:size-10 ${accent.iconBg}`}
        >
          {link.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={link.iconUrl}
              alt=""
              aria-hidden
              className="size-full rounded-full object-contain"
            />
          ) : (
            <span className={`text-sm font-semibold ${accent.iconText}`}>
              {letter}
            </span>
          )}
        </div>
        <span className="truncate text-base font-medium text-gray-900 group-hover:text-white sm:text-lg">
          {link.label}
        </span>
      </div>

      <svg
        className="size-4 shrink-0 text-gray-600 opacity-0 transition-all duration-200 group-hover:text-white group-hover:opacity-100"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 17l9.2-9.2M17 17V7H7"
        />
      </svg>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={`${className} no-underline`}>
      {inner}
    </Link>
  );
}
