import PhoneIcon from "./PhoneIcon";
import MapPinIcon from "./MapPinIcon";
import MailIcon from "./MailIcon";
import type { ContactChannelIconProps } from "./types";

export default function ContactChannelIcon({ kind }: ContactChannelIconProps) {
  if (kind === "phone") return <PhoneIcon />;
  if (kind === "location") return <MapPinIcon />;
  return <MailIcon />;
}
