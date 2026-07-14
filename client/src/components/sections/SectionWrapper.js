/**
 * Global content width shell for every section.
 * Sections themselves stay full-bleed; wrap inner content with this.
 *
 * Tune padding / max-width here once — applies site-wide.
 */
export default function SectionWrapper({ children, className = "", id }) {
  return (
    <div
      id={id}
      className={[
        "relative mx-auto w-full max-w-[1280px]",
        // horizontal inset: mobile/tablet only (full width on large)
        "px-4 sm:px-6 md:px-8 lg:px-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
