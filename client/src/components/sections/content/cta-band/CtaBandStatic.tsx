import SectionButtons from "@/components/ui/SectionButtons";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import CtaBandUi from "./CtaBandUi";
import { CTA_BAND_STATIC_DEMO } from "./lib/static-demo";

export default function CtaBandStatic() {
  return (
    <CtaBandUi
      title={CTA_BAND_STATIC_DEMO.section_title}
      subtitle={CTA_BAND_STATIC_DEMO.sub_title}
      body={CTA_BAND_STATIC_DEMO.data.body}
      footer={
        <div className="mt-8 flex justify-center">
          <SectionButtons
            buttons={sortActiveButtons([
              { label: "Book a demo", href: "/contact", variant: "primary" },
            ])}
            className="flex flex-wrap items-center justify-center gap-3"
          />
        </div>
      }
    />
  );
}
