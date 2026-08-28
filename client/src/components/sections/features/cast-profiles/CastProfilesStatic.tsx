import CastProfilesUi from "./CastProfilesUi";
import { CAST_PROFILES_STATIC_DEMO } from "./lib/static-demo";

export type CastProfilesStaticProps = {
  className?: string;
  id?: string;
};

/**
 * Static cast profiles — hard-coded demo → {@link CastProfilesUi}.
 */
export default function CastProfilesStatic({
  className,
  id,
}: CastProfilesStaticProps = {}) {
  return (
    <CastProfilesUi
      id={id}
      title={CAST_PROFILES_STATIC_DEMO.title}
      subtitle={CAST_PROFILES_STATIC_DEMO.subtitle}
      items={CAST_PROFILES_STATIC_DEMO.items}
      className={className}
    />
  );
}
