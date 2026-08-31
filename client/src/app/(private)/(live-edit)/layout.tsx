import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import type { AppLayoutProps } from "../../types";

/** Live section editor — public site chrome, emerald CMS bar on the page. */
export default function CmsLiveEditLayout({ children }: AppLayoutProps) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
