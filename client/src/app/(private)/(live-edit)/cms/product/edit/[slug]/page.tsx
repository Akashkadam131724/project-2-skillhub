import type { Metadata } from "next";
import {
  fetchProductBySlug,
  fetchVendorBySlug,
} from "@/lib/api";
import { fetchLiveEditPageTheme } from "@/lib/cms/live-edit-theme";
import { cmsPublicHref } from "@/lib/cms/cms-edit-routes";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import CmsLivePageSections from "@/components/cms/pages/CmsLivePageSections";
import { CmsLiveEditProvider } from "@/context/CmsLiveEditContext";
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
  return {
    title: `Edit sections · ${slug}`,
    robots: { index: false, follow: false },
  };
}

export default async function CmsProductSectionEditPage({ params }: SlugPageProps) {
  const { slug } = await params;

  let product: Record<string, unknown>;
  let vendor: Record<string, unknown> | null = null;
  let pageTheme = null;

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

    pageTheme = await fetchLiveEditPageTheme("product");
  } catch {
    return <NotFoundState entity="Product" />;
  }

  const vendorName = vendor?.name ? String(vendor.name) : null;
  const vendorId = resolveVendorId(product, vendor);
  const vendorLogo = (vendor?.logoUrl || vendor?.vendorCatalogueLogo || null) as string | null;
  const productId = String(product._id || product.id);

  return (
    <DetailShell
      crumbs={[
        { href: "/cms/products", label: "CMS · Products" },
        { href: `/cms/product/${product.slug}`, label: String(product.name) },
        { label: "Edit sections" },
      ]}
      title={String(product.name)}
      subtitle={product.description ? String(product.description) : undefined}
      logo={vendorLogo}
      ctaHref="#catalog"
      ctaLabel="Browse courses"
      flush
    >
      <CmsLiveEditProvider
        pageKey="product"
        entityId={productId}
        entityLabel={String(product.name)}
        initialTheme={pageTheme}
        publicHref={cmsPublicHref("product", String(product.slug))}
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
      >
        <CmsLivePageSections />
      </CmsLiveEditProvider>
    </DetailShell>
  );
}
