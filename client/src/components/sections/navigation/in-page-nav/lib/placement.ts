import { createMinBuiltItemsPlacementGuard } from "@/lib/sections/placement-guard";
import { buildInPageNavItems } from "./map";
import type { InPageNavSectionProps } from "./types";

export const isInPageNavPlacementShowable =
  createMinBuiltItemsPlacementGuard<InPageNavSectionProps>(
    (props) => buildInPageNavItems(props.navSections),
    2
  );
