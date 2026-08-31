import type { IconProps } from "./types";

const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  "aria-hidden": true,
} as const;

export default function MapPinIcon({ className = "size-5 shrink-0 text-brand", ...props }: IconProps) {
  return (
    <svg className={className} {...STROKE} {...props}>
      <path
        d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}
