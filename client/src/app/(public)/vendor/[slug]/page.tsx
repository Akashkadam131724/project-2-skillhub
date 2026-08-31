import type { Metadata } from "next";
import { fetchVendorBySlug } from "@/lib/api";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import PublicPageSectionsSuspense from "@/components/cms/pages/PublicPageSectionsSuspense";
import ResolvedPageSections from "@/components/cms/pages/ResolvedPageSections";
import type { SlugPageProps } from "@/app/types";

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await fetchVendorBySlug(slug);
    return {
      title: String(data.name || ""),
      description: String(
        data.shortDescription || data.description || data.name || ""
      ),
    };
  } catch {
    return { title: "Vendor not found" };
  }
}

export default async function VendorDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;

  let vendor: Record<string, unknown>;

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
        { label: String(vendor.name) },
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
      <PublicPageSectionsSuspense compact>
        <ResolvedPageSections
          pageKey="vendor"
          entityId={vendorId}
          pageContext={{
            entityType: "vendor",
            entityId: vendorId,
            entityName: String(vendor.name),
            catalogTitle: `${vendor.name} Courses`,
            catalogSubtitle: `Browse training courses from ${vendor.name}.`,
          }}
        />
      </PublicPageSectionsSuspense>
    </DetailShell>
  );
}
