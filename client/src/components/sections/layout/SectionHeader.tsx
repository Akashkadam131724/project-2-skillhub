import type { ReactNode } from "react";
import {
  DS_SPACE,
  DS_TYPE,
  sectionClassNames,
  type DsSpaceKey,
} from "@/lib/layout/section-layout-system";

export type SectionHeaderProps = {
  eyebrow?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  /** When false, no bottom margin even if children follow */
  spaced?: boolean;
  spacing?: DsSpaceKey;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  eyebrowClassName?: string;
};

/**
 * Standard section header — eyebrow, title, subtitle, optional action.
 * Matches SectionFrame / TrainingOptions header spacing.
 */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  spaced = true,
  spacing = "headerBody",
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  eyebrowClassName = "",
}: SectionHeaderProps) {
  const showHeader = Boolean(eyebrow || title || subtitle || action);
  if (!showHeader) return null;

  const hasTitleBlock = Boolean(eyebrow || title || subtitle);

  return (
    <header
      className={sectionClassNames(
        action
          ? "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6"
          : `flex max-w-3xl flex-col ${DS_SPACE.headerStack}`,
        spaced && spacing ? DS_SPACE[spacing] : "",
        className
      )}
    >
      {hasTitleBlock ? (
        <div
          className={sectionClassNames(
            "flex min-w-0 flex-1 flex-col",
            DS_SPACE.headerStack
          )}
        >
          {eyebrow ? (
            typeof eyebrow === "string" ? (
              <p className={sectionClassNames(DS_TYPE.eyebrow, eyebrowClassName)}>
                {eyebrow}
              </p>
            ) : (
              eyebrow
            )
          ) : null}
          {title ? (
            typeof title === "string" ? (
              <h2
                className={sectionClassNames(DS_TYPE.displayTitle, titleClassName)}
              >
                {title}
              </h2>
            ) : (
              title
            )
          ) : null}
          {subtitle ? (
            typeof subtitle === "string" ? (
              <p
                className={sectionClassNames(DS_TYPE.subtitle, subtitleClassName)}
              >
                {subtitle}
              </p>
            ) : (
              subtitle
            )
          ) : null}
        </div>
      ) : null}
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
