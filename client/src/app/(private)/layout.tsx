import type { AppLayoutProps } from "../types";

/** Pass-through — child route groups choose admin shell vs live-edit chrome. */
export default function PrivateLayout({ children }: AppLayoutProps) {
  return children;
}
