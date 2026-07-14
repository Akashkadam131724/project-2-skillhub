"use client";

import { sanitizeRichHtml, isRichTextEmpty } from "@/lib/rich-text";

/**
 * Safe rich HTML display for section / item body.
 * Legacy plain text is converted to paragraphs inside sanitizeRichHtml.
 */
export default function CmsRichText({
  html,
  className = "",
  empty = null,
}) {
  if (isRichTextEmpty(html)) {
    return empty;
  }

  const clean = sanitizeRichHtml(html);

  return (
    <div
      className={`cms-rich-body ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
