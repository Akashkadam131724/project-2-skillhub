"use client";

import DsButton from "./DsButton";

/**
 * CMS placement button — thin alias over the design-system DsButton.
 * @deprecated Prefer DsButton directly for new code.
 */
export default function CmsButton(props) {
  return <DsButton {...props} />;
}

export { DsButton };
