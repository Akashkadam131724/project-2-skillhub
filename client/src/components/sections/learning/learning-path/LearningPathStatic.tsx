import LearningPathUi from "./LearningPathUi";
import { LEARNING_PATH_STATIC_DEMO } from "./lib/static-demo";

export type LearningPathStaticProps = {
  id?: string;
  className?: string;
};

/** Static learning path — hard-coded demo → {@link LearningPathUi}. */
export default function LearningPathStatic({
  id = "learning-path-static",
  className,
}: LearningPathStaticProps = {}) {
  return (
    <LearningPathUi
      id={id}
      className={className}
      preview
      title={LEARNING_PATH_STATIC_DEMO.title}
      subtitle={LEARNING_PATH_STATIC_DEMO.subtitle}
      items={LEARNING_PATH_STATIC_DEMO.items}
    />
  );
}
