import Link from "next/link";

function IconVendor({ className = "size-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
    </svg>
  );
}

function IconSkillLevel({ className = "size-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 20V14" />
      <path d="M10 20V10" />
      <path d="M16 20V6" />
      <path d="M22 20V3" />
    </svg>
  );
}

function IconIndustry({ className = "size-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21h18" />
      <path d="M5 21V10l5 3V10l5 3V5h4v16" />
      <path d="M9 21v-4h4v4" />
    </svg>
  );
}

function IconSkillingArea({ className = "size-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </svg>
  );
}

function IconProduct({ className = "size-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="M3.3 7 12 12l8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function formatNames(items, fallback = "—") {
  if (!Array.isArray(items) || items.length === 0) return fallback;
  const names = items.map((item) => item?.name).filter(Boolean);
  if (!names.length) return fallback;
  if (names.length <= 2) return names.join(", ");
  return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
}

function MetaItem({ icon, label, value, href }) {
  if (!value || value === "—") return null;

  const text = href ? (
    <Link
      href={href}
      className="truncate text-inherit no-underline hover:text-brand"
      title={value}
    >
      {value}
    </Link>
  ) : (
    <span className="truncate" title={value}>
      {value}
    </span>
  );

  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
      <span className="group/tip relative inline-flex shrink-0 cursor-help text-brand">
        <span aria-hidden="true">{icon}</span>
        <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-md transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 dark:bg-slate-100 dark:text-slate-900">
          {label}
          <span
            className="absolute left-1/2 top-full -mt-px -translate-x-1/2 border-4 border-transparent border-t-ink dark:border-t-slate-100"
            aria-hidden="true"
          />
        </span>
        <span className="sr-only">{label}</span>
      </span>
      {text}
    </span>
  );
}

export default function CourseCard({ course }) {
  const vendorName = course.product?.vendor?.name || "";
  const vendorSlug = course.product?.vendor?.slug || "";
  const productName = course.product?.name || "";
  const productSlug = course.product?.slug || "";
  const skillLevelName = course.skillLevel?.name || "";
  const industryNames = formatNames(course.industries, "");
  const skillingAreaNames = formatNames(course.skillingAreas, "");
  const courseHref = course.slug ? `/course/${course.slug}` : null;

  return (
    <article className="group relative h-full overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white p-5 shadow-[0_16px_40px_-32px_color-mix(in_srgb,var(--ink)_35%,transparent)] transition hover:-translate-y-1 hover:border-brand/25 dark:border-slate-800 dark:bg-slate-950">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ink via-brand to-ink opacity-80"
      />
      <div className="flex flex-wrap items-start justify-between gap-3 pt-1">
        <h3 className="m-0 text-lg font-semibold tracking-tight text-ink dark:text-white">
          {courseHref ? (
            <Link
              href={courseHref}
              className="text-inherit no-underline hover:text-brand"
            >
              {course.name}
            </Link>
          ) : (
            course.name
          )}
        </h3>
        {productName && (
          productSlug ? (
            <Link
              href={`/product/${productSlug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand no-underline dark:border-brand/40 dark:bg-brand/20 dark:text-brand"
            >
              <IconProduct className="size-3.5" />
              {productName}
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand dark:border-brand/40 dark:bg-brand/20 dark:text-brand">
              <IconProduct className="size-3.5" />
              {productName}
            </span>
          )
        )}
      </div>

      <p className="mt-2 mb-0 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {course.description || "No description"}
      </p>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        <MetaItem
          icon={<IconVendor />}
          label="Vendor"
          value={vendorName}
          href={vendorSlug ? `/vendor/${vendorSlug}` : null}
        />
        <MetaItem
          icon={<IconSkillLevel />}
          label="Skill level"
          value={skillLevelName}
        />
        <MetaItem
          icon={<IconIndustry />}
          label="Industry"
          value={industryNames}
          href={
            course.industries?.[0]?.slug
              ? `/industry/${course.industries[0].slug}`
              : null
          }
        />
        <MetaItem
          icon={<IconSkillingArea />}
          label="Skilling area"
          value={skillingAreaNames}
          href={
            course.skillingAreas?.[0]?.slug
              ? `/skilling-area/${course.skillingAreas[0].slug}`
              : null
          }
        />
      </div>
    </article>
  );
}
