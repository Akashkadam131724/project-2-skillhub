import type { ReactNode } from "react";
import type { AccordionUiBaseProps } from "../../shared/lib/types";

export type FaqUiProps = AccordionUiBaseProps & {
  headerAction?: ReactNode;
};
