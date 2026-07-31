import NetcomSectionPreviewGallery from "@/components/test/NetcomSectionPreviewGallery";
import sectionPreviews from "@/data/netcom-section-previews.json";

export const metadata = {
  title: "Section previews",
  description: "Static gallery of NetCom CMS section preview images.",
};

export default function TestSectionPreviewsPage() {
  return (
    <main>
      <NetcomSectionPreviewGallery sections={sectionPreviews} />
    </main>
  );
}
