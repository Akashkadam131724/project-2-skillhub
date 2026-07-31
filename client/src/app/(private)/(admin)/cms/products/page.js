"use client";

import { useEffect, useState } from "react";
import { fetchProducts, fetchVendors } from "@/lib/api";
import {
  createProduct,
  deleteProduct,
  restoreProduct,
  updateProduct,
} from "@/lib/entity-cms-api";
import { cmsEditHref, cmsPublicHref } from "@/lib/cms-edit-routes";
import { nextToggleStatus } from "@/lib/cms-list-filters";
import { useCmsEntityList } from "@/hooks/useCmsEntityList";
import CmsEntityListPanel from "@/components/cms/CmsEntityListPanel";
import CmsEntityRowActions, {
  CmsEntityStatusBadge,
} from "@/components/cms/CmsEntityRowActions";
import {
  cmsEntityListMetaClass,
  cmsEntityListPrimaryClass,
  cmsEntityListRowClass,
  cmsEntityListTitleClass,
} from "@/components/cms/cms-entity-list-row";
import {
  CmsHeading,
  CmsPanel,
  Field,
  ErrorBanner,
  inputClass,
  btnPrimary,
} from "@/components/cms/CmsUi";

const emptyForm = {
  name: "",
  vendor: "",
  description: "",
  category: "general",
  status: "active",
};

export default function CmsProductsPage() {
  const {
    filter,
    setFilter,
    page,
    setPage,
    limit,
    totalPages,
    items: products,
    total,
    loading,
    error,
    setError,
    onSearchChange,
    reload,
  } = useCmsEntityList(fetchProducts);
  const [vendors, setVendors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchVendors({ limit: 100, status: "active" })
      .then((res) => setVendors(res.data || []))
      .catch(() => {});
  }, []);

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

  async function onToggleStatus(product) {
    try {
      await updateProduct(product.slug, {
        status: nextToggleStatus(product.status),
      });
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  async function onDelete(product) {
    if (!confirm(`Delete product "${product.name}"?`)) return;
    try {
      await deleteProduct(product.slug);
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  async function onRestore(product) {
    try {
      await restoreProduct(product.slug);
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div className="w-full">
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

      <CmsEntityListPanel
        title="All products"
        items={products}
        loading={loading}
        total={total}
        page={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={setPage}
        onSearchChange={onSearchChange}
        filter={filter}
        onFilterChange={setFilter}
        searchPlaceholder="Search products…"
        renderItem={(product) => (
          <li key={product.slug} className={cmsEntityListRowClass()}>
            <div className={cmsEntityListPrimaryClass()}>
              <div className="flex flex-wrap items-center gap-2">
                <p className={cmsEntityListTitleClass()}>{product.name}</p>
                <CmsEntityStatusBadge item={product} />
              </div>
              <p className={cmsEntityListMetaClass()}>
                {product.vendor?.name || "—"} · /product/{product.slug}
              </p>
            </div>
            <CmsEntityRowActions
              item={product}
              editHref={`/cms/product/${product.slug}`}
              publicHref={cmsPublicHref("product", product.slug)}
              liveEditHref={cmsEditHref("product", product.slug)}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              onRestore={onRestore}
            />
          </li>
        )}
      />
    </div>
  );
}
