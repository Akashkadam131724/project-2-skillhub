"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  deleteEntityPageSection,
  upsertEntityPageSection,
} from "@/lib/api/cms-api";
import {
  contentLockedAtLayer,
  filterLockedPlacementPatch,
  liveEditContentLayer,
  lockedContentMessage,
} from "@/lib/cms/content-scope";
import {
  buildVisibleWithSurface,
  placementKey,
} from "@/lib/sections/page-sections-stack";
import { useCmsLiveEdit } from "@/context/CmsLiveEditContext";
import {
  fetchLivePlacements,
  fetchSectionCatalog,
} from "@/components/cms/pages/live/fetch-live-placements";
import { resolveFieldEditRequest } from "@/components/cms/pages/live/resolve-field-edit";
import type {
  CmsLivePlacementsContextValue,
  CmsLivePlacementsProviderProps,
  FieldEditState,
  FieldSavedResult,
  PagePlacement,
  PlacementWithSurface,
  SectionCatalogEntry,
} from "@/components/cms/pages/types";

const CmsLivePlacementsContext =
  createContext<CmsLivePlacementsContextValue | null>(null);

/**
 * Owns sections/catalog + field-edit session for the live editor tree.
 * Mount under CmsLiveEditProvider; consume with useCmsLivePagePlacements().
 */
