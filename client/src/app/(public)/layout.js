import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import PublicCmsEditLinkLazy from "@/components/cms/public/PublicCmsEditLinkLazy";

export default function PublicLayout({ children }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <PublicCmsEditLinkLazy />
    </>
  );
}
