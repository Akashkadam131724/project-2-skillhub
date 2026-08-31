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

export default function SkillLevelIcon({ className = "size-4", ...props }: IconProps) {
  return (
    <svg className={className} {...STROKE} {...props}>
      <path d="M4 20V14" />
      <path d="M10 20V10" />
      <path d="M16 20V6" />
      <path d="M22 20V3" />
    </svg>
  );
}
