import { Suspense } from "react";
import {
  fetchProductBySlug,
  fetchVendorBySlug,
} from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/cms-api";
import {
  cmsEditExitHref,
  cmsPublicHref,
} from "@/lib/cms-edit-routes";
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
  return {
    title: `Edit sections · ${slug}`,
    robots: { index: false, follow: false },
  };
}

export default async function CmsProductSectionEditPage({ params }) {
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
        { href: "/cms/products", label: "CMS · Products" },
        { href: `/cms/product/${product.slug}`, label: product.name },
        { label: "Edit sections" },
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
          cmsMode
          publicHref={cmsPublicHref("product", product.slug)}
          exitHref={cmsEditExitHref("product", product.slug)}
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
