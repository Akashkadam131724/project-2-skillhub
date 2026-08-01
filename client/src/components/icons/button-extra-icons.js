/** Compact stroke icons used by the button design system */

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  "aria-hidden": true,
};

function Svg({ className = "size-4 shrink-0", children, ...props }) {
  return (
    <svg className={className} {...base} {...props}>
      {children}
    </svg>
  );
}

export function ArrowUpIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function DownloadIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3v12M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 21h16" strokeLinecap="round" />
    </Svg>
  );
}

export function CalendarIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 11h18" strokeLinecap="round" />
    </Svg>
  );
}

export function ChatIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4V6z"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function UserIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" strokeLinecap="round" />
    </Svg>
  );
}

export function PlusIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </Svg>
  );
}

export function MinusIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5 12h14" strokeLinecap="round" />
    </Svg>
  );
}

export function BookIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2 2V4z" />
      <path d="M7 4v16" />
    </Svg>
  );
}

export function GraduationIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 9.5 12 4l9 5.5-9 5.5-9-5.5z" strokeLinejoin="round" />
      <path d="M7 12.5V17c0 1 3 2.5 5 2.5s5-1.5 5-2.5v-4.5" strokeLinecap="round" />
    </Svg>
  );
}

export function GlobeIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.8 4 6.2 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6.2-4 9s1.5 6.2 4 9" />
    </Svg>
  );
}

export function ShareIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.7 15.8 6.3M8.2 13.3l7.6 4.4" />
    </Svg>
  );
}

export function ClockIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function HeartIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M12 20s-6.5-4.2-8.8-8.2C1.4 8.4 3.6 5 6.8 5c1.7 0 3.2.9 4 2.2.8-1.3 2.3-2.2 4-2.2 3.2 0 5.4 3.4 3.6 6.8C18.5 15.8 12 20 12 20z"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function InfoIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7h.01" strokeLinecap="round" />
    </Svg>
  );
}
