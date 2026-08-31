import { createContentPlacementGuard } from "@/lib/sections/placement-guard";
import type { CtaBandSectionProps } from "./types";

export const isCtaBandPlacementShowable =
  createContentPlacementGuard<CtaBandSectionProps>();
