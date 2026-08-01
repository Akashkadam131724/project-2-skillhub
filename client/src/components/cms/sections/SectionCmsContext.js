"use client";

import { createContext, useContext } from "react";
import { itemsConfigRenderKey } from "@/lib/sections/section-render-key";

const SectionCmsContext = createContext({
  sectionKey: "",
  renderKey: "",
});

export function SectionCmsProvider({ section, sectionKey, renderKey, children }) {
  const key = String(
    sectionKey || section?.section_key || section?.key || ""
  ).toLowerCase();
  const rk =
    renderKey !== undefined && renderKey !== null
      ? String(renderKey || "")
      : itemsConfigRenderKey(section || { key, render_key: "" });

  return (
    <SectionCmsContext.Provider value={{ sectionKey: key, renderKey: rk }}>
      {children}
    </SectionCmsContext.Provider>
  );
}

export function useSectionCmsKeys() {
  return useContext(SectionCmsContext);
}
