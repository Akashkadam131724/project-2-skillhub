import type { Metadata } from "next";
import Link from "next/link";
import { VendorLinksGridStatic } from "@/components/sections/content/vendor-links-grid";
import SectionWrapper from "@/components/sections/SectionWrapper";

export const metadata: Metadata = {
  title: "Vendor links grid (static) · SkillHub",
  description:
    "Static UI preview for the vendor links grid section (legacy TWListOfLinksSection).",
};

export default function VendorLinksGridTestPage() {
  return (
    <main className="min-h-screen bg-transparent">
      <SectionWrapper className="py-8 sm:py-10">
        <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          <Link href="/user-guide" className="hover:underline">
            User guide
          </Link>
          {" / Vendor links grid"}
        </p>
        <h1 className="section-theme-heading mt-2 mb-0 text-2xl font-semibold tracking-tight sm:text-3xl">
          Static UI — vendor link grid
        </h1>
        <p className="section-theme-muted mt-3 mb-0 max-w-3xl text-sm leading-relaxed">
          Registered as <code className="text-xs">vendor_link_grid</code>{" "}
          (global scope). New DB entries can use any{" "}
          <code className="text-xs">section_key</code> with{" "}
          <code className="text-xs">render_key: vendor_link_grid</code> to reuse
          this UI.
        </p>
      </SectionWrapper>

      <VendorLinksGridStatic />

      <SectionWrapper className="border-t border-slate-200 py-8 dark:border-slate-800">
        <p className="section-theme-muted m-0 text-sm">
          Files:{" "}
          <code className="text-xs">
            components/sections/content/vendor-links-grid/
          </code>
        </p>
      </SectionWrapper>
    </main>
  );
}
