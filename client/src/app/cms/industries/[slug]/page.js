"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchIndustryBySlug } from "@/lib/api";
import { updateIndustry, deleteIndustry } from "@/lib/entity-cms-api";
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

export default function CmsIndustryEditPage() {
  const { slug } = useParams();
  const router = useRouter();
  const industrySlug = String(slug || "");

  const [item, setItem] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setError(null);
    try {
      const res = await fetchIndustryBySlug(industrySlug);
      const data = res.data;
      setItem(data);
      setForm({
        name: data.name || "",
        description: data.description || "",
        status: data.status || "active",
        sortOrder: data.sortOrder ?? 0,
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
  }, [industrySlug]);

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateIndustry(industrySlug, {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        sortOrder: Number(form.sortOrder) || 0,
      });
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirm(`Delete industry "${item?.name}"?`)) return;
    try {
      await deleteIndustry(industrySlug);
      router.push("/cms/industries");
    } catch (err) {
      setError(err);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (!item || !form) {
    return (
      <div>
        <ErrorBanner error={error || { message: "Industry not found" }} />
        <Link href="/cms/industries" className={btnSecondary}>
          Back to industries
        </Link>
      </div>
    );
  }

  return (
    <div>
      <CmsHeading
        title={item.name}
        subtitle={`Slug: ${item.slug}`}
        actions={
          <>
            <Link href="/cms/industries" className={btnSecondary}>
              All industries
            </Link>
            <Link href={`/industries/${item.slug}?cms=true`} className={btnPrimary}>
              Edit live sections
            </Link>
            <StatusBadge active={item.status === "active"} />
          </>
        }
      />
      <ErrorBanner error={error} />
      <CmsPanel title="Industry details">
        <form onSubmit={onSave} className="grid gap-3 sm:grid-cols-2">
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
              className={`${inputClass} min-h-[80px]`}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </Field>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button type="submit" className={btnPrimary} disabled={saving}>
              {saving ? "Saving…" : "Save industry"}
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
