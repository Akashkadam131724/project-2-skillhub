import { createTitleSubtitleButtonsPlacementGuard } from "@/lib/sections/placement-guard";
import type { NewsletterBandSectionProps } from "./types";

export const isNewsletterBandPlacementShowable =
  createTitleSubtitleButtonsPlacementGuard<NewsletterBandSectionProps>();
