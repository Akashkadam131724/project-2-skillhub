import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import PublicCmsEditLink from "@/components/cms/public/PublicCmsEditLink";
import type { AppLayoutProps } from "../types";

export default function PublicLayout({ children }: AppLayoutProps) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <PublicCmsEditLink />
    </>
  );
}
