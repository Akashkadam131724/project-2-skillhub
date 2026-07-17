"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchIndustries } from "@/lib/api";
import { createIndustry, deleteIndustry } from "@/lib/entity-cms-api";
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
  description: "",
  status: "active",
  sortOrder: 0,
};

export default function CmsIndustriesPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function load(search = q) {
    setLoading(true);
    try {
      const res = await fetchIndustries({
        limit: 100,
        ...(search.trim() ? { q: search.trim() } : {}),
      });
      setItems(res.data || []);
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
        const res = await fetchIndustries({
          limit: 100,
          ...(q.trim() ? { q: q.trim() } : {}),
        });
        if (!alive) return;
        setItems(res.data || []);
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
      const res = await createIndustry({
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        sortOrder: Number(form.sortOrder) || 0,
      });
      setForm(emptyForm);
      setShowForm(false);
      window.location.href = `/cms/industry/${res.data.slug}`;
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(item) {
    if (!confirm(`Delete industry "${item.name}"?`)) return;
    try {
      await deleteIndustry(item.slug);
      await load();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div>
      <CmsHeading
        title="Industries"
        subtitle="Manage industry taxonomy used on courses and detail pages."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancel" : "Add industry"}
          </button>
        }
      />
      <ErrorBanner error={error} />

      {showForm ? (
        <CmsPanel title="New industry" className="mb-4">
          <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input
                className={inputClass}
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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
              </select>
            </Field>
            <Field label="Sort order">
              <input
                type="number"
                className={inputClass}
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: e.target.value }))
                }
              />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <textarea
                className={`${inputClass} min-h-[72px]`}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </Field>
            <div className="sm:col-span-2">
              <button type="submit" className={btnPrimary} disabled={saving}>
                {saving ? "Creating…" : "Create industry"}
              </button>
            </div>
          </form>
        </CmsPanel>
      ) : null}

      <CmsPanel title="All industries">
        <div className="mb-4">
          <input
            className={inputClass}
            placeholder="Search industries…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : !items.length ? (
          <EmptyState message="No industries yet." />
        ) : (
          <ul className="m-0 list-none divide-y divide-slate-100 p-0 dark:divide-slate-900">
            {items.map((item) => (
              <li
                key={item.slug}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
                      {item.name}
                    </p>
                    <StatusBadge active={item.status === "active"} />
                  </div>
                  <p className="mt-0.5 mb-0 text-xs text-slate-500">
                    /industry/{item.slug}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/cms/industry/${item.slug}`}
                    className={btnSecondary}
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/industry/${item.slug}?cms=true`}
                    className={btnPrimary}
                  >
                    Edit live
                  </Link>
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => onDelete(item)}
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
