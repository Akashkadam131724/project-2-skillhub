import MediaMosaicUi from "./MediaMosaicUi";
import { MEDIA_MOSAIC_STATIC_DEMO } from "./lib/static-demo";

export type MediaMosaicStaticProps = {
  id?: string;
  className?: string;
};

/** Static media mosaic — hard-coded demo → {@link MediaMosaicUi}. */
export default function MediaMosaicStatic({
  id = "media-mosaic-static",
  className,
}: MediaMosaicStaticProps = {}) {
  return (
    <MediaMosaicUi
      id={id}
      className={className}
      preview
      title={MEDIA_MOSAIC_STATIC_DEMO.title}
      subtitle={MEDIA_MOSAIC_STATIC_DEMO.subtitle}
      items={MEDIA_MOSAIC_STATIC_DEMO.items}
    />
  );
}
