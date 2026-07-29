import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteHeaderGate from "@/components/SiteHeaderGate";
import SiteFooter from "@/components/SiteFooter";
import SiteFooterGate from "@/components/SiteFooterGate";
import SiteThemeBootstrap from "@/components/cms/SiteThemeBootstrap";
import CmsModeFab from "@/components/CmsModeFab";

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
    icon: [{ url: "/skillhub-icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/skillhub-icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full`}
      data-theme="blue"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-white antialiased" suppressHydrationWarning>
        <SiteThemeBootstrap />
        <SiteHeaderGate>
          <SiteHeader />
        </SiteHeaderGate>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <SiteFooterGate>
          <SiteFooter />
        </SiteFooterGate>
        <CmsModeFab />
      </body>
    </html>
  );
}
