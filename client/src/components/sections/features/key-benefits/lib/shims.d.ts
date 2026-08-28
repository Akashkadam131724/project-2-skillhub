import type { ReactNode } from "react";

declare module "@/components/sections/MobileCardPeekRow" {
  export default function MobileCardPeekRow(props: {
    gridClassName?: string;
    gapClassName?: string;
    className?: string;
    gridFrom?: string;
    children?: ReactNode;
  }): ReactNode;
}
