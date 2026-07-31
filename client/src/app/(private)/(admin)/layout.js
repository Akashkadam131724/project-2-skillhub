import CmsShell from "@/components/cms/CmsShell";

export const metadata = {
  title: "CMS",
  description: "Manage pages and content sections",
};

export default function CmsAdminLayout({ children }) {
  return <CmsShell>{children}</CmsShell>;
}
