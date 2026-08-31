import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import { DS_RADIUS, sectionClassNames } from "@/lib/layout/section-layout-system";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import TabsChildCard from "./TabsChildCard";
import { tabPanelButtons } from "./lib/tab-panel";
import type { TabChildUiItem, TabUiItem, TabsLayout } from "./lib/types";

export default function TabsPanel({
  current,
  childItems = [],
  onFormOpen,
  layout,
}: {
  current?: TabUiItem;
  childItems?: TabChildUiItem[];
  onFormOpen?: (formKey: string, button?: unknown) => void;
  layout: TabsLayout;
}) {
  const photo = current?.imageUrl;
  const panelButtons = tabPanelButtons(current);
  const hasChildren = childItems.length > 0;
  const lightPanel = layout === "underline";

  return (
    <div
      className={sectionClassNames(
        DS_RADIUS.media,
        "overflow-hidden border shadow-lg",
        lightPanel
          ? "border-slate-200 bg-white"
          : "border-slate-200 bg-slate-950 dark:border-slate-800"
      )}
    >
      {(photo || current?.title) && !lightPanel ? (
        <div className="relative aspect-[16/10]">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo}
              src={photo}
              alt={mediaAlt(current, "Feature")}
              className="absolute inset-0 h-full w-full object-cover transition duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--ink),var(--brand))]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            {current?.title ? (
              <h3 className="m-0 font-[family-name:var(--font-display)] text-2xl font-semibold text-white sm:text-3xl">
                {current.title}
              </h3>
            ) : null}
            {!isRichTextEmpty(current?.body) ? (
              <CmsRichText
                html={current?.body}
                className="mt-3 max-w-xl text-sm text-white/75"
              />
            ) : null}
            {panelButtons.length ? (
              <SectionButtons
                buttons={panelButtons}
                onFormOpen={onFormOpen}
                inverted
                className="mt-5 flex flex-wrap items-center gap-3"
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {lightPanel ? (
        photo ? (
          <div className="relative aspect-[16/10]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={photo}
              src={photo}
              alt={mediaAlt(current, "Feature")}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              {current?.title ? (
                <h3 className="m-0 font-[family-name:var(--font-display)] text-2xl font-semibold text-white sm:text-3xl">
                  {current.title}
                </h3>
              ) : null}
              {!isRichTextEmpty(current?.body) ? (
                <CmsRichText
                  html={current.body}
                  className="mt-3 max-w-xl text-sm text-white/75"
                />
              ) : null}
              {panelButtons.length ? (
                <SectionButtons
                  buttons={panelButtons}
                  onFormOpen={onFormOpen}
                  inverted
                  className="mt-5 flex flex-wrap items-center gap-3"
                />
              ) : null}
            </div>
          </div>
        ) : (
          <div className="px-6 py-6 sm:px-8">
            {current?.title ? (
              <h3 className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
                {current.title}
              </h3>
            ) : null}
            {!isRichTextEmpty(current?.body) ? (
              <CmsRichText
                html={current?.body}
                className="section-theme-muted mt-3 max-w-2xl text-sm"
              />
            ) : null}
            {panelButtons.length ? (
              <SectionButtons
                buttons={panelButtons}
                onFormOpen={onFormOpen}
                className="mt-5 flex flex-wrap items-center gap-3"
              />
            ) : null}
          </div>
        )
      ) : null}

      {hasChildren ? (
        <div
          className={`border-t px-4 py-5 sm:px-6 sm:py-6 ${
            lightPanel
              ? "border-slate-200 bg-slate-50"
              : "border-white/10 bg-slate-950"
          }`}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {childItems.map((child, i) => (
              <TabsChildCard
                key={child.id || i}
                item={child}
                onFormOpen={onFormOpen}
                tone={lightPanel ? "light" : "dark"}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
