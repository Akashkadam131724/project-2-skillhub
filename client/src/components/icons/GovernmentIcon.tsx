import type { IconProps } from "./types";

const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.8",
  "aria-hidden": true,
} as const;

export default function GovernmentIcon({ className = "size-4 shrink-0", ...props }: IconProps) {
  return (
    <svg className={className} {...STROKE} {...props}>
      <path d="M3 21h18M5 21V9l7-4 7 4v12" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}
