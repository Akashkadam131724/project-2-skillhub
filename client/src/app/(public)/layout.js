import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import PublicCmsEditLink from "@/components/cms/public/PublicCmsEditLink";

export default function PublicLayout({ children }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <PublicCmsEditLink />
    </>
  );
}
