/** AI-themed animated background — CSS port of legacy Framer Motion layer */
export default function HeroGradientSliderAnimatedBg() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden [&_*]:pointer-events-none"
      aria-hidden
    >
      <div className="hp-blob-1 absolute left-[8%] top-[6%] h-[24rem] w-[24rem] rounded-full bg-[#3B82F6]/20 blur-[42px]" />
      <div className="hp-blob-2 absolute bottom-0 right-[6%] h-[32rem] w-[32rem] rounded-full bg-[#A855F7]/20 blur-[42px]" />
      <div className="hp-blob-3 absolute left-[35%] top-1/2 hidden h-[20rem] w-[16rem] rounded-full bg-[#06B6D4]/15 blur-[56px] lg:block" />

      <svg className="absolute inset-0 h-full w-full opacity-30">
        <line
          x1="10%"
          y1="20%"
          x2="40%"
          y2="80%"
          stroke="url(#hp-gradient1)"
          strokeWidth="1"
          className="hp-line-1"
        />
        <line
          x1="60%"
          y1="10%"
          x2="90%"
          y2="70%"
          stroke="url(#hp-gradient2)"
          strokeWidth="1"
          className="hp-line-2"
        />
        <line
          x1="30%"
          y1="90%"
          x2="70%"
          y2="30%"
          stroke="url(#hp-gradient3)"
          strokeWidth="1"
          className="hp-line-3"
        />
        <defs>
          <linearGradient id="hp-gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hp-gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hp-gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {[...Array(15)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="hp-particle absolute h-1 w-1 rounded-full bg-blue-400"
          style={{
            left: `${10 + i * 6}%`,
            top: `${20 + ((i * 17) % 60)}%`,
            animationDuration: `${3 + i * 0.5}s`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}

      {[...Array(8)].map((_, i) => (
        <div
          key={`node-${i}`}
          className="hp-node absolute h-2 w-2 rounded-full bg-purple-400"
          style={{
            left: `${15 + i * 12}%`,
            top: `${30 + ((i * 23) % 50)}%`,
            animationDuration: `${2 + i * 0.3}s`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}
