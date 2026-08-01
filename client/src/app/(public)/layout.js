import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PublicCmsEditLinkLazy from "@/components/PublicCmsEditLinkLazy";

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
