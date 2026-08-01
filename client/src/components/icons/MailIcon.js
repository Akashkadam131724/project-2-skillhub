const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  "aria-hidden": true,
};

export default function MailIcon({ className = "size-5 shrink-0 text-brand", ...props }) {
  return (
    <svg className={className} {...STROKE} {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinejoin="round" />
    </svg>
  );
}
