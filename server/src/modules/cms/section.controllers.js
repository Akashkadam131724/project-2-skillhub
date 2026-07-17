import Section, { normalizeContentScope } from "./section.model.js";
import Page from "./page.model.js";
import {
  getSectionCatalogMeta,
  normalizeSectionTags,
} from "./section.catalog.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";

export const createSection = async (req, res) => {
  try {
    const { pages: pageTags, ...rest } = req.body;

    // Default category/tags from catalog when creating a known section key
    const catalog = getSectionCatalogMeta(rest.key);
    if (catalog) {
      if (rest.category === undefined || rest.category === "") {
        rest.category = catalog.category;
      }
      if (rest.tags === undefined) {
        rest.tags = catalog.tags;
      }
    }
    if (rest.tags !== undefined) {
      rest.tags = normalizeSectionTags(rest.tags);
    }

    const section = new Section(rest);

    if (Array.isArray(pageTags) && pageTags.length) {
      for (const tag of pageTags) {
        const page = await Page.findByKey(tag.page_key);
        if (!page) {
          return res.status(404).json({
            success: false,
            message: `Page not found: ${tag.page_key}`,
          });
        }
        const tagPayload = {
          page: page._id,
          page_key: page.key,
          sort_order: tag.sort_order ?? 0,
          section_title: tag.section_title ?? null,
          sub_title: tag.sub_title ?? null,
          section_bg_img: tag.section_bg_img ?? null,
          section_bg_color: tag.section_bg_color ?? null,
          in_page_nav_title: tag.in_page_nav_title ?? null,
          section_img_url: tag.section_img_url ?? null,
          section_preview_img: section.section_preview_img || null,
          data: tag.data ?? null,
          status: tag.status !== false,
        };
        if (Array.isArray(tag.buttons)) tagPayload.buttons = tag.buttons;
        if (Array.isArray(tag.items)) tagPayload.items = tag.items;
        section.tagPage(tagPayload);
      }
    }

    await section.save();
    res.status(201).json({ success: true, data: section });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getSections = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status !== undefined) {
      filter.status = req.query.status === "true" || req.query.status === true;
    }
    if (req.query.page_key) {
      filter["pages.page_key"] = String(req.query.page_key).toLowerCase();
    }
    if (req.query.content_scope) {
      const scope = String(req.query.content_scope).toLowerCase();
      if (scope === "global" || scope === "template") {
        filter.content_scope = scope;
      } else if (scope === "page") {
        // page + legacy cascading + unset → treat as page cascade
        filter.content_scope = { $nin: ["global", "template"] };
      }
    }
    if (req.query.category) {
      const category = String(req.query.category).toLowerCase().trim();
      if (category === "uncategorized") {
        filter.$and = [
          ...(filter.$and || []),
          {
            $or: [
              { category: "" },
              { category: null },
              { category: { $exists: false } },
            ],
          },
        ];
      } else {
        filter.category = category;
      }
    }
    if (req.query.tag) {
      filter.tags = String(req.query.tag).toLowerCase().trim();
    }
    if (req.query.q) {
      const q = { $regex: req.query.q, $options: "i" };
      filter.$and = [
        ...(filter.$and || []),
        {
          $or: [{ name: q }, { key: q }, { category: q }, { tags: q }],
        },
      ];
    }

    const sections = await Section.find(filter)
      .populate("pages.page", "key name status entity_type")
      .sort({ name: 1 })
      .lean();

    res.json({ success: true, count: sections.length, data: sections });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getSectionByKey = async (req, res) => {
  try {
    const section = await Section.findByKey(req.params.key).populate(
      "pages.page",
      "key name status entity_type"
    );
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    res.json({ success: true, data: section });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const updateSection = async (req, res) => {
  try {
    // key / pages are code-bound — only content + display fields may change
    const allowed = [
      "name",
      "description",
      "category",
      "tags",
      "section_title",
      "sub_title",
      "in_page_nav_title",
      "button_title",
      "target_url",
      "section_bg_img",
      "section_bg_color",
      "section_img_url",
      "section_preview_img",
      "data",
      "buttons",
      "items",
      "content_scope",
      "render_key",
      "status",
    ];
    const patch = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) patch[field] = req.body[field];
    }
    if (patch.render_key !== undefined) {
      patch.render_key = String(patch.render_key || "")
        .toLowerCase()
        .trim();
    }
    if (patch.content_scope !== undefined) {
      patch.content_scope = normalizeContentScope(patch.content_scope);
    }
    if (patch.tags !== undefined) {
      patch.tags = normalizeSectionTags(patch.tags);
    }
    if (patch.category !== undefined) {
      patch.category = String(patch.category || "")
        .toLowerCase()
        .trim();
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No editable fields provided",
      });
    }

    const section = await Section.findOneAndUpdate(
      { key: String(req.params.key).toLowerCase() },
      { $set: patch },
      { new: true, runValidators: true }
    ).populate("pages.page", "key name status entity_type");

    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    res.json({ success: true, data: section });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const setSectionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (typeof status !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "status must be a boolean",
        fields: { status: "Expected true or false" },
      });
    }

    const section = await Section.findOneAndUpdate(
      { key: String(req.params.key).toLowerCase() },
      { status },
      { new: true }
    );
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    res.json({ success: true, data: section });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

