const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  "aria-hidden": true,
};

export default function PhoneIcon({ className = "size-5 shrink-0 text-brand", ...props }) {
  return (
    <svg className={className} {...STROKE} {...props}>
      <path
        d="M6.5 4.5h3l1.5 4-2 1.2a12 12 0 0 0 5.3 5.3l1.2-2 4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 6.7 2 2 0 0 1 6.5 4.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
