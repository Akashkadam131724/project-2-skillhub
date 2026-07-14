import CmsShell from "@/components/cms/CmsShell";

export const metadata = {
  title: "CMS",
  description: "Manage pages and content sections",
};

export default function CmsLayout({ children }) {
  return <CmsShell>{children}</CmsShell>;
}
