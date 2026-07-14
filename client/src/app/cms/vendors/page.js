"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchVendors } from "@/lib/api";
import { createVendor, deleteVendor } from "@/lib/entity-cms-api";
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
  email: "",
  phone: "",
  status: "active",
  shortDescription: "",
  description: "",
  logoUrl: "",
};

export default function CmsVendorsPage() {
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
      const res = await fetchVendors({
        limit: 50,
        ...(search.trim() ? { q: search.trim() } : {}),
      });
      setVendors(res.data || []);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      try {
        const res = await fetchVendors({
          limit: 50,
          ...(q.trim() ? { q: q.trim() } : {}),
        });
        if (!alive) return;
        setVendors(res.data || []);
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
    setSaving(true);
    setError(null);
    try {
      const res = await createVendor({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        status: form.status,
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        logoUrl: form.logoUrl.trim() || null,
      });
      setForm(emptyForm);
      setShowForm(false);
      await load();
      window.location.href = `/cms/vendors/${res.data.slug}`;
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(vendor) {
    if (!confirm(`Delete vendor "${vendor.name}"?`)) return;
    try {
      await deleteVendor(vendor.slug);
      await load();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div>
      <CmsHeading
        title="Vendors"
        subtitle="Add and edit vendors. Use Edit live to customize page sections for one vendor."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancel" : "Add vendor"}
          </button>
        }
      />

      <ErrorBanner error={error} />

      {showForm ? (
        <CmsPanel title="New vendor" className="mb-4">
          <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input
                className={inputClass}
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>
            <Field label="Email">
              <input
                className={inputClass}
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </Field>
            <Field label="Phone" hint="10-digit Indian number">
              <input
                className={inputClass}
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
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
                <option value="pending">pending</option>
              </select>
            </Field>
            <Field label="Short description" className="sm:col-span-2">
              <input
                className={inputClass}
                value={form.shortDescription}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shortDescription: e.target.value }))
                }
              />
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
            <Field label="Logo URL" className="sm:col-span-2">
              <input
                className={inputClass}
                value={form.logoUrl}
                onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
                placeholder="https://… or /uploads/…"
              />
            </Field>
            <div className="sm:col-span-2">
              <button type="submit" className={btnPrimary} disabled={saving}>
                {saving ? "Creating…" : "Create vendor"}
              </button>
            </div>
          </form>
        </CmsPanel>
      ) : null}

      <CmsPanel title="All vendors">
        <div className="mb-4">
          <input
            className={inputClass}
            placeholder="Search vendors…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : !vendors.length ? (
          <EmptyState message="No vendors yet. Add one above." />
        ) : (
          <ul className="m-0 list-none divide-y divide-slate-100 p-0 dark:divide-slate-900">
            {vendors.map((vendor) => (
              <li
                key={vendor.slug}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
                      {vendor.name}
                    </p>
                    <StatusBadge active={vendor.status === "active"} />
                  </div>
                  <p className="mt-0.5 mb-0 truncate text-xs text-slate-500">
                    {vendor.email} · /vendors/{vendor.slug}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/cms/vendors/${vendor.slug}`} className={btnSecondary}>
                    Edit
                  </Link>
                  <Link
                    href={`/vendors/${vendor.slug}?cms=true`}
                    className={btnPrimary}
                  >
                    Edit live
                  </Link>
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => onDelete(vendor)}
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
