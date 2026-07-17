import CmsShell from "@/components/cms/CmsShell";
import CmsEditorUnlock from "@/components/cms/CmsEditorUnlock";

export const metadata = {
  title: "CMS",
  description: "Manage pages and content sections",
};

export default function CmsLayout({ children }) {
  return (
    <CmsShell>
      <CmsEditorUnlock />
      {children}
    </CmsShell>
  );
}
