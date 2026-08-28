"use client";

import SarderEcosystemUi from "./SarderEcosystemUi";
import {
  SARDER_ECOSYSTEM_STATIC_GROUPS,
  SARDER_ECOSYSTEM_STATIC_LOGO,
  SARDER_ECOSYSTEM_STATIC_LOGO_ALT,
  SARDER_ECOSYSTEM_STATIC_SUBTITLE,
  SARDER_ECOSYSTEM_STATIC_TITLE,
} from "./lib/static-demo";

export type SarderEcosystemStaticProps = {
  id?: string;
  className?: string;
};

export default function SarderEcosystemStatic({
  id = "sarder-ecosystem-static",
  className,
}: SarderEcosystemStaticProps = {}) {
  return (
    <SarderEcosystemUi
      id={id}
      className={className}
      title={SARDER_ECOSYSTEM_STATIC_TITLE}
      subtitle={SARDER_ECOSYSTEM_STATIC_SUBTITLE}
      logoSrc={SARDER_ECOSYSTEM_STATIC_LOGO}
      logoAlt={SARDER_ECOSYSTEM_STATIC_LOGO_ALT}
      groups={SARDER_ECOSYSTEM_STATIC_GROUPS}
    />
  );
}
