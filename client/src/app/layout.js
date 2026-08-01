import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { fetchSiteThemeForLayout } from "@/lib/site-theme-server";
import { themeCssVars } from "@/lib/theme";

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
    default: "SkillHub AI",
    template: "%s | SkillHub",
  },
  description:
    "SkillHub — browse courses, vendors, and industry solutions for workforce transformation.",
  icons: {
    icon: [{ url: "/skillhub-icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/skillhub-icon.svg", type: "image/svg+xml" }],
  },
};

export default async function RootLayout({ children }) {
  const siteTheme = await fetchSiteThemeForLayout();
  const themeVars = themeCssVars(siteTheme);
  const themePreset = siteTheme?.preset || "blue";

  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full`}
      data-theme={themePreset}
      style={themeVars}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-white antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
