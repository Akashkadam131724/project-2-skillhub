import SectionButtons from "@/components/ui/SectionButtons";
import SectionFrame from "@/components/sections/SectionFrame";
import { sortActiveButtons } from "@/lib/utils/button-types";
import NewsletterBandUi from "./NewsletterBandUi";
import { NEWSLETTER_BAND_STATIC_DEMO } from "./lib/static-demo";

export default function NewsletterBandStatic() {
  const demo = NEWSLETTER_BAND_STATIC_DEMO;

  return (
    <SectionFrame
      title={demo.section_title}
      subtitle={demo.sub_title}
      eyebrow="Stay in the loop"
      buttonsFooter={false}
    >
      <NewsletterBandUi
        placeholder={demo.data.email_placeholder}
        formFooter={
          <SectionButtons
            buttons={sortActiveButtons([demo.button])}
            className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-nowrap"
          />
        }
      />
    </SectionFrame>
  );
}