export function CmsLivePlacementsProvider({ children }: CmsLivePlacementsProviderProps) {
  const { pageKey, entityId, pageTheme } = useCmsLiveEdit();
  const [sections, setSections] = useState<PagePlacement[]>([]);
  const [catalog, setCatalog] = useState<SectionCatalogEntry[]>([]);
  const [sortDisabled, setSortDisabled] = useState(true);
  const [loading, setLoading] = useState(Boolean(entityId));
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<FieldEditState | null>(null);
  const [fieldDrawerOpen, setFieldDrawerOpen] = useState(false);

  const catalogLoadedRef = useRef(false);
  const catalogRef = useRef(catalog);
  catalogRef.current = catalog;
  const sortDisabledRef = useRef(sortDisabled);
  sortDisabledRef.current = sortDisabled;
  const editingRef = useRef(editing);
  editingRef.current = editing;

  const reload = useCallback(async () => {
    if (!entityId || !pageKey) return [];
    setError(null);
    const { sections: next } = await fetchLivePlacements(pageKey, entityId, {
      catalog: catalogRef.current,
      sortDisabled: sortDisabledRef.current,
      fetchPage: false,
      fetchCatalog: false,
    });
    setSections(next);
    return next;
  }, [entityId, pageKey]);

  useEffect(() => {
    if (!entityId || !pageKey) return;
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const data = await fetchLivePlacements(pageKey, entityId, {
          catalog: catalogRef.current,
          fetchPage: true,
          fetchCatalog: false,
        });
        if (!alive) return;
        setSortDisabled(data.sortDisabled);
        setSections(data.sections);
      } catch (err) {
        if (alive) setError((err as Error).message || "Failed to load sections");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [entityId, pageKey]);

  const ensureCatalog = useCallback(async () => {
    if (catalogLoadedRef.current && catalogRef.current?.length) {
      return catalogRef.current;
    }
    setCatalogLoading(true);
    try {
      const next = await fetchSectionCatalog();
      catalogLoadedRef.current = true;
      setCatalog(next);
      return next;
    } catch (err) {
      setError((err as Error).message || "Failed to load section catalog");
      throw err;
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  const savePlacement = useCallback(
    async (
      s: PagePlacement | Record<string, unknown>,
      patch: Record<string, unknown>
    ) => {
      const section = s as PagePlacement;
      const layer = liveEditContentLayer();
      const safePatch = filterLockedPlacementPatch(section, patch, layer);
      if (
        contentLockedAtLayer(section.content_scope, layer) &&
        Object.keys(safePatch || {}).length === 0
      ) {
        throw new Error(lockedContentMessage(section.content_scope, layer));
      }
      const body = safePatch;
      if (section.is_entity_extra || section.entity_override_id) {
        return upsertEntityPageSection({
          id: section.entity_override_id,
          page_key: pageKey,
          entity_id: entityId,
          section_key: section.section_key,
          ...body,
        });
      }
      return upsertEntityPageSection({
        page_key: pageKey,
        entity_id: entityId,
        section_key: section.section_key,
        page_tag_id: section.page_tag_id,
        ...body,
      });
    },
    [entityId, pageKey]
  );

  const closeFieldEdit = useCallback(() => {
    setFieldDrawerOpen(false);
    setEditing(null);
  }, []);

  const reloadAndSyncEditing = useCallback(async () => {
    const merged = await reload();
    const current = editingRef.current;
    if (!current?.section || !merged?.length) return merged;
    const refreshed = merged.find(
      (s) => placementKey(s) === placementKey(current.section)
    );
    if (refreshed) {
      setEditing((prev) => (prev ? { ...prev, section: refreshed } : null));
    }
    return merged;
  }, [reload]);

  const handleFieldSaved = useCallback(
    async (result?: FieldSavedResult) => {
      const patch = result?.localPatch;
      const current = editingRef.current;
      if (patch && current?.section) {
        const key = placementKey(current.section);
        setSections((prev) =>
          prev.map((s) => (placementKey(s) === key ? { ...s, ...patch } : s))
        );
        return;
      }
      await reloadAndSyncEditing();
    },
    [reloadAndSyncEditing]
  );

  const openFieldEdit = useCallback(
    (
      section: PagePlacement | Record<string, unknown>,
      field: string,
      options: Record<string, unknown> = {}
    ) => {
      const result = resolveFieldEditRequest(
        section as PagePlacement,
        field,
        options, {
        savePlacement,
        reload: reloadAndSyncEditing,
        setError,
        setSaving,
      });
      if (result.handled) return;
      if (result.editing) {
        setEditing(result.editing);
        setFieldDrawerOpen(true);
        setError(null);
      }
    },
    [savePlacement, reloadAndSyncEditing]
  );

  async function persistOrder(nextList: PagePlacement[]) {
    setSaving(true);
    setError(null);
    try {
      if (sortDisabled) {
        const effective = nextList.map((s) =>
          s.is_entity_extra ? null : Number(s.sort_order)
        );
        const updates = [];
        for (let i = 0; i < nextList.length; i++) {
          const s = nextList[i];
          if (!s.is_entity_extra) continue;

          let prevOrder = null;
          for (let p = i - 1; p >= 0; p--) {
            if (effective[p] != null && Number.isFinite(effective[p])) {
              prevOrder = effective[p];
              break;
            }
          }
          let nextOrder = null;
          for (let n = i + 1; n < nextList.length; n++) {
            if (!nextList[n].is_entity_extra) {
              const v = Number(nextList[n].sort_order);
              if (Number.isFinite(v)) {
                nextOrder = v;
                break;
              }
            }
          }

          let order;
          if (prevOrder != null && nextOrder != null) {
            order = (prevOrder + nextOrder) / 2;
          } else if (prevOrder != null) {
            order = prevOrder + 1;
          } else if (nextOrder != null) {
            order = nextOrder - 1;
          } else {
            order = i + 1;
          }

          effective[i] = order;
          updates.push(savePlacement(s, { sort_order: order }));
        }
        await Promise.all(updates);
      } else {
        await Promise.all(
          nextList.map((s, i) => savePlacement(s, { sort_order: i + 1 }))
        );
      }
      await reload();
    } catch (err) {
      setError((err as Error).message || "Reorder failed");
      await reload();
    } finally {
      setSaving(false);
    }
  }

  async function move(index: number, dir: number) {
    const item = sections[index];
    if (sortDisabled && !item?.is_entity_extra) return;
    const next = sections.slice();
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setSections(next);
    await persistOrder(next);
  }

  async function toggleVisibility(section: PagePlacement | Record<string, unknown>) {
    const row = section as PagePlacement;
    const nextStatus = row.status === false;
    setSaving(true);
    setError(null);
    setSections((prev) =>
      prev.map((s) =>
        placementKey(s) === placementKey(row)
          ? { ...s, status: nextStatus }
          : s
      )
    );
    try {
      await savePlacement(row, { status: nextStatus });
    } catch (err) {
      setError((err as Error).message || "Could not update visibility");
      await reload();
    } finally {
      setSaving(false);
    }
  }

  async function addOnThisPage(sectionKey: string) {
    setSaving(true);
    setError(null);
    try {
      const maxSort = sections.reduce(
        (m, s) => Math.max(m, Number(s.sort_order) || 0),
        0
      );
      await upsertEntityPageSection({
        page_key: pageKey,
        entity_id: entityId,
        section_key: sectionKey,
        sort_order: maxSort + 1,
        status: true,
      });
      await reload();
    } catch (err) {
      setError((err as Error).message || "Could not add section");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function removeExtra(section?: PagePlacement | Record<string, unknown>) {
    const current = editingRef.current;
    const target = (section || current?.section) as PagePlacement | undefined;
    if (!target?.is_entity_extra || !target.entity_override_id) return;
    if (!confirm("Remove this section from this page only?")) return;
    setSaving(true);
    try {
      await deleteEntityPageSection(String(target.entity_override_id));
      if (
        current?.section &&
        placementKey(current.section) === placementKey(target)
      ) {
        closeFieldEdit();
      }
      await reload();
    } catch (err) {
      setError((err as Error).message || "Remove failed");
    } finally {
      setSaving(false);
    }
  }

  const visibleWithSurface = useMemo(
    () =>
      buildVisibleWithSurface(sections, pageTheme, true) as PlacementWithSurface[],
    [pageTheme, sections]
  );

const value: CmsLivePlacementsContextValue = {
    sections,
    setSections,
    catalog,
    catalogLoading,
    ensureCatalog,
    sortDisabled,
    loading,
    error,
    setError,
    saving,
    setSaving,
    reload,
    savePlacement,
    move,
    toggleVisibility,
    addOnThisPage,
    removeExtra,
    visibleWithSurface,
    editing,
    fieldDrawerOpen,
    openFieldEdit,
    closeFieldEdit,
    handleFieldSaved,
  };

  return (
    <CmsLivePlacementsContext.Provider value={value}>
      {children}
    </CmsLivePlacementsContext.Provider>
  );
}

export function useCmsLivePagePlacements(): CmsLivePlacementsContextValue {
  const ctx = useContext(CmsLivePlacementsContext);
  if (!ctx) {
    throw new Error(
      "useCmsLivePagePlacements must be used within CmsLivePlacementsProvider"
    );
  }
  return ctx;
}
