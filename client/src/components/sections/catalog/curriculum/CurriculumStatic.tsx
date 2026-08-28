import CurriculumUi from "./CurriculumUi";
import { CURRICULUM_STATIC_DEMO } from "./lib/static-demo";

export type CurriculumStaticProps = {
  className?: string;
  id?: string;
};

export default function CurriculumStatic({
  className,
  id,
}: CurriculumStaticProps = {}) {
  return (
    <CurriculumUi
      id={id}
      title={CURRICULUM_STATIC_DEMO.title}
      subtitle={CURRICULUM_STATIC_DEMO.subtitle}
      items={CURRICULUM_STATIC_DEMO.items}
      className={className}
    />
  );
}
