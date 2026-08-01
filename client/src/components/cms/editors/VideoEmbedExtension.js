import { mergeAttributes, Node } from "@tiptap/core";

function youtubeId(url) {
  const value = String(url || "").trim();
  const match = value.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i
  );
  return match?.[1] || "";
}

function vimeoId(url) {
  const value = String(url || "").trim();
  const match = value.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return match?.[1] || "";
}

export function normalizeVideoEmbed(url) {
  const trimmed = String(url || "").trim();
  if (!trimmed) return null;

  const yt = youtubeId(trimmed);
  if (yt) {
    return {
      src: `https://www.youtube-nocookie.com/embed/${yt}`,
      provider: "youtube",
    };
  }

  const vim = vimeoId(trimmed);
  if (vim) {
    return {
      src: `https://player.vimeo.com/video/${vim}`,
      provider: "vimeo",
    };
  }

  if (/\.(mp4|webm|ogg)(\?|#|$)/i.test(trimmed) || /\/video\//i.test(trimmed)) {
    return { src: trimmed, provider: "file" };
  }

  if (/^https?:\/\//i.test(trimmed)) {
    // Allow direct embed URLs that already look like players
    if (/youtube\.com\/embed\//i.test(trimmed) || /player\.vimeo\.com\/video\//i.test(trimmed)) {
      return {
        src: trimmed,
        provider: /vimeo/i.test(trimmed) ? "vimeo" : "youtube",
      };
    }
  }

  return null;
}

export function isAllowedVideoSrc(src) {
  const value = String(src || "").trim();
  if (!value) return false;
  try {
    const parsed = new URL(value);
    if (!/^https?:$/i.test(parsed.protocol)) return false;
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    if (
      host === "youtube.com" ||
      host === "youtube-nocookie.com" ||
      host === "youtu.be" ||
      host === "player.vimeo.com" ||
      host === "vimeo.com"
    ) {
      return true;
    }
    return /\.(mp4|webm|ogg)(\?|#|$)/i.test(parsed.pathname + parsed.search);
  } catch {
    return false;
  }
}

/**
 * Block video embed for TipTap (YouTube / Vimeo iframe or native video file).
 */
export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      provider: { default: "youtube" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-video-embed]",
        getAttrs: (el) => {
          const node = el;
          const iframe = node.querySelector?.("iframe");
          const video = node.querySelector?.("video");
          const src =
            node.getAttribute("data-src") ||
            iframe?.getAttribute("src") ||
            video?.getAttribute("src") ||
            "";
          if (!isAllowedVideoSrc(src)) return false;
          return {
            src,
            provider:
              node.getAttribute("data-provider") ||
              (video ? "file" : "youtube"),
          };
        },
      },
      {
        tag: "iframe[src]",
        getAttrs: (el) => {
          const src = el.getAttribute("src") || "";
          if (!isAllowedVideoSrc(src)) return false;
          return {
            src,
            provider: /vimeo/i.test(src) ? "vimeo" : "youtube",
          };
        },
      },
      {
        tag: "video[src]",
        getAttrs: (el) => {
          const src = el.getAttribute("src") || "";
          if (!isAllowedVideoSrc(src)) return false;
          return { src, provider: "file" };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes.src;
    const provider = HTMLAttributes.provider || "youtube";
    if (!src || !isAllowedVideoSrc(src)) return ["div", { class: "cms-rich-video" }, 0];

    if (provider === "file") {
      return [
        "div",
        mergeAttributes({
          "data-video-embed": "true",
          "data-provider": "file",
          "data-src": src,
          class: "cms-rich-video",
        }),
        [
          "video",
          {
            src,
            controls: "true",
            playsinline: "true",
            class: "cms-rich-video-el",
          },
        ],
      ];
    }

    return [
      "div",
      mergeAttributes({
        "data-video-embed": "true",
        "data-provider": provider,
        "data-src": src,
        class: "cms-rich-video",
      }),
      [
        "iframe",
        {
          src,
          title: "Embedded video",
          loading: "lazy",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowfullscreen: "true",
          frameborder: "0",
          class: "cms-rich-video-el",
        },
      ],
    ];
  },

  addCommands() {
    return {
      setVideoEmbed:
        (attrs) =>
        ({ commands }) => {
          const normalized =
            typeof attrs === "string"
              ? normalizeVideoEmbed(attrs)
              : attrs?.src
                ? {
                    src: attrs.src,
                    provider: attrs.provider || normalizeVideoEmbed(attrs.src)?.provider,
                  }
                : null;
          if (!normalized?.src || !isAllowedVideoSrc(normalized.src)) return false;
          return commands.insertContent({
            type: this.name,
            attrs: normalized,
          });
        },
    };
  },
});
