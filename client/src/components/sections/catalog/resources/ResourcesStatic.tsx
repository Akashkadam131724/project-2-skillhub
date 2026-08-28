import ResourcesUi from "./ResourcesUi";
import { RESOURCES_STATIC_DEMO } from "./lib/static-demo";

export type ResourcesStaticProps = {
  className?: string;
  id?: string;
};

export default function ResourcesStatic({
  className,
  id,
}: ResourcesStaticProps = {}) {
  return (
    <ResourcesUi
      id={id}
      title={RESOURCES_STATIC_DEMO.title}
      subtitle={RESOURCES_STATIC_DEMO.subtitle}
      items={RESOURCES_STATIC_DEMO.items}
      className={className}
    />
  );
}
