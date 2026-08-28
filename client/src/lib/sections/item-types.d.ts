export function itemQuestion(item: unknown): string;
export function itemAnswer(item: unknown): string;
export function itemTitle(item: unknown): string;
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
