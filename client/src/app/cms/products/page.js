"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProducts, fetchVendors } from "@/lib/api";
import { createProduct, deleteProduct } from "@/lib/entity-cms-api";
import {
  CmsHeading,
  CmsPanel,
  StatusBadge,
  Field,
  ErrorBanner,
  EmptyState,
  inputClass,
  btnPrimary,
  btnSecondary,
  btnDanger,
} from "@/components/cms/CmsUi";

const emptyForm = {
  name: "",
  vendor: "",
  description: "",
  category: "general",
  status: "active",
};

export default function CmsProductsPage() {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function load(search = q) {
    setLoading(true);
    try {
      const res = await fetchProducts({
        limit: 50,
        ...(search.trim() ? { q: search.trim() } : {}),
      });
      setProducts(res.data || []);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVendors({ limit: 100, status: "active" })
      .then((res) => setVendors(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      try {
        const res = await fetchProducts({
          limit: 50,
          ...(q.trim() ? { q: q.trim() } : {}),
        });
        if (!alive) return;
        setProducts(res.data || []);
        setError(null);
      } catch (err) {
        if (alive) setError(err);
      } finally {
        if (alive) setLoading(false);
      }
    }, q ? 250 : 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [q]);

  async function onCreate(e) {
    e.preventDefault();
    if (!form.vendor) {
      setError({ message: "Vendor is required" });
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await createProduct({
        name: form.name.trim(),
        vendor: form.vendor,
        description: form.description.trim(),
        category: form.category.trim() || "general",
        status: form.status,
      });
      setForm(emptyForm);
      setShowForm(false);
      window.location.href = `/cms/product/${res.data.slug}`;
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(product) {
    if (!confirm(`Delete product "${product.name}"?`)) return;
    try {
      await deleteProduct(product.slug);
      await load();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div>
      <CmsHeading
        title="Products"
        subtitle="Products belong to a vendor. Edit live to customize page sections."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancel" : "Add product"}
          </button>
        }
      />

      <ErrorBanner error={error} />

      {showForm ? (
        <CmsPanel title="New product" className="mb-4">
          <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-2">
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
                className={`${inputClass} min-h-[80px]`}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </Field>
            <div className="sm:col-span-2">
              <button type="submit" className={btnPrimary} disabled={saving}>
                {saving ? "Creating…" : "Create product"}
              </button>
            </div>
          </form>
        </CmsPanel>
      ) : null}

      <CmsPanel title="All products">
        <div className="mb-4">
          <input
            className={inputClass}
            placeholder="Search products…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : !products.length ? (
          <EmptyState message="No products yet." />
        ) : (
          <ul className="m-0 list-none divide-y divide-slate-100 p-0 dark:divide-slate-900">
            {products.map((product) => (
              <li
                key={product.slug}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
                      {product.name}
                    </p>
                    <StatusBadge active={product.status === "active"} />
                  </div>
                  <p className="mt-0.5 mb-0 text-xs text-slate-500">
                    {product.vendor?.name || "—"} · /product/{product.slug}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/cms/product/${product.slug}`}
                    className={btnSecondary}
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/product/${product.slug}?cms=true`}
                    className={btnPrimary}
                  >
                    Edit live
                  </Link>
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => onDelete(product)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CmsPanel>
    </div>
  );
}
