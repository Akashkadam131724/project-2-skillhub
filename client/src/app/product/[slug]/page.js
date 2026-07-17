import { Suspense } from "react";
import {
  fetchProductBySlug,
  fetchVendorBySlug,
} from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/cms-api";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import CmsLivePageSections from "@/components/cms/CmsLivePageSections";

function resolveVendorId(product, vendor) {
  if (vendor?._id || vendor?.id) return String(vendor._id || vendor.id);
  const linked = product?.vendor;
  if (!linked) return null;
  if (typeof linked === "object") return String(linked._id || linked.id || "");
  return String(linked);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const { data } = await fetchProductBySlug(slug);
    return {
      title: `${data.name}`,
      description: data.description || data.name,
    };
  } catch {
    return { title: "Product not found" };
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;

  let product;
  let vendor = null;
  let cmsSections = [];
  let pageTheme = null;

  try {
    const productRes = await fetchProductBySlug(slug);
    product = productRes.data;

    const linkedVendor = product.vendor;
    const vendorSlug =
      typeof linkedVendor === "object" ? linkedVendor?.slug : null;

    if (vendorSlug) {
      const vendorRes = await fetchVendorBySlug(vendorSlug).catch(() => null);
      vendor =
        vendorRes?.data ||
        (typeof linkedVendor === "object" ? linkedVendor : null);
    } else if (typeof linkedVendor === "object") {
      vendor = linkedVendor;
    }

    const productId = String(product._id || product.id);
    const sectionsRes = await getPageSectionsResolved(
      "product",
      productId
    ).catch(() => ({ sections: [] }));
    cmsSections = sectionsRes.sections || [];
    pageTheme = sectionsRes.page?.theme || null;
  } catch {
    return <NotFoundState entity="Product" />;
  }

  const vendorSlug = vendor?.slug || null;
  const vendorName = vendor?.name || null;
  const vendorId = resolveVendorId(product, vendor);
  const vendorLogo = vendor?.logoUrl || vendor?.vendorCatalogueLogo || null;
  const productId = String(product._id || product.id);

  return (
    <DetailShell
      crumbs={[
        { href: "/products", label: "Products" },
        ...(vendorSlug
          ? [{ href: `/vendor/${vendorSlug}`, label: vendorName || "Vendor" }]
          : []),
        { label: product.name },
      ]}
      title={product.name}
      subtitle={product.description}
      logo={vendorLogo}
      ctaHref="#catalog"
      ctaLabel="Browse courses"
      flush
    >
      <Suspense fallback={null}>
        <CmsLivePageSections
          pageKey="product"
          entityId={productId}
          entityLabel={product.name}
          initialSections={cmsSections}
          initialTheme={pageTheme}
          pageContext={{
            entityType: "product",
            entityId: productId,
            entityName: product.name,
            vendorId,
            catalogTitle: `${product.name} Courses`,
            catalogSubtitle: vendorName
              ? `Courses for ${product.name} from ${vendorName}.`
              : `Browse courses for ${product.name}.`,
          }}
        />
      </Suspense>
    </DetailShell>
  );
}
