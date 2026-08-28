import WebsiteBuildStepsUi from "./WebsiteBuildStepsUi";
import { WEBSITE_BUILD_STEPS_STATIC_DEMO } from "./lib/static-demo";

export default function WebsiteBuildStepsStatic() {
  return (
    <WebsiteBuildStepsUi
      title={WEBSITE_BUILD_STEPS_STATIC_DEMO.section_title}
      subtitle={WEBSITE_BUILD_STEPS_STATIC_DEMO.sub_title}
      items={WEBSITE_BUILD_STEPS_STATIC_DEMO.items}
    />
  );
}
