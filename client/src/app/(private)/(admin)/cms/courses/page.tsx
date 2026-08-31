"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  fetchCourses,
  fetchProducts,
  fetchIndustries,
  fetchSkillingAreas,
  fetchSkillLevels,
} from "@/lib/api";
import {
  createCourse,
  deleteCourse,
  restoreCourse,
  updateCourse,
} from "@/lib/api/entity-cms-api";
import { cmsEditHref, cmsPublicHref } from "@/lib/cms/cms-edit-routes";
import { nextToggleStatus } from "@/lib/cms/cms-list-filters";
import { useCmsEntityList } from "@/hooks/useCmsEntityList";
import CmsEntityListPanel from "@/components/cms/admin/CmsEntityListPanel";
import CmsEntityRowActions, {
  CmsEntityStatusBadge,
} from "@/components/cms/admin/CmsEntityRowActions";
import {
  cmsEntityListMetaClass,
  cmsEntityListPrimaryClass,
  cmsEntityListRowClass,
  cmsEntityListTitleClass,
} from "@/components/cms/admin/cms-entity-list-row";
import {
  CmsHeading,
  CmsPanel,
  Field,
  ErrorBanner,
  inputClass,
  btnPrimary,
} from "@/components/cms/admin/CmsUi";
import type { CmsEntityListItem } from "@/components/cms/admin/types";
import type {
  ApiRecord,
  CourseCreateForm,
  CourseListItem,
  SelectOption,
} from "../entity-types";

const emptyForm: CourseCreateForm = {
  name: "",
  product: "",
  description: "",
  status: "active",
  skillLevel: "",
  industries: [],
  skillingAreas: [],
};

function productLabel(product: CourseListItem["product"]): string {
  if (!product || typeof product !== "object") return "—";
  return String((product as ApiRecord).name || "—");
}

export default function CmsCoursesPage() {
  const {
    filter,
    setFilter,
    page,
    setPage,
    limit,
    totalPages,
    items: courses,
    total,
    loading,
    error,
    setError,
    onSearchChange,
    reload,
  } = useCmsEntityList<CourseListItem>(fetchCourses);
  const [products, setProducts] = useState<SelectOption[]>([]);
  const [industries, setIndustries] = useState<SelectOption[]>([]);
  const [areas, setAreas] = useState<SelectOption[]>([]);
  const [levels, setLevels] = useState<SelectOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CourseCreateForm>(emptyForm);

  useEffect(() => {
    Promise.all([
      fetchProducts({ limit: 100, status: "active" }),
      fetchIndustries({ limit: 100, status: "active" }),
      fetchSkillingAreas({ limit: 100, status: "active" }),
      fetchSkillLevels({ limit: 50 }).catch(() => ({ data: [] })),
    ])
      .then(([p, i, a, l]) => {
        setProducts((p.data || []) as SelectOption[]);
        setIndustries((i.data || []) as SelectOption[]);
        setAreas((a.data || []) as SelectOption[]);
        setLevels((l.data || []) as SelectOption[]);
      })
      .catch(() => {});
  }, []);

  function toggleMulti(key: "industries" | "skillingAreas", id: string) {
    setForm((f) => {
      const set = new Set(f[key]);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...f, [key]: [...set] };
    });
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!form.product) {
      setError({ message: "Product is required" });
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await createCourse({
        name: form.name.trim(),
        product: form.product,
        description: form.description.trim(),
        status: form.status,
        skillLevel: form.skillLevel || null,
        industries: form.industries,
        skillingAreas: form.skillingAreas,
      });
      setForm(emptyForm);
      setShowForm(false);
      window.location.href = `/cms/course/${(res.data as CourseListItem).slug}`;
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onToggleStatus(item: CmsEntityListItem) {
    const course = item as CourseListItem;
    try {
      await updateCourse(String(course.slug), {
        status: nextToggleStatus(course.status),
      });
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  async function onDelete(item: CmsEntityListItem) {
    const course = item as CourseListItem;
    if (!confirm(`Delete course "${course.name}"?`)) return;
    try {
      await deleteCourse(String(course.slug));
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  async function onRestore(item: CmsEntityListItem) {
    const course = item as CourseListItem;
    try {
      await restoreCourse(String(course.slug));
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div className="w-full">
      <CmsHeading
        title="Courses"
        subtitle="Courses belong to a product. Map industries and skilling areas here."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancel" : "Add course"}
          </button>
        }
      />
      <ErrorBanner error={error} />

      {showForm ? (
        <CmsPanel title="New course" className="mb-4">
          <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input
                className={inputClass}
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>
            <Field label="Product">
              <select
                className={inputClass}
                required
                value={form.product}
                onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}
              >
                <option value="">Select product…</option>
                {products.map((p) => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
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
            <Field label="Skill level">
              <select
                className={inputClass}
                value={form.skillLevel}
                onChange={(e) =>
                  setForm((f) => ({ ...f, skillLevel: e.target.value }))
                }
              >
                <option value="">None</option>
                {levels.map((l) => (
                  <option key={l._id || l.id} value={l._id || l.id}>
                    {l.name}
                  </option>
                ))}
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
            <Field label="Industries" className="sm:col-span-2">
              <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto rounded-lg border border-slate-200 p-2 dark:border-slate-800">
                {industries.map((i) => {
                  const id = String(i._id || i.id);
                  const on = form.industries.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleMulti("industries", id)}
                      className={`rounded-md px-2 py-1 text-xs font-medium ${
                        on
                          ? "bg-brand text-white"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {i.name}
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="Skilling areas" className="sm:col-span-2">
              <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto rounded-lg border border-slate-200 p-2 dark:border-slate-800">
                {areas.map((a) => {
                  const id = String(a._id || a.id);
                  const on = form.skillingAreas.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleMulti("skillingAreas", id)}
                      className={`rounded-md px-2 py-1 text-xs font-medium ${
                        on
                          ? "bg-brand text-white"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {a.name}
                    </button>
                  );
                })}
              </div>
            </Field>
            <div className="sm:col-span-2">
              <button type="submit" className={btnPrimary} disabled={saving}>
                {saving ? "Creating…" : "Create course"}
              </button>
            </div>
          </form>
        </CmsPanel>
      ) : null}

      <CmsEntityListPanel
        title="All courses"
        items={courses}
        loading={loading}
        total={total ?? 0}
        page={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={setPage}
        onSearchChange={onSearchChange}
        filter={filter}
        onFilterChange={setFilter}
        searchPlaceholder="Search courses…"
        renderItem={(course) => (
          <li key={course.slug} className={cmsEntityListRowClass()}>
            <div className={cmsEntityListPrimaryClass()}>
              <div className="flex flex-wrap items-center gap-2">
                <p className={cmsEntityListTitleClass()}>{course.name}</p>
                <CmsEntityStatusBadge item={course} />
              </div>
              <p className={cmsEntityListMetaClass()}>
                {productLabel(course.product)} · /course/{course.slug}
              </p>
            </div>
            <CmsEntityRowActions
              item={course}
              editHref={`/cms/course/${course.slug}`}
              publicHref={cmsPublicHref("course", String(course.slug))}
              liveEditHref={cmsEditHref("course", String(course.slug))}
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
