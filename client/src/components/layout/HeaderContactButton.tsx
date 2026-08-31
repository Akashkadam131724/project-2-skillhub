"use client";

import DsButton from "@/components/ui/DsButton";
import type { HeaderContactButtonProps } from "./types";

/** Site header / mobile nav — Contact us CTA */
export default function HeaderContactButton({
  className = "",
  fullWidth = false,
  onNavigate,
}: HeaderContactButtonProps) {
  return (
    <DsButton
      button={{
        label: "Contact us",
        variant: "primary",
        size: "md",
        shape: "rounded",
        icon: "none",
        action_type: "url",
        target_url: "/contact-us",
        full_width: fullWidth,
      }}
      className={className}
      onClick={onNavigate}
    />
  );
}
