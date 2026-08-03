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
import { CmsLiveEditProvider } from "@/components/cms/pages/live/CmsLiveEditContext";

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

    pageTheme = await fetchLiveEditPageTheme("product");
  } catch {
    return <NotFoundState entity="Product" />;
  }

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
      <CmsLiveEditProvider
        pageKey="product"
        entityId={productId}
        entityLabel={product.name}
        initialTheme={pageTheme}
        publicHref={cmsPublicHref("product", product.slug)}
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
      >
        <CmsLivePageSections />
      </CmsLiveEditProvider>
    </DetailShell>
  );
}
