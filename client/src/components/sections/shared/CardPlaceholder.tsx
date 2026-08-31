import type { ReactNode } from "react";

export default function CardPlaceholder({ children }: { children?: ReactNode }) {
  return (
    <span className="section-theme-placeholder italic">{children}</span>
  );
}
