"use client";

import DsButton from "./DsButton";
import type { DsButtonProps } from "./types";

/**
 * CMS placement button — thin alias over the design-system DsButton.
 * @deprecated Prefer DsButton directly for new code.
 */
export default function CmsButton(props: DsButtonProps) {
  return <DsButton {...props} />;
}

export { DsButton };
