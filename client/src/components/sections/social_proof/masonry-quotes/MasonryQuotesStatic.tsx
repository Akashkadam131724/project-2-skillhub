import MasonryQuotesUi from "./MasonryQuotesUi";
import { MASONRY_QUOTES_STATIC_DEMO } from "./lib/static-demo";

export type MasonryQuotesStaticProps = {
  id?: string;
  className?: string;
};

/** Static masonry quotes — hard-coded demo → {@link MasonryQuotesUi}. */
export default function MasonryQuotesStatic({
  id = "masonry-quotes-static",
  className,
}: MasonryQuotesStaticProps = {}) {
  return (
    <MasonryQuotesUi
      id={id}
      className={className}
      preview
      title={MASONRY_QUOTES_STATIC_DEMO.title}
      subtitle={MASONRY_QUOTES_STATIC_DEMO.subtitle}
      items={MASONRY_QUOTES_STATIC_DEMO.items}
    />
  );
}
