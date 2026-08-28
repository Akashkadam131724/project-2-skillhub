import TextMediaUi from "./TextMediaUi";
import { TEXT_MEDIA_STATIC_DEMO } from "./lib/static-demo";

export default function TextMediaStatic({
  className,
  id,
}: { className?: string; id?: string } = {}) {
  return (
    <TextMediaUi
      id={id}
      title={TEXT_MEDIA_STATIC_DEMO.title}
      subtitle={TEXT_MEDIA_STATIC_DEMO.subtitle}
      items={TEXT_MEDIA_STATIC_DEMO.items}
      className={className}
    />
  );
}
