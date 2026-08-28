import SectionButtons from "@/components/ui/SectionButtons";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import SplitCtaUi from "./SplitCtaUi";
import { SPLIT_CTA_STATIC_DEMO } from "./lib/static-demo";

export default function SplitCtaStatic() {
  return (
    <SplitCtaUi
      title={SPLIT_CTA_STATIC_DEMO.section_title}
      subtitle={SPLIT_CTA_STATIC_DEMO.sub_title}
      imageUrl={SPLIT_CTA_STATIC_DEMO.section_img_url}
      imageSide={SPLIT_CTA_STATIC_DEMO.data.image_side}
      footer={
        <SectionButtons
          buttons={sortActiveButtons([
            { label: "Get started", href: "/contact", variant: "primary" },
            { label: "View user guide", href: "/user-guide", variant: "secondary" },
          ])}
          inverted
          className="flex flex-wrap items-center gap-3 [&_a]:rounded-lg [&_a]:px-4 [&_a]:py-2.5"
        />
      }
    />
  );
}
