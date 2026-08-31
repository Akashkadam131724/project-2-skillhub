import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import {
  catalogBaseParamsFromContext,
  catalogHideKeysFromContext,
} from "./lib/context";
import type { CatalogPageContext } from "./lib/types";

export type CatalogCmsSectionOptions = {
  section_title?: string;
  sub_title?: string;
  onEditField?: (field: string, extra?: unknown) => void;
  pageContext?: CatalogPageContext | null;
  cmsMode?: boolean;
  /** Include `baseParams` / `hideFilterKeys` for course-catalog Ui. */
  withCatalogParams?: boolean;
};

/** Catalog CMS adapter — header slots + optional locked filter params. */
export function catalogCmsSection({
  section_title,
  sub_title,
  onEditField,
  pageContext,
  cmsMode,
  withCatalogParams = false,
}: CatalogCmsSectionOptions) {
  const header = cmsSectionHeaderSlots({
    section_title,
    sub_title,
    onEditField,
    cmsMode,
  });

  if (!withCatalogParams && pageContext == null) {
    return header;
  }

  return {
    ...header,
    baseParams: catalogBaseParamsFromContext(pageContext),
    hideFilterKeys: catalogHideKeysFromContext(pageContext),
  };
}
