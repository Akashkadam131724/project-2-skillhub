"use client";

import { Field } from "@/components/cms/admin/CmsUi";
import CmsSurfacePatternEditor from "@/components/cms/theme/CmsSurfacePatternEditor";
import { useCmsThemeEditor } from "@/context/CmsThemeEditorContext";
import type { SurfacePattern } from "../types";

/** Section band / surface pattern tab. */
export default function SurfaceTab() {
  const { isPage, theme, parent, patchTheme } = useCmsThemeEditor();

  function inheritSurface() {
    patchTheme({
      surface_mode: null,
      surface_pattern: null,
    });
  }

  function setSurfacePattern(pattern: SurfacePattern) {
    patchTheme({
      surface_mode:
        pattern.layout === "transparent" ? "transparent" : "custom",
      surface_pattern: pattern as Record<string, unknown>,
    });
  }

  return (
    <Field
      label="Section stripe pattern"
      hint="White / soft grey sequence for normal sections. Dark sections (CTA, heroes, …) skip this and use their built-in background."
    >
      <CmsSurfacePatternEditor
        value={(theme.surface_pattern as SurfacePattern | null) ?? null}
        inheritedTheme={parent}
        isPage={isPage}
        onInherit={isPage ? inheritSurface : undefined}
        onChange={setSurfacePattern}
      />
    </Field>
  );
}
