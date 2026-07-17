"use client";

import { useEffect } from "react";
import { enableCmsFab } from "@/components/CmsModeFab";

/** Visiting /cms unlocks the public-page CMS FAB for this browser. */
export default function CmsEditorUnlock() {
  useEffect(() => {
    enableCmsFab();
  }, []);
  return null;
}
