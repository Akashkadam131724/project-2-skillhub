"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchVendorBySlug } from "@/lib/api";
import { updateVendor, deleteVendor } from "@/lib/api/entity-cms-api";
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
import type { VendorEditForm, VendorRecord } from "../../entity-types";
import { useSlugParam } from "../../use-slug-param";

function formFromVendor(data: VendorRecord): VendorEditForm {
  return {
    name: data.name || "",
    email: (data.email as string) || "",
    phone: data.phone || "",
    status: data.status || "active",
    shortDescription: data.shortDescription || "",
    description: data.description || "",
    overviewTitle: data.overviewTitle || "",
    overview: data.overview || "",
    logoUrl: data.logoUrl || "",
    vendorCatalogueLogo: data.vendorCatalogueLogo || "",
  };
}

export default function CmsVendorEditPage() {
  const vendorSlug = useSlugParam();
  const router = useRouter();

  const [vendor, setVendor] = useState<VendorRecord | null>(null);
  const [form, setForm] = useState<VendorEditForm | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setError(null);
    try {
      const res = await fetchVendorBySlug(vendorSlug);
      const data = res.data as VendorRecord;
      setVendor(data);
      setForm(formFromVendor(data));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorSlug]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    try {
      await updateVendor(vendorSlug, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        status: form.status,
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        overviewTitle: form.overviewTitle.trim(),
        overview: form.overview.trim(),
        logoUrl: form.logoUrl.trim() || null,
        vendorCatalogueLogo: form.vendorCatalogueLogo.trim() || null,
      });
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirm(`Delete vendor "${vendor?.name}"?`)) return;
    try {
      await deleteVendor(vendorSlug);
      router.push("/cms/vendors");
    } catch (err) {
      setError(err);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (!vendor || !form) {
    return (
      <div>
        <ErrorBanner error={error || { message: "Vendor not found" }} />
        <Link href="/cms/vendors" className={btnSecondary}>
          Back to vendors
        </Link>
      </div>
    );
  }

  return (
    <div>
      <CmsHeading
        title={vendor.name}
        subtitle={`Slug: ${vendor.slug}`}
        actions={
          <>
            <Link href="/cms/vendors" className={btnSecondary}>
              All vendors
            </Link>
            <Link href={`/cms/vendor/edit/${vendor.slug}`} className={btnPrimary}>
              Edit live sections
            </Link>
            <StatusBadge active={vendor.status === "active"} />
          </>
        }
      />

      <ErrorBanner error={error} />

      <CmsPanel title="Vendor details">
        <form onSubmit={onSave} className="grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <input
              className={inputClass}
              required
              value={form.name}
              onChange={(e) => setForm((f) => f && ({ ...f, name: e.target.value }))}
            />
          </Field>
          <Field label="Email">
            <input
              className={inputClass}
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => f && ({ ...f, email: e.target.value }))}
            />
          </Field>
          <Field label="Phone">
            <input
              className={inputClass}
              value={form.phone}
              onChange={(e) => setForm((f) => f && ({ ...f, phone: e.target.value }))}
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
              <option value="pending">pending</option>
            </select>
          </Field>
          <Field label="Short description" className="sm:col-span-2">
            <input
              className={inputClass}
              value={form.shortDescription}
              onChange={(e) =>
                setForm((f) => f && ({ ...f, shortDescription: e.target.value }))
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
          <Field label="Overview title">
            <input
              className={inputClass}
              value={form.overviewTitle}
              onChange={(e) =>
                setForm((f) => f && ({ ...f, overviewTitle: e.target.value }))
              }
            />
          </Field>
          <Field label="Logo URL">
            <input
              className={inputClass}
              value={form.logoUrl}
              onChange={(e) => setForm((f) => f && ({ ...f, logoUrl: e.target.value }))}
            />
          </Field>
          <Field label="Overview" className="sm:col-span-2">
            <textarea
              className={`${inputClass} min-h-[100px]`}
              value={form.overview}
              onChange={(e) => setForm((f) => f && ({ ...f, overview: e.target.value }))}
            />
          </Field>
          <Field label="Catalogue logo URL" className="sm:col-span-2">
            <input
              className={inputClass}
              value={form.vendorCatalogueLogo}
              onChange={(e) =>
                setForm((f) => f && ({ ...f, vendorCatalogueLogo: e.target.value }))
              }
            />
          </Field>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button type="submit" className={btnPrimary} disabled={saving}>
              {saving ? "Saving…" : "Save vendor"}
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
