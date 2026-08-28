import ComparisonTableUi from "./ComparisonTableUi";
import { COMPARISON_TABLE_STATIC_DEMO } from "./lib/static-demo";

export type ComparisonTableStaticProps = {
  className?: string;
  id?: string;
};

export default function ComparisonTableStatic({
  className,
  id,
}: ComparisonTableStaticProps = {}) {
  return (
    <ComparisonTableUi
      id={id}
      title={COMPARISON_TABLE_STATIC_DEMO.title}
      subtitle={COMPARISON_TABLE_STATIC_DEMO.subtitle}
      items={COMPARISON_TABLE_STATIC_DEMO.items}
      className={className}
    />
  );
}
