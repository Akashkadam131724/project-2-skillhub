import type { ReactNode } from "react";

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
