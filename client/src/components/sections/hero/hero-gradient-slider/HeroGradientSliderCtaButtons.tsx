"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { normalizeButton } from "@/lib/utils/button-types";

const PRIMARY_CLASS =
  "flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-base font-semibold text-black no-underline transition-all duration-300 hover:bg-gray-100 hover:text-black sm:px-6 sm:py-3";

const SECONDARY_CLASS =
  "flex items-center justify-center gap-2 rounded-lg border border-solid border-white bg-transparent px-5 py-2.5 text-base font-semibold text-white no-underline transition-all duration-300 hover:bg-transparent hover:text-white sm:px-6 sm:py-3";

type HeroGradientSliderCtaButtonsProps = {
  buttons?: unknown[];
  onFormOpenChange?: (open: boolean) => void;
};

function CtaLink({
  href,
  className,
  children,
  external,
}: {
  href: string;
  className: string;
  children: ReactNode;
  external?: boolean;
}) {
  if (!href || href === "#") {
    return (
      <span className={`${className} cursor-default opacity-70`}>{children}</span>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function HeroGradientSliderCtaButtons({
  buttons = [],
  onFormOpenChange,
}: HeroGradientSliderCtaButtonsProps) {
  const active = buttons
    .map((b) => normalizeButton(b))
    .filter((b) => b.label && b.status !== false);

  const primary = active[0];
  const secondary = active[1];

  if (!primary) return null;

  function renderButton(
    btn: ReturnType<typeof normalizeButton>,
    className: string
  ) {
    const href = btn.target_url || "#";
    const isForm = btn.action_type === "form";

    if (isForm) {
      return (
        <button
          type="button"
          className={className}
          onClick={() => onFormOpenChange?.(true)}
        >
          {btn.label}
        </button>
      );
    }

    const external = href.startsWith("http");

    return (
      <CtaLink href={href} className={className} external={external}>
        {btn.label}
      </CtaLink>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4 sm:gap-x-6">
      {renderButton(primary, PRIMARY_CLASS)}
      {secondary ? renderButton(secondary, SECONDARY_CLASS) : null}
    </div>
  );
}
