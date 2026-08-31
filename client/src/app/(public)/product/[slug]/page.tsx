import type { Metadata } from "next";
import {
  fetchProductBySlug,
  fetchVendorBySlug,
} from "@/lib/api";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import PublicPageSectionsSuspense from "@/components/cms/pages/PublicPageSectionsSuspense";
import ResolvedPageSections from "@/components/cms/pages/ResolvedPageSections";
import type { SlugPageProps } from "@/app/types";

function resolveVendorId(
  product: Record<string, unknown>,
  vendor: Record<string, unknown> | null
): string | null {
  if (vendor?._id || vendor?.id) return String(vendor._id || vendor.id);
  const linked = product?.vendor;
  if (!linked) return null;
  if (typeof linked === "object") {
    const v = linked as Record<string, unknown>;
    return String(v._id || v.id || "");
  }
  return String(linked);
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await fetchProductBySlug(slug);
    return {
      title: String(data.name || ""),
      description: String(data.description || data.name || ""),
    };
  } catch {
    return { title: "Product not found" };
  }
}

export default async function ProductDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;

  let product: Record<string, unknown>;
  let vendor: Record<string, unknown> | null = null;

  try {
    const productRes = await fetchProductBySlug(slug);
    product = productRes.data;

    const linkedVendor = product.vendor;
    const vendorSlug =
      typeof linkedVendor === "object" && linkedVendor !== null
        ? (linkedVendor as Record<string, unknown>).slug
        : null;

    if (vendorSlug) {
      const vendorRes = await fetchVendorBySlug(String(vendorSlug)).catch(() => null);
      vendor =
        vendorRes?.data ||
        (typeof linkedVendor === "object" && linkedVendor !== null
          ? (linkedVendor as Record<string, unknown>)
          : null);
    } else if (typeof linkedVendor === "object" && linkedVendor !== null) {
      vendor = linkedVendor as Record<string, unknown>;
    }
  } catch {
    return <NotFoundState entity="Product" />;
  }

  const vendorSlug = vendor?.slug ? String(vendor.slug) : null;
  const vendorName = vendor?.name ? String(vendor.name) : null;
  const vendorId = resolveVendorId(product, vendor);
  const vendorLogo = (vendor?.logoUrl || vendor?.vendorCatalogueLogo || null) as string | null;
  const productId = String(product._id || product.id);

  return (
    <DetailShell
      crumbs={[
        { href: "/products", label: "Products" },
        ...(vendorSlug
          ? [{ href: `/vendor/${vendorSlug}`, label: vendorName || "Vendor" }]
          : []),
        { label: String(product.name) },
      ]}
      title={String(product.name)}
      subtitle={product.description ? String(product.description) : undefined}
      logo={vendorLogo}
      ctaHref="#catalog"
      ctaLabel="Browse courses"
      flush
    >
      <PublicPageSectionsSuspense compact>
        <ResolvedPageSections
          pageKey="product"
          entityId={productId}
          pageContext={{
            entityType: "product",
            entityId: productId,
            entityName: String(product.name),
            vendorId,
            catalogTitle: `${product.name} Courses`,
            catalogSubtitle: vendorName
              ? `Courses for ${product.name} from ${vendorName}.`
              : `Browse courses for ${product.name}.`,
          }}
        />
      </PublicPageSectionsSuspense>
    </DetailShell>
  );
}
