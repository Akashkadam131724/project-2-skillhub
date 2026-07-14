"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createPage,
  deletePage,
  listPages,
  setPageStatus,
} from "@/lib/cms-api";
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

const ENTITY_TYPES = [
  { value: "", label: "None (static)" },
  { value: "product", label: "product" },
  { value: "course", label: "course" },
  { value: "vendor", label: "vendor" },
  { value: "industry", label: "industry" },
  { value: "skilling_area", label: "skilling_area" },
  { value: "content", label: "content" },
];

const emptyForm = {
  key: "",
  name: "",
  description: "",
  entity_type: "",
  status: true,
  is_sort_disabled: true,
};

export default function CmsPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setError(null);
    try {
      const res = await listPages();
      setPages(res.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await listPages();
        if (!alive) return;
        setPages(res.data || []);
      } catch (err) {
        if (alive) setError(err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = {
        ...form,
        key: form.key.trim().toLowerCase(),
        entity_type: form.entity_type || null,
      };
      const res = await createPage(body);
      setForm(emptyForm);
      setShowForm(false);
      router.push(`/cms/pages/${res.data.key}`);
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(page) {
    try {
      await setPageStatus(page.key, !page.status);
      await load();
    } catch (err) {
      setError(err);
    }
  }

  async function onDelete(page) {
    if (!confirm(`Delete page "${page.key}"?`)) return;
    try {
      await deletePage(page.key);
      await load();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div>
      <CmsHeading
        title="Manage sections for templates / pages"
        subtitle="Assign, sort, and configure content sections on each page template."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancel" : "New page"}
          </button>
        }
      />

      <ErrorBanner error={error} />

      {showForm ? (
        <CmsPanel title="Create page" className="mb-4">
          <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-2">
            <Field label="Key" hint="snake_case, e.g. product">
              <input
                className={inputClass}
                required
                pattern="[a-z0-9]+(_[a-z0-9]+)*"
                value={form.key}
                onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
              />
            </Field>
            <Field label="Name">
              <input
                className={inputClass}
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>
            <Field label="Entity type">
              <select
                className={inputClass}
                value={form.entity_type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, entity_type: e.target.value }))
                }
              >
                {ENTITY_TYPES.map((t) => (
                  <option key={t.value || "none"} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Description">
              <input
                className={inputClass}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </Field>
            <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700 sm:col-span-2 dark:text-slate-200">
              <input
                type="checkbox"
                className="mt-1"
                checked={form.is_sort_disabled !== false}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    is_sort_disabled: e.target.checked,
                  }))
                }
              />
              <span>
                <span className="font-semibold">Disable page-level sort</span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  Default on — sort only on the template, not per entity page.
                </span>
              </span>
            </label>
            <div className="sm:col-span-2">
              <button type="submit" className={btnPrimary} disabled={saving}>
                {saving ? "Creating…" : "Create page"}
              </button>
            </div>
          </form>
        </CmsPanel>
      ) : null}

      <CmsPanel title="All pages">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : !pages.length ? (
          <EmptyState message="No pages yet. Create one to get started." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase dark:border-slate-800">
                  <th className="py-2 pr-3 font-semibold">Name</th>
                  <th className="py-2 pr-3 font-semibold">Key</th>
                  <th className="py-2 pr-3 font-semibold">Entity</th>
                  <th className="py-2 pr-3 font-semibold">Page sort</th>
                  <th className="py-2 pr-3 font-semibold">Status</th>
                  <th className="py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr
                    key={page.key}
                    className="border-b border-slate-100 dark:border-slate-900"
                  >
                    <td className="py-3 pr-3">
                      <Link
                        href={`/cms/pages/${page.key}`}
                        className="font-semibold text-slate-900 no-underline hover:text-brand dark:text-white"
                      >
                        {page.name}
                      </Link>
                    </td>
                    <td className="py-3 pr-3 text-slate-500">{page.key}</td>
                    <td className="py-3 pr-3 text-slate-500">
                      {page.entity_type || "—"}
                    </td>
                    <td className="py-3 pr-3 text-slate-500">
                      {page.is_sort_disabled !== false ? "Template only" : "Allowed"}
                    </td>
                    <td className="py-3 pr-3">
                      <StatusBadge active={page.status} />
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/cms/pages/${page.key}`}
                          className={btnSecondary}
                        >
                          Manage sections
                        </Link>
                        <button
                          type="button"
                          className={btnSecondary}
                          onClick={() => toggleStatus(page)}
                        >
                          {page.status ? "Disable" : "Enable"}
                        </button>
                        <button
                          type="button"
                          className={btnDanger}
                          onClick={() => onDelete(page)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CmsPanel>
    </div>
  );
}
