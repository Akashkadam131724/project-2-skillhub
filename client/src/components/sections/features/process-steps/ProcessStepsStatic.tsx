import ProcessStepsUi from "./ProcessStepsUi";
import { PROCESS_STEPS_STATIC_DEMO } from "./lib/static-demo";

export type ProcessStepsStaticProps = {
  className?: string;
  id?: string;
  onDarkBand?: boolean;
};

/**
 * Static process steps — hard-coded demo → {@link ProcessStepsUi}.
 */
export default function ProcessStepsStatic({
  className,
  id,
  onDarkBand = false,
}: ProcessStepsStaticProps = {}) {
  return (
    <ProcessStepsUi
      id={id}
      title={PROCESS_STEPS_STATIC_DEMO.title}
      subtitle={PROCESS_STEPS_STATIC_DEMO.subtitle}
      items={PROCESS_STEPS_STATIC_DEMO.items}
      onDarkBand={onDarkBand}
      className={className}
    />
  );
}
