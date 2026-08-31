"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchSkillingAreaBySlug } from "@/lib/api";
import { updateSkillingArea, deleteSkillingArea } from "@/lib/api/entity-cms-api";
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
import type { SkillingAreaForm, SkillingAreaListItem } from "../../entity-types";
import { useSlugParam } from "@/hooks/useSlugParam";

export default function CmsSkillingAreaEditPage() {
  const areaSlug = useSlugParam();
  const router = useRouter();

  const [item, setItem] = useState<SkillingAreaListItem | null>(null);
  const [form, setForm] = useState<SkillingAreaForm | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setError(null);
    try {
      const res = await fetchSkillingAreaBySlug(areaSlug);
      const data = res.data as SkillingAreaListItem;
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
  }, [areaSlug]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    try {
      await updateSkillingArea(areaSlug, {
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
    if (!confirm(`Delete skilling area "${item?.name}"?`)) return;
    try {
      await deleteSkillingArea(areaSlug);
      router.push("/cms/skilling-areas");
    } catch (err) {
      setError(err);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (!item || !form) {
    return (
      <div>
        <ErrorBanner error={error || { message: "Skilling area not found" }} />
        <Link href="/cms/skilling-areas" className={btnSecondary}>
          Back to skilling areas
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
            <Link href="/cms/skilling-areas" className={btnSecondary}>
              All skilling areas
            </Link>
            <Link
              href={`/cms/skilling-area/edit/${item.slug}`}
              className={btnPrimary}
            >
              Edit live sections
            </Link>
            <StatusBadge active={item.status === "active"} />
          </>
        }
      />
      <ErrorBanner error={error} />
      <CmsPanel title="Skilling area details">
        <form onSubmit={onSave} className="grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <input
              className={inputClass}
              required
              value={form.name}
              onChange={(e) => setForm((f) => f && ({ ...f, name: e.target.value }))}
            />
          </Field>
          <Field label="Status">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm((f) => f && ({ ...f, status: e.target.value }))}
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
                setForm((f) => f && ({ ...f, sortOrder: Number(e.target.value) || 0 }))
              }
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea
              className={`${inputClass} min-h-[80px]`}
              value={form.description}
              onChange={(e) =>
                setForm((f) => f && ({ ...f, description: e.target.value }))
              }
            />
          </Field>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button type="submit" className={btnPrimary} disabled={saving}>
              {saving ? "Saving…" : "Save skilling area"}
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
