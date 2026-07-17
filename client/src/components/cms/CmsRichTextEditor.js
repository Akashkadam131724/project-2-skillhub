"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import { BulletList, OrderedList } from "@tiptap/extension-list";
import { Extension } from "@tiptap/core";
import {
  plainTextToHtml,
  sanitizePastedHtml,
  sanitizeRichHtml,
  isRichTextEmpty,
} from "@/lib/rich-text";
import {
  VideoEmbed,
  normalizeVideoEmbed,
} from "@/components/cms/VideoEmbedExtension";

const TEXT_COLORS = [
  { label: "Default", value: "", group: "light" },
  // Light / white backgrounds
  { label: "Navy", value: "var(--ink)", group: "light" },
  { label: "Blue", value: "var(--brand)", group: "light" },
  { label: "Teal", value: "#0f766e", group: "light" },
  { label: "Rose", value: "#e11d48", group: "light" },
  { label: "Amber", value: "#d97706", group: "light" },
  { label: "Slate", value: "#475569", group: "light" },
  // Dark / navy / black backgrounds
  { label: "White", value: "#ffffff", group: "dark" },
  { label: "Soft white", value: "#e2e8f0", group: "dark" },
  { label: "Sky", value: "#7dd3fc", group: "dark" },
  { label: "Cyan", value: "#67e8f9", group: "dark" },
  { label: "Mint", value: "#6ee7b7", group: "dark" },
  { label: "Gold", value: "#fbbf24", group: "dark" },
  { label: "Coral", value: "#fda4af", group: "dark" },
  { label: "Lavender", value: "#c4b5fd", group: "dark" },
];

/**
 * Marks that stop at the caret — typing after formatted text stays normal.
 * Same idea as Unlink for every format.
 */
const ExitFriendlyBold = Bold.extend({ inclusive: false });
const ExitFriendlyItalic = Italic.extend({ inclusive: false });
const ExitFriendlyUnderline = Underline.extend({ inclusive: false });
const ExitFriendlyLink = Link.extend({ inclusive: false });
// Color must not stick to the caret — only selected text gets colored
const ExitFriendlyTextStyle = TextStyle.extend({ inclusive: false });

/**
 * Lists are toolbar-only.
 * TipTap's default input rules (`- `, `* `, `1. `) were turning normal text into
 * <li> when focusing / typing near those characters.
 */
const SafeBulletList = BulletList.extend({
  addInputRules() {
    return [];
  },
  addPasteRules() {
    return [];
  },
  addKeyboardShortcuts() {
    // Disable Mod-Shift-8 — it was easy to hit / feel like “focus activated list”
    return {};
  },
});

const SafeOrderedList = OrderedList.extend({
  addInputRules() {
    return [];
  },
  addPasteRules() {
    return [];
  },
  addKeyboardShortcuts() {
    // Disable Mod-Shift-7
    return {};
  },
  // Disable plain-text paste → ordered list conversion
  addProseMirrorPlugins() {
    return [];
  },
});

/** Minimal list keys after disabling TipTap ListKeymap (avoids join-into-previous-list). */
const SafeListKeys = Extension.create({
  name: "safeListKeys",
  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        if (!this.editor.isActive("listItem")) return false;
        const { $from, empty } = this.editor.state.selection;
        if (!empty || $from.parentOffset !== 0) return false;
        return this.editor.commands.liftListItem("listItem");
      },
      Enter: () => {
        if (!this.editor.isActive("listItem")) return false;
        const { $from, empty } = this.editor.state.selection;
        if (!empty) return false;
        const listItem = $from.node($from.depth - 1);
        if (!listItem || listItem.type.name !== "listItem") return false;
        if (listItem.textContent.trim()) return false;
        return this.editor.commands.liftListItem("listItem");
      },
    };
  },
});

/** True when the caret is inside a real list node (not a false-positive toolbar state). */
function isCaretInList(editor, listName) {
  if (!editor) return false;
  const { $from } = editor.state.selection;
  for (let depth = $from.depth; depth > 0; depth -= 1) {
    if ($from.node(depth).type.name === listName) return true;
  }
  return false;
}

/** If focus lands in an empty list item, lift back to a normal paragraph. */
function liftEmptyListItem(editor) {
  if (!editor) return;
  if (!isCaretInList(editor, "bulletList") && !isCaretInList(editor, "orderedList")) {
    return;
  }
  const { $from, empty } = editor.state.selection;
  if (!empty) return;
  const listItem = $from.node($from.depth - 1);
  if (!listItem || listItem.type.name !== "listItem") return;
  if (listItem.textContent.trim()) return;
  editor.commands.liftListItem("listItem");
}

