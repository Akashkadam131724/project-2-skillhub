import type { ReactNode } from "react";

/**
 * Horizontal inset matching SectionWrapper content start on full-bleed sections
 * (e.g. split heroes) that cannot wrap the whole band in SectionWrapper.
 */
export const SECTION_CONTENT_INSET_CLASS =
  "px-4 sm:px-6 lg:pl-[max(2rem,calc((100vw-90rem)/2+2rem))] lg:pr-8";

export type SectionWrapperProps = {
  children?: ReactNode;
  className?: string;
  id?: string;
};

/**
 * Global content width shell for every section.
 * Sections themselves stay full-bleed; wrap inner content with this.
 */
export default function SectionWrapper({
  children,
  className = "",
  id,
}: SectionWrapperProps) {
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
