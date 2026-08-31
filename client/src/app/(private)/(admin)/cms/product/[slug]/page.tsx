"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchProductBySlug, fetchVendors } from "@/lib/api";
import { updateProduct, deleteProduct } from "@/lib/api/entity-cms-api";
import {
  CmsHeading,
  CmsPanel,
  StatusBadge,
  Field,
  ErrorBanner,
  inputClass,
  btnPrimary,
  btnSecondary,
  btnDanger,
} from "@/components/cms/admin/CmsUi";
import type { ProductEditForm, ProductRecord, SelectOption } from "../../entity-types";
import { vendorIdFromProduct } from "../../entity-types";
import { useSlugParam } from "../../use-slug-param";

function formFromProduct(data: ProductRecord): ProductEditForm {
  return {
    name: data.name || "",
    vendor: vendorIdFromProduct({ vendor: data.vendor }),
    description: data.description || "",
    category: data.category || "general",
    status: data.status || "draft",
  };
}

export default function CmsProductEditPage() {
  const productSlug = useSlugParam();
  const router = useRouter();

  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [vendors, setVendors] = useState<SelectOption[]>([]);
  const [form, setForm] = useState<ProductEditForm | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setError(null);
    try {
      const [productRes, vendorsRes] = await Promise.all([
        fetchProductBySlug(productSlug),
        fetchVendors({ limit: 100 }),
      ]);
      const data = productRes.data as ProductRecord;
      setProduct(data);
      setVendors((vendorsRes.data || []) as SelectOption[]);
      setForm(formFromProduct(data));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSlug]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    try {
      await updateProduct(productSlug, {
        name: form.name.trim(),
        vendor: form.vendor,
        description: form.description.trim(),
        category: form.category.trim() || "general",
        status: form.status,
      });
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirm(`Delete product "${product?.name}"?`)) return;
    try {
      await deleteProduct(productSlug);
      router.push("/cms/products");
    } catch (err) {
      setError(err);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (!product || !form) {
    return (
      <div>
        <ErrorBanner error={error || { message: "Product not found" }} />
        <Link href="/cms/products" className={btnSecondary}>
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <CmsHeading
        title={product.name}
        subtitle={`Slug: ${product.slug}`}
        actions={
          <>
            <Link href="/cms/products" className={btnSecondary}>
              All products
            </Link>
            <Link href={`/cms/product/edit/${product.slug}`} className={btnPrimary}>
              Edit live sections
            </Link>
            <StatusBadge active={product.status === "active"} />
          </>
        }
      />
      <ErrorBanner error={error} />
      <CmsPanel title="Product details">
        <form onSubmit={onSave} className="grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <input
              className={inputClass}
              required
              value={form.name}
              onChange={(e) =>
                setForm((f: ProductEditForm | null) => f && ({ ...f, name: e.target.value }))
              }
            />
          </Field>
          <Field label="Vendor">
            <select
              className={inputClass}
              required
              value={form.vendor}
              onChange={(e) =>
                setForm((f: ProductEditForm | null) => f && ({ ...f, vendor: e.target.value }))
              }
            >
              <option value="">Select vendor…</option>
              {vendors.map((v) => (
                <option key={v._id || v.id} value={v._id || v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <input
              className={inputClass}
              value={form.category}
              onChange={(e) =>
                setForm((f: ProductEditForm | null) => f && ({ ...f, category: e.target.value }))
              }
            />
          </Field>
          <Field label="Status">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) =>
                setForm((f: ProductEditForm | null) => f && ({ ...f, status: e.target.value }))
              }
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
              <option value="draft">draft</option>
            </select>
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea
              className={`${inputClass} min-h-[100px]`}
              value={form.description}
              onChange={(e) =>
                setForm(
                  (f: ProductEditForm | null) => f && ({ ...f, description: e.target.value }),
                )
              }
            />
          </Field>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button type="submit" className={btnPrimary} disabled={saving}>
              {saving ? "Saving…" : "Save product"}
            </button>
            <button type="button" className={btnDanger} onClick={onDelete}>
              Delete
            </button>
          </div>
        </form>
      </CmsPanel>
    </div>
  );
}
