"use client";

import dynamic from "next/dynamic";
import { itemTitle } from "@/lib/sections/item-types";

const FaqItemCard = dynamic(() => import("./cards/FaqItemCard"));
const BenefitItemCard = dynamic(() => import("./cards/BenefitItemCard"));
const StatItemCard = dynamic(() => import("./cards/StatItemCard"));
const TestimonialItemCard = dynamic(() => import("./cards/TestimonialItemCard"));
const CustomerTestimonialItemCard = dynamic(() =>
  import("./cards/CustomerTestimonialItemCard"),
);
const ResourceItemCard = dynamic(() => import("./cards/ResourceItemCard"));
const TextMediaItemCard = dynamic(() => import("./cards/TextMediaItemCard"));
const CurriculumItemCard = dynamic(() => import("./cards/CurriculumItemCard"));
const WhyChooseItemCard = dynamic(() => import("./cards/WhyChooseItemCard"));
const HeroBannerItemCard = dynamic(() => import("./cards/HeroBannerItemCard"));
const PartnerItemCard = dynamic(() => import("./cards/PartnerItemCard"));
const TrainingOptionCard = dynamic(() =>
  import("@/components/sections/features/cards/TrainingOptionCard"),
);
const AwardCard = dynamic(() =>
  import("@/components/sections/features/cards/AwardCard"),
);

/**
 * Dispatch by SECTION_ITEMS_CONFIG.preview key.
 * CMS editor preview only — public sections import cards directly.
 */
export default function SectionItemCard({
  type,
  item,
  preview = false,
  className,
  index = 0,
  variant,
  onDarkBand = false,
}) {
  if (!item && !preview) return null;

  switch (type) {
    case "faq":
      return (
        <FaqItemCard
          item={item}
          preview={preview}
          index={index}
          onDarkBand={onDarkBand}
        />
      );
    case "benefit":
      return <BenefitItemCard item={item} preview={preview} />;
    case "why_choose":
      return (
        <WhyChooseItemCard
          item={item}
          preview={preview}
          index={index}
          variant={variant || "dark"}
        />
      );
    case "stat":
      if (preview) {
        return (
          <div className="rounded-xl section-ui-card border px-4 py-3">
            <StatItemCard
              item={item}
              preview
              className={className}
              variant={variant || "dark"}
            />
          </div>
        );
      }
      return (
        <StatItemCard
          item={item}
          preview={preview}
          className={className}
          variant={variant || "dark"}
        />
      );
    case "testimonial":
      return <TestimonialItemCard item={item} preview={preview} />;
    case "customer_testimonial":
      return <CustomerTestimonialItemCard item={item} preview={preview} />;
    case "resource":
      return <ResourceItemCard item={item} preview={preview} />;
    case "text_media":
      return <TextMediaItemCard item={item} preview={preview} />;
    case "curriculum":
      return <CurriculumItemCard item={item} preview={preview} />;
    case "hero_banner":
      return <HeroBannerItemCard item={item} preview={preview} />;
    case "training_option":
      return (
        <TrainingOptionCard
          item={item}
          preview={preview}
          index={index}
          onDarkBand={onDarkBand}
        />
      );
    case "award":
      return <AwardCard item={item} preview={preview} />;
    case "partner":
      return <PartnerItemCard item={item} preview={preview} />;
    default:
      return (
        <div className="rounded-xl border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500">
          {itemTitle(item) || "Item"}
        </div>
      );
  }
}
