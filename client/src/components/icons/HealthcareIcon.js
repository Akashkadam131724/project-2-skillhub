const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.8",
  "aria-hidden": true,
};

export default function HealthcareIcon({ className = "size-4 shrink-0", ...props }) {
  return (
    <svg className={className} {...STROKE} {...props}>
      <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10Z" />
      <path d="M12 11v4M10 13h4" />
    </svg>
  );
}
