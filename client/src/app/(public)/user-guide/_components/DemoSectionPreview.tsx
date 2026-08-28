"use client";

import { useEffect, useState, type ComponentType } from "react";
import PromoModalUi from "@/components/sections/overlays/promo-modal/PromoModalUi";
import { resolvePromoModalConfig } from "@/components/sections/overlays/promo-modal/lib/map";
import { PROMO_MODAL_STATIC_DEMO } from "@/components/sections/overlays/promo-modal/lib/static-demo";
import SectionWrapper from "@/components/sections/SectionWrapper";
import SectionButtons from "@/components/ui/SectionButtons";
import { SECTION_STATIC_LOADERS } from "@/lib/demo/section-static-loaders";
import {
  isSectionStaticSpecial,
  isSectionStaticUnavailable,
} from "@/lib/demo/section-static-registry";
import { sortActiveButtons } from "@/lib/utils/button-types";

type PreviewComponent = ComponentType<{ id?: string }>;

function PreviewLoading() {
  return (
    <SectionWrapper className="py-10">
      <p className="section-theme-muted m-0 text-sm">Loading preview…</p>
    </SectionWrapper>
  );
}

function PromoModalPreview() {
  const [open, setOpen] = useState(false);
  const demo = PROMO_MODAL_STATIC_DEMO;
  const { body } = resolvePromoModalConfig(demo.data);
  const buttons = sortActiveButtons(demo.buttons);

  return (
    <SectionWrapper className="py-10">
      <p className="section-theme-muted m-0 max-w-xl text-sm leading-relaxed">
        Promo modals are overlay components — preview opens on demand so this
        page stays scrollable.
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-brand mt-4 inline-flex cursor-pointer items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white"
      >
        Preview promo modal
      </button>
      <PromoModalUi
        id="demo-promo-modal"
        open={open}
        onDismiss={() => setOpen(false)}
        title={demo.section_title}
        subtitle={demo.sub_title}
        body={body}
        footer={
          buttons.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <SectionButtons buttons={buttons} />
            </div>
          ) : null
        }
      />
    </SectionWrapper>
  );
}

function UnavailablePreview({
  name,
  sectionKey,
}: {
  name: string;
  sectionKey: string;
}) {
  return (
    <SectionWrapper className="py-10">
      <p className="section-theme-muted m-0 max-w-2xl rounded-xl border border-dashed border-slate-300 px-4 py-8 text-sm leading-relaxed dark:border-slate-700">
        <strong className="section-theme-heading font-semibold">{name}</strong>{" "}
        (<code className="text-xs">{sectionKey}</code>) loads live catalog or
        directory data from the API — no static preview component yet. Add this
        section in CMS on a page with seeded content to see it in context.
      </p>
    </SectionWrapper>
  );
}

export default function DemoSectionPreview({
  sectionKey,
  name,
}: {
  sectionKey: string;
  name: string;
}) {
  const [Component, setComponent] = useState<PreviewComponent | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (
      isSectionStaticUnavailable(sectionKey) ||
      isSectionStaticSpecial(sectionKey)
    ) {
      return undefined;
    }

    const loader = SECTION_STATIC_LOADERS[sectionKey];
    if (!loader) {
      return undefined;
    }

    let active = true;
    setComponent(null);
    setFailed(false);

    loader()
      .then((mod) => {
        if (active) setComponent(() => mod.default);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [sectionKey]);

  if (isSectionStaticUnavailable(sectionKey)) {
    return <UnavailablePreview name={name} sectionKey={sectionKey} />;
  }

  if (isSectionStaticSpecial(sectionKey)) {
    return <PromoModalPreview />;
  }

  if (!SECTION_STATIC_LOADERS[sectionKey]) {
    return (
      <SectionWrapper className="py-10">
        <p className="section-theme-muted m-0 text-sm">
          No static preview registered for <code>{sectionKey}</code>.
        </p>
      </SectionWrapper>
    );
  }

  if (failed) {
    return (
      <SectionWrapper className="py-10">
        <p className="section-theme-muted m-0 text-sm">
          Failed to load preview for <code>{sectionKey}</code>.
        </p>
      </SectionWrapper>
    );
  }

  if (!Component) {
    return <PreviewLoading />;
  }

  return <Component id={`demo-${sectionKey}`} />;
}
