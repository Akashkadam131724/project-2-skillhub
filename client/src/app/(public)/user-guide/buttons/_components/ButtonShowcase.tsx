"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, type ReactNode } from "react";
import DsButton from "@/components/ui/DsButton";
import SectionButtons from "@/components/ui/SectionButtons";
import SectionWrapper from "@/components/sections/SectionWrapper";
import {
  BUTTON_ACTION_LABELS,
  BUTTON_ACTION_TYPES,
  BUTTON_ICON_GROUPS,
  BUTTON_ICON_LABELS,
  BUTTON_SHAPE_LABELS,
  BUTTON_SHAPES,
  BUTTON_SIZE_LABELS,
  BUTTON_SIZES,
  BUTTON_VARIANT_LABELS,
  BUTTON_VARIANTS,
  normalizeButton,
} from "@/lib/utils/button-types";
import { BUTTON_APPEARANCE_PRESETS } from "@/lib/ui/button-class-catalog";
import {
  normalizeButtonsDraft,
  serializeButtonsDraft,
} from "@/components/cms/editors/CmsButtonsEditor";
import {
  BUTTON_ACTION_DEMOS,
  BUTTON_BUILDER_STARTER,
} from "../lib/button-demo-samples";

const CmsButtonsEditor = dynamic(
  () => import("@/components/cms/editors/CmsButtonsEditor"),
  {
    ssr: false,
    loading: () => (
      <p className="section-theme-muted m-0 text-sm">Loading button editor…</p>
    ),
  }
);

function DemoSection({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-t border-slate-200 dark:border-slate-800"
    >
      <SectionWrapper className="py-8 sm:py-10">
        <h2 className="section-theme-heading m-0 text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        {description ? (
          <p className="section-theme-muted mt-2 mb-0 max-w-3xl text-sm leading-relaxed">
            {description}
          </p>
        ) : null}
        <div className="mt-6">{children}</div>
      </SectionWrapper>
    </section>
  );
}

