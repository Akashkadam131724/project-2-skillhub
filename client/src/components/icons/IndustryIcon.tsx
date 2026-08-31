import type { IconProps } from "./types";

const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export default function IndustryIcon({ className = "size-4", ...props }: IconProps) {
  return (
    <svg className={className} {...STROKE} {...props}>
      <path d="M3 21h18" />
      <path d="M5 21V10l5 3V10l5 3V5h4v16" />
      <path d="M9 21v-4h4v4" />
    </svg>
  );
}
