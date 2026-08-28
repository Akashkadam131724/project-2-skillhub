import { SectionBrandGlow } from "@/components/sections/shared/design";
import { VENDOR_LINKS_GRID_DARK_GRADIENT_STYLE } from "./lib/band";

type VendorLinksGridBandDecorProps = {
  darkBand?: boolean;
};

/** Theme-aware atmosphere — full ink→brand gradient on dark bands, brand glow on light. */
export default function VendorLinksGridBandDecor({
  darkBand = true,
}: VendorLinksGridBandDecorProps) {
  if (!darkBand) {
    return <SectionBrandGlow />;
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={VENDOR_LINKS_GRID_DARK_GRADIENT_STYLE}
      />
      <div
        className="absolute top-0 left-1/4 size-96 animate-pulse rounded-full blur-3xl"
        style={{
          background:
            "color-mix(in srgb, var(--brand) 22%, transparent)",
        }}
      />
      <div
        className="absolute right-1/4 bottom-0 size-96 animate-pulse rounded-full blur-3xl [animation-delay:1s]"
        style={{
          background: "color-mix(in srgb, var(--ink) 28%, transparent)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full blur-3xl [animation-delay:2s]"
        style={{
          background:
            "color-mix(in srgb, var(--brand) 16%, transparent)",
        }}
      />
    </div>
  );
}