function SurfaceRow({
  label,
  dark = false,
  children,
}: {
  label: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        dark
          ? "border-slate-700 bg-slate-900"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
      }`}
      {...(dark ? { "data-section-theme": "dark" } : {})}
    >
      <p
        className={`m-0 mb-4 text-[10px] font-semibold tracking-[0.18em] uppercase ${
          dark ? "text-white/50" : "text-slate-400"
        }`}
      >
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function ButtonShowcase() {
  const [draft, setDraft] = useState<ReturnType<typeof normalizeButtonsDraft>>(
    () => normalizeButtonsDraft(BUTTON_BUILDER_STARTER)
  );

  const serialized = useMemo(() => serializeButtonsDraft(draft), [draft]);
  const jsonPreview = useMemo(
    () => JSON.stringify(serialized, null, 2),
    [serialized]
  );

  return (
    <>
      <DemoSection
        title="Variants"
        description="Seven style presets. Primary and outline are the usual pair on dark hero bands; ghost and link work well in dense UI."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <SurfaceRow label="Light section">
            {BUTTON_VARIANTS.map((variant) => (
              <DsButton
                key={variant}
                preview
                surface="light"
                button={normalizeButton({
                  label:
                    (BUTTON_VARIANT_LABELS as Record<string, string>)[variant]?.split(
                      " ("
                    )[0] || variant,
                  variant,
                  icon: "none",
                  action_type: "url",
                  target_url: "#",
                })}
              />
            ))}
          </SurfaceRow>
          <SurfaceRow label="Dark section" dark>
            {BUTTON_VARIANTS.map((variant) => (
              <DsButton
                key={variant}
                preview
                surface="dark"
                button={normalizeButton({
                  label:
                    (BUTTON_VARIANT_LABELS as Record<string, string>)[variant]?.split(
                      " ("
                    )[0] || variant,
                  variant,
                  icon: "none",
                  action_type: "url",
                  target_url: "#",
                })}
              />
            ))}
          </SurfaceRow>
        </div>
      </DemoSection>

      <DemoSection title="Sizes" description="sm · md (default) · lg">
        <SurfaceRow label="All sizes — primary">
          {BUTTON_SIZES.map((size) => (
            <DsButton
              key={size}
              preview
              surface="light"
              button={normalizeButton({
                label: (BUTTON_SIZE_LABELS as Record<string, string>)[size],
                variant: "primary",
                size,
                icon: "none",
              })}
            />
          ))}
        </SurfaceRow>
      </DemoSection>

      <DemoSection title="Shapes" description="rounded · pill · square">
        <SurfaceRow label="All shapes — outline">
          {BUTTON_SHAPES.map((shape) => (
            <DsButton
              key={shape}
              preview
              surface="light"
              button={normalizeButton({
                label: (BUTTON_SHAPE_LABELS as Record<string, string>)[shape],
                variant: "outline",
                shape,
                icon: "none",
              })}
            />
          ))}
        </SurfaceRow>
      </DemoSection>

      <DemoSection
        title="Action types"
        description="What happens when a visitor clicks — configured in CMS per button."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {BUTTON_ACTION_TYPES.map((actionType) => (
            <div
              key={actionType}
              className="section-ui-card rounded-xl border p-4"
            >
              <p className="m-0 font-mono text-xs text-brand">{actionType}</p>
              <p className="section-theme-muted m-0 mt-1 text-sm">
                {BUTTON_ACTION_LABELS[actionType as keyof typeof BUTTON_ACTION_LABELS]}
              </p>
              <div className="mt-4">
                <DsButton
                  button={
                    BUTTON_ACTION_DEMOS[
                      actionType as keyof typeof BUTTON_ACTION_DEMOS
                    ]
                  }
                  onFormOpen={(key: string) =>
                    window.alert(`Form opened: ${key || "contact"}`)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection
        title="Icon catalog"
        description="Grouped presets from the CMS icon picker. Use auto to infer from the action (e.g. mail for email, external for https links)."
      >
        <div className="space-y-6">
          {BUTTON_ICON_GROUPS.map((group) => (
            <div key={group.id}>
              <h3 className="section-theme-heading m-0 text-sm font-semibold">
                {group.label}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.icons.map((iconId) => (
                  <DsButton
                    key={iconId}
                    preview
                    surface="light"
                    button={normalizeButton({
                      label:
                        (BUTTON_ICON_LABELS as Record<string, string>)[iconId] ||
                        iconId,
                      variant: "secondary",
                      size: "sm",
                      icon: iconId,
                      action_type: "url",
                      target_url: "#",
                    })}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection
        title="Appearance presets"
        description="One-click Tailwind overrides for editors — white outline and solid white on dark bands."
      >
        <SurfaceRow label="Dark band" dark>
          {BUTTON_APPEARANCE_PRESETS.map((preset) => (
            <DsButton
              key={preset.id}
              preview
              surface="dark"
              button={normalizeButton({
                label: preset.label,
                variant: "primary",
                icon: "none",
                action_type: "url",
                target_url: "#",
                ...preset.patch,
              })}
            />
          ))}
        </SurfaceRow>
      </DemoSection>

      <DemoSection
        id="button-builder"
        title="Button builder"
        description="Same editor used in CMS section live-edit. Add buttons, set style and action, drag to reorder — then copy the JSON into a section's buttons field."
      >
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="section-ui-card rounded-2xl border p-4 sm:p-5">
            {/* CmsButtonsEditor is untyped JS — draft shape matches normalizeButtonsDraft */}
            <CmsButtonsEditor
              value={draft}
              onChange={setDraft}
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="m-0 text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
                Live preview
              </p>
              <div className="mt-3 grid gap-4">
                <SurfaceRow label="Light section">
                  <SectionButtons
                    buttons={serialized}
                    onFormOpen={(key) =>
                      window.alert(`Form opened: ${key || "contact"}`)
                    }
                    surface="light"
                  />
                </SurfaceRow>
                <SurfaceRow label="Dark section" dark>
                  <SectionButtons
                    buttons={serialized}
                    onFormOpen={(key) =>
                      window.alert(`Form opened: ${key || "contact"}`)
                    }
                    surface="dark"
                  />
                </SurfaceRow>
              </div>
            </div>

            <div>
              <p className="m-0 text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
                CMS JSON
              </p>
              <p className="section-theme-muted mt-1 mb-0 text-xs">
                Paste into a section&apos;s <code>buttons</code> array in the
                CMS or API payload.
              </p>
              <pre className="section-ui-card mt-3 max-h-80 overflow-auto rounded-xl border p-4 font-mono text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {jsonPreview}
              </pre>
            </div>

            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm leading-relaxed dark:border-slate-700">
              <p className="section-theme-heading m-0 font-semibold">
                How to add buttons in CMS
              </p>
              <ol className="section-theme-muted mt-2 mb-0 list-decimal space-y-1.5 pl-5">
                <li>Open a page in live-edit and select a section.</li>
                <li>
                  Use <strong>Manage buttons</strong> in the section footer (or
                  item-level buttons where supported).
                </li>
                <li>
                  Set <strong>Label</strong>, <strong>Style</strong>,{" "}
                  <strong>Size</strong>, <strong>Icon</strong>, and{" "}
                  <strong>Action</strong>.
                </li>
                <li>
                  Optionally override colors with appearance fields or the white
                  outline / solid white presets.
                </li>
                <li>Drag to reorder; inactive buttons are hidden on the site.</li>
              </ol>
            </div>
          </div>
        </div>
      </DemoSection>
    </>
  );
}
