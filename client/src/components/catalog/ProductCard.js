import Link from "next/link";

export default function ProductCard({ product, index = 0 }) {
  const n = String(index + 1).padStart(2, "0");
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative block h-full overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 p-5 no-underline shadow-[0_16px_40px_-32px_color-mix(in_srgb,var(--ink)_35%,transparent)] transition hover:-translate-y-1 hover:border-brand/25 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 -right-8 size-24 rounded-full bg-brand/10 blur-2xl transition group-hover:bg-brand/20"
      />
      <div className="relative mb-4 flex items-start justify-between gap-3">
        <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
          Product
        </span>
        <span className="font-[family-name:var(--font-display)] text-xl font-semibold text-brand/30">
          {n}
        </span>
      </div>
      <h3 className="relative m-0 text-lg font-semibold tracking-tight text-ink dark:text-white">
        {product.name}
      </h3>
      <p className="relative mt-2 mb-0 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {product.description || "Training product"}
      </p>
      {product.category ? (
        <span className="relative mt-4 inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {product.category}
        </span>
      ) : null}
    </Link>
  );
}
