import TrainingOptionsUi from "./TrainingOptionsUi";
import { TRAINING_OPTIONS_STATIC_DEMO } from "./lib/static-demo";

export type TrainingOptionsStaticProps = {
  className?: string;
  id?: string;
  onDarkBand?: boolean;
};

/**
 * Static training options — hard-coded demo → {@link TrainingOptionsUi}.
 */
export default function TrainingOptionsStatic({
  className,
  id,
  onDarkBand = false,
}: TrainingOptionsStaticProps = {}) {
  return (
    <TrainingOptionsUi
      id={id}
      title={TRAINING_OPTIONS_STATIC_DEMO.title}
      subtitle={TRAINING_OPTIONS_STATIC_DEMO.subtitle}
      items={TRAINING_OPTIONS_STATIC_DEMO.items}
      onDarkBand={onDarkBand}
      className={className}
    />
  );
}
