declare module "@/lib/sections/section-design-system" {
  export const DS_TEXT: {
    heading: string;
    muted: string;
    subtle: string;
    [key: string]: string;
  };

  export const DS_FIELD: {
    input: string;
    label: string;
    checkbox: string;
  };

  export function sectionLightCardSurfaceProps(extraClass?: string): {
    "data-section-surface": string;
    "data-light-surface": string;
    className: string;
  };

  export function sectionGlassCardSurfaceProps(extraClass?: string): {
    "data-section-surface": string;
    className: string;
  };

  export function sectionDarkOverlaySurfaceProps(extraClass?: string): {
    "data-section-surface": string;
    className: string;
  };
}
