import { redirect } from "next/navigation";

export default async function CmsSectionRedirectPage({ params }) {
  const { key } = await params;
  redirect(`/cms/pages-content-sections/${key}`);
}
