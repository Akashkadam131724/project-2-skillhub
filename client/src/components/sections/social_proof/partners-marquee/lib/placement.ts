import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isPartnerLogoShowable } from "./map";
import type { PartnersMarqueeSectionProps } from "./types";

export const isPartnersMarqueePlacementShowable = createPlacementGuard<PartnersMarqueeSectionProps>(
  "partners_marquee",
  isPartnerLogoShowable
);
