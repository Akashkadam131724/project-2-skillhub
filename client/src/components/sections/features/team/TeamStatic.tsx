import TeamUi from "./TeamUi";
import { TEAM_STATIC_DEMO } from "./lib/static-demo";

export type TeamStaticProps = {
  className?: string;
  id?: string;
};

/**
 * Static team — hard-coded demo → {@link TeamUi}.
 */
export default function TeamStatic({ className, id }: TeamStaticProps = {}) {
  return (
    <TeamUi
      id={id}
      title={TEAM_STATIC_DEMO.section_title}
      subtitle={TEAM_STATIC_DEMO.sub_title}
      items={TEAM_STATIC_DEMO.items}
      className={className}
    />
  );
}
