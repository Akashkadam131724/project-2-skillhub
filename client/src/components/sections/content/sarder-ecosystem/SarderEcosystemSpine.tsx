"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import {
  BAR_GAP,
  BAR_THICKNESS,
  DOT_SIZE,
  ELBOW_LENGTH,
  LEFT_BRIDGE_LEN,
  SPINE_LEFT,
  SPINE_BOTTOM_PAD,
  SPINE_TOP_PAD,
  SPINE_DOT_IMAGE,
} from "./lib/spine-constants";

const SPINE_COLOR = "bg-gray-300";

type CardConnectorProps = {
  cardRef: RefObject<HTMLDivElement | null>;
  headerRef: RefObject<HTMLSpanElement | null>;
  setDotY: Dispatch<SetStateAction<number>>;
  isMiddle: boolean;
  containerRef: RefObject<HTMLElement | null>;
};

export function SarderEcosystemCardConnector({
  cardRef,
  headerRef,
  setDotY,
  isMiddle,
  containerRef,
}: CardConnectorProps) {
  const [y, setY] = useState(0);

  useEffect(() => {
    const calc = () => {
      if (!cardRef.current || !headerRef.current || !containerRef.current) return;

      const cardRect = cardRef.current.getBoundingClientRect();
      const headerRect = headerRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const centerY = headerRect.top - cardRect.top + headerRect.height / 2;
      setY(centerY);

      if (isMiddle) {
        const dotCenterAbs = cardRect.top + centerY;
        const dotCenterRel = dotCenterAbs - containerRect.top;
        setDotY(dotCenterRel);
      }
    };

    calc();

    const ro = new ResizeObserver(calc);
    if (cardRef.current) ro.observe(cardRef.current);
    if (headerRef.current) ro.observe(headerRef.current);

    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("resize", calc);
      ro.disconnect();
    };
  }, [cardRef, headerRef, containerRef, isMiddle, setDotY]);

  return (
    <div
      className="absolute hidden items-center xl:flex"
      style={{
        left: SPINE_LEFT - DOT_SIZE / 2,
        top: y - DOT_SIZE / 2,
      }}
      aria-hidden
    >
      <Image
        src={SPINE_DOT_IMAGE}
        alt=""
        width={DOT_SIZE}
        height={DOT_SIZE}
      />
      <div
        className={`${SPINE_COLOR} rounded-full`}
        style={{
          marginLeft: BAR_GAP,
          width: ELBOW_LENGTH,
          height: BAR_THICKNESS,
        }}
      />
    </div>
  );
}

type BoundedSpineProps = {
  containerRef: RefObject<HTMLElement | null>;
  headerRefs: RefObject<HTMLSpanElement | null>[];
};

export function SarderEcosystemBoundedSpine({
  containerRef,
  headerRefs,
}: BoundedSpineProps) {
  const [bounds, setBounds] = useState({ top: 0, height: 0 });

  useEffect(() => {
    const calc = () => {
      const root = containerRef.current;
      if (!root) return;

      const rootRect = root.getBoundingClientRect();

      const centers = headerRefs
        .map((r) => r.current)
        .filter(Boolean)
        .map((el) => {
          const rc = el!.getBoundingClientRect();
          return rc.top - rootRect.top + rc.height / 2;
        });

      if (!centers.length) return;

      const minC = Math.min(...centers);
      const maxC = Math.max(...centers);
      const top = minC + SPINE_TOP_PAD;
      const bottom = maxC + SPINE_BOTTOM_PAD;

      setBounds({ top, height: Math.max(0, bottom - top) });
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [containerRef, headerRefs]);

  return (
    <div
      className={`absolute hidden rounded-full xl:block ${SPINE_COLOR}`}
      style={{
        left: SPINE_LEFT,
        top: bounds.top,
        width: BAR_THICKNESS,
        height: bounds.height,
      }}
      aria-hidden
    />
  );
}

type LeftBridgeProps = {
  containerRef: RefObject<HTMLElement | null>;
  anchorHeaderRef: RefObject<HTMLSpanElement | null>;
};

export function SarderEcosystemLeftBridge({
  containerRef,
  anchorHeaderRef,
}: LeftBridgeProps) {
  const [y, setY] = useState(0);

  useEffect(() => {
    const calc = () => {
      const root = containerRef.current;
      const el = anchorHeaderRef?.current;
      if (!root || !el) return;

      const rootRect = root.getBoundingClientRect();
      const rc = el.getBoundingClientRect();
      const centerY = rc.top - rootRect.top + rc.height / 2;
      setY(centerY);
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [containerRef, anchorHeaderRef]);

  const left = SPINE_LEFT - DOT_SIZE / 2 - BAR_GAP - LEFT_BRIDGE_LEN;

  return (
    <div
      className={`absolute hidden xl:block ${SPINE_COLOR}`}
      style={{
        top: y - BAR_THICKNESS / 2,
        left,
        width: LEFT_BRIDGE_LEN,
        height: BAR_THICKNESS,
        borderRadius: 9999,
      }}
      aria-hidden
    />
  );
}
