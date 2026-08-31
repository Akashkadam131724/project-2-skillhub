import type { Metadata } from "next";
import { fetchVendorBySlug } from "@/lib/api";
import { fetchLiveEditPageTheme } from "@/lib/cms/live-edit-theme";
import { cmsPublicHref } from "@/lib/cms/cms-edit-routes";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import CmsLivePageSections from "@/components/cms/pages/CmsLivePageSections";
import { CmsLiveEditProvider } from "@/components/cms/pages/live/CmsLiveEditContext";
import type { SlugPageProps } from "@/app/types";

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Edit sections · ${slug}`,
    robots: { index: false, follow: false },
  };
}

export default async function CmsVendorSectionEditPage({ params }: SlugPageProps) {
  const { slug } = await params;

  let vendor: Record<string, unknown>;
  let pageTheme = null;

  try {
    const vendorRes = await fetchVendorBySlug(slug);
    vendor = vendorRes.data;
    pageTheme = await fetchLiveEditPageTheme("vendor");
  } catch {
    return <NotFoundState entity="Vendor" />;
  }

  const vendorId = String(vendor._id || vendor.id);

  return (
    <DetailShell
      crumbs={[
        { href: "/cms/vendors", label: "CMS · Vendors" },
        { href: `/cms/vendor/${vendor.slug}`, label: String(vendor.name) },
        { label: "Edit sections" },
      ]}
      title={String(vendor.name)}
      subtitle={
        vendor.shortDescription || vendor.description
          ? String(vendor.shortDescription || vendor.description)
          : undefined
      }
      logo={(vendor.logoUrl || vendor.vendorCatalogueLogo) as string | undefined}
      ctaHref="#catalog"
      ctaLabel="Browse courses"
      flush
    >
      <CmsLiveEditProvider
        pageKey="vendor"
        entityId={vendorId}
        entityLabel={String(vendor.name)}
        initialTheme={pageTheme}
        publicHref={cmsPublicHref("vendor", String(vendor.slug))}
        pageContext={{
          entityType: "vendor",
          entityId: vendorId,
          entityName: String(vendor.name),
          catalogTitle: `${vendor.name} Courses`,
          catalogSubtitle: `Browse training courses from ${vendor.name}.`,
        }}
      >
        <CmsLivePageSections />
      </CmsLiveEditProvider>
    </DetailShell>
  );
}
