"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  fetchCourseBySlug,
  fetchProducts,
  fetchIndustries,
  fetchSkillingAreas,
  fetchSkillLevels,
} from "@/lib/api";
import { updateCourse, deleteCourse } from "@/lib/api/entity-cms-api";
import {
  CmsHeading,
  CmsPanel,
  Field,
  ErrorBanner,
  inputClass,
  btnPrimary,
  btnSecondary,
  btnDanger,
} from "@/components/cms/admin/CmsUi";
import type { CourseEditForm, CourseRecord, SelectOption } from "../../entity-types";
import { idFromRef, idsFromRefs } from "../../entity-types";
import { useSlugParam } from "../../use-slug-param";

function formFromCourse(data: CourseRecord): CourseEditForm {
  return {
    name: data.name || "",
    product: idFromRef(data.product),
    description: data.description || "",
    status: data.status || "active",
    skillLevel: idFromRef(data.skillLevel),
    industries: idsFromRefs(data.industries),
    skillingAreas: idsFromRefs(data.skillingAreas),
  };
}

export default function CmsCourseEditPage() {
  const courseSlug = useSlugParam();
  const router = useRouter();

  const [course, setCourse] = useState<CourseRecord | null>(null);
  const [products, setProducts] = useState<SelectOption[]>([]);
  const [industries, setIndustries] = useState<SelectOption[]>([]);
  const [areas, setAreas] = useState<SelectOption[]>([]);
  const [levels, setLevels] = useState<SelectOption[]>([]);
  const [form, setForm] = useState<CourseEditForm | null>(null);
  const [error, setError] = useState<unknown>(null);
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
      const data = courseRes.data as CourseRecord;
      setCourse(data);
      setProducts((p.data || []) as SelectOption[]);
      setIndustries((i.data || []) as SelectOption[]);
      setAreas((a.data || []) as SelectOption[]);
      setLevels((l.data || []) as SelectOption[]);
      setForm(formFromCourse(data));
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

  function toggleMulti(key: "industries" | "skillingAreas", id: string) {
    setForm((f) => {
      if (!f) return f;
      const set = new Set(f[key]);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...f, [key]: [...set] };
    });
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    try {
      await updateCourse(courseSlug, {
        name: form.name.trim(),
        product: form.product,
        description: form.description.trim(),
        status: form.status,
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
            <Link href={`/cms/course/edit/${course.slug}`} className={btnPrimary}>
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
              onChange={(e) =>
                setForm((f: CourseEditForm | null) => f && ({ ...f, name: e.target.value }))
              }
            />
          </Field>
          <Field label="Product">
            <select
              className={inputClass}
              required
              value={form.product}
              onChange={(e) =>
                setForm((f: CourseEditForm | null) => f && ({ ...f, product: e.target.value }))
              }
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
                setForm(
                  (f: CourseEditForm | null) => f && ({ ...f, skillLevel: e.target.value }),
                )
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
          <Field label="Status">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) =>
                setForm((f: CourseEditForm | null) => f && ({ ...f, status: e.target.value }))
              }
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
              <option value="draft">draft</option>
            </select>
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea
              className={`${inputClass} min-h-[100px]`}
              value={form.description}
              onChange={(e) =>
                setForm(
                  (f: CourseEditForm | null) => f && ({ ...f, description: e.target.value }),
                )
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
