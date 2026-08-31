import type { IconProps } from "./types";

const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.8",
  "aria-hidden": true,
} as const;

export default function BuildingIcon({ className = "size-4 shrink-0", ...props }: IconProps) {
  return (
    <svg className={className} {...STROKE} {...props}>
      <path d="M3 21h18M6 21V7l6-3 6 3v14" />
      <path d="M9 21v-4h6v4" />
      <path d="M10 10h4M10 14h4" />
    </svg>
  );
}
