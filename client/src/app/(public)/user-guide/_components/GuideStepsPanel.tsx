export type GuideStep = {
  title: string;
  detail: string;
  status?: "done" | "partial" | "todo";
};

const STATUS_CLASS: Record<NonNullable<GuideStep["status"]>, string> = {
  done: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  partial:
    "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  todo: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export default function GuideStepsPanel({
  title,
  steps,
  className = "",
}: {
  title: string;
  steps: GuideStep[];
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 p-5 dark:border-slate-800 ${className}`.trim()}
    >
      <h2 className="section-theme-heading m-0 text-sm font-semibold">{title}</h2>
      <ol className="section-theme-muted mt-4 mb-0 list-none space-y-4 p-0 text-sm">
        {steps.map((item, index) => (
          <li key={item.title} className="flex gap-3">
            <span className="section-theme-subtle mt-0.5 shrink-0 text-xs font-semibold tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            {item.status ? (
              <span
                className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_CLASS[item.status]}`}
              >
                {item.status}
              </span>
            ) : null}
            <div className="min-w-0">
              <p className="section-theme-heading m-0 font-medium">
                {item.title}
              </p>
              <p className="m-0 mt-0.5 leading-relaxed">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
