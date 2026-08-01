const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  "aria-hidden": true,
};

export default function LinkIcon({ className = "size-4 shrink-0", ...props }) {
  return (
    <svg className={className} {...STROKE} {...props}>
      <path
        d="M9 15l6-6M8.5 10.5l-1.2 1.2a3.5 3.5 0 0 0 5 5l1.2-1.2M15.5 13.5l1.2-1.2a3.5 3.5 0 0 0-5-5L10.5 8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
