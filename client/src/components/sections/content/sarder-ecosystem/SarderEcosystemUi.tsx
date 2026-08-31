"use client";

import Image from "next/image";
import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { SectionLayoutRoot } from "@/components/sections/layout";
import type { SarderEcosystemGroup, SarderEcosystemUiProps } from "./lib/types";
import SarderEcosystemCard from "./SarderEcosystemCard";
import {
  SarderEcosystemBoundedSpine,
  SarderEcosystemLeftBridge,
} from "./SarderEcosystemSpine";

export default function SarderEcosystemUi({
  id,
  className = "",
  title = "",
  subtitle = "",
  logoSrc = "",
  logoAlt = "Sarder logo",
  groups = [],
  titleSlot,
  subtitleSlot,
  logoSlot,
  groupsBar,
  emptyGroupsState,
}: SarderEcosystemUiProps) {
  const rightRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const [dotY, setDotY] = useState(0);
  const [leftOffset, setLeftOffset] = useState(0);

  const cardRefs = useMemo(
    () => groups.map(() => createRef<HTMLDivElement>()),
    [groups]
  );
  const headerRefs = useMemo(
    () => groups.map(() => createRef<HTMLSpanElement>()),
    [groups]
  );

  useEffect(() => {
    const align = () => {
      if (!logoRef.current || !rightRef.current) {
        setLeftOffset(0);
        return;
      }

      if (window.innerWidth < 1280) {
        setLeftOffset(0);
        return;
      }

      if (!dotY) {
        setLeftOffset(0);
        return;
      }

      const rightRect = rightRef.current.getBoundingClientRect();
      const logoRect = logoRef.current.getBoundingClientRect();
      const logoCenterRel = logoRect.top - rightRect.top + logoRect.height / 2;
      setLeftOffset(dotY - logoCenterRel);
    };

    align();
    window.addEventListener("resize", align);
    return () => window.removeEventListener("resize", align);
  }, [dotY]);

  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showLogo = logoSlot != null || Boolean(logoSrc);
  const showGroups =
    groupsBar != null || emptyGroupsState != null || groups.length > 0;

  if (!showTitle && !showSubtitle && !showLogo && !showGroups) return null;

  const middleIndex = groups.length ? Math.min(1, groups.length - 1) : 0;

  return (
    <SectionLayoutRoot
      id={id}
      className={`bg-[#f5f5f5] px-4 pt-20 pb-20 md:px-4 xl:px-0 ${className}`.trim()}
      padding="none"
      layout="wrapper"
      hasBodyContent
      ariaLabelledBy={id ? `${id}-title` : "sarder-ecosystem-title"}
    >
      <div className="grid w-full max-w-[1200px] grid-cols-1 gap-10 xl:mx-auto xl:grid-cols-[380px_1fr]">
        <div
          style={{ transform: `translateY(${leftOffset}px)` }}
          className="flex flex-col items-center gap-4 xl:items-start"
        >
          {logoSlot ??
            (showLogo ? (
              <Image
                ref={logoRef}
                src={logoSrc}
                alt={logoAlt}
                width={260}
                height={70}
                className="order-1 h-9 w-auto object-contain md:order-3 md:h-[60px]"
              />
            ) : null)}

          <div className="order-2 text-center md:order-1 xl:text-left">
            {titleSlot ??
              (showTitle ? (
                <h2
                  id={id ? `${id}-title` : "sarder-ecosystem-title"}
                  className="text-[26px] font-semibold text-gray-900"
                >
                  {title}
                </h2>
              ) : null)}
            {subtitleSlot ??
              (showSubtitle ? (
                <p className="mt-2 text-[15px] text-gray-600">{subtitle}</p>
              ) : null)}
          </div>
        </div>

        {showGroups ? (
          <section ref={rightRef} className="relative flex flex-col gap-6">
            {groupsBar}

            {groups.length > 0 ? (
              <>
                <SarderEcosystemBoundedSpine
                  containerRef={rightRef}
                  headerRefs={headerRefs}
                />
                <SarderEcosystemLeftBridge
                  containerRef={rightRef}
                  anchorHeaderRef={headerRefs[middleIndex]}
                />
                {groups.map((group: SarderEcosystemGroup, idx) => (
                  <SarderEcosystemCard
                    key={group.id ?? idx}
                    title={group.title}
                    items={group.items}
                    cardRef={cardRefs[idx]}
                    headerRef={headerRefs[idx]}
                    setDotY={setDotY}
                    isMiddle={idx === middleIndex}
                    containerRef={rightRef}
                  />
                ))}
              </>
            ) : (
              emptyGroupsState
            )}
          </section>
        ) : null}
      </div>
    </SectionLayoutRoot>
  );
}
