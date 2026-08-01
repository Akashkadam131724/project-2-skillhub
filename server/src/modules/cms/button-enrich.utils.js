/**
 * Infer design-system fields for CMS buttons from label + link.
 * Used by scripts/enrich-buttons.mjs
 */
import {
  BUTTON_ACTION_TYPES,
  BUTTON_ICON_PRESETS,
  BUTTON_SHAPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
} from "./button.schema.js";

const YOUTUBE_RE =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i;

function hashString(input) {
  const s = String(input || "");
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function pick(rng, list) {
  if (!list?.length) return "";
  return list[Math.floor(rng() * list.length)];
}

function urlExt(href) {
  try {
    const path = String(href || "").split(/[?#]/)[0];
    const base = path.split("/").pop() || "";
    const m = base.match(/\.([a-z0-9]+)$/i);
    return m ? m[1].toLowerCase() : "";
  } catch {
    return "";
  }
}

function inferActionType(btn) {
  const label = String(btn?.label || "").toLowerCase();
  const url = String(btn?.target_url || "").trim();
  const targetId = String(btn?.target_id || "").replace(/^#/, "").trim();
  const formKey = String(btn?.form_key || "").trim();

  if (formKey || btn?.action_type === "form") return "form";
  if (btn?.action_type === "scroll_top") return "scroll_top";

  if (YOUTUBE_RE.test(url) || btn?.action_type === "youtube") return "youtube";
  if (targetId && btn?.action_type === "anchor") return "anchor";
  if (targetId && !url) return "anchor";

  if (
    btn?.action_type === "email" ||
    /^mailto:/i.test(url) ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url)
  ) {
    return "email";
  }

  if (
    btn?.action_type === "phone" ||
    /^tel:/i.test(url) ||
    (/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(url) &&
      label.match(/\b(call|phone|tel)\b/))
  ) {
    return "phone";
  }

  const ext = urlExt(url);
  if (
    btn?.action_type === "download" ||
    label.match(/\b(download|brochure|pdf|whitepaper|datasheet)\b/) ||
    ["pdf", "zip", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)
  ) {
    return "download";
  }

  if (url.startsWith("#") || label.match(/\b(scroll|jump|skip)\b/)) {
    return "anchor";
  }

  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";

  return "url";
}

function inferIcon(btn, actionType) {
  const label = String(btn?.label || "").toLowerCase();
  const url = String(btn?.target_url || "").trim();
  const ext = urlExt(url);

  if (actionType === "youtube") return "play";
  if (actionType === "form") return "form";
  if (actionType === "email") return "mail";
  if (actionType === "phone") return "phone";
  if (actionType === "download") return ext === "pdf" ? "pdf" : "download";
  if (actionType === "scroll_top") return "arrow-up";
  if (actionType === "anchor") return "arrow-down";

  if (label.match(/\b(cart|buy|purchase|checkout|enroll)\b/)) return "cart";
  if (label.match(/\b(search|find|browse)\b/)) return "search";
  if (label.match(/\b(course|learn|training|class)\b/)) return "graduation";
  if (label.match(/\b(book|read|guide|ebook)\b/)) return "book";
  if (label.match(/\b(schedule|calendar|date|event)\b/)) return "calendar";
  if (label.match(/\b(contact|message|chat)\b/)) return "chat";
  if (label.match(/\b(location|map|visit)\b/)) return "map-pin";
  if (label.match(/\b(enterprise|company|business)\b/)) return "building";
  if (label.match(/\b(watch|trailer|video|play)\b/)) return "play";
  if (label.match(/\b(share|social)\b/)) return "share";
  if (label.match(/\b(star|featured|premium)\b/)) return "sparkle";
  if (label.match(/\b(confirm|apply|submit|done)\b/)) return "check";
  if (label.match(/\b(add|create|new)\b/)) return "plus";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip"].includes(ext)) {
    return "file";
  }
  if (/^https?:\/\//i.test(url)) return "external";
  if (label.match(/\b(more|next|continue|start|explore|view)\b/)) {
    return "arrow-right";
  }
  return "link";
}

function inferVariant(btn, actionType, rng) {
  const label = String(btn?.label || "").toLowerCase();
  const sort = btn?.sort_order ?? 0;

  if (label.match(/\b(delete|remove|cancel order|unsubscribe)\b/)) return "danger";
  if (label.match(/\b(maybe later|skip|dismiss|not now)\b/)) {
    return pick(rng, ["ghost", "link"]);
  }
  if (label.match(/\b(learn more|read more|view all|see all|details)\b/)) {
    return pick(rng, ["link", "ghost", "outline"]);
  }

  if (sort === 0) {
    return pick(rng, ["outline", "outline", "primary", "inverse"]);
  }
  if (sort === 1) {
    return pick(rng, ["outline", "outline", "ghost", "link"]);
  }
  return pick(rng, ["outline", "ghost", "link", "secondary"]);
}

function inferIconPosition(btn, icon, rng) {
  const label = String(btn?.label || "").toLowerCase();
  if (
    icon === "arrow-right" ||
    icon === "chevron-right" ||
    label.match(/\b(more|next|continue|start|explore|view|go)\b/)
  ) {
    return "end";
  }
  if (icon === "arrow-left" || icon === "chevron-left") return "start";
  if (["play", "download", "mail", "phone", "search"].includes(icon)) {
    return "start";
  }
  return rng() > 0.75 ? "end" : "start";
}

function inferSize(btn, rng) {
  const label = String(btn?.label || "").toLowerCase();
  if (label.match(/\b(get started|sign up|register|enroll now|book now)\b/)) {
    return pick(rng, ["lg", "lg", "md"]);
  }
  if (label.match(/\b(view|read|learn more|details)\b/)) {
    return pick(rng, ["sm", "md"]);
  }
  return pick(rng, ["sm", "md", "md", "lg"]);
}

function inferShape(btn, variant, rng) {
  const label = String(btn?.label || "").toLowerCase();
  if (variant === "link") return "rounded";
  if (label.match(/\b(get started|sign up|join|subscribe)\b/)) {
    return pick(rng, ["pill", "pill", "rounded"]);
  }
  return pick(rng, ["rounded", "rounded", "pill", "square"]);
}

function normalizeTargetForAction(btn, actionType) {
  const out = { ...btn };
  const url = String(btn?.target_url || "").trim();
  const targetId = String(btn?.target_id || "").replace(/^#/, "").trim();

  if (actionType === "email") {
    out.target_url = url.replace(/^mailto:/i, "");
    out.target_id = "";
    out.form_key = "";
  } else if (actionType === "phone") {
    out.target_url = url.replace(/^tel:/i, "");
    out.target_id = "";
    out.form_key = "";
  } else if (actionType === "anchor") {
    out.target_id = targetId || url.replace(/^#/, "");
    out.target_url = "";
    out.form_key = "";
  } else if (actionType === "form") {
    if (!out.form_key && /contact|lead|demo|enterprise/i.test(btn?.label || "")) {
      out.form_key = "contact";
    }
    out.target_url = "";
    out.target_id = "";
  } else if (actionType === "scroll_top") {
    out.target_url = "";
    out.target_id = "";
    out.form_key = "";
  } else if (actionType === "download") {
    const ext = urlExt(url);
    if (!out.download_filename && ext) {
      const base = url.split("/").pop()?.split("?")[0] || `file.${ext}`;
      out.download_filename = base;
    }
  }

  return out;
}

/**
 * Enrich one button with design-system fields from label + link.
 * @param {object} btn
 * @param {{ seed?: number, random?: boolean }} [opts]
 */
export function enrichButton(btn, opts = {}) {
  if (!btn || !String(btn.label || "").trim()) return btn;

  const seedInput =
    opts.seed ??
    hashString(
      `${btn._id || ""}|${btn.label}|${btn.target_url}|${btn.target_id}|${btn.form_key}`
    );
  const rng = createRng(opts.random ? (Math.random() * 0xffffffff) >>> 0 : seedInput);

  const action_type = inferActionType(btn);
  let next = normalizeTargetForAction({ ...btn }, action_type);
  const icon = inferIcon(next, action_type);
  const variant = inferVariant(next, action_type, rng);
  const icon_position = inferIconPosition(next, icon, rng);

  const open_in_new_tab =
    action_type === "url" &&
    /^https?:\/\//i.test(String(next.target_url || "")) &&
    (Boolean(btn.open_in_new_tab) ||
      String(btn.label || "").match(/\b(external|website)\b/i));

  return {
    ...next,
    action_type,
    variant: BUTTON_VARIANTS.includes(variant) ? variant : "primary",
    size: "md",
    shape: "rounded",
    icon: BUTTON_ICON_PRESETS.includes(icon) ? icon : "auto",
    icon_position: icon_position === "end" ? "end" : "start",
    open_in_new_tab: Boolean(open_in_new_tab),
    full_width: Boolean(
      btn.full_width ||
        String(btn.label || "").match(/\b(register now|enroll now)\b/i)
    ),
    aria_label: String(btn.aria_label || "").trim(),
    download_filename: String(next.download_filename || "").trim(),
    status: btn.status !== false,
    sort_order: btn.sort_order ?? 0,
  };
}

export function applyButtonLayout(btn) {
  if (!btn || !String(btn.label || "").trim()) return btn;
  return { ...btn, size: "md", shape: "rounded" };
}

export function applyButtonsLayout(buttons) {
  if (!Array.isArray(buttons)) return buttons;
  return buttons.map((b) => applyButtonLayout(b));
}

export function applyItemsLayout(items) {
  if (!Array.isArray(items)) return items;
  return items.map((item) => {
    if (!item || typeof item !== "object") return item;
    const next = { ...item };
    if (Array.isArray(item.buttons) && item.buttons.length) {
      next.buttons = applyButtonsLayout(item.buttons);
    }
    return next;
  });
}

export function enrichButtons(buttons, opts = {}) {
  if (!Array.isArray(buttons)) return buttons;
  return buttons.map((b, i) =>
    enrichButton({ ...b, sort_order: b?.sort_order ?? i }, opts)
  );
}

export function enrichItems(items, opts = {}) {
  if (!Array.isArray(items)) return items;
  return items.map((item, i) => {
    if (!item || typeof item !== "object") return item;
    const next = { ...item, sort_order: item.sort_order ?? i };
    if (Array.isArray(item.buttons) && item.buttons.length) {
      next.buttons = enrichButtons(item.buttons, opts);
    }
    return next;
  });
}
