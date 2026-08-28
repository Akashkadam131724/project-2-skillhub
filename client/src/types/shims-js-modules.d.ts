declare module "@/lib/sections/item-types" {
  export function itemQuestion(item: unknown): string;
  export function itemAnswer(item: unknown): string;
  export function itemTitle(item: unknown): string;
  export function itemAuthor(item: unknown): string;
  export function itemQuote(item: unknown): string;
  export function itemStatLabel(item: unknown): string;
  export function itemStatValue(item: unknown): string;
  export function resolveItemsForSection(
    sectionKey: string,
    items?: unknown
  ): unknown[];
  export function resolveSectionItems(items?: unknown): unknown[];
  export function sortActiveItems(items?: unknown): unknown[];
  export function sectionUsesItems(sectionKey: string): boolean;
  export function shouldRenderPlacement(
    section: unknown,
    cmsMode?: boolean
  ): boolean;
  export function placementHasMeaningfulContent(
    section: unknown,
    cmsMode?: boolean
  ): boolean;
  export function sectionProbeFromProps(
    sectionKey: string,
    props?: Record<string, unknown>
  ): Record<string, unknown>;
  export function groupItemsByTabs(items?: unknown): unknown[];
}

declare module "@/lib/sections/section-theme" {
  export function isPlacementDarkBand(input: {
    section_theme?: unknown;
    sectionTheme?: unknown;
    surfaceTone?: unknown;
    surfaceBand?: unknown;
  }): boolean;
  export function isPageSurfaceTransparent(pageSurfaceMode?: unknown): boolean;
  export function normalizeSectionTheme(
    placement?: string | Record<string, unknown>
  ): string;
  export function sectionSkipsInheritedBandPaint(sectionKey?: string): boolean;
  export function sectionThemeBandClass(themePref?: string): string;
  export function sectionThemeDataAttribute(
    themeOrPlacement?: string | Record<string, unknown>
  ): string | undefined;
  export function surfaceToneForSectionTheme(theme?: string): string | null;
  export const SECTION_THEME_BAND_SKIP_KEYS: Set<string>;
}

declare module "@/components/ui/DsButton" {
  import type { ReactNode } from "react";
  export default function DsButton(
    props: Record<string, unknown>
  ): ReactNode;
}

declare module "@/components/sections/shared/CardPlaceholder" {
  import type { ReactNode } from "react";
  export default function CardPlaceholder(props: {
    children?: ReactNode;
  }): ReactNode;
}
