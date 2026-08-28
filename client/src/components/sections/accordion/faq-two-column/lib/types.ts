import type { ReactNode } from "react";
import type { AccordionUiBaseProps } from "../../shared/lib/types";

export type FaqHeaderSide = "left" | "right";

export type FaqTwoColumnUiProps = AccordionUiBaseProps & {
  headerControls?: ReactNode;
  headerSide?: FaqHeaderSide;
};
