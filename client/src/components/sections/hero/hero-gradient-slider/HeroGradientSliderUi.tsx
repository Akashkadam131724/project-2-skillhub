"use client";

import { useEffect, useRef, useState } from "react";
import ChevronLeftIcon from "@/components/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import YoutubeModal from "@/components/ui/YoutubeModal";
import {
  youtubeEmbedUrl,
  youtubeWatchUrl,
} from "@/lib/utils/button-types";
import { mediaAlt } from "@/lib/utils/media-alt";
import HeroGradientSliderAnimatedBg from "./HeroGradientSliderAnimatedBg";
import HeroGradientSliderCtaButtons from "./HeroGradientSliderCtaButtons";
import HeroGradientSliderImage from "./HeroGradientSliderImage";
import HeroGradientSliderPlayIcon from "./HeroGradientSliderPlayIcon";
import HeroGradientSliderStatsRow from "./HeroGradientSliderStatsRow";
import { SECTION_CONTENT_INSET_CLASS } from "@/components/sections/SectionWrapper";
import { HERO_GRADIENT_SLIDER_DEFAULT_BG } from "./lib/static-demo";
import type { HeroGradientSliderUiProps } from "./lib/types";
import "./hero-gradient-slider.css";

const FIRST_SLIDE_INDEX = 0;

export default function HeroGradientSliderUi({
  id,
  slides,
  autoplayMs = 12000,
}: HeroGradientSliderUiProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const count = slides.length;
  const slide = count ? slides[Math.min(currentSlide, count - 1)] : null;
  const bgStyle = slide?.bgColor || HERO_GRADIENT_SLIDER_DEFAULT_BG;
  const videoUrl = slide?.videoUrl?.trim() || "";
  const embedSrc = videoUrl
    ? youtubeEmbedUrl(videoUrl, { autoplay: true })
    : null;
  const watchHref = videoUrl ? youtubeWatchUrl(videoUrl) || videoUrl : null;
  const hasVideo = Boolean(videoUrl && embedSrc);
  const showStats =
    currentSlide === FIRST_SLIDE_INDEX && slide?.showStats !== false;

  useEffect(() => {
    setCurrentSlide(0);
  }, [slides.length]);

  useEffect(() => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
      autoPlayRef.current = null;
    }

    if (count <= 1 || isFormModalOpen || isVideoOpen || !autoplayMs) return;

    autoPlayRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % count);
    }, autoplayMs);

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [currentSlide, count, isFormModalOpen, isVideoOpen, autoplayMs]);

  if (!count || !slide) return null;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % count);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + count) % count);

  const description =
    slide.body ||
    "<p>Accelerate workforce transformation with AI-driven learning solutions.</p>";

  return (
    <section
      id={id}
      data-always-light-text=""
      className="relative overflow-hidden py-0 text-white"
      style={{ background: bgStyle }}
    >
      <HeroGradientSliderAnimatedBg />

      <div className="relative flex min-h-[28rem] flex-col items-stretch lg:min-h-[calc(100vh-116px)] lg:flex-row">
        {/* Content Section */}
        <div className="relative z-[1] flex w-full items-center lg:w-[60%]">
          <div
            key={slide.id}
            className={`hp-content-enter flex w-full flex-col justify-center space-y-6 py-8 sm:py-12 lg:space-y-8 lg:py-[60px] lg:py-0 ${SECTION_CONTENT_INSET_CLASS}`}
          >
            <div className="space-y-4 lg:space-y-6">
              <h1 className="m-0 text-[40px] font-semibold leading-tight tracking-tight text-white sm:text-[36px] lg:text-[40px]">
                {slide.title}
              </h1>
              <div
                className="leading-relaxed text-slate-200 [&>*]:m-0"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>

            <HeroGradientSliderCtaButtons
              buttons={slide.buttons}
              onFormOpenChange={setIsFormModalOpen}
            />

            {showStats ? <HeroGradientSliderStatsRow /> : null}

            {hasVideo ? (
              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                className="mt-4 rounded-full transition duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 lg:hidden"
                aria-label="Play video"
              >
                <HeroGradientSliderPlayIcon />
              </button>
            ) : null}
          </div>
        </div>

        {/* Image Section — desktop */}
        <div
          key={`image-${slide.id}`}
          className="hp-image-enter relative hidden h-auto w-full overflow-hidden lg:block lg:w-1/2"
        >
          <div className="hp-image-inner relative flex h-full w-full items-stretch">
            {hasVideo ? (
              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full transition duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                aria-label="Play video"
              >
                <HeroGradientSliderPlayIcon />
              </button>
            ) : null}

            <HeroGradientSliderImage
              src={slide.sideImageUrl}
              alt={mediaAlt(slide.title, "Banner")}
              className="h-full w-full shrink-0 object-cover object-[center_75%] lg:object-center"
            />
          </div>
        </div>

        {/* Image Section — mobile */}
        {slide.sideImageUrl ? (
          <div className="relative aspect-[4/3] w-full lg:hidden">
            <HeroGradientSliderImage
              src={slide.sideImageUrl}
              alt={mediaAlt(slide.title, "Banner")}
              className="h-full w-full object-cover object-center"
            />
            {hasVideo ? (
              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/20"
                aria-label="Play video"
              >
                <HeroGradientSliderPlayIcon />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="pointer-events-auto relative z-20 flex w-full justify-start px-6 pb-8 md:justify-center lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:px-0 lg:py-0 lg:pb-8">
          <div className="flex items-center gap-3 lg:justify-center">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="mb-0 rounded-full border border-white/20 bg-white/10 p-2 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20"
            >
              <ChevronLeftIcon className="h-4 w-4 text-white" />
            </button>

            <div className="flex items-center space-x-2">
              {slides.map((s, index) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={`relative mb-0 h-2 overflow-hidden rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 bg-white/30"
                      : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentSlide ? "true" : undefined}
                >
                  {index === currentSlide ? (
                    <span
                      key={currentSlide}
                      className="hp-dot-progress pointer-events-none absolute left-0 top-0 h-full rounded-full bg-white"
                      style={{ animationDuration: `${autoplayMs}ms` }}
                    />
                  ) : null}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="mb-0 rounded-full border border-white/20 bg-white/10 p-2 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20"
            >
              <ChevronRightIcon className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      ) : null}

      <YoutubeModal
        open={isVideoOpen}
        title={slide.title}
        embedSrc={embedSrc}
        watchHref={watchHref}
        onClose={() => setIsVideoOpen(false)}
      />
    </section>
  );
}
