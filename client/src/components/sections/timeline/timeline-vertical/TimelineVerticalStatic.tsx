import TimelineVerticalUi from "./TimelineVerticalUi";
import { TIMELINE_VERTICAL_STATIC_DEMO } from "./lib/static-demo";

export type TimelineVerticalStaticProps = {
  className?: string;
  id?: string;
};

/** Static vertical timeline — hard-coded demo → {@link TimelineVerticalUi}. */
export default function TimelineVerticalStatic({
  className,
  id = "timeline-vertical-static",
}: TimelineVerticalStaticProps = {}) {
  return (
    <TimelineVerticalUi
      id={id}
      className={className}
      title={TIMELINE_VERTICAL_STATIC_DEMO.title}
      subtitle={TIMELINE_VERTICAL_STATIC_DEMO.subtitle}
      items={TIMELINE_VERTICAL_STATIC_DEMO.items}
    />
  );
}
