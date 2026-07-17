"use client";

import { useCallback, useState } from "react";
import CmsEditable from "@/components/cms/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionWrapper from "@/components/sections/SectionWrapper";
import SectionButtons from "@/components/ui/SectionButtons";
import YoutubeModal from "@/components/ui/YoutubeModal";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { resolveSectionItems } from "@/lib/item-types";
import { sortActiveButtons, youtubeEmbedUrl, youtubeWatchUrl } from "@/lib/button-types";

const DEFAULT_GRADIENT =
  "linear-gradient(135deg, #2e1064 0%, #4c1d95 45%, #312e81 100%)";

function PlayIcon({ className = "size-7" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86Z" />
    </svg>
  );
}

function TabGlyph({ name }) {
  const key = String(name || "").toLowerCase().trim();
  const common = "size-4 shrink-0";

  if (key === "healthcare") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10Z" />
        <path d="M12 11v4M10 13h4" />
      </svg>
    );
  }
  if (key === "finance" || key === "financial") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M3 10h18M5 6h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
        <path d="M8 14h.01M12 14h.01M16 14h.01" />
      </svg>
    );
  }
  if (key === "technology" || key === "tech") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    );
  }
  if (key === "local" || key === "local-government") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M3 21h18M5 21V9l7-4 7 4v12" />
        <path d="M9 21v-6h6v6" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 21h18M6 21V7l6-3 6 3v14" />
      <path d="M9 21v-4h6v4" />
      <path d="M10 10h4M10 14h4" />
    </svg>
  );
}

function StoryTab({ item, active, onClick }) {
  const label = item.label || item.title || "Story";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "border-ink bg-ink text-white shadow-sm dark:border-white dark:bg-white dark:text-ink"
          : "border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      }`}
    >
      <TabGlyph name={item.icon} />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function StoryPanel({ item, cmsMode, onFormOpen }) {
  const [videoOpen, setVideoOpen] = useState(false);
  const photo = mediaUrl(item?.image_url);
  const logo = mediaUrl(item?.value);
  const gradient = String(item?.bg_color || "").trim() || DEFAULT_GRADIENT;
  const videoUrl = String(item?.href || "").trim();
  const embedSrc = videoUrl ? youtubeEmbedUrl(videoUrl, { autoplay: false }) : null;
  const watchHref = videoUrl ? youtubeWatchUrl(videoUrl) || videoUrl : null;
  const buttons = sortActiveButtons(Array.isArray(item?.buttons) ? item.buttons : []);
  const partner = String(item?.subtitle || "").trim();

  const handlePlay = useCallback(() => {
    if (cmsMode) return;
    if (embedSrc) {
      setVideoOpen(true);
      return;
    }
    if (watchHref) window.open(watchHref, "_blank", "noopener,noreferrer");
  }, [cmsMode, embedSrc, watchHref]);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl dark:border-slate-800">
        <div className="grid lg:grid-cols-2">
          <div
            className="flex min-h-[280px] flex-col justify-center px-8 py-10 sm:px-10 sm:py-12 lg:min-h-[360px]"
            style={{ background: gradient }}
          >
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={mediaAlt(item, "Partner logo")}
                className="mb-6 h-8 w-auto max-w-[140px] object-contain object-left brightness-0 invert"
              />
            ) : partner ? (
              <p className="m-0 mb-6 text-lg font-bold tracking-tight text-white/90">
                {partner}
              </p>
            ) : null}

            {item?.title ? (
              <h3 className="m-0 max-w-xl font-[family-name:var(--font-display)] text-2xl leading-snug font-semibold text-white sm:text-[1.65rem]">
                {item.title}
              </h3>
            ) : null}

            {buttons.length ? (
              <SectionButtons
                buttons={buttons}
                onFormOpen={onFormOpen}
                inverted
                className="mt-8 flex flex-wrap items-center gap-3"
              />
            ) : null}
          </div>

          <div className="relative min-h-[240px] bg-slate-900 lg:min-h-[360px]">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt={mediaAlt(item, "Success story")}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-800" />
            )}

            {videoUrl && photo ? (
              <button
                type="button"
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center border-0 bg-black/10 transition hover:bg-black/25"
                aria-label="Play video"
              >
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7c3aed,#4f46e5)] text-white shadow-2xl ring-4 ring-white/20">
                  <PlayIcon className="size-7 translate-x-0.5" />
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {embedSrc ? (
        <YoutubeModal
          open={videoOpen}
          title={item?.title || "Success story"}
          embedSrc={embedSrc}
          watchHref={watchHref}
          onClose={() => setVideoOpen(false)}
        />
      ) : null}
    </>
  );
}

/** Industry icon tabs + split story panel (client success stories pattern). */
export default function TabsSuccessStoriesSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "tabs_success_stories",
  cmsMode,
  onEditField,
  onFormOpen,
}) {
  const stories = resolveSectionItems(mappingItems);
  const [active, setActive] = useState(0);
  const current = stories[Math.min(active, Math.max(stories.length - 1, 0))];

  if (!stories.length && !cmsMode) return null;

  return (
    <section className="relative w-full overflow-hidden bg-transparent py-14 sm:py-16 lg:py-20">
      <SectionWrapper>
        <header className="mx-auto mb-8 max-w-4xl text-center sm:mb-10">
          <CmsEditable
            cmsMode={cmsMode}
            field="section_title"
            label="Title"
            onEditField={onEditField}
          >
            {section_title ? (
              <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl dark:text-white">
                {section_title}
              </h2>
            ) : (
              <h2 className="m-0 text-3xl font-semibold text-slate-300 italic sm:text-4xl dark:text-slate-600">
                Add title…
              </h2>
            )}
          </CmsEditable>
          {sub_title || cmsMode ? (
            <CmsEditable
              cmsMode={cmsMode}
              field="sub_title"
              label="Subtitle"
              onEditField={onEditField}
              className="mt-3"
            >
              {sub_title ? (
                <p className="m-0 text-base text-slate-600 dark:text-slate-300">
                  {sub_title}
                </p>
              ) : (
                <p className="m-0 text-base text-slate-400 italic">Add subtitle…</p>
              )}
            </CmsEditable>
          ) : null}
        </header>

        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode={cmsMode}
          onEditField={onEditField}
          itemCount={stories.length}
        />

        {stories.length ? (
          <div className="space-y-6">
            <div
              role="tablist"
              aria-label="Success stories"
              className="flex flex-wrap justify-center gap-2 sm:gap-3"
            >
              {stories.map((item, i) => (
                <StoryTab
                  key={item._id || item.id || i}
                  item={item}
                  active={i === active}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
            <StoryPanel
              item={current}
              cmsMode={cmsMode}
              onFormOpen={onFormOpen}
            />
          </div>
        ) : (
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        )}
      </SectionWrapper>
    </section>
  );
}
