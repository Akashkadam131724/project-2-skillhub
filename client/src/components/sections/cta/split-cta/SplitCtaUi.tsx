import type { CSSProperties } from "react";
import { SectionLayoutRoot } from "@/components/sections/layout";
import { SPLIT_CTA_THEME_BAND_CLASS } from "./lib/band";
import type { SplitCtaUiProps } from "./lib/types";

export default function SplitCtaUi({
  id,
  title,
  subtitle,
  imageUrl,
  imageSide = "right",
  bandStyle = null,
  useThemeBand = true,
  titleSlot,
  subtitleSlot,
  footer = null,
  imageSideControl = null,
}: SplitCtaUiProps) {
  const copyCol = (
    <div className="flex w-full flex-[2] items-center py-10 md:py-14 lg:py-[60px]">
      <div className="w-full min-w-0">
        {titleSlot ??
          (title ? (
            <h2 className="m-0 mb-3 max-w-xl text-[22px] leading-[30px] font-semibold text-white md:mb-3 md:text-xl md:leading-[26px] lg:mb-[18px] lg:text-[26px] lg:leading-9 xl:text-[32px] xl:leading-[42px]">
              {title}
            </h2>
          ) : null)}
        {subtitleSlot ??
          (subtitle ? (
            <p className="m-0 mb-6 max-w-xl text-base leading-6 font-normal text-white/90 md:mb-[26px] md:text-sm md:leading-[18px] lg:mb-[34px] lg:text-sm lg:leading-[22px] xl:text-base xl:leading-6">
              {subtitle}
            </p>
          ) : null)}
        {footer}
      </div>
    </div>
  );

  const imageCol = (
    <div className="relative hidden h-[260px] w-full flex-1 md:block">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 size-full object-contain object-bottom"
        />
      ) : null}
    </div>
  );

  const sectionStyle: CSSProperties | undefined = bandStyle || undefined;

  return (
    <SectionLayoutRoot
      id={id}
      className={`py-0 ${
        useThemeBand && !bandStyle ? SPLIT_CTA_THEME_BAND_CLASS : ""
      }`}
      padding="none"
      layout="wrapper"
      sectionStyle={sectionStyle}
      hasBodyContent
    >
      {imageSideControl}
      <div
        className={`flex items-end gap-0 md:gap-[90px] lg:gap-[120px] xl:gap-[180px] ${
          imageSide === "left" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {copyCol}
        {imageCol}
      </div>
    </SectionLayoutRoot>
  );
}