/** Replace / set page tags on a section: body.pages = [{ page_key, sort_order, ... }] */
export const setSectionPages = async (req, res) => {
  try {
    const section = await Section.findByKey(req.params.key);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    const pageTags = Array.isArray(req.body.pages) ? req.body.pages : null;
    if (!pageTags) {
      return res.status(400).json({
        success: false,
        message: "pages array is required",
        fields: { pages: "Expected an array of page tags" },
      });
    }

    const next = [];
    for (const tag of pageTags) {
      if (!tag.page_key) {
        return res.status(400).json({
          success: false,
          message: "Each tag needs page_key",
        });
      }
      const page = await Page.findByKey(tag.page_key);
      if (!page) {
        return res.status(404).json({
          success: false,
          message: `Page not found: ${tag.page_key}`,
        });
      }
      const entry = {
        page: page._id,
        page_key: page.key,
        sort_order: tag.sort_order ?? 0,
        section_title: tag.section_title ?? null,
        sub_title: tag.sub_title ?? null,
        in_page_nav_title: tag.in_page_nav_title ?? null,
        section_bg_img: tag.section_bg_img ?? null,
        section_bg_color: tag.section_bg_color ?? null,
        section_img_url: tag.section_img_url ?? null,
        section_preview_img: section.section_preview_img || null,
        data: tag.data ?? null,
        status: tag.status !== false,
      };
      if (Array.isArray(tag.buttons)) entry.buttons = tag.buttons;
      if (Array.isArray(tag.items)) entry.items = tag.items;
      next.push(entry);
    }

    section.pages = next;
    await section.save();
    await section.populate("pages.page", "key name status entity_type");

    res.json({ success: true, data: section });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

/** Add a new page placement (same page_key allowed multiple times) */
export const tagSectionPage = async (req, res) => {
  try {
    const section = await Section.findByKey(req.params.key);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    const pageKey = req.params.pageKey || req.body.page_key;
    if (!pageKey) {
      return res.status(400).json({
        success: false,
        message: "page_key is required",
      });
    }

    const page = await Page.findByKey(pageKey);
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    const tagPayload = {
      page: page._id,
      page_key: page.key,
      sort_order: req.body.sort_order ?? 0,
      section_title: req.body.section_title ?? null,
      sub_title: req.body.sub_title ?? null,
      section_bg_img: req.body.section_bg_img ?? null,
      section_bg_color: req.body.section_bg_color ?? null,
      in_page_nav_title: req.body.in_page_nav_title ?? null,
      section_img_url: req.body.section_img_url ?? null,
      section_preview_img: section.section_preview_img || null,
      data: req.body.data ?? null,
      status: req.body.status !== false,
    };
    if (Array.isArray(req.body.buttons)) tagPayload.buttons = req.body.buttons;
    if (Array.isArray(req.body.items)) tagPayload.items = req.body.items;
    section.tagPage(tagPayload);
    await section.save();
    await section.populate("pages.page", "key name status entity_type");

    const tag = section.pages[section.pages.length - 1];
    res.status(201).json({
      success: true,
      data: section,
      placement: {
        id: tag._id,
        page_key: tag.page_key,
        sort_order: tag.sort_order,
      },
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

/** Update one placement by tag id */
export const updateSectionPageTag = async (req, res) => {
  try {
    const section = await Section.findByKey(req.params.key);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    const allowed = [
      "sort_order",
      "section_title",
      "sub_title",
      "section_bg_img",
      "section_bg_color",
      "in_page_nav_title",
      "section_img_url",
      "buttons",
      "items",
      "data",
      "status",
    ];
    const patch = {};
    for (const key of allowed) {
      if (req.body[key] === undefined) continue;
      if ((key === "items" || key === "buttons") && req.body[key] === null) {
        patch[key] = undefined;
        continue;
      }
      patch[key] = req.body[key];
    }

    const tag = section.updatePageTag(req.params.tagId, patch);
    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Page placement not found",
      });
    }

    // Explicit null from client clears template override → inherit Section
    for (const key of ["items", "buttons"]) {
      if (req.body[key] === null) {
        tag.set(key, undefined);
      }
    }

    await section.save();
    await section.populate("pages.page", "key name status entity_type");
    res.json({ success: true, data: section });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

/** Remove one placement by tag id */
export const untagSectionPageById = async (req, res) => {
  try {
    const section = await Section.findByKey(req.params.key);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    if (!section.untagById(req.params.tagId)) {
      return res.status(404).json({
        success: false,
        message: "Page placement not found",
      });
    }

    await section.save();
    res.json({ success: true, data: section });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

/** Remove all placements for a page_key */
export const untagSectionPage = async (req, res) => {
  try {
    const section = await Section.findByKey(req.params.key);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    const removed = section.untagPage(req.params.pageKey);
    if (!removed) {
      return res.status(404).json({
        success: false,
        message: `Section is not tagged to page "${req.params.pageKey}"`,
      });
    }

    await section.save();
    res.json({
      success: true,
      removed,
      data: section,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const deleteSection = async (req, res) => {
  try {
    const section = await Section.findOneAndDelete({
      key: String(req.params.key).toLowerCase(),
    });
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    res.json({ success: true, message: "Section deleted", data: section });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
