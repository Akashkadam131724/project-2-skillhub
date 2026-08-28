"use client";

import SectionButtons from "@/components/ui/SectionButtons";
import { sortActiveButtons } from "@/lib/utils/button-types";
import PromoModalUi from "./PromoModalUi";
import { resolvePromoModalConfig } from "./lib/map";
import { PROMO_MODAL_STATIC_DEMO } from "./lib/static-demo";

export type PromoModalStaticProps = {
  id?: string;
};

/** Static promo modal — open dialog with demo content for showcase. */
export default function PromoModalStatic({
  id = "promo-modal-static",
}: PromoModalStaticProps = {}) {
  const demo = PROMO_MODAL_STATIC_DEMO;
  const { body } = resolvePromoModalConfig(demo.data);
  const list = sortActiveButtons(demo.buttons);

  return (
    <PromoModalUi
      id={id}
      open
      onDismiss={() => {}}
      title={demo.section_title}
      subtitle={demo.sub_title}
      body={body}
      footer={
        list.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <SectionButtons buttons={list} />
          </div>
        ) : null
      }
    />
  );
}
