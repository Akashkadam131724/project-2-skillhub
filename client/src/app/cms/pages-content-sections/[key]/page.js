"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getSection,
  setSectionStatus,
  updateSection,
  mediaUrl,
  uploadCmsImage,
} from "@/lib/cms-api";
import { isKnownSectionKey, SECTION_CATEGORIES } from "@/lib/section-registry";
import {
  contentScopeLabel,
  normalizeContentScope,
} from "@/lib/content-scope";
import CmsSectionLiveEditor, {
  sectionDocToLiveProps,
} from "@/components/cms/CmsSectionLiveEditor";
import {
  CmsHeading,
  CmsPanel,
  StatusBadge,
  Field,
  ErrorBanner,
  SectionPreviewThumb,
  inputClass,
  btnPrimary,
  btnSecondary,
} from "@/components/cms/CmsUi";

export default function CmsSectionDetailPage() {
  const { key } = useParams();
  const sectionKey = String(key || "");

  const [section, setSection] = useState(null);
  const [meta, setMeta] = useState({
    name: "",
    description: "",
    category: "",
    content_scope: "page",
    section_preview_img: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingMeta, setSavingMeta] = useState(false);

  async function load() {
    setError(null);
    try {
      const sectionRes = await getSection(sectionKey);
      const data = sectionRes.data;
      setSection(data);
      setMeta({
        name: data.name || "",
        description: data.description || "",
        category: data.category || "",
        content_scope: normalizeContentScope(data.content_scope),
        section_preview_img: data.section_preview_img || "",
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const sectionRes = await getSection(sectionKey);
        if (!alive) return;
        const data = sectionRes.data;
        setSection(data);
        setMeta({
          name: data.name || "",
          description: data.description || "",
          category: data.category || "",
          content_scope: normalizeContentScope(data.content_scope),
          section_preview_img: data.section_preview_img || "",
        });
      } catch (err) {
        if (alive) setError(err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [sectionKey]);

  const liveSection = useMemo(
    () => sectionDocToLiveProps(section),
    [section]
  );

  async function saveMeta(e) {
    e?.preventDefault?.();
    setSavingMeta(true);
    setError(null);
    try {
      await updateSection(sectionKey, {
        name: meta.name,
        description: meta.description,
        category: meta.category || "",
        content_scope: meta.content_scope,
        section_preview_img: meta.section_preview_img || "",
      });
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSavingMeta(false);
    }
  }

  async function saveContentPatch(patch) {
    // Global layer stores empty strings for cleared text fields
    const body = { ...patch };
    for (const key of [
      "section_title",
      "sub_title",
      "in_page_nav_title",
      "section_bg_img",
      "section_bg_color",
      "section_img_url",
    ]) {
      if (body[key] === null) body[key] = "";
    }
    await updateSection(sectionKey, body);
    await load();
  }

  async function toggleStatus() {
    try {
      await setSectionStatus(sectionKey, !section.status);
      await load();
    } catch (err) {
      setError(err);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  if (!section || !liveSection) {
    return (
      <div>
        <ErrorBanner error={error || { message: "Section not found" }} />
        <Link href="/cms/pages-content-sections" className={btnSecondary}>
          Back to content sections
        </Link>
      </div>
    );
  }

  const known = isKnownSectionKey(section.key);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start">
        <SectionPreviewThumb
          src={meta.section_preview_img || section.section_preview_img}
          alt={section.name}
          className="h-28 w-44"
          rounded="rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <CmsHeading
            title={section.name}
            subtitle="Edit this section the same way as on a live page — click the pencil on any field."
            actions={
              <>
                <Link
                  href="/cms/pages-content-sections"
                  className={btnSecondary}
                >
                  All content sections
                </Link>
                <Link href="/cms/pages" className={btnSecondary}>
                  Manage on pages
                </Link>
                <StatusBadge
                  active={section.status}
                  labelOn="Enabled"
                  labelOff="Disabled"
                />
                <StatusBadge
                  active={meta.content_scope === "global"}
                  labelOn={`Scope: ${contentScopeLabel(meta.content_scope)}`}
                  labelOff={`Scope: ${contentScopeLabel(meta.content_scope)}`}
                />
              </>
            }
          />
        </div>
      </div>

      <ErrorBanner error={error} />

      {!known ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          No React component registered for key <code>{section.key}</code>.
        </div>
      ) : null}

      <CmsPanel title="Catalog settings" className="mb-6">
        <form onSubmit={saveMeta} className="grid gap-3 sm:grid-cols-2">
          <Field label="Component key" hint="Locked to the React component">
            <input
              className={`${inputClass} bg-slate-50 font-mono text-slate-500 dark:bg-slate-900`}
              value={section.key}
              readOnly
              disabled
            />
          </Field>
          <Field label="Status">
            <div className="flex h-[42px] items-center gap-2">
              <StatusBadge active={section.status} />
              <button
                type="button"
                className={btnSecondary}
                onClick={toggleStatus}
              >
                {section.status ? "Disable" : "Enable"}
              </button>
            </div>
          </Field>
          <Field label="Display name">
            <input
              className={inputClass}
              required
              value={meta.name}
              onChange={(e) =>
                setMeta((m) => ({ ...m, name: e.target.value }))
              }
            />
          </Field>
          <Field label="Description">
            <input
              className={inputClass}
              value={meta.description}
              onChange={(e) =>
                setMeta((m) => ({ ...m, description: e.target.value }))
              }
            />
          </Field>
          <Field
            label="Category"
            hint="What kind of section this is (hero, accordion, …)"
          >
            <select
              className={inputClass}
              value={meta.category}
              onChange={(e) =>
                setMeta((m) => ({ ...m, category: e.target.value }))
              }
            >
              <option value="">Uncategorized</option>
              {SECTION_CATEGORIES.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Content scope"
            hint="Controls where content can be edited. Placement (sort / show-hide) always works on templates and pages."
            className="sm:col-span-2"
          >
            <div className="flex flex-wrap gap-2">
              {[
                {
                  value: "global",
                  label: "Global",
                  help: "Edit only here — locked on template & page",
                },
                {
                  value: "template",
                  label: "Template",
                  help: "Edit here + page template — locked on entity pages",
                },
                {
                  value: "page",
                  label: "Page",
                  help: "Edit at global, template, and per-entity page",
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  title={opt.help}
                  className={
                    meta.content_scope === opt.value
                      ? btnPrimary
                      : btnSecondary
                  }
                  onClick={() =>
                    setMeta((m) => ({ ...m, content_scope: opt.value }))
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="mt-2 mb-0 text-xs text-slate-500">
              {meta.content_scope === "global"
                ? "Content is shared everywhere. Template and live pages cannot change it."
                : meta.content_scope === "template"
                  ? "Content is set per page type (e.g. all courses). Individual entity pages cannot override it."
                  : "Full cascade — entity pages can override template and global defaults."}
            </p>
          </Field>
          <Field
            label="Catalog preview image"
            hint="Shown in CMS lists; copied onto page mappings when tagged"
            className="sm:col-span-2"
          >
            <div className="space-y-2">
              {meta.section_preview_img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl(meta.section_preview_img)}
                  alt=""
                  className="h-28 w-full max-w-md rounded-lg object-cover"
                />
              ) : null}
              <input
                className={inputClass}
                value={meta.section_preview_img}
                onChange={(e) =>
                  setMeta((m) => ({
                    ...m,
                    section_preview_img: e.target.value,
                  }))
                }
                placeholder="/uploads/… or https://…"
              />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="block w-full text-xs"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  setSavingMeta(true);
                  try {
                    const dataUrl = await new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result);
                      reader.onerror = () =>
                        reject(new Error("Could not read file"));
                      reader.readAsDataURL(file);
                    });
                    const res = await uploadCmsImage(dataUrl, "sections");
                    setMeta((m) => ({
                      ...m,
                      section_preview_img: res.data?.url || "",
                    }));
                  } catch (err) {
                    setError(err);
                  } finally {
                    setSavingMeta(false);
                  }
                }}
              />
            </div>
          </Field>
          <div className="sm:col-span-2">
            <button type="submit" className={btnPrimary} disabled={savingMeta}>
              {savingMeta ? "Saving…" : "Save catalog settings"}
            </button>
          </div>
        </form>
      </CmsPanel>

      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="m-0 text-sm font-semibold tracking-wide text-slate-800 uppercase dark:text-slate-100">
            Live preview
          </h2>
          <p className="mt-1 mb-0 text-xs text-slate-500">
            Same UI as on a live page. Pencil icons edit catalog defaults.
            {meta.content_scope === "global"
              ? " Locked on template and entity pages."
              : meta.content_scope === "template"
                ? " Templates can override; entity pages are locked."
                : " Templates and entity pages can override."}
          </p>
        </div>
      </div>

      <CmsSectionLiveEditor
        section={liveSection}
        onSavePatch={saveContentPatch}
        layerLabel="Global"
        saveLabel="Save global content"
        showVisibilityToggle
        onToggleStatus={async (visible) => {
          await setSectionStatus(sectionKey, visible);
          await load();
        }}
      />
    </div>
  );
}
