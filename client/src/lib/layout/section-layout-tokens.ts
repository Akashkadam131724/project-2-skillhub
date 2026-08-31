/** Content rail — keep in sync with SectionWrapper */
export const SECTION_LAYOUT_MAX_WIDTH_PX = 1440;
export const SECTION_LAYOUT_MAX_WIDTH_REM = 90;

/** Horizontal padding per breakpoint (matches px-4 / sm:px-6 / lg:px-8) */
export const SECTION_LAYOUT_GUTTER_PX = {
  default: 16,
  sm: 24,
  md: 24,
  lg: 32,
} as const;

export const SECTION_LAYOUT_BREAKPOINTS_PX = {
  sm: 640,
  lg: 1024,
} as const;
