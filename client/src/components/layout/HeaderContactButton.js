"use client";

import DsButton from "@/components/ui/DsButton";

/** Site header / mobile nav — Contact us CTA */
export default function HeaderContactButton({
  className = "",
  fullWidth = false,
  onNavigate,
}) {
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
