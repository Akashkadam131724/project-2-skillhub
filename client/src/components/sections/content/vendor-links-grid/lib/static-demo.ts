import type { VendorLinksGridLink } from "./types";

const icon = (path: string) =>
  path.startsWith("http")
    ? path
    : `https://images.netcomlearning.com/cms/icons/${path.replace(/^\//, "")}`;

export const VENDOR_LINKS_GRID_DEFAULT_TITLE =
  "Role-Based Solutions That Support Enterprise Transformation";

export const VENDOR_LINKS_GRID_DEFAULT_BODY =
  "NetCom Learning delivers role-based training solutions that translate complex technology ecosystems into practical, job-aligned capabilities. Through authorized partnerships with the world's leading vendors, we help enterprises close skill gaps, improve workforce readiness, and support long-term transformation.";

export const VENDOR_LINKS_GRID_STATIC_LINKS: VendorLinksGridLink[] = [
  {
    id: 385,
    label: "Microsoft",
    href: "https://www.netcomlearning.com/vendor/microsoft-training",
    iconUrl: icon(
      "https://images.netcomlearning.com/cms/icons/microsoft-icon.webp"
    ),
    sortOrder: 1,
  },
  {
    id: 389,
    label: "AI CERTs™",
    href: "https://www.netcomlearning.com/vendor/ai-certs-training",
    iconUrl: icon(
      "https://images.netcomlearning.com/cms/icons/ai-certs-icon.webp"
    ),
    sortOrder: 2,
  },
  {
    id: 387,
    label: "Google Cloud",
    href: "https://www.netcomlearning.com/vendor/google-cloud-training",
    iconUrl: icon(
      "https://images.netcomlearning.com/cms/icons/google-cloud-icon.webp"
    ),
    sortOrder: 3,
  },
  {
    id: 393,
    label: "Cisco",
    href: "https://www.netcomlearning.com/vendor/cisco-training",
    iconUrl: icon(
      "https://images.netcomlearning.com/cms/icons/cisco-icon.webp"
    ),
    sortOrder: 4,
  },
  {
    id: 392,
    label: "AWS",
    href: "https://www.netcomlearning.com/vendor/aws-training",
    iconUrl: icon(
      "https://images.netcomlearning.com/cms/icons/aws-icon.webp"
    ),
    sortOrder: 5,
  },
  {
    id: 394,
    label: "PMI",
    href: "https://www.netcomlearning.com/vendor/PMI-training",
    iconUrl: icon("https://images.netcomlearning.com/cms/icons/pmi-icon.webp"),
    sortOrder: 10,
  },
  {
    id: 6210,
    label: "CompTIA",
    href: "https://www.netcomlearning.com/vendor/comptia-training",
    iconUrl: "https://www.netcomlearning.com/compitia-circle.png",
    sortOrder: 11,
  },
  {
    id: 620,
    label: "Autodesk",
    href: "https://www.netcomlearning.com/vendor/autodesk-training",
    iconUrl: icon(
      "https://images.netcomlearning.com/cms/icons/autodesk-icon.webp"
    ),
    sortOrder: 12,
  },
  {
    id: 6201,
    label: "ISC2",
    href: "https://www.netcomlearning.com/vendor/isc2-training",
    iconUrl: "https://www.netcomlearning.com/ISC2-circle.png",
    sortOrder: 13,
  },
  {
    id: 6199,
    label: "ITIL",
    href: "https://www.netcomlearning.com/vendor/itil-training",
    iconUrl: icon(
      "https://images.netcomlearning.com/cms/icons/itil-icon.webp"
    ),
    sortOrder: 14,
  },
];

export const VENDOR_LINKS_GRID_STATIC_BUTTONS = [
  {
    label: "View all vendors",
    variant: "outline",
    action_type: "url",
    target_url: "https://www.netcomlearning.com/vendors",
    open_in_new_tab: true,
    sort_order: 0,
    status: true,
  },
];
