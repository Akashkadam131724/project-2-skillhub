import CmsShell from "@/components/cms/admin/CmsShell";
import type { AppLayoutProps } from "../../types";

export const metadata = {
  title: "CMS",
  description: "Manage pages and content sections",
};

export default function CmsAdminLayout({ children }: AppLayoutProps) {
  return <CmsShell>{children}</CmsShell>;
}
