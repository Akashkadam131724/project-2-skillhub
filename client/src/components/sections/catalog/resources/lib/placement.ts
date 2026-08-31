import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isResourceItemShowable } from "./map";
import type { ResourcesSectionProps } from "./types";

export const isResourcesPlacementShowable = createPlacementGuard<ResourcesSectionProps>(
  "resources",
  isResourceItemShowable
);
