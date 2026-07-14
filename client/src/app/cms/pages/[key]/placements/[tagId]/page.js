"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getPage,
  getSection,
  listPageSections,
  updatePageSectionTag,
} from "@/lib/cms-api";
import {
  contentLockedAtLayer,
  contentScopeLabel,
  lockedContentHref,
  lockedContentMessage,
  normalizeContentScope,
} from "@/lib/content-scope";
import CmsSectionLiveEditor, {
  templatePlacementToLiveProps,
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

export default function CmsPagePlacementDetailPage() {
  const { key, tagId } = useParams();
  const pageKey = String(key || "");
  const placementId = String(tagId || "");

  const [page, setPage] = useState(null);
  const [tag, setTag] = useState(null);
  const [sectionDoc, setSectionDoc] = useState(null);
  const [sortOrder, setSortOrder] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setError(null);
    try {
      const [pageRes, tagsRes] = await Promise.all([
        getPage(pageKey),
        listPageSections({ page_key: pageKey }),
      ]);
      const found = (tagsRes.data || []).find(
        (t) => String(t.id) === placementId
      );
      if (!found) {
        setPage(pageRes.data);
        setTag(null);
        setSectionDoc(null);
        return;
      }
      const sectionRes = await getSection(found.section_key);
      setPage(pageRes.data);
      setTag(found);
      setSectionDoc(sectionRes.data);
      setSortOrder(found.sort_order ?? 0);
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
        const [pageRes, tagsRes] = await Promise.all([
          getPage(pageKey),
          listPageSections({ page_key: pageKey }),
        ]);
        if (!alive) return;
        const found = (tagsRes.data || []).find(
          (t) => String(t.id) === placementId
        );
        if (!found) {
          setPage(pageRes.data);
          setTag(null);
          setSectionDoc(null);
          return;
        }
        const sectionRes = await getSection(found.section_key);
        if (!alive) return;
        setPage(pageRes.data);
        setTag(found);
        setSectionDoc(sectionRes.data);
        setSortOrder(found.sort_order ?? 0);
      } catch (err) {
        if (alive) setError(err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [pageKey, placementId]);

  const scope = normalizeContentScope(
    tag?.content_scope || sectionDoc?.content_scope
  );
  const contentLocked = contentLockedAtLayer(scope, "template");

  const liveSection = useMemo(
    () => templatePlacementToLiveProps(tag, sectionDoc),
    [tag, sectionDoc]
  );

  async function saveContentPatch(patch) {
    if (contentLocked) {
      throw new Error(lockedContentMessage(scope, "template"));
    }
    const body = { ...patch };
    // Empty arrays → clear template override so global section items/buttons inherit
    if (Array.isArray(body.items) && body.items.length === 0) {
      body.items = null;
    }
    if (Array.isArray(body.buttons) && body.buttons.length === 0) {
      body.buttons = null;
    }
    await updatePageSectionTag(placementId, body);
    await load();
  }

  async function savePlacementMeta(e) {
    e?.preventDefault?.();
    setSaving(true);
    setError(null);
    try {
      await updatePageSectionTag(placementId, {
        sort_order: Number(sortOrder) || 0,
        status: tag.status !== false,
      });
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(visible) {
    setSaving(true);
    setError(null);
    try {
      await updatePageSectionTag(placementId, { status: visible });
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  if (!page || !tag || !liveSection) {
    return (
      <div>
        <ErrorBanner error={error || { message: "Placement not found" }} />
        <Link href={`/cms/pages/${pageKey}`} className={btnSecondary}>
          Back to {pageKey || "page"}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start">
        <SectionPreviewThumb
          src={
            tag.section_preview_img || sectionDoc?.section_preview_img || ""
          }
          alt={tag.section_key}
          className="h-28 w-44"
          rounded="rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <CmsHeading
            title={`${tag.section_key} · ${page.name || pageKey}`}
            subtitle="Template-level edit — same live UI as a real page. Changes apply to every entity of this type unless overridden."
            actions={
              <>
                <Link href={`/cms/pages/${pageKey}`} className={btnSecondary}>
                  Back to page
                </Link>
                <Link
                  href={`/cms/pages-content-sections/${tag.section_key}`}
                  className={btnSecondary}
                >
                  Global section
                </Link>
                <StatusBadge active={tag.status} />
                <StatusBadge
                  active={scope !== "page"}
                  labelOn={`Scope: ${contentScopeLabel(scope)}`}
                  labelOff={`Scope: ${contentScopeLabel(scope)}`}
                />
              </>
            }
          />
        </div>
      </div>

      <ErrorBanner error={error} />

      <CmsPanel title="Placement" className="mb-6">
        <form
          onSubmit={savePlacementMeta}
          className="grid gap-3 sm:grid-cols-2"
        >
          <Field label="Sort order">
            <input
              type="number"
              className={inputClass}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </Field>
          <Field label="Template status">
            <div className="flex h-[42px] items-center gap-2">
              <StatusBadge active={tag.status !== false} />
              <button
                type="button"
                className={btnSecondary}
                disabled={saving}
                onClick={() => toggleStatus(!(tag.status !== false))}
              >
                {tag.status !== false ? "Disable" : "Enable"}
              </button>
            </div>
          </Field>
          <div className="sm:col-span-2">
            <button type="submit" className={btnPrimary} disabled={saving}>
              {saving ? "Saving…" : "Save sort order"}
            </button>
          </div>
        </form>
      </CmsPanel>

      <div className="mb-3">
        <h2 className="m-0 text-sm font-semibold tracking-wide text-slate-800 uppercase dark:text-slate-100">
          Live preview
        </h2>
        <p className="mt-1 mb-0 text-xs text-slate-500">
          {contentLocked
            ? lockedContentMessage(scope, "template")
            : scope === "template"
              ? "Edit template content here. Entity pages cannot override it."
              : "Click pencils to override template content. Entity pages can still override when scope is Page."}
        </p>
      </div>

      <CmsSectionLiveEditor
        section={liveSection}
        onSavePatch={saveContentPatch}
        layerLabel="Template"
        saveLabel="Save template content"
        contentLocked={contentLocked}
        contentLockedHref={lockedContentHref(scope, {
          sectionKey: tag.section_key,
          pageKey,
          tagId: placementId,
        })}
        contentLockedMessage={lockedContentMessage(scope, "template")}
        showVisibilityToggle
        onToggleStatus={toggleStatus}
      />
    </div>
  );
}
