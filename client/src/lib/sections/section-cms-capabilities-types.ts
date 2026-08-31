export type SectionCmsMode = "content" | "static";

export type SectionCmsToolbarCapabilities = {
  navTitle: boolean;
  /** `auto` resolves via sectionUsesImage at runtime */
  sectionImage: boolean | "auto";
  sectionBand: boolean;
  visibility: boolean;
  removeExtra: boolean;
};

export type SectionCmsCapabilities = {
  mode: SectionCmsMode;
  staticHint?: string;
  toolbar: Partial<SectionCmsToolbarCapabilities>;
  fields?: Record<string, boolean>;
};
