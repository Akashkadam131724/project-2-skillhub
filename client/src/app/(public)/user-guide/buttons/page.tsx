import type { Metadata } from "next";
import Link from "next/link";
import SectionWrapper from "@/components/sections/SectionWrapper";
import ButtonShowcase from "./_components/ButtonShowcase";

export const metadata: Metadata = {
  title: "Button system · SkillHub",
  description:
    "Explore button variants, sizes, icons, actions, and build CMS-ready buttons with the live editor.",
};

export default function DemoButtonsPage() {
  return (
    <main className="min-h-screen bg-transparent">
      <SectionWrapper className="py-10 sm:py-14">
        <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          <Link href="/user-guide" className="hover:underline">
            Section library
          </Link>
          {" / Buttons"}
        </p>
        <h1 className="section-theme-heading mt-2 mb-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Button design system
        </h1>
        <p className="section-theme-muted mt-4 mb-0 max-w-3xl text-base leading-relaxed">
          Every CTA on SkillHub sections uses the same CMS button model — style,
          icon, action, and optional Tailwind appearance overrides. Browse the
          catalog below, then use the builder to compose buttons for your pages.
        </p>
      </SectionWrapper>

      <ButtonShowcase />
    </main>
  );
}
