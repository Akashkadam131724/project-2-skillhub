const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  "aria-hidden": true,
};

export default function ExternalLinkIcon({ className = "size-4 shrink-0", ...props }) {
  return (
    <svg className={className} {...STROKE} {...props}>
      <path
        d="M14 4h6v6M10 14 20 4M18 14v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
