"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  fetchCourseBySlug,
  fetchProducts,
  fetchIndustries,
  fetchSkillingAreas,
  fetchSkillLevels,
} from "@/lib/api";
import { updateCourse, deleteCourse } from "@/lib/entity-cms-api";
import {
  CmsHeading,
  CmsPanel,
  Field,
  ErrorBanner,
  inputClass,
  btnPrimary,
  btnSecondary,
  btnDanger,
} from "@/components/cms/CmsUi";

function idsFrom(arr) {
  return (arr || []).map((x) =>
    typeof x === "object" ? String(x._id || x.id) : String(x)
  );
}

export default function CmsCourseEditPage() {
  const { slug } = useParams();
  const router = useRouter();
  const courseSlug = String(slug || "");

  const [course, setCourse] = useState(null);
  const [products, setProducts] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [areas, setAreas] = useState([]);
  const [levels, setLevels] = useState([]);
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setError(null);
    try {
      const [courseRes, p, i, a, l] = await Promise.all([
        fetchCourseBySlug(courseSlug),
        fetchProducts({ limit: 100 }),
        fetchIndustries({ limit: 100 }),
        fetchSkillingAreas({ limit: 100 }),
        fetchSkillLevels({ limit: 50 }).catch(() => ({ data: [] })),
      ]);
      const data = courseRes.data;
      setCourse(data);
      setProducts(p.data || []);
      setIndustries(i.data || []);
      setAreas(a.data || []);
      setLevels(l.data || []);
      const productId =
        typeof data.product === "object"
          ? String(data.product._id || data.product.id)
          : String(data.product || "");
      const skillLevelId = data.skillLevel
        ? typeof data.skillLevel === "object"
          ? String(data.skillLevel._id || data.skillLevel.id)
          : String(data.skillLevel)
        : "";
      setForm({
        name: data.name || "",
        product: productId,
        description: data.description || "",
        skillLevel: skillLevelId,
        industries: idsFrom(data.industries),
        skillingAreas: idsFrom(data.skillingAreas),
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
  }, [courseSlug]);

  function toggleMulti(key, id) {
    setForm((f) => {
      const set = new Set(f[key]);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...f, [key]: [...set] };
    });
  }

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateCourse(courseSlug, {
        name: form.name.trim(),
        product: form.product,
        description: form.description.trim(),
        skillLevel: form.skillLevel || null,
        industries: form.industries,
        skillingAreas: form.skillingAreas,
      });
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirm(`Delete course "${course?.name}"?`)) return;
    try {
      await deleteCourse(courseSlug);
      router.push("/cms/courses");
    } catch (err) {
      setError(err);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (!course || !form) {
    return (
      <div>
        <ErrorBanner error={error || { message: "Course not found" }} />
        <Link href="/cms/courses" className={btnSecondary}>
          Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div>
      <CmsHeading
        title={course.name}
        subtitle={`Slug: ${course.slug}`}
        actions={
          <>
            <Link href="/cms/courses" className={btnSecondary}>
              All courses
            </Link>
            <Link href={`/course/${course.slug}?cms=true`} className={btnPrimary}>
              Edit live sections
            </Link>
          </>
        }
      />
      <ErrorBanner error={error} />
      <CmsPanel title="Course details">
        <form onSubmit={onSave} className="grid gap-3 sm:grid-cols-2">
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
              className={`${inputClass} min-h-[100px]`}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </Field>
          <Field label="Industries" className="sm:col-span-2">
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-lg border border-slate-200 p-2 dark:border-slate-800">
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
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-lg border border-slate-200 p-2 dark:border-slate-800">
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
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button type="submit" className={btnPrimary} disabled={saving}>
              {saving ? "Saving…" : "Save course"}
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
