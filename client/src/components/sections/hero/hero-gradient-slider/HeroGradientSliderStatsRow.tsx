import ButtonIcon from "@/components/icons/ButtonIcon";
import type { HeroGradientSliderStat } from "./lib/types";

type HeroGradientSliderStatsRowProps = {
  stats?: HeroGradientSliderStat[];
};

/** Trust stats row — only rendered when the current slide has stats. */
export default function HeroGradientSliderStatsRow({
  stats = [],
}: HeroGradientSliderStatsRowProps) {
  if (!stats.length) return null;

  return (
    <div className="flex flex-col flex-wrap items-start gap-6 pt-2 md:flex md:flex-row lg:gap-3">
      {stats.map((stat) => (
        <div key={stat.id} className="flex items-start gap-2">
          {stat.icon ? (
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F4F7FE]"
              aria-hidden
            >
              <ButtonIcon
                kind={stat.icon}
                className="h-3.5 w-3.5 text-[var(--accent-blue)]"
              />
            </span>
          ) : null}
          <div>
            <div className="relative top-[-3px] pb-1 text-[18px] font-bold text-white">
              {stat.value}
            </div>
            <div
              className="h-px shrink-0 bg-white/50 opacity-50 md:w-full"
              aria-hidden
            />
            <div className="mt-2 text-[12px] leading-tight text-white/90">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