function ToolbarButton({ active, disabled, onClick, title, children }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-semibold transition ${
        active
          ? "bg-brand text-white"
          : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      } disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function ExitChip({ label, onExit, title }) {
  return (
    <button
      type="button"
      title={title || `Exit ${label}`}
      onClick={onExit}
      className="inline-flex h-7 items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-2 text-[11px] font-semibold text-brand hover:bg-brand/15"
    >
      <span>{label}</span>
      <span aria-hidden className="text-sm leading-none">
        ×
      </span>
    </button>
  );
}

/**
 * TipTap rich editor for CMS body fields (section data.body + items[].body).
 */
export default function CmsRichTextEditor({
  value = "",
  onChange,
  placeholder = "Write content…",
  className = "",
}) {
  // Always starts Off — toggle only for the current editing session
  const [keepPasteColors, setKeepPasteColors] = useState(false);
  const keepPasteColorsRef = useRef(false);
  const [colorPanelOpen, setColorPanelOpen] = useState(false);
  const [headingPanelOpen, setHeadingPanelOpen] = useState(false);
  const colorRangeRef = useRef(null);
  const rootRef = useRef(null);
  const lastEmittedRef = useRef(sanitizeRichHtml(plainTextToHtml(value) || ""));
  // Selection actions (Colors / Bold / Exit selection) only while the editor chrome is focused
  const [shellActive, setShellActive] = useState(false);
  /**
   * List toolbar highlight is armed only by clicking • List / 1. List.
   * Never derive from TipTap isActive / caret-in-list — focus inside existing
   * <ul>/<ol> HTML was lighting the buttons and looking like “list mode on”.
   * null | "bullet" | "ordered"
   */
  const [listArmed, setListArmed] = useState(null);
  const listArmedRef = useRef(null);
  const armingListRef = useRef(false);

  function armList(next) {
    listArmedRef.current = next;
    setListArmed(next);
  }

  function disarmList() {
    listArmedRef.current = null;
    setListArmed(null);
  }

  function toggleKeepPasteColors() {
    setKeepPasteColors((prev) => {
      const next = !prev;
      keepPasteColorsRef.current = next;
      return next;
    });
  }

  function closeColorPanel() {
    setColorPanelOpen(false);
    colorRangeRef.current = null;
  }

  function closeHeadingPanel() {
    setHeadingPanelOpen(false);
  }

  function closeSelectionPanels() {
    closeColorPanel();
    closeHeadingPanel();
  }

  const emit = useCallback(
    (html) => {
      const clean = sanitizeRichHtml(html);
      lastEmittedRef.current = clean;
      onChange?.(clean);
    },
    [onChange]
  );

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        // Replaced with exit-friendly / safer versions below
        bold: false,
        italic: false,
        bulletList: false,
        orderedList: false,
        // Prevents Backspace at the start of a paragraph after a list from
        // sucking that paragraph into the previous list (feels like “focus activated list”).
        listKeymap: false,
      }),
      SafeBulletList,
      SafeOrderedList,
      SafeListKeys,
      ExitFriendlyBold,
      ExitFriendlyItalic,
      ExitFriendlyUnderline,
      ExitFriendlyTextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      ExitFriendlyLink.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          class: "cms-rich-link",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "cms-rich-img",
        },
      }),
      VideoEmbed,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: plainTextToHtml(value) || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "cms-rich-body ProseMirror min-h-[160px] max-h-[420px] overflow-y-auto px-3 py-2.5 text-sm outline-none",
      },
      transformPastedHTML(html) {
        return sanitizePastedHtml(html, {
          keepColors: keepPasteColorsRef.current,
        });
      },
    },
    onUpdate: ({ editor: ed }) => {
      emit(ed.getHTML());
      // Typing / edits should never leave pickers open
      closeSelectionPanels();
    },
  });

  // List toolbar arming: button click only. Focus/blur on the ProseMirror DOM
  // must never leave • List / 1. List looking pressed from caret-in-list.
  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom;

    const onFocus = () => {
      queueMicrotask(() => {
        if (armingListRef.current) return;
        liftEmptyListItem(editor);
        disarmList();
      });
    };

    const onBlur = () => {
      queueMicrotask(() => {
        if (armingListRef.current) return;
        disarmList();
      });
    };

    const onSelection = () => {
      if (armingListRef.current) return;
      const armed = listArmedRef.current;
      if (!armed) return;
      if (armed === "bullet" && !isCaretInList(editor, "bulletList")) disarmList();
      else if (armed === "ordered" && !isCaretInList(editor, "orderedList")) {
        disarmList();
      }
    };

    dom.addEventListener("focus", onFocus);
    dom.addEventListener("blur", onBlur);
    editor.on("selectionUpdate", onSelection);
    return () => {
      dom.removeEventListener("focus", onFocus);
      dom.removeEventListener("blur", onBlur);
      editor.off("selectionUpdate", onSelection);
    };
  }, [editor]);

  // Sync external value → editor, but never clobber while the user is focused/typing.
  useEffect(() => {
    if (!editor) return;
    const next = sanitizeRichHtml(plainTextToHtml(value) || "");
    if (next === lastEmittedRef.current) return;
    if (editor.isFocused) return;

    const current = sanitizeRichHtml(editor.getHTML());
    if (current === next) {
      lastEmittedRef.current = next;
      return;
    }

    editor.commands.setContent(next ? next : "<p></p>", {
      emitUpdate: false,
    });
    lastEmittedRef.current = next;
    editor.view.dispatch(editor.state.tr.setStoredMarks([]));
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    const onSelection = () => {
      const { from, to } = editor.state.selection;
      // No range = hide Colors/Bold UI so caret moves don’t look “activated”
      if (to <= from) {
        closeSelectionPanels();
        const marks = editor.state.storedMarks;
        if (
          marks?.some((m) =>
            ["bold", "italic", "underline", "link", "textStyle"].includes(
              m.type.name
            )
          )
        ) {
          editor.view.dispatch(editor.state.tr.setStoredMarks([]));
        }
      }
      // Empty field must stay a plain paragraph — never a residual list/heading
      if (isRichTextEmpty(editor.getHTML())) {
        if (
          editor.isActive("bulletList") ||
          editor.isActive("orderedList") ||
          editor.isActive("heading")
        ) {
          editor.commands.setContent("<p></p>", { emitUpdate: false });
          editor.view.dispatch(editor.state.tr.setStoredMarks([]));
          lastEmittedRef.current = "";
        }
      }
    };
    editor.on("selectionUpdate", onSelection);
    return () => {
      editor.off("selectionUpdate", onSelection);
    };
  }, [editor]);

  // Hide selection-only tools as soon as focus leaves the editor (toolbar still counts as “in”).
  useEffect(() => {
    if (!editor) return;
    const root = rootRef.current;
    if (!root) return;

    function deactivateShell() {
      setShellActive(false);
      disarmList();
      closeSelectionPanels();
      const { from, to } = editor.state.selection;
      if (to > from) {
        editor.view.dispatch(
          editor.state.tr.setTextSelection(to).setStoredMarks([])
        );
      }
    }

    function onFocusIn() {
      setShellActive(true);
    }

    function onFocusOut(e) {
      if (e.relatedTarget && root.contains(e.relatedTarget)) return;
      window.requestAnimationFrame(() => {
        if (root.contains(document.activeElement)) return;
        if (editor.isFocused) return;
        deactivateShell();
      });
    }

    function onPointerDown(e) {
      if (root.contains(e.target)) return;
      deactivateShell();
    }

    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [editor]);

  if (!editor) {
    return (
      <div
        ref={rootRef}
        className={`min-h-[200px] rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 ${className}`}
      />
    );
  }

  function openColorPanel() {
    const { from, to } = editor.state.selection;
    if (to <= from) return;
    colorRangeRef.current = { from, to };
    setColorPanelOpen(true);
  }

  function applyTextColor(colorValue) {
    const saved = colorRangeRef.current;
    const sel = editor.state.selection;
    const from = saved && saved.to > saved.from ? saved.from : sel.from;
    const to = saved && saved.to > saved.from ? saved.to : sel.to;

    if (to <= from) {
      closeColorPanel();
      editor.commands.focus();
      return;
    }

    const chain = editor.chain().focus().setTextSelection({ from, to });
    if (!colorValue) chain.unsetColor().run();
    else chain.setColor(colorValue).run();

    // Collapse caret after colored text so Colors UI disappears and typing is normal
    editor
      .chain()
      .focus()
      .setTextSelection(to)
      .command(({ tr, dispatch }) => {
        tr.setStoredMarks([]);
        if (dispatch) dispatch(tr);
        return true;
      })
      .run();
    closeColorPanel();
  }

  function exitSelection() {
    const { to } = editor.state.selection;
    closeSelectionPanels();
    editor
      .chain()
      .focus()
      .setTextSelection(to)
      .command(({ tr, dispatch }) => {
        tr.setStoredMarks([]);
        if (dispatch) dispatch(tr);
        return true;
      })
      .run();
  }

  function applyHeading(level) {
    if (!level) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
    closeHeadingPanel();
  }

  function clearAllContent() {
    const ok = window.confirm("Clear all content in this field?");
    if (!ok) return;
    closeSelectionPanels();
    // Always back to a bare paragraph — never leave a leftover list / heading node
    editor.commands.setContent("<p></p>", { emitUpdate: false });
    editor.commands.focus("start");
    editor.view.dispatch(editor.state.tr.setStoredMarks([]));
    emit("");
  }

  /** After wrapping a selection, park the caret at the end so the next keystrokes are plain. */
  function applyMarkToggle(toggleCmd) {
    const { empty } = editor.state.selection;
    toggleCmd();
    if (!empty) {
      const end = editor.state.selection.to;
      editor.commands.setTextSelection(end);
    }
  }

  function addImage() {
    const prev = editor.getAttributes("image").src || "";
    const url = window.prompt("Image URL", prev || "https://");
    if (url === null) return;
    const trimmed = String(url).trim();
    if (!trimmed) return;
    editor.chain().focus().setImage({ src: trimmed }).run();
  }

  function addVideo() {
    const url = window.prompt(
      "Video URL (YouTube, Vimeo, or direct .mp4/.webm)",
      "https://"
    );
    if (url === null) return;
    const embed = normalizeVideoEmbed(url);
    if (!embed) {
      window.alert(
        "Couldn’t use that URL. Paste a YouTube/Vimeo link or a direct video file URL."
      );
      return;
    }
    editor.chain().focus().setVideoEmbed(embed).run();
  }

  function setLink() {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Link URL (leave empty to remove)", prev);
    if (url === null) return;
    if (!String(url).trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    const { empty } = editor.state.selection;
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: String(url).trim() })
      .run();
    if (!empty || editor.isActive("link")) {
      const end = editor.state.selection.to;
      editor.commands.setTextSelection(end);
    }
  }

  function exitBold() {
    editor.chain().focus().extendMarkRange("bold").unsetBold().run();
  }
  function exitItalic() {
    editor.chain().focus().extendMarkRange("italic").unsetItalic().run();
  }
  function exitUnderline() {
    editor.chain().focus().extendMarkRange("underline").unsetUnderline().run();
  }
  function exitLink() {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  }
  function exitColor() {
    editor.chain().focus().unsetColor().run();
  }
  function exitHeading() {
    editor.chain().focus().setParagraph().run();
  }
  function exitBulletList() {
    armingListRef.current = true;
    if (isCaretInList(editor, "bulletList")) {
      editor.chain().focus().toggleBulletList().run();
    }
    disarmList();
    queueMicrotask(() => {
      armingListRef.current = false;
    });
  }
  function exitOrderedList() {
    armingListRef.current = true;
    if (isCaretInList(editor, "orderedList")) {
      editor.chain().focus().toggleOrderedList().run();
    }
    disarmList();
    queueMicrotask(() => {
      armingListRef.current = false;
    });
  }
  function exitAlign() {
    editor.chain().focus().unsetTextAlign().run();
  }

  function toggleBulletList() {
    armingListRef.current = true;
    editor.chain().focus().toggleBulletList().run();
    const on = isCaretInList(editor, "bulletList");
    armList(on ? "bullet" : null);
    // Survive focus + selection microtasks from this click
    window.setTimeout(() => {
      armingListRef.current = false;
    }, 50);
  }

  function toggleOrderedList() {
    armingListRef.current = true;
    editor.chain().focus().toggleOrderedList().run();
    const on = isCaretInList(editor, "orderedList");
    armList(on ? "ordered" : null);
    window.setTimeout(() => {
      armingListRef.current = false;
    }, 50);
  }

  function clearAllFormats() {
    armingListRef.current = true;
    editor.chain().focus().unsetAllMarks().unsetColor().unsetTextAlign().run();
    if (editor.isActive("heading")) {
      editor.chain().focus().setParagraph().run();
    }
    if (isCaretInList(editor, "bulletList")) {
      editor.chain().focus().toggleBulletList().run();
    }
    if (isCaretInList(editor, "orderedList")) {
      editor.chain().focus().toggleOrderedList().run();
    }
    disarmList();
    editor.view.dispatch(editor.state.tr.setStoredMarks([]));
    queueMicrotask(() => {
      armingListRef.current = false;
    });
  }

  const contentEmpty = isRichTextEmpty(editor.getHTML());

  const activeBold = !contentEmpty && editor.isActive("bold");
  const activeItalic = !contentEmpty && editor.isActive("italic");
  const activeUnderline = !contentEmpty && editor.isActive("underline");
  const activeLink = !contentEmpty && editor.isActive("link");
  const activeColor =
    !contentEmpty && Boolean(editor.getAttributes("textStyle").color);
  const activeHeadingLevel = contentEmpty
    ? undefined
    : [2, 3, 4].find((level) => editor.isActive("heading", { level }));
  // Empty field = nothing “on” by default (lists / headings included)
  const activeHeading = Boolean(activeHeadingLevel);
  // List buttons: armed-by-click only — never TipTap isActive(bulletList/orderedList)
  const activeBullet = listArmed === "bullet";
  const activeOrdered = listArmed === "ordered";
  // Only non-default aligns count as “active” (left/unset is normal, not armed)
  const activeAlign =
    !contentEmpty &&
    (editor.isActive({ textAlign: "center" }) ||
      editor.isActive({ textAlign: "right" }));

  const { from: selFrom, to: selTo } = editor.state.selection;
  const hasTextSelection = selTo > selFrom;
  // After blur: hide Colors / Bold / Exit selection even if TipTap still holds a range briefly
  const showSelectionActions = shellActive && hasTextSelection;

  // Marks like Bold must not look “on” just because the caret sits inside formatted text
  const selectedBold = showSelectionActions && activeBold;
  const selectedItalic = showSelectionActions && activeItalic;
  const selectedUnderline = showSelectionActions && activeUnderline;
  const selectedLink = showSelectionActions && activeLink;
  const selectedColor = showSelectionActions && activeColor;

  const hasActiveFormat =
    selectedBold ||
    selectedItalic ||
    selectedUnderline ||
    selectedLink ||
    selectedColor ||
    (shellActive && activeHeading) ||
    (shellActive && activeBullet) ||
    (shellActive && activeOrdered) ||
    (shellActive && activeAlign);

  return (
    <div
      ref={rootRef}
      className={`overflow-hidden rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-950">
        {showSelectionActions ? (
          <ToolbarButton
            title="Choose a color for the selected text"
            active={colorPanelOpen}
            onClick={() => {
              closeHeadingPanel();
              if (colorPanelOpen) closeColorPanel();
              else openColorPanel();
            }}
          >
            Colors
          </ToolbarButton>
        ) : null}
        {showSelectionActions ? (
          <ToolbarButton
            title="Heading for selected block (H2–H4)"
            active={headingPanelOpen || Boolean(activeHeadingLevel)}
            onClick={() => {
              closeColorPanel();
              setHeadingPanelOpen((open) => !open);
            }}
          >
            {activeHeadingLevel ? `H${activeHeadingLevel}` : "Heading"}
          </ToolbarButton>
        ) : null}
        {showSelectionActions ? (
          <ToolbarButton
            title="Bold selected text"
            active={selectedBold}
            onClick={() =>
              applyMarkToggle(() => editor.chain().focus().toggleBold().run())
            }
          >
            B
          </ToolbarButton>
        ) : null}
        {showSelectionActions ? (
          <ToolbarButton
            title="Italic selected text"
            active={selectedItalic}
            onClick={() =>
              applyMarkToggle(() => editor.chain().focus().toggleItalic().run())
            }
          >
            <span className="italic">I</span>
          </ToolbarButton>
        ) : null}
        {showSelectionActions ? (
          <ToolbarButton
            title="Underline selected text"
            active={selectedUnderline}
            onClick={() =>
              applyMarkToggle(() =>
                editor.chain().focus().toggleUnderline().run()
              )
            }
          >
            <span className="underline">U</span>
          </ToolbarButton>
        ) : null}
        {showSelectionActions ? (
          <ToolbarButton
            title="Clear text selection and keep writing"
            active={false}
            onClick={exitSelection}
          >
            Exit selection
          </ToolbarButton>
        ) : null}
        <ToolbarButton
          title="Bullet list"
          active={activeBullet}
          onClick={toggleBulletList}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={activeOrdered}
          onClick={toggleOrderedList}
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          title="Add / edit link"
          active={selectedLink}
          onClick={setLink}
        >
          Link
        </ToolbarButton>
        <ToolbarButton title="Insert image by URL" onClick={addImage}>
          Img
        </ToolbarButton>
        <ToolbarButton
          title="Insert YouTube, Vimeo, or video file URL"
          onClick={addVideo}
        >
          Video
        </ToolbarButton>
        <ToolbarButton
          title="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          ⬅
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          ↔
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          ➡
        </ToolbarButton>
        <ToolbarButton
          title={
            keepPasteColors
              ? "Paste colors ON — keeps text/background color only; still strips classes and other styles"
              : "Paste colors OFF — strips classes, inline styles, and colors (keeps bold/lists/links)"
          }
          active={keepPasteColors}
          onClick={toggleKeepPasteColors}
        >
          Paste colors: {keepPasteColors ? "On" : "Off"}
        </ToolbarButton>
        <ToolbarButton
          title="Clear every format and return to normal text"
          active={false}
          disabled={!hasActiveFormat}
          onClick={clearAllFormats}
        >
          Clear formats
        </ToolbarButton>
        <ToolbarButton
          title="Delete all text in this field"
          active={false}
          onClick={clearAllContent}
        >
          Clear content
        </ToolbarButton>
      </div>

      {showSelectionActions && headingPanelOpen ? (
        <div
          className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-white px-2 py-1.5 dark:border-slate-800 dark:bg-slate-950"
          onMouseDown={(e) => e.preventDefault()}
        >
          <span className="mr-1 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
            Heading
          </span>
          {[
            { label: "Normal", level: 0 },
            { label: "H2", level: 2 },
            { label: "H3", level: 3 },
            { label: "H4", level: 4 },
          ].map((opt) => {
            const active =
              opt.level === 0
                ? !activeHeadingLevel
                : activeHeadingLevel === opt.level;
            return (
              <button
                key={opt.label}
                type="button"
                title={opt.label}
                onClick={() => applyHeading(opt.level)}
                className={`inline-flex h-7 items-center rounded-md px-2.5 text-xs font-semibold transition ${
                  active
                    ? "bg-brand text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {showSelectionActions && colorPanelOpen ? (
        <div
          className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-2 py-1.5 dark:border-slate-800 dark:bg-slate-950"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-wrap items-center gap-1">
            {TEXT_COLORS.filter((c) => c.group === "light").map((c) => (
              <button
                key={c.label}
                type="button"
                title={c.label}
                className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 text-[9px] font-bold dark:border-slate-600"
                style={{
                  backgroundColor: c.value || "#ffffff",
                  color: c.value ? "#ffffff" : "#64748b",
                }}
                onClick={() => applyTextColor(c.value)}
              >
                {c.value ? "" : "A"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1 rounded bg-ink px-1.5 py-1">
            {TEXT_COLORS.filter((c) => c.group === "dark").map((c) => (
              <button
                key={c.label}
                type="button"
                title={`${c.label} (dark bg)`}
                className="h-6 w-6 rounded border border-white/20"
                style={{ backgroundColor: c.value }}
                onClick={() => applyTextColor(c.value)}
              />
            ))}
          </div>
        </div>
      ) : null}

      {hasActiveFormat ? (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-white px-2 py-1.5 dark:border-slate-800 dark:bg-slate-950">
          <span className="mr-1 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
            Active · tap × to exit
          </span>
          {selectedBold ? (
            <ExitChip label="Bold" onExit={exitBold} />
          ) : null}
          {selectedItalic ? (
            <ExitChip label="Italic" onExit={exitItalic} />
          ) : null}
          {selectedUnderline ? (
            <ExitChip label="Underline" onExit={exitUnderline} />
          ) : null}
          {selectedLink ? (
            <ExitChip label="Link" onExit={exitLink} />
          ) : null}
          {selectedColor ? (
            <ExitChip label="Color" onExit={exitColor} />
          ) : null}
          {activeHeading ? (
            <ExitChip
              label={`H${activeHeadingLevel}`}
              onExit={exitHeading}
            />
          ) : null}
          {activeBullet ? (
            <ExitChip label="Bullet list" onExit={exitBulletList} />
          ) : null}
          {activeOrdered ? (
            <ExitChip label="Numbered list" onExit={exitOrderedList} />
          ) : null}
          {activeAlign ? (
            <ExitChip label="Align" onExit={exitAlign} />
          ) : null}
          <ExitChip
            label="Clear all"
            title="Exit every active format"
            onExit={clearAllFormats}
          />
        </div>
      ) : null}

      <EditorContent editor={editor} />
    </div>
  );
}
