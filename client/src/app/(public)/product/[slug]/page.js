import {
  fetchProductBySlug,
  fetchVendorBySlug,
} from "@/lib/api";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import PublicPageSectionsSuspense from "@/components/cms/PublicPageSectionsSuspense";
import ResolvedPageSections from "@/components/cms/ResolvedPageSections";
import { isrFetchOptions } from "@/lib/isr";

export const revalidate = 60;

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
    const { data } = await fetchProductBySlug(
      slug,
      isrFetchOptions({ tags: ["product", `product:${slug}`] })
    );
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

  try {
    const productRes = await fetchProductBySlug(
      slug,
      isrFetchOptions({ tags: ["product", `product:${slug}`] })
    );
    product = productRes.data;

    const linkedVendor = product.vendor;
    const vendorSlug =
      typeof linkedVendor === "object" ? linkedVendor?.slug : null;

    if (vendorSlug) {
      const vendorRes = await fetchVendorBySlug(
        vendorSlug,
        isrFetchOptions({ tags: ["vendor", `vendor:${vendorSlug}`] })
      ).catch(() => null);
      vendor =
        vendorRes?.data ||
        (typeof linkedVendor === "object" ? linkedVendor : null);
    } else if (typeof linkedVendor === "object") {
      vendor = linkedVendor;
    }
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
      <PublicPageSectionsSuspense compact>
        <ResolvedPageSections
          pageKey="product"
          entityId={productId}
          cacheTags={[`product:${slug}`]}
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
      </PublicPageSectionsSuspense>
    </DetailShell>
  );
}
