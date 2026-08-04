"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SectionPreviewThumb } from "@/components/cms/admin/CmsUi";
import {
  SECTION_CATALOG,
  sectionUsesImage,
} from "@/lib/sections/section-registry";
import MoreHorizontalIcon from "@/components/icons/MoreHorizontalIcon";

function sectionDisplayName(sectionKey) {
  const key = String(sectionKey || "").toLowerCase();
  return SECTION_CATALOG.find((s) => s.key === key)?.name || key;
}

function stopBubble(e) {
  e.preventDefault();
  e.stopPropagation();
}

function MenuItem({ children, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        stopBubble(e);
        onClick?.(e);
      }}
      className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium transition ${
        danger
          ? "text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/40"
          : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

export default function CmsSectionToolbar({
  section,
  preview,
  hidden = false,
  layerLabel = null,
  contentLocked = false,
  contentLockedHref = null,
  onEditField,
  onToggleVisibility,
  onRemoveExtra,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const sectionKey = section?.section_key || section?.key;
  const renderKey = section?.render_key || "";
  const showImage = sectionUsesImage(sectionKey, renderKey);
  const previewSrc = preview ?? section?.section_preview_img;

  function editField(field) {
    if (!onEditField) return;
    onEditField(section, field);
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e) {
      if (rootRef.current?.contains(e.target)) return;
      setOpen(false);
    }

    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function runAction(action) {
    setOpen(false);
    action?.();
  }

  return (
    <div
      ref={rootRef}
      className="flex w-full items-center justify-end gap-2 border-b border-slate-200/80 bg-slate-50/95 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900/80"
    >
      <SectionPreviewThumb
        src={previewSrc}
        alt={sectionKey}
        className="size-9 shrink-0 border border-white/80 shadow"
      />

      <div className="min-w-0 max-w-[14rem]">
        <p className="m-0 truncate text-xs font-semibold text-slate-900 dark:text-white">
          {sectionDisplayName(sectionKey)}
        </p>
        <p className="m-0 truncate text-[10px] font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
          {sectionKey}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {layerLabel ? (
          <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {layerLabel}
          </span>
        ) : null}
        {contentLocked ? (
          contentLockedHref ? (
            <Link
              href={contentLockedHref}
              className="rounded bg-amber-600 px-1.5 py-0.5 text-[10px] font-semibold text-white no-underline hover:bg-amber-500"
              title="Edit at the owning layer"
              onClick={stopBubble}
            >
              Locked · edit source
            </Link>
          ) : (
            <span className="rounded bg-amber-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              Locked
            </span>
          )
        ) : null}
        {section?.is_entity_extra ? (
          <span
            className="rounded bg-emerald-700 px-1.5 py-0.5 text-[10px] font-semibold text-white"
            title="Added only on this page"
          >
            Page only
          </span>
        ) : null}
        {hidden ? (
          <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Hidden
          </span>
        ) : null}

        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              stopBubble(e);
              setOpen((v) => !v);
            }}
            className="inline-flex size-8 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label={`Section actions for ${sectionDisplayName(sectionKey)}`}
            aria-expanded={open}
            aria-haspopup="menu"
          >
            <MoreHorizontalIcon />
          </button>

          {open ? (
            <div
              role="menu"
              className="absolute top-[calc(100%+0.375rem)] right-0 z-20 min-w-[11rem] rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              {contentLocked && contentLockedHref ? (
                <Link
                  href={contentLockedHref}
                  className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium text-brand no-underline hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={(e) => {
                    stopBubble(e);
                    setOpen(false);
                  }}
                >
                  Edit at source layer →
                </Link>
              ) : null}
              <MenuItem
                onClick={() => runAction(() => editField("in_page_nav_title"))}
              >
                {contentLocked ? "Nav title (view)" : "Edit nav title"}
              </MenuItem>
              {showImage ? (
                <MenuItem
                  onClick={() => runAction(() => editField("section_img_url"))}
                >
                  {contentLocked ? "Section image (view)" : "Edit section image"}
                </MenuItem>
              ) : null}
              <MenuItem
                onClick={() => runAction(() => editField("section_band"))}
              >
                {contentLocked ? "Section band (view)" : "Section band…"}
              </MenuItem>
              {onToggleVisibility ? (
                <>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <MenuItem
                    onClick={() =>
                      runAction(() => onToggleVisibility?.(section))
                    }
                  >
                    {hidden ? "Show section" : "Hide section"}
                  </MenuItem>
                </>
              ) : null}
              {section?.is_entity_extra ? (
                <MenuItem
                  danger
                  onClick={() => runAction(() => onRemoveExtra?.(section))}
                >
                  Remove from page
                </MenuItem>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
