import PlayIcon from "./PlayIcon";
import PdfFileIcon from "./PdfFileIcon";
import FileIcon from "./FileIcon";
import FormIcon from "./FormIcon";
import ArrowDownIcon from "./ArrowDownIcon";
import ExternalLinkIcon from "./ExternalLinkIcon";
import LinkIcon from "./LinkIcon";

const BUTTON_ICONS = {
  youtube: PlayIcon,
  video: PlayIcon,
  pdf: PdfFileIcon,
  file: FileIcon,
  form: FormIcon,
  anchor: ArrowDownIcon,
  external: ExternalLinkIcon,
  link: LinkIcon,
};

export default function ButtonIcon({ kind, className = "size-4 shrink-0" }) {
  const Icon = BUTTON_ICONS[kind] || LinkIcon;
  return <Icon className={className} />;
}
