import SuccessStoriesUi from "./SuccessStoriesUi";
import { SUCCESS_STORIES_STATIC_DEMO } from "./lib/static-demo";

export default function TabsSuccessStoriesStatic({
  id = "success-stories-static",
  className,
}: { id?: string; className?: string } = {}) {
  return (
    <SuccessStoriesUi
      id={id}
      className={className}
      title={SUCCESS_STORIES_STATIC_DEMO.title}
      subtitle={SUCCESS_STORIES_STATIC_DEMO.subtitle}
      stories={SUCCESS_STORIES_STATIC_DEMO.stories}
    />
  );
}
