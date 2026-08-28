import type { ReactNode } from "react";
import type { HeroLayoutSectionProps } from "@/components/sections/hero/shared/lib/hero-layout-types";

export type HeroClassicUiProps =
  import("@/components/sections/hero/shared/lib/hero-layout-types").HeroLayoutUiProps & {
    visualSlot?: ReactNode;
    imageAddSlot?: ReactNode;
  };

export type HeroClassicSectionProps = HeroLayoutSectionProps;
