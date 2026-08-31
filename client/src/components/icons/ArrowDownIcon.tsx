import type { IconProps } from "./types";

const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  "aria-hidden": true,
} as const;

export default function ArrowDownIcon({ className = "size-4 shrink-0", ...props }: IconProps) {
  return (
    <svg className={className} {...STROKE} {...props}>
      <path
        d="M12 5v14M12 19l-4-4M12 19l4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
