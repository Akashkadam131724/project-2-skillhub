/**
 * Single row in SECTION_CATALOG — defaults keep new sections to one object.
 *
 * @param {object} opts
 * @param {string} opts.key
 * @param {string} opts.name
 * @param {string} opts.category
 * @param {string[]} [opts.tags]
 * @param {"alt"|"fixed"} [opts.surface] — alt = page band alternation; fixed = own-band / chrome
 * @param {boolean} [opts.usesSectionImage] — layout reads section_img_url
 * @param {"global"|"template"|"page"} [opts.contentScope]
 * @param {string} [opts.renderKey] — shared UI when different from key
 */
export function defineCatalogEntry({
  key,
  name,
  category,
  tags = [],
  surface = "alt",
  usesSectionImage = false,
  contentScope,
  renderKey,
}) {
  const entry = {
    key,
    name,
    category,
    tags,
    surface,
    uses_section_image: usesSectionImage,
  };
  if (contentScope) entry.content_scope = contentScope;
  if (renderKey) entry.render_key = renderKey;
  return entry;
}
