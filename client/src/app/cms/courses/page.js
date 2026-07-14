"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchCourses,
  fetchProducts,
  fetchIndustries,
  fetchSkillingAreas,
  fetchSkillLevels,
} from "@/lib/api";
import { createCourse, deleteCourse } from "@/lib/entity-cms-api";
import {
  CmsHeading,
  CmsPanel,
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
  product: "",
  description: "",
  skillLevel: "",
  industries: [],
  skillingAreas: [],
};

export default function CmsCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [products, setProducts] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [areas, setAreas] = useState([]);
  const [levels, setLevels] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    Promise.all([
      fetchProducts({ limit: 100 }),
      fetchIndustries({ limit: 100 }),
      fetchSkillingAreas({ limit: 100 }),
      fetchSkillLevels({ limit: 50 }).catch(() => ({ data: [] })),
    ])
      .then(([p, i, a, l]) => {
        setProducts(p.data || []);
        setIndustries(i.data || []);
        setAreas(a.data || []);
        setLevels(l.data || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      try {
        const res = await fetchCourses({
          limit: 50,
          ...(q.trim() ? { q: q.trim() } : {}),
        });
        if (!alive) return;
        setCourses(res.data || []);
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

  function toggleMulti(key, id) {
    setForm((f) => {
      const set = new Set(f[key]);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...f, [key]: [...set] };
    });
  }

  async function onCreate(e) {
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
        skillLevel: form.skillLevel || null,
        industries: form.industries,
        skillingAreas: form.skillingAreas,
      });
      setForm(emptyForm);
      setShowForm(false);
      window.location.href = `/cms/courses/${res.data.slug}`;
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(course) {
    if (!confirm(`Delete course "${course.name}"?`)) return;
    try {
      await deleteCourse(course.slug);
      const res = await fetchCourses({ limit: 50, ...(q.trim() ? { q: q.trim() } : {}) });
      setCourses(res.data || []);
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div>
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

      <CmsPanel title="All courses">
        <div className="mb-4">
          <input
            className={inputClass}
            placeholder="Search courses…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : !courses.length ? (
          <EmptyState message="No courses yet." />
        ) : (
          <ul className="m-0 list-none divide-y divide-slate-100 p-0 dark:divide-slate-900">
            {courses.map((course) => (
              <li
                key={course.slug}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
                    {course.name}
                  </p>
                  <p className="mt-0.5 mb-0 text-xs text-slate-500">
                    {course.product?.name || "—"} · /courses/{course.slug}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/cms/courses/${course.slug}`}
                    className={btnSecondary}
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/courses/${course.slug}?cms=true`}
                    className={btnPrimary}
                  >
                    Edit live
                  </Link>
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => onDelete(course)}
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
