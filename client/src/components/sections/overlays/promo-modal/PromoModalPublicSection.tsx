"use client";

import { useEffect, useState } from "react";
import SectionButtons from "@/components/ui/SectionButtons";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import PromoModalUi from "./PromoModalUi";
import { resolvePromoModalConfig } from "./lib/map";
import { isPromoModalPlacementShowable } from "./lib/placement";
import type { PromoModalSectionProps } from "./lib/types";

/** Public promo modal — timer + sessionStorage dismiss → {@link PromoModalUi}. */
export default function PromoModalPublicSection({
  section_title,
  sub_title,
  data = {},
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: PromoModalSectionProps) {
  const { delayMs, storageKey, body } = resolvePromoModalConfig(data);
  const [open, setOpen] = useState(false);

  const showable = isPromoModalPlacementShowable(
    {
      section_title,
      sub_title,
      data,
      buttons,
      button_title,
      target_url,
    },
    false
  );

  useEffect(() => {
    if (!showable) return undefined;
    if (storageKey && typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem(storageKey) === "1") return undefined;
      } catch {
        /* ignore */
      }
    }
    const t = window.setTimeout(() => setOpen(true), delayMs);
    return () => window.clearTimeout(t);
  }, [showable, delayMs, storageKey]);

  if (!showable) return null;

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  function dismiss() {
    setOpen(false);
    if (storageKey && typeof window !== "undefined") {
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {
        /* ignore */
      }
    }
  }

  return (
    <PromoModalUi
      id={id}
      open={open}
      onDismiss={dismiss}
      title={section_title}
      subtitle={sub_title}
      body={body}
      footer={
        list.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <SectionButtons buttons={list} onFormOpen={onFormOpen} />
          </div>
        ) : null
      }
    />
  );
}
