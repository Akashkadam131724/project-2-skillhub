/** Rotating icon chip + row hover accents (legacy TWListOfLinksSection palette). */
export const VENDOR_LINK_ACCENT_PALETTES = [
  {
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    hover: "hover:bg-blue-600",
  },
  {
    iconBg: "bg-purple-50",
    iconText: "text-purple-600",
    hover: "hover:bg-purple-600",
  },
  {
    iconBg: "bg-orange-50",
    iconText: "text-orange-600",
    hover: "hover:bg-orange-600",
  },
  {
    iconBg: "bg-green-50",
    iconText: "text-green-600",
    hover: "hover:bg-green-600",
  },
  {
    iconBg: "bg-red-50",
    iconText: "text-red-600",
    hover: "hover:bg-red-600",
  },
  {
    iconBg: "bg-indigo-50",
    iconText: "text-indigo-600",
    hover: "hover:bg-indigo-600",
  },
  {
    iconBg: "bg-sky-50",
    iconText: "text-sky-600",
    hover: "hover:bg-sky-600",
  },
  {
    iconBg: "bg-yellow-50",
    iconText: "text-yellow-600",
    hover: "hover:bg-yellow-600",
  },
  {
    iconBg: "bg-teal-50",
    iconText: "text-teal-600",
    hover: "hover:bg-teal-600",
  },
  {
    iconBg: "bg-pink-50",
    iconText: "text-pink-600",
    hover: "hover:bg-pink-600",
  },
] as const;

export function vendorLinkAccent(index: number) {
  return VENDOR_LINK_ACCENT_PALETTES[index % VENDOR_LINK_ACCENT_PALETTES.length];
}

export function vendorLinkLetterLogo(label: string) {
  if (!label) return "";
  const words = label.trim().split(/\s+/);
  if (words.length > 1) {
    return words
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join("");
  }
  return label.charAt(0).toUpperCase();
}
