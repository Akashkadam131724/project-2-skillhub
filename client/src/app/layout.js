import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: {
    default: "SkillHub",
    template: "%s | SkillHub",
  },
  description:
    "SkillHub — browse courses, vendors, and industry solutions for workforce transformation.",
  icons: {
    icon: [{ url: "/skillhub-logo.png", type: "image/png" }],
    apple: [{ url: "/skillhub-logo.png", type: "image/png" }],
  },
};

const themeInitScript = `
(function () {
  try {
    var themes = {
      blue: { brand: "#1b4de4", brandHover: "#153fc0", ink: "#0b1f4d" },
      teal: { brand: "#0f766e", brandHover: "#0c5f59", ink: "#134e4a" },
      indigo: { brand: "#4f46e5", brandHover: "#4338ca", ink: "#1e1b4b" },
      cyan: { brand: "#0891b2", brandHover: "#0e7490", ink: "#164e63" },
      emerald: { brand: "#059669", brandHover: "#047857", ink: "#064e3b" },
      violet: { brand: "#7c3aed", brandHover: "#6d28d9", ink: "#4c1d95" },
      navy: { brand: "#1e3a8a", brandHover: "#1e40af", ink: "#0f172a" },
      sky: { brand: "#0284c7", brandHover: "#0369a1", ink: "#0c4a6e" },
      slate: { brand: "#475569", brandHover: "#334155", ink: "#0f172a" }
    };
    var stored = localStorage.getItem("skillhub-color-theme");
    if (!themes[stored]) {
      localStorage.removeItem("skillhub-theme");
      localStorage.removeItem("netcom-theme");
      stored = "blue";
    }
    var t = themes[stored];
    var root = document.documentElement;
    root.setAttribute("data-theme", stored);
    root.classList.remove("dark");
    root.style.setProperty("--brand", t.brand);
    root.style.setProperty("--brand-hover", t.brandHover);
    root.style.setProperty("--ink", t.ink);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full`}
      data-theme="blue"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-white antialiased" suppressHydrationWarning>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
