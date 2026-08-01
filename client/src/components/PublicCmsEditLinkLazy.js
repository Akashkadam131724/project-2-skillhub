"use client";

import dynamic from "next/dynamic";

const PublicCmsEditLink = dynamic(() => import("./PublicCmsEditLink"), {
  ssr: false,
});

/** Client-only shell — `ssr: false` must live in a Client Component, not the layout. */
export default function PublicCmsEditLinkLazy() {
  return <PublicCmsEditLink />;
}
