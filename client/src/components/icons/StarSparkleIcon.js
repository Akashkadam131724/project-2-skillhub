export default function StarSparkleIcon({ className = "size-3.5", ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M10 1.5l2.4 5.2 5.6.6-4.2 3.8 1.2 5.5L10 13.8 4.9 16.6l1.2-5.5L2 7.3l5.6-.6L10 1.5z" />
    </svg>
  );
}
