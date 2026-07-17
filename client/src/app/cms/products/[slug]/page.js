"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchProductBySlug, fetchVendors } from "@/lib/api";
import { updateProduct, deleteProduct } from "@/lib/entity-cms-api";
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
} from "@/components/cms/CmsUi";

export default function CmsProductEditPage() {
  const { slug } = useParams();
  const router = useRouter();
  const productSlug = String(slug || "");

  const [product, setProduct] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setError(null);
    try {
      const [productRes, vendorsRes] = await Promise.all([
        fetchProductBySlug(productSlug),
        fetchVendors({ limit: 100 }),
      ]);
      const data = productRes.data;
      setProduct(data);
      setVendors(vendorsRes.data || []);
      const vendorId =
        typeof data.vendor === "object"
          ? String(data.vendor._id || data.vendor.id)
          : String(data.vendor || "");
      setForm({
        name: data.name || "",
        vendor: vendorId,
        description: data.description || "",
        category: data.category || "general",
        status: data.status || "draft",
      });
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

  async function onSave(e) {
    e.preventDefault();
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
            <Link href={`/product/${product.slug}?cms=true`} className={btnPrimary}>
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
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </Field>
          <Field label="Vendor">
            <select
              className={inputClass}
              required
              value={form.vendor}
              onChange={(e) => setForm((f) => ({ ...f, vendor: e.target.value }))}
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
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            />
          </Field>
          <Field label="Status">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
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
                setForm((f) => ({ ...f, description: e.target.value }))
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
