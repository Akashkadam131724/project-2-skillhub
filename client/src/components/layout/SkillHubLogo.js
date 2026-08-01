/**
 * SkillHub brand mark — inline SVG using theme tokens (`--ink`, `--brand`).
 * Updates automatically when site/page theme CSS vars change.
 */
export default function SkillHubLogo({
  showWordmark = true,
  size = 32,
  className = "",
  priority: _priority = false,
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="SkillHub"
        className="shrink-0 transition-[transform,color] duration-200 group-hover:scale-[1.03]"
      >
        <rect width="40" height="40" rx="11" fill="var(--ink)" />
        <path
          d="M40 24.5C33.2 33.4 21.4 38.2 11.5 33.8V40H40V24.5Z"
          fill="var(--brand)"
        />
        <rect
          x="10"
          y="23"
          width="5.5"
          height="9"
          rx="2.75"
          fill="white"
          fillOpacity="0.82"
        />
        <rect
          x="17.25"
          y="17"
          width="5.5"
          height="15"
          rx="2.75"
          fill="white"
          fillOpacity="0.92"
        />
        <rect x="24.5" y="11" width="5.5" height="21" rx="2.75" fill="white" />
        <circle cx="30.5" cy="9.5" r="2.75" fill="var(--brand)" />
        <circle cx="30.5" cy="9.5" r="1.1" fill="white" fillOpacity="0.9" />
      </svg>
      {showWordmark ? (
        <span className="text-sm font-bold tracking-wide text-ink dark:text-white">
          SkillHub
        </span>
      ) : null}
    </span>
  );
}
