"use client";

import type { Dispatch, RefObject, SetStateAction } from "react";
import type { SarderEcosystemLogoItem } from "./lib/types";
import SarderEcosystemLogoPill from "./SarderEcosystemLogoPill";
import { SarderEcosystemCardConnector } from "./SarderEcosystemSpine";

type SarderEcosystemCardProps = {
  title: string;
  items: SarderEcosystemLogoItem[];
  cardRef: RefObject<HTMLDivElement | null>;
  headerRef: RefObject<HTMLSpanElement | null>;
  setDotY: Dispatch<SetStateAction<number>>;
  isMiddle: boolean;
  containerRef: RefObject<HTMLElement | null>;
};

export default function SarderEcosystemCard({
  title,
  items,
  cardRef,
  headerRef,
  setDotY,
  isMiddle,
  containerRef,
}: SarderEcosystemCardProps) {
  const gridCols =
    items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <div
      ref={cardRef}
      className="relative overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="rounded-t-xl border-b border-gray-200 bg-gray-50 px-3 py-2">
        <span
          ref={headerRef}
          className="text-base font-semibold text-gray-800"
        >
          {title}
        </span>
      </div>

      <div className="px-3 py-3">
        <div className={`grid gap-3 ${gridCols}`}>
          {items.map((item, i) => (
            <SarderEcosystemLogoPill key={item.id ?? i} {...item} />
          ))}
        </div>
      </div>

      <SarderEcosystemCardConnector
        cardRef={cardRef}
        headerRef={headerRef}
        setDotY={setDotY}
        isMiddle={isMiddle}
        containerRef={containerRef}
      />
    </div>
  );
}
