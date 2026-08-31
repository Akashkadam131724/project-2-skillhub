import type { IconProps } from "./types";

const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  "aria-hidden": true,
} as const;

export default function FormIcon({ className = "size-4 shrink-0", ...props }: IconProps) {
  return (
    <svg className={className} {...STROKE} {...props}>
      <path d="M8 6h8M8 10h8M8 14h5" strokeLinecap="round" />
      <rect x="4" y="3" width="16" height="18" rx="2" />
    </svg>
  );
}
