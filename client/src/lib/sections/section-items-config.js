/**
 * Which mapping `items[]` fields each section’s UI uses — drives the CMS form.
 * Field defs: { key, type, label, required?, options?, placeholder?, hint?,
 *   minLength?, maxLength?, min?, max?, pattern?, format?, errors? }
 * Types: text | textarea | richtext | url | image | select | radio | bg_color | buttons
 * Formats: url | email | tel | slug
 */

/** Fallback when DB render_key is unset — keep in sync with section.catalog.js */
const BEHAVIOR_ALIASES = {
  page_testimonials: "customer_testimonials",
  partners: "partners_marquee",
  tabs_vertical: "feature_tabs",
};

/** Resolve component + CMS config key from catalog key and optional render_key */
export function resolveSectionBehaviorKey(sectionKey, renderKey) {
  const k = String(sectionKey || "").toLowerCase();
  const r = String(renderKey || "").toLowerCase().trim();
  if (r) return r;
  return BEHAVIOR_ALIASES[k] || k;
}

export const SECTION_ITEMS_CONFIG = {
  text_media: {
    label: 'Text + media rows',
    actionLabel: 'rows',
    fields: [
      { key: 'image_url', type: 'image', label: 'Media image' },
      { key: 'title', type: 'text', label: 'Headline', required: true },
      { key: 'body', type: 'richtext', label: 'Body (rich text — add links here)' },
      { key: 'value', type: 'radio', label: 'Media side (start or end)', required: true, options: [{ value: 'start', label: 'Media start (left)' }, { value: 'end', label: 'Media end (right)' }], errors: { required: 'Choose which side the media sits on' } }
    ],
    preview: 'text_media',
  },
  faq: {
    label: 'FAQ',
    actionLabel: 'FAQ',
    fields: [
      { key: 'title', type: 'text', label: 'Question', required: true, minLength: 5, errors: { required: 'Question is required', } },
      { key: 'body', type: 'richtext', label: 'Answer', required: true, errors: { required: 'Answer is required' } },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    preview: 'faq',
  },
  faq_two_column: {
    label: 'FAQ',
    actionLabel: 'FAQ',
    fields: [
      { key: 'title', type: 'text', label: 'Question', required: true, errors: { required: 'Question is required' } },
      { key: 'body', type: 'richtext', label: 'Answer', required: true, errors: { required: 'Answer is required' } },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    preview: 'faq',
  },
  comparison_table: {
    label: 'Comparison rows',
    actionLabel: 'rows',
    fields: [
      { key: 'title', type: 'text', label: 'Option' },
      { key: 'value', type: 'text', label: 'Highlight' },
      { key: 'subtitle', type: 'text', label: 'Short label' },
      { key: 'body', type: 'richtext', label: 'Notes' },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    preview: 'comparison_row',
  },
  media_mosaic: {
    label: 'Mosaic tiles',
    actionLabel: 'tiles',
    fields: [
      { key: 'image_url', type: 'image', label: 'Image' },
      { key: 'title', type: 'text', label: 'Title' },
      { key: 'subtitle', type: 'text', label: 'Caption' },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    preview: 'mosaic_tile',
  },
  timeline_vertical: {
    label: 'Timeline steps',
    actionLabel: 'milestones',
    fields: [
      { key: 'title', type: 'text', label: 'Milestone', required: true },
      { key: 'subtitle', type: 'text', label: 'Date / phase' },
      { key: 'body', type: 'richtext', label: 'Description' },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    preview: 'timeline_step',
  },
  trust_badges: {
    label: 'Trust badges',
    actionLabel: 'badges',
    fields: [
      { key: 'image_url', type: 'image', label: 'Logo / badge' },
      { key: 'title', type: 'text', label: 'Label' },
      { key: 'subtitle', type: 'text', label: 'Caption' },
      { key: 'value', type: 'text', label: 'Fallback icon text' }
    ],
    preview: 'trust_badge',
  },
  learning_path: {
    label: 'Path steps',
    actionLabel: 'steps',
    fields: [
      { key: 'value', type: 'text', label: 'Step number' },
      { key: 'title', type: 'text', label: 'Module', required: true },
      { key: 'subtitle', type: 'text', label: 'Duration / format' },
      { key: 'body', type: 'richtext', label: 'Description' },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    preview: 'learning_step',
  },
  form_split: {
    label: 'Highlights',
    actionLabel: 'highlights',
    fields: [
      { key: 'title', type: 'text', label: 'Label' },
      { key: 'subtitle', type: 'text', label: 'Detail' },
      { key: 'body', type: 'richtext', label: 'Note' }
    ],
    preview: 'form_highlight',
  },
  key_benefits: {
    label: 'Benefit cards',
    actionLabel: 'benefits',
    fields: [
      { key: 'image_url', type: 'image', label: 'Card image', required: true },
      { key: 'title', type: 'text', label: 'Benefit', required: true },
      { key: 'body', type: 'richtext', label: 'Description' },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    preview: 'benefit',
  },
  team: {
    label: 'Team members',
    actionLabel: 'members',
    fields: [
      { key: 'image_url', type: 'image', label: 'Photo', required: true },
      { key: 'title', type: 'text', label: 'Name', required: true },
      { key: 'subtitle', type: 'text', label: 'Role / title' },
      { key: 'body', type: 'richtext', label: 'Short bio' }
    ],
    preview: 'team_member',
  },
  feature_spotlight: {
    label: 'Spotlight cards',
    actionLabel: 'spotlights',
    fields: [
      { key: 'image_url', type: 'image', label: 'Background image' },
      { key: 'value', type: 'text', label: 'Metric / eyebrow' },
      { key: 'title', type: 'text', label: 'Title', required: true },
      { key: 'subtitle', type: 'text', label: 'Subtitle' },
      { key: 'body', type: 'richtext', label: 'Description' }
    ],
    preview: 'spotlight',
  },
  process_steps: {
    label: 'Process steps',
    actionLabel: 'steps',
    fields: [
      { key: 'title', type: 'text', label: 'Step title', required: true },
      { key: 'subtitle', type: 'text', label: 'Short label' },
      { key: 'body', type: 'richtext', label: 'Description' }
    ],
    preview: 'process_step',
  },
  contact_us: {
    label: 'Contact channels',
    actionLabel: 'channels',
    fields: [
      { key: 'icon', type: 'select', label: 'Type (email / phone / location)', required: true, options: [{ value: 'email', label: 'Email' }, { value: 'phone', label: 'Phone' }, { value: 'location', label: 'Location' }], errors: { required: 'Pick a channel type' } },
      { key: 'title', type: 'text', label: 'Label', required: true },
      { key: 'subtitle', type: 'text', label: 'Value (email, phone, address)', required: true },
      { key: 'body', type: 'richtext', label: 'Note (optional)' },
      { key: 'href', type: 'url', label: 'Link (mailto:, tel:, maps…)' }
    ],
    preview: 'contact_channel',
  },
  contact_form: {
    label: 'Contact channels',
    actionLabel: 'channels',
    fields: [
      { key: 'icon', type: 'select', label: 'Type (email / phone / location)', required: true, options: [{ value: 'email', label: 'Email' }, { value: 'phone', label: 'Phone' }, { value: 'location', label: 'Location' }] },
      { key: 'title', type: 'text', label: 'Label', required: true },
      { key: 'subtitle', type: 'text', label: 'Value', required: true },
      { key: 'body', type: 'richtext', label: 'Note (optional)' },
      { key: 'href', type: 'url', label: 'Link (mailto:, tel:…)' }
    ],
    preview: 'contact_channel',
  },
  bento_grid: {
    label: 'Bento cells',
    actionLabel: 'cells',
    fields: [
      { key: 'image_url', type: 'image', label: 'Background image' },
      { key: 'value', type: 'text', label: 'Metric / label' },
      { key: 'title', type: 'text', label: 'Title' },
      { key: 'subtitle', type: 'text', label: 'Subtitle' },
      { key: 'body', type: 'richtext', label: 'Description' }
    ],
    preview: 'bento_cell',
  },
  horizon_gallery: {
    label: 'Gallery panels',
    actionLabel: 'panels',
    fields: [
      { key: 'image_url', type: 'image', label: 'Panel image' },
      { key: 'title', type: 'text', label: 'Caption title' },
      { key: 'subtitle', type: 'text', label: 'Caption subtitle' },
      { key: 'body', type: 'richtext', label: 'Caption body' }
    ],
    preview: 'gallery_panel',
  },
  split_narrative: {
    label: 'Story chapters',
    actionLabel: 'chapters',
    fields: [
      { key: 'image_url', type: 'image', label: 'Chapter image' },
      { key: 'value', type: 'text', label: 'Chapter label' },
      { key: 'title', type: 'text', label: 'Title' },
      { key: 'subtitle', type: 'text', label: 'Subtitle' },
      { key: 'body', type: 'richtext', label: 'Body' }
    ],
    preview: 'story_chapter',
  },
  pillar_destinations: {
    label: 'Destination pillars',
    actionLabel: 'pillars',
    fields: [
      { key: 'image_url', type: 'image', label: 'Background image' },
      { key: 'title', type: 'text', label: 'Title' },
      { key: 'subtitle', type: 'text', label: 'Subtitle' },
      { key: 'body', type: 'richtext', label: 'Description' },
      { key: 'href', type: 'url', label: 'Link URL' }
    ],
    preview: 'pillar',
  },
  card_stack: {
    label: 'Stack cards',
    actionLabel: 'cards',
    fields: [
      { key: 'image_url', type: 'image', label: 'Card image' },
      { key: 'value', type: 'text', label: 'Eyebrow / number' },
      { key: 'title', type: 'text', label: 'Title' },
      { key: 'subtitle', type: 'text', label: 'Subtitle' },
      { key: 'body', type: 'richtext', label: 'Body' }
    ],
    preview: 'stack_card',
  },
  feature_tabs: {
    label: 'Feature tabs',
    actionLabel: 'tabs',
    nestedTabs: true,
    fields: [
      { key: 'image_url', type: 'image', label: 'Preview image' },
      { key: 'value', type: 'text', label: 'Tab label / count' },
      { key: 'title', type: 'text', label: 'Title' },
      { key: 'subtitle', type: 'text', label: 'Subtitle' },
      { key: 'body', type: 'richtext', label: 'Description' },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    childFields: [
      { key: 'image_url', type: 'image', label: 'Card image' },
      { key: 'title', type: 'text', label: 'Card title' },
      { key: 'subtitle', type: 'text', label: 'Subtitle' },
      { key: 'body', type: 'richtext', label: 'Description' },
      { key: 'href', type: 'url', label: 'Link URL' },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    preview: 'feature_tab',
  },
  tabs_vertical: {
    label: 'Vertical tabs',
    actionLabel: 'tabs',
    nestedTabs: true,
    fields: [
      { key: 'image_url', type: 'image', label: 'Preview image' },
      { key: 'value', type: 'text', label: 'Tab label / count' },
      { key: 'title', type: 'text', label: 'Title' },
      { key: 'subtitle', type: 'text', label: 'Subtitle' },
      { key: 'body', type: 'richtext', label: 'Description' },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    childFields: [
      { key: 'image_url', type: 'image', label: 'Card image' },
      { key: 'title', type: 'text', label: 'Card title' },
      { key: 'subtitle', type: 'text', label: 'Subtitle' },
      { key: 'body', type: 'richtext', label: 'Description' },
      { key: 'href', type: 'url', label: 'Link URL' },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    preview: 'feature_tab',
  },
  tabs_horizontal: {
    label: 'Horizontal tabs',
    actionLabel: 'tabs',
    nestedTabs: true,
    fields: [
      { key: 'image_url', type: 'image', label: 'Preview image' },
      { key: 'value', type: 'text', label: 'Tab label / count' },
      { key: 'title', type: 'text', label: 'Title' },
      { key: 'subtitle', type: 'text', label: 'Subtitle' },
      { key: 'body', type: 'richtext', label: 'Description' },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    childFields: [
      { key: 'image_url', type: 'image', label: 'Card image' },
      { key: 'title', type: 'text', label: 'Card title' },
      { key: 'subtitle', type: 'text', label: 'Subtitle' },
      { key: 'body', type: 'richtext', label: 'Description' },
      { key: 'href', type: 'url', label: 'Link URL' },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    preview: 'feature_tab',
  },
  tabs_underline: {
    label: 'Underline tabs',
    actionLabel: 'tabs',
    nestedTabs: true,
    fields: [
      { key: 'image_url', type: 'image', label: 'Preview image' },
      { key: 'value', type: 'text', label: 'Tab label / count' },
      { key: 'title', type: 'text', label: 'Title' },
      { key: 'subtitle', type: 'text', label: 'Subtitle' },
      { key: 'body', type: 'richtext', label: 'Description' },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    childFields: [
      { key: 'image_url', type: 'image', label: 'Card image' },
      { key: 'title', type: 'text', label: 'Card title' },
      { key: 'subtitle', type: 'text', label: 'Subtitle' },
      { key: 'body', type: 'richtext', label: 'Description' },
      { key: 'href', type: 'url', label: 'Link URL' },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    preview: 'feature_tab',
  },
  tabs_success_stories: {
    label: 'Success story',
    actionLabel: 'stories',
    fields: [
      { key: 'icon', type: 'select', label: 'Tab icon (government, healthcare, finance, local, technology)', options: [{ value: 'government', label: 'Government' }, { value: 'healthcare', label: 'Healthcare' }, { value: 'finance', label: 'Finance' }, { value: 'local', label: 'Local' }, { value: 'technology', label: 'Technology' }] },
      { key: 'label', type: 'text', label: 'Tab name', required: true },
      { key: 'subtitle', type: 'text', label: 'Partner name' },
      { key: 'title', type: 'text', label: 'Story headline', required: true },
      { key: 'value', type: 'text', label: 'Partner logo URL' },
      { key: 'image_url', type: 'image', label: 'Story image' },
      { key: 'href', type: 'url', label: 'Video URL (optional)' },
      { key: 'bg_color', type: 'bg_color', label: 'Panel gradient' },
      { key: 'buttons', type: 'buttons', label: 'CTA button' }
    ],
    preview: 'success_story',
  },
  pricing_tiers: {
    label: 'Pricing plans',
    actionLabel: 'plans',
    fields: [
      { key: 'title', type: 'text', label: 'Plan name', required: true },
      { key: 'value', type: 'text', label: 'Price', required: true, errors: { required: 'Price is required' } },
      { key: 'subtitle', type: 'text', label: 'Period (e.g. /mo)' },
      { key: 'body', type: 'richtext', label: 'Features (one per line)' },
      { key: 'label', type: 'radio', label: 'Badge (use popular)', options: [{ value: '', label: 'None' }, { value: 'popular', label: 'Popular' }] },
      { key: 'href', type: 'url', label: 'CTA URL' },
      { key: 'icon', type: 'text', label: 'CTA label' }
    ],
    preview: 'pricing_plan',
  },
  masonry_quotes: {
    label: 'Quotes',
    actionLabel: 'quotes',
    fields: [
      { key: 'body', type: 'richtext', label: 'Quote' },
      { key: 'subtitle', type: 'text', label: 'Author name' },
      { key: 'value', type: 'text', label: 'Role / company' },
      { key: 'image_url', type: 'image', label: 'Avatar' }
    ],
    preview: 'testimonial',
  },
  metric_rail: {
    label: 'Metrics',
    actionLabel: 'metrics',
    fields: [
      { key: 'value', type: 'text', label: 'Metric value', required: true },
      { key: 'label', type: 'text', label: 'Metric label', required: true }
    ],
    preview: 'stat',
  },
  template_gallery: {
    label: 'Template cards',
    actionLabel: 'templates',
    fields: [
      { key: 'image_url', type: 'image', label: 'Template image' },
      { key: 'value', type: 'text', label: 'Category label' },
      { key: 'title', type: 'text', label: 'Template name' },
      { key: 'subtitle', type: 'text', label: 'Short description' },
      { key: 'body', type: 'richtext', label: 'Body' }
    ],
    preview: 'template_card',
  },
  builder_feature_cards: {
    label: 'Builder features',
    actionLabel: 'features',
    fields: [
      { key: 'value', type: 'text', label: 'Number / icon text' },
      { key: 'title', type: 'text', label: 'Feature title' },
      { key: 'subtitle', type: 'text', label: 'Short label' },
      { key: 'body', type: 'richtext', label: 'Description' }
    ],
    preview: 'builder_feature',
  },
  domain_search_band: {
    label: 'Domain chips',
    actionLabel: 'domain chips',
    fields: [
      { key: 'value', type: 'text', label: 'Chip text', required: true },
      { key: 'label', type: 'text', label: 'Fallback chip label' }
    ],
    preview: 'domain_chip',
  },
  website_build_steps: {
    label: 'Build steps',
    actionLabel: 'steps',
    fields: [
      { key: 'title', type: 'text', label: 'Step title', required: true },
      { key: 'subtitle', type: 'text', label: 'Short label' },
      { key: 'body', type: 'richtext', label: 'Description' }
    ],
    preview: 'build_step',
  },
  why_choose: {
    label: 'Feature cards',
    actionLabel: 'features',
    fields: [
      { key: 'image_url', type: 'image', label: 'Icon image' },
      { key: 'icon', type: 'text', label: 'Icon URL (alt)' },
      { key: 'title', type: 'text', label: 'Feature title', required: true },
      { key: 'body', type: 'richtext', label: 'Description' }
    ],
    preview: 'why_choose',
  },
  stats: {
    label: 'Stats',
    actionLabel: 'stats',
    fields: [
      { key: 'value', type: 'text', label: 'Stat value', required: true },
      { key: 'label', type: 'text', label: 'Stat label', required: true }
    ],
    preview: 'stat',
  },
  testimonials: {
    label: 'Testimonials',
    actionLabel: 'testimonials',
    fields: [
      { key: 'body', type: 'richtext', label: 'Quote', required: true },
      { key: 'title', type: 'text', label: 'Author', required: true }
    ],
    preview: 'testimonial',
  },
  customer_testimonials: {
    label: 'Customer testimonials',
    actionLabel: 'testimonials',
    fields: [
      { key: 'value', type: 'text', label: 'Star rating (1–5)' },
      { key: 'body', type: 'richtext', label: 'Quote', required: true },
      { key: 'title', type: 'text', label: 'Author name', required: true },
      { key: 'image_url', type: 'image', label: 'Company logo' }
    ],
    preview: 'customer_testimonial',
  },
  resources: {
    label: 'Resources',
    actionLabel: 'resources',
    fields: [
      { key: 'title', type: 'text', label: 'Resource name', required: true },
      { key: 'body', type: 'richtext', label: 'Description' },
      { key: 'href', type: 'url', label: 'Link URL' },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    preview: 'resource',
  },
  curriculum: {
    label: 'Modules',
    actionLabel: 'modules',
    fields: [
      { key: 'title', type: 'text', label: 'Module name', required: true }
    ],
    preview: 'curriculum',
  },
  partners: {
    label: 'Partner logos',
    actionLabel: 'partners',
    fields: [
      { key: 'image_url', type: 'image', label: 'Logo image', required: true },
      { key: 'title', type: 'text', label: 'Partner name', required: true },
      { key: 'href', type: 'url', label: 'Link URL (optional)' }
    ],
    preview: 'partner',
  },
  partners_marquee: {
    label: 'Partner logos',
    actionLabel: 'partners',
    fields: [
      { key: 'image_url', type: 'image', label: 'Logo image', required: true },
      { key: 'title', type: 'text', label: 'Partner name', required: true },
      { key: 'href', type: 'url', label: 'Link URL (optional)' }
    ],
    preview: 'partner',
  },
  training_options: {
    label: 'Training options',
    actionLabel: 'options',
    fields: [
      { key: 'image_url', type: 'image', label: 'Card image' },
      { key: 'title', type: 'text', label: 'Option title', required: true },
      { key: 'body', type: 'richtext', label: 'Description' }
    ],
    preview: 'training_option',
  },
  awards: {
    label: 'Awards',
    actionLabel: 'awards',
    fields: [
      { key: 'image_url', type: 'image', label: 'Award badge / logo' },
      { key: 'title', type: 'text', label: 'Award title', required: true },
      { key: 'body', type: 'richtext', label: 'Description' }
    ],
    preview: 'award',
  },
  hero_stats: {
    label: 'Hero stats',
    actionLabel: 'stats',
    fields: [
      { key: 'value', type: 'text', label: 'Stat value', required: true },
      { key: 'label', type: 'text', label: 'Stat label', required: true }
    ],
    preview: 'stat',
  },
  hero_media: {
    label: 'Banner slides',
    actionLabel: 'banners',
    fields: [
      { key: 'image_url', type: 'image', label: 'Banner background image' },
      { key: 'bg_color', type: 'bg_color', label: 'Background (color or gradient)' },
      { key: 'icon', type: 'text', label: 'Right-side image' },
      { key: 'href', type: 'url', label: 'Video URL (optional)' },
      { key: 'title', type: 'text', label: 'Headline', required: true },
      { key: 'subtitle', type: 'text', label: 'Subtitle' },
      { key: 'body', type: 'richtext', label: 'Body (optional)' },
      { key: 'buttons', type: 'buttons', label: 'Buttons' }
    ],
    preview: 'hero_banner',
  },
  video_banner: {
    label: 'Video banner',
    actionLabel: 'video',
    fields: [
      { key: 'href', type: 'url', label: 'Video URL' },
      { key: 'image_url', type: 'image', label: 'Fallback image' },
      { key: 'title', type: 'text', label: 'Overlay title' },
      { key: 'subtitle', type: 'text', label: 'Overlay subtitle' },
      { key: 'buttons', type: 'buttons', label: 'Overlay buttons' }
    ],
    preview: 'hero_banner',
  },
  cast_profiles: {
    label: 'Cast profiles',
    actionLabel: 'profiles',
    fields: [
      { key: 'image_url', type: 'image', label: 'Portrait photo', required: true },
      { key: 'value', type: 'text', label: 'Badge (e.g. Lead)' },
      { key: 'title', type: 'text', label: 'Actor name', required: true },
      { key: 'subtitle', type: 'text', label: 'Character name' },
      { key: 'body', type: 'richtext', label: 'Short bio' }
    ],
    preview: 'cast_profile',
  },
};

export function sectionUsesItems(key, renderKey) {
  const behavior = resolveSectionBehaviorKey(key, renderKey);
  return Boolean(SECTION_ITEMS_CONFIG[behavior]);
}

export function getSectionItemsConfig(key, renderKey) {
  const behavior = resolveSectionBehaviorKey(key, renderKey);
  return SECTION_ITEMS_CONFIG[behavior] || null;
}

export {
  getItemFieldDefs,
  getItemFieldKeys,
  validateSectionItem,
  validateItemFields,
  buildItemFieldsZodSchema,
  itemField,
} from "@/lib/sections/section-items-fields";

/** Alias — item-driven sections require items on the public page */
export function sectionRequiresItems(key, renderKey) {
  return sectionUsesItems(key, renderKey);
}
