import InPageNavUi from "./InPageNavUi";
import { buildInPageNavItems } from "./lib/map";
import { IN_PAGE_NAV_STATIC_DEMO_SECTIONS } from "./lib/static-demo";

export type InPageNavStaticProps = {
  id?: string;
};

/** Static in-page nav — demo links for showcase. */
export default function InPageNavStatic({
  id = "in-page-nav-static",
}: InPageNavStaticProps = {}) {
  const items = buildInPageNavItems(IN_PAGE_NAV_STATIC_DEMO_SECTIONS);

  return <InPageNavUi id={id} items={items} preview />;
}
