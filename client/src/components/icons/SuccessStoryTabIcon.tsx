import HealthcareIcon from "./HealthcareIcon";
import FinanceIcon from "./FinanceIcon";
import TechnologyIcon from "./TechnologyIcon";
import GovernmentIcon from "./GovernmentIcon";
import BuildingIcon from "./BuildingIcon";
import type { SuccessStoryTabIconProps } from "./types";

export default function SuccessStoryTabIcon({ name }: SuccessStoryTabIconProps) {
  const key = String(name || "").toLowerCase().trim();

  if (key === "healthcare") return <HealthcareIcon />;
  if (key === "finance" || key === "financial") return <FinanceIcon />;
  if (key === "technology" || key === "tech") return <TechnologyIcon />;
  if (key === "local" || key === "local-government") return <GovernmentIcon />;

  return <BuildingIcon />;
}
