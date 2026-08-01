import { fetchVendorBySlug } from "@/lib/api";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import PublicPageSectionsSuspense from "@/components/cms/pages/PublicPageSectionsSuspense";
import ResolvedPageSections from "@/components/cms/pages/ResolvedPageSections";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const { data } = await fetchVendorBySlug(slug);
    return {
      title: `${data.name}`,
      description: data.shortDescription || data.description || data.name,
    };
  } catch {
    return { title: "Vendor not found" };
  }
}

export default async function VendorDetailPage({ params }) {
  const { slug } = await params;

  let vendor;

  try {
    const vendorRes = await fetchVendorBySlug(slug);
    vendor = vendorRes.data;
  } catch {
    return <NotFoundState entity="Vendor" />;
  }

  const vendorId = String(vendor._id || vendor.id);

  return (
    <DetailShell
      crumbs={[
        { href: "/vendors", label: "Vendors" },
        { label: vendor.name },
      ]}
      title={vendor.name}
      subtitle={vendor.shortDescription || vendor.description}
      logo={vendor.logoUrl || vendor.vendorCatalogueLogo}
      ctaHref="#catalog"
      ctaLabel="Browse courses"
      flush
    >
      <PublicPageSectionsSuspense compact>
        <ResolvedPageSections
          pageKey="vendor"
          entityId={vendorId}
          pageContext={{
            entityType: "vendor",
            entityId: vendorId,
            entityName: vendor.name,
            catalogTitle: `${vendor.name} Courses`,
            catalogSubtitle: `Browse training courses from ${vendor.name}.`,
          }}
        />
      </PublicPageSectionsSuspense>
    </DetailShell>
  );
}
