import type { KeyPageProps } from "@/app/types";
import { redirect } from "next/navigation";

export default async function CmsSectionRedirectPage({ params }: KeyPageProps) {
  const { key } = await params;
  redirect(`/cms/pages-content-sections/${key}`);
}
