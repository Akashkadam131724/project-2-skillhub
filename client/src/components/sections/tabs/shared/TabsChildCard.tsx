import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import { DS_RADIUS, sectionClassNames } from "@/lib/layout/section-layout-system";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { tabChildPanelButtons } from "./lib/tab-panel";
import type { TabChildUiItem } from "./lib/types";

export default function TabsChildCard({
  item,
  onFormOpen,
  tone = "dark",
}: {
  item: TabChildUiItem;
  onFormOpen?: (formKey: string, button?: unknown) => void;
  tone?: "dark" | "light";
}) {
  const buttons = tabChildPanelButtons(item);
  const dark = tone === "dark";

  return (
    <article
      data-light-surface={dark ? undefined : ""}
      className={sectionClassNames(
        DS_RADIUS.nested,
        "flex h-full flex-col overflow-hidden border",
        dark ? "border-white/15 bg-white/5" : "border-slate-200 bg-white"
      )}
    >
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={mediaAlt(item, "Tab item")}
          className="aspect-[16/10] w-full object-cover"
        />
      ) : null}
      <div className="flex flex-1 flex-col p-4">
        {item.title ? (
          <h4
            className={`m-0 text-base font-semibold tracking-tight ${
              dark ? "text-white" : "section-theme-heading"
            }`}
          >
            {item.title}
          </h4>
        ) : null}
        {item.subtitle ? (
          <p
            className={`mt-1 mb-0 text-sm ${
              dark ? "text-white/60" : "text-slate-500"
            }`}
          >
            {item.subtitle}
          </p>
        ) : null}
        {!isRichTextEmpty(item.body) ? (
          <CmsRichText
            html={item.body}
            className={`mt-2 text-sm ${
              dark ? "text-white/70" : "section-theme-muted"
            }`}
          />
        ) : null}
        {buttons.length ? (
          <SectionButtons
            buttons={buttons}
            onFormOpen={onFormOpen}
            inverted={dark}
            className="mt-auto flex flex-wrap items-center gap-2 pt-4"
          />
        ) : null}
      </div>
    </article>
  );
}
