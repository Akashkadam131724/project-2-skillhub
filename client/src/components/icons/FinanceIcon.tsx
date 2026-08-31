import type { IconProps } from "./types";

const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.8",
  "aria-hidden": true,
} as const;

export default function FinanceIcon({ className = "size-4 shrink-0", ...props }: IconProps) {
  return (
    <svg className={className} {...STROKE} {...props}>
      <path d="M3 10h18M5 6h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
      <path d="M8 14h.01M12 14h.01M16 14h.01" />
    </svg>
  );
}
