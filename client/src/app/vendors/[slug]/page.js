import { Suspense } from "react";
import { fetchVendorBySlug } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/cms-api";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import CmsLivePageSections from "@/components/cms/CmsLivePageSections";

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
  let cmsSections = [];

  try {
    const vendorRes = await fetchVendorBySlug(slug);
    vendor = vendorRes.data;
    const vendorId = String(vendor._id || vendor.id);
    const sectionsRes = await getPageSectionsResolved("vendor", vendorId).catch(
      () => ({ sections: [] })
    );
    cmsSections = sectionsRes.sections || [];
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
      <Suspense fallback={null}>
        <CmsLivePageSections
          pageKey="vendor"
          entityId={vendorId}
          entityLabel={vendor.name}
          initialSections={cmsSections}
          pageContext={{
            entityType: "vendor",
            entityId: vendorId,
            entityName: vendor.name,
            catalogTitle: `${vendor.name} Courses`,
            catalogSubtitle: `Browse training courses from ${vendor.name}.`,
          }}
        />
      </Suspense>
    </DetailShell>
  );
}
