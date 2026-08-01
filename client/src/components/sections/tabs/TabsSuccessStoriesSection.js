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
import PlayIcon from "@/components/icons/PlayIcon";
import SuccessStoryTabIcon from "@/components/icons/SuccessStoryTabIcon";

const DEFAULT_GRADIENT =
  "linear-gradient(135deg, #2e1064 0%, #4c1d95 45%, #312e81 100%)";

function StoryTab({ item, active, onClick }) {
  const label = item.label || item.title || "Story";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`section-tab section-tab--horizontal inline-flex items-center gap-2 text-sm font-semibold${
        active ? " is-active" : ""
      }`}
    >
      <SuccessStoryTabIcon name={item.icon} />
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
              <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight section-theme-heading sm:text-4xl">
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
                <p className="m-0 text-base section-theme-muted">
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
              className="section-tabs-list section-tabs-list--horizontal flex-wrap justify-center"
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
