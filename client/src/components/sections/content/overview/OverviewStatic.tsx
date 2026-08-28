import Link from "next/link";
import SectionFrame from "@/components/sections/SectionFrame";
import OverviewUi from "./OverviewUi";
import { OVERVIEW_STATIC_DEMO } from "./lib/static-demo";

export default function OverviewStatic() {
  return (
    <SectionFrame eyebrow="Overview" title={OVERVIEW_STATIC_DEMO.section_title}>
      <OverviewUi
        showImage
        imageUrl={OVERVIEW_STATIC_DEMO.section_img_url}
        imageAlt={OVERVIEW_STATIC_DEMO.section_title}
        title={OVERVIEW_STATIC_DEMO.section_title}
        subtitle={OVERVIEW_STATIC_DEMO.sub_title}
        body={OVERVIEW_STATIC_DEMO.data.body}
        footer={
          <Link
            href="/demo"
            className="section-theme-heading mt-2 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold no-underline transition hover:border-brand hover:text-brand sm:mt-3"
          >
            Learn more <span aria-hidden>→</span>
          </Link>
        }
      />
    </SectionFrame>
  );
}
