import { createHeaderOrItemsPlacementGuard } from "@/lib/sections/placement-guard";
import { isDomainChipShowable } from "./map";
import type { DomainSearchBandSectionProps } from "./types";

export const isDomainSearchBandPlacementShowable =
  createHeaderOrItemsPlacementGuard<DomainSearchBandSectionProps>(
    isDomainChipShowable
  );
