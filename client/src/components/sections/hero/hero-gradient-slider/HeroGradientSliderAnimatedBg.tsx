import { useId } from "react";

/** Atmosphere layer — Accent blue / purple / cyan from site + page theme. */
export default function HeroGradientSliderAnimatedBg() {
  const uid = useId().replace(/:/g, "");
  const g1 = `hp-grad-blue-${uid}`;
  const g2 = `hp-grad-purple-${uid}`;
  const g3 = `hp-grad-cyan-${uid}`;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden [&_*]:pointer-events-none"
      aria-hidden
    >
      <div
        className="hp-blob-1 absolute left-[8%] top-[6%] h-[24rem] w-[24rem] rounded-full blur-[42px]"
        style={{
          background: "color-mix(in srgb, var(--accent-blue) 20%, transparent)",
        }}
      />
      <div
        className="hp-blob-2 absolute bottom-0 right-[6%] h-[32rem] w-[32rem] rounded-full blur-[42px]"
        style={{
          background:
            "color-mix(in srgb, var(--accent-purple) 20%, transparent)",
        }}
      />
      <div
        className="hp-blob-3 absolute left-[35%] top-1/2 hidden h-[20rem] w-[16rem] rounded-full blur-[56px] lg:block"
        style={{
          background: "color-mix(in srgb, var(--accent-cyan) 15%, transparent)",
        }}
      />

      <svg className="absolute inset-0 h-full w-full opacity-30">
        <line
          x1="10%"
          y1="20%"
          x2="40%"
          y2="80%"
          stroke={`url(#${g1})`}
          strokeWidth="1"
          className="hp-line-1"
        />
        <line
          x1="60%"
          y1="10%"
          x2="90%"
          y2="70%"
          stroke={`url(#${g2})`}
          strokeWidth="1"
          className="hp-line-2"
        />
        <line
          x1="30%"
          y1="90%"
          x2="70%"
          y2="30%"
          stroke={`url(#${g3})`}
          strokeWidth="1"
          className="hp-line-3"
        />
        <defs>
          <linearGradient id={g1} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--accent-blue)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g2} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-purple)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--accent-purple)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent-purple)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g3} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--accent-cyan)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {[...Array(15)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="hp-particle absolute h-1 w-1 rounded-full"
          style={{
            left: `${10 + i * 6}%`,
            top: `${20 + ((i * 17) % 60)}%`,
            backgroundColor: "var(--accent-blue)",
            animationDuration: `${3 + i * 0.5}s`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}

      {[...Array(8)].map((_, i) => (
        <div
          key={`node-${i}`}
          className="hp-node absolute h-2 w-2 rounded-full"
          style={{
            left: `${15 + i * 12}%`,
            top: `${30 + ((i * 23) % 50)}%`,
            backgroundColor: "var(--accent-purple)",
            animationDuration: `${2 + i * 0.3}s`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}
