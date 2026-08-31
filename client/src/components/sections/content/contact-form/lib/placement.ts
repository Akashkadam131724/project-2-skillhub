import { createHeaderOrItemsPlacementGuard } from "@/lib/sections/placement-guard";
import { isContactChannelShowable } from "./map";
import type { ContactFormSectionProps } from "./types";

export const isContactFormPlacementShowable =
  createHeaderOrItemsPlacementGuard<ContactFormSectionProps>(
    isContactChannelShowable
  );
