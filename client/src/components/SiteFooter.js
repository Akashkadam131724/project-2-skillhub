import Link from "next/link";
import SkillHubLogo from "@/components/SkillHubLogo";
import SectionWrapper from "@/components/sections/SectionWrapper";

const FOOTER_COLUMNS = [
  {
    title: "Learn",
    links: [
      { label: "Courses", href: "/courses" },
      { label: "Products", href: "/products" },
      { label: "Blogs", href: "/blogs" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Solutions", href: "/solutions" },
      { label: "Enterprise", href: "/enterprise" },
      { label: "Get started", href: "/get-started" },
      { label: "Section library", href: "/section" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about-us" },
      { label: "Our team", href: "/our-team" },
      { label: "Careers", href: "/company/careers" },
      { label: "Contact", href: "/contact-us" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

/**
 * Site-wide static footer — theme ink/brand, no CMS wiring.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-ink text-white">
      <SectionWrapper className="py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 no-underline"
              aria-label="SkillHub home"
            >
              <SkillHubLogo size={32} showWordmark={false} />
              <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-white">
                SkillHub
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Authorized vendor training, role-based learning paths, and live CMS
              pages — built for teams that ship skills at scale.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="min-w-0">
              <h2 className="m-0 text-[11px] font-semibold tracking-[0.2em] text-white/50 uppercase">
                {col.title}
              </h2>
              <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-white/85 no-underline transition hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 text-xs text-white/50">
            © {year} SkillHub. All rights reserved.
          </p>
          <ul className="m-0 flex flex-wrap list-none gap-x-6 gap-y-2 p-0">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs font-medium text-white/60 no-underline transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </SectionWrapper>
    </footer>
  );
}
