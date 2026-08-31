import type { ReactNode } from "react";

export default function FeatureCardPlaceholder({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <span className="text-slate-300 italic dark:text-slate-600">{children}</span>
  );
}
