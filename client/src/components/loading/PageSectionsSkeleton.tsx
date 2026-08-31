import type { PageSectionsSkeletonProps } from "./types";

/**
 * Placeholder while public CMS sections stream in.
 * Matches hero_classic layout (padding, aspect ratio, trust row) to limit CLS.
 */
export default function PageSectionsSkeleton({ compact = false }: PageSectionsSkeletonProps) {
  if (compact) {
    return (
      <div
        className="w-full animate-pulse py-8 sm:py-10"
        aria-hidden
        role="presentation"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="space-y-4">
              <div className="h-8 w-4/5 max-w-md rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-full max-w-lg rounded bg-slate-200/80 dark:bg-slate-800/80" />
              <div className="h-4 w-11/12 max-w-md rounded bg-slate-200/70 dark:bg-slate-800/70" />
              <div className="h-4 w-2/3 max-w-sm rounded bg-slate-200/60 dark:bg-slate-800/60" />
            </div>
            <div className="aspect-[5/4] w-full rounded-2xl bg-slate-200/90 dark:bg-slate-800/90" />
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-slate-100 dark:bg-slate-900/80"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-pulse" aria-hidden role="presentation">
      <section className="bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-16">
            <div className="flex min-w-0 flex-col">
              <div className="mb-4 h-7 w-48 max-w-full rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="flex max-w-2xl flex-col gap-5 sm:gap-6">
                <div className="h-[2.15rem] w-full max-w-xl rounded-xl bg-slate-200 sm:h-12 dark:bg-slate-800" />
                <div className="h-5 w-full max-w-lg rounded-lg bg-slate-200/80 dark:bg-slate-800/80" />
                <div className="h-5 w-4/5 max-w-md rounded-lg bg-slate-200/70 dark:bg-slate-800/70" />
              </div>
              <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
                <div className="h-11 w-36 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-11 w-32 rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-200/80 pt-6 sm:mt-10 sm:gap-6 dark:border-slate-800">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-6 w-full rounded bg-slate-200 sm:h-7 dark:bg-slate-800" />
                    <div className="h-3 w-full rounded bg-slate-200/70 dark:bg-slate-800/70" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-lg lg:max-w-none">
              <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="aspect-[5/4] w-full rounded-[1.35rem] bg-slate-200/90 dark:bg-slate-800/90" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/70 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 h-8 w-64 max-w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950/50"
              >
                <div className="aspect-[4/3] bg-slate-200/80 dark:bg-slate-800/80" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-full rounded bg-slate-200/70 dark:bg-slate-800/70" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
