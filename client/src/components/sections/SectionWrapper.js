/**
 * Global content width shell for every section.
 * Sections themselves stay full-bleed; wrap inner content with this.
 *
 * Tune padding / max-width here once — applies site-wide.
 * Keep a horizontal gutter at every breakpoint (never lg:px-0) so
 * mid-desktop viewports aren’t flush to the edges.
 */
export default function SectionWrapper({ children, className = "", id }) {
  return (
    <div
      id={id}
      className={[
        "relative mx-auto w-full max-w-[1440px]",
        "px-4 sm:px-6 lg:px-8",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
