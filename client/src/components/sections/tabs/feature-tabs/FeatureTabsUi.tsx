import TabsNestedUi from "../shared/TabsNestedUi";
import type { TabsNestedUiProps } from "../shared/lib/types";

export default function FeatureTabsUi(
  props: Omit<TabsNestedUiProps, "layout">
) {
  return <TabsNestedUi {...props} layout="vertical" />;
}
