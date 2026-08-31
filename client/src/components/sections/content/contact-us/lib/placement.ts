import { createHeaderOrItemsPlacementGuard } from "@/lib/sections/placement-guard";
import { isContactChannelShowable } from "./map";
import type { ContactUsSectionProps } from "./types";

export const isContactUsPlacementShowable = createHeaderOrItemsPlacementGuard<
  ContactUsSectionProps
>(isContactChannelShowable);
