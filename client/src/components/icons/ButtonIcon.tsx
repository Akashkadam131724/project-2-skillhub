import type { ComponentType } from "react";
import PlayIcon from "./PlayIcon";
import PdfFileIcon from "./PdfFileIcon";
import FileIcon from "./FileIcon";
import FormIcon from "./FormIcon";
import ArrowDownIcon from "./ArrowDownIcon";
import ArrowRightIcon from "./ArrowRightIcon";
import ArrowLeftIcon from "./ArrowLeftIcon";
import ExternalLinkIcon from "./ExternalLinkIcon";
import LinkIcon from "./LinkIcon";
import MailIcon from "./MailIcon";
import PhoneIcon from "./PhoneIcon";
import MapPinIcon from "./MapPinIcon";
import SearchIcon from "./SearchIcon";
import CartIcon from "./CartIcon";
import CheckIcon from "./CheckIcon";
import SettingsIcon from "./SettingsIcon";
import StarSparkleIcon from "./StarSparkleIcon";
import StarRatingIcon from "./StarRatingIcon";
import BuildingIcon from "./BuildingIcon";
import ChevronRightIcon from "./ChevronRightIcon";
import ChevronLeftIcon from "./ChevronLeftIcon";
import ChevronDownIcon from "./ChevronDownIcon";
import {
  ArrowUpIcon,
  BookIcon,
  CalendarIcon,
  ChatIcon,
  ClockIcon,
  DownloadIcon,
  GlobeIcon,
  GraduationIcon,
  HeartIcon,
  InfoIcon,
  MinusIcon,
  PlusIcon,
  ShareIcon,
  UserIcon,
} from "./button-extra-icons";
import type { ButtonIconProps } from "./types";

type IconComponent = ComponentType<{ className?: string }>;

const BUTTON_ICONS: Record<string, IconComponent> = {
  youtube: PlayIcon,
  video: PlayIcon,
  play: PlayIcon,
  pdf: PdfFileIcon,
  file: FileIcon,
  form: FormIcon,
  anchor: ArrowDownIcon,
  "arrow-down": ArrowDownIcon,
  "arrow-right": ArrowRightIcon,
  "arrow-left": ArrowLeftIcon,
  "arrow-up": ArrowUpIcon,
  "chevron-right": ChevronRightIcon,
  "chevron-left": ChevronLeftIcon,
  "chevron-down": ChevronDownIcon,
  "chevron-up": ArrowUpIcon,
  external: ExternalLinkIcon,
  link: LinkIcon,
  mail: MailIcon,
  phone: PhoneIcon,
  "map-pin": MapPinIcon,
  search: SearchIcon,
  cart: CartIcon,
  check: CheckIcon,
  settings: SettingsIcon,
  sparkle: StarSparkleIcon,
  star: StarRatingIcon,
  building: BuildingIcon,
  download: DownloadIcon,
  calendar: CalendarIcon,
  chat: ChatIcon,
  user: UserIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  book: BookIcon,
  graduation: GraduationIcon,
  globe: GlobeIcon,
  share: ShareIcon,
  clock: ClockIcon,
  heart: HeartIcon,
  info: InfoIcon,
};

export default function ButtonIcon({ kind, className = "shrink-0" }: ButtonIconProps) {
  const Icon = (kind && BUTTON_ICONS[kind]) || LinkIcon;
  return <Icon className={className} />;
}

export { BUTTON_ICONS };
