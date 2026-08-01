import PhoneIcon from "./PhoneIcon";
import MapPinIcon from "./MapPinIcon";
import MailIcon from "./MailIcon";

export default function ContactChannelIcon({ kind }) {
  if (kind === "phone") return <PhoneIcon />;
  if (kind === "location") return <MapPinIcon />;
  return <MailIcon />;
}
