import mongoose from "mongoose";
import Page from "./page.model.js";
import Section, { normalizeContentScope } from "./section.model.js";
import EntityPageSection from "./entity-page-section.model.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";

async function resolvePageAndSection(pageKey, sectionKey) {
  const page = await Page.findByKey(pageKey);
  if (!page) return { error: { status: 404, message: "Page not found" } };

  const section = await Section.findByKey(sectionKey);
  if (!section) return { error: { status: 404, message: "Section not found" } };

  return { page, section };
}

function serializeTag(section, tag) {
  if (!tag) return null;
  return {
    id: tag._id,
    section_id: section._id,
    section_key: section.key,
    section_name: section.name,
    content_scope: normalizeContentScope(section.content_scope),
    page: tag.page,
    page_key: tag.page_key,
    sort_order: tag.sort_order,
    section_title: tag.section_title,
    sub_title: tag.sub_title,
    section_bg_img: tag.section_bg_img,
    in_page_nav_title: tag.in_page_nav_title,
    section_img_url: tag.section_img_url,
    section_preview_img:
      tag.section_preview_img || section.section_preview_img || null,
    buttons: Array.isArray(tag.buttons) ? tag.buttons : undefined,
    items: Array.isArray(tag.items) ? tag.items : undefined,
    data: tag.data,
    status: tag.status,
  };
}

/** Tag a section onto a page — always adds a new placement (duplicates allowed) */
export const tagSectionToPage = async (req, res) => {
  try {
    const {
      page_key,
      section_key,
      sort_order = 0,
      section_title = null,
      sub_title = null,
      section_bg_img = null,
      in_page_nav_title = null,
      section_img_url = null,
      buttons,
      items,
      data = null,
      status = true,
    } = req.body;

    if (!page_key || !section_key) {
      return res.status(400).json({
        success: false,
        message: "page_key and section_key are required",
        fields: {
          ...(page_key ? {} : { page_key: "Required" }),
          ...(section_key ? {} : { section_key: "Required" }),
        },
      });
    }

    const resolved = await resolvePageAndSection(page_key, section_key);
    if (resolved.error) {
      return res
        .status(resolved.error.status)
        .json({ success: false, message: resolved.error.message });
    }

    const { page, section } = resolved;

    const tagPayload = {
      page: page._id,
      page_key: page.key,
      sort_order,
      section_title,
      sub_title,
      section_bg_img,
      in_page_nav_title,
      section_img_url,
      // Snapshot from section — not editable on the mapping
      section_preview_img: section.section_preview_img || null,
      data,
      status,
    };
    // Only set when provided — omit to inherit from the other mapping layer
    if (Array.isArray(buttons)) tagPayload.buttons = buttons;
    if (Array.isArray(items)) tagPayload.items = items;
    section.tagPage(tagPayload);
    await section.save();

    const tag = section.pages[section.pages.length - 1];
    res.status(201).json({
      success: true,
      data: serializeTag(section, tag),
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

/** List tags — flatten Section.pages (filter by page_key / section_key) */
export const getPageSections = async (req, res) => {
  try {
    const filter = {};
    if (req.query.section_key) {
      filter.key = String(req.query.section_key).toLowerCase();
    }
    if (req.query.page_key) {
      filter["pages.page_key"] = String(req.query.page_key).toLowerCase();
    }
    if (req.query.status !== undefined) {
      const status = req.query.status === "true" || req.query.status === true;
      filter["pages.status"] = status;
    }

    const sections = await Section.find(filter)
      .populate("pages.page", "key name status entity_type")
      .sort({ key: 1 })
      .lean();

    const pageKeyFilter = req.query.page_key
      ? String(req.query.page_key).toLowerCase()
      : null;
    const statusFilter =
      req.query.status !== undefined
        ? req.query.status === "true" || req.query.status === true
        : null;

    const tags = [];
    for (const section of sections) {
      for (const tag of section.pages || []) {
        if (pageKeyFilter && tag.page_key !== pageKeyFilter) continue;
        if (statusFilter !== null && tag.status !== statusFilter) continue;
        tags.push({
          id: tag._id,
          section_id: section._id,
          section_key: section.key,
          section_name: section.name,
          section_global_status: section.status,
          content_scope: normalizeContentScope(section.content_scope),
          page: tag.page,
          page_key: tag.page_key,
          sort_order: tag.sort_order,
          section_title: tag.section_title,
          sub_title: tag.sub_title,
          section_bg_img: tag.section_bg_img,
          in_page_nav_title: tag.in_page_nav_title,
          section_img_url: tag.section_img_url,
          section_preview_img:
            tag.section_preview_img || section.section_preview_img || null,
          buttons: Array.isArray(tag.buttons) ? tag.buttons : undefined,
          items: Array.isArray(tag.items) ? tag.items : undefined,
          data: tag.data,
          status: tag.status,
        });
      }
    }

    tags.sort(
      (a, b) =>
        a.page_key.localeCompare(b.page_key) || a.sort_order - b.sort_order
    );

    res.json({ success: true, count: tags.length, data: tags });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

/** Update a page tag by subdocument id */
export const updatePageSection = async (req, res) => {
  try {
    const allowed = [
      "sort_order",
      "section_title",
      "sub_title",
      "section_bg_img",
      "in_page_nav_title",
      "section_img_url",
      "buttons",
      "items",
      "data",
      "status",
    ];

    const section = await Section.findOne({ "pages._id": req.params.id });
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Page section tag not found" });
    }

    const tag = section.pages.id(req.params.id);
    for (const key of allowed) {
      if (req.body[key] === undefined) continue;
      if ((key === "items" || key === "buttons") && req.body[key] === null) {
        tag.set(key, undefined);
        continue;
      }
      tag[key] = req.body[key];
    }
    await section.save();

    res.json({ success: true, data: serializeTag(section, tag) });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const setPageSectionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (typeof status !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "status must be a boolean",
        fields: { status: "Expected true or false" },
      });
    }

    const section = await Section.findOne({ "pages._id": req.params.id });
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Page section tag not found" });
    }

    const tag = section.pages.id(req.params.id);
    tag.status = status;
    await section.save();

    res.json({ success: true, data: serializeTag(section, tag) });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

/** Bulk reorder: { page_key, items: [{ section_key | id, sort_order }] } */
export const reorderPageSections = async (req, res) => {
  try {
    const { page_key, items } = req.body;
    if (!page_key || !Array.isArray(items) || !items.length) {
      return res.status(400).json({
        success: false,
        message: "page_key and items[] are required",
      });
    }

    const key = String(page_key).toLowerCase();
    const sections = await Section.find({ "pages.page_key": key });

    for (const item of items) {
      if (item.sort_order === undefined) continue;

      const section = sections.find((s) => {
        if (item.section_key && s.key === String(item.section_key).toLowerCase()) {
          return true;
        }
        if (item.id && s.pages.id(item.id)) return true;
        return false;
      });
      if (!section) continue;

      const tag = item.id
        ? section.pages.id(item.id)
        : section.pages.find((p) => p.page_key === key);
      if (!tag) continue;
      tag.sort_order = Number(item.sort_order);
      await section.save();
    }

    const refreshed = await Section.find({ "pages.page_key": key }).lean();
    const tags = refreshed
      .flatMap((s) =>
        (s.pages || [])
          .filter((p) => p.page_key === key)
          .map((p) => ({
            id: p._id,
            section_key: s.key,
            page_key: key,
            sort_order: p.sort_order,
            status: p.status,
          }))
      )
      .sort((a, b) => a.sort_order - b.sort_order);

    res.json({ success: true, count: tags.length, data: tags });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const deletePageSection = async (req, res) => {
  try {
    const section = await Section.findOne({ "pages._id": req.params.id });
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Page section tag not found" });
    }

    const tag = section.pages.id(req.params.id);
    const snapshot = serializeTag(section, tag);
    tag.deleteOne();
    await section.save();

    res.json({ success: true, message: "Tag removed", data: snapshot });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

/** Upsert template override OR update by id OR create entity-only extra */
export const upsertEntityPageSection = async (req, res) => {
  try {
    const {
      id,
      page_key,
      entity_id,
      section_key,
      page_tag_id,
    } = req.body;

    if (!page_key || !entity_id || !section_key) {
      return res.status(400).json({
        success: false,
        message: "page_key, entity_id, and section_key are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(entity_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid entity_id",
        fields: { entity_id: "Invalid id format" },
      });
    }

    const resolved = await resolvePageAndSection(page_key, section_key);
    if (resolved.error) {
      return res
        .status(resolved.error.status)
        .json({ success: false, message: resolved.error.message });
    }

    const { page, section } = resolved;
    const sortDisabled = page.is_sort_disabled !== false;

    const optional = [
      "sort_order",
      "section_title",
      "sub_title",
      "section_bg_img",
      "in_page_nav_title",
      "section_img_url",
      "buttons",
      "items",
      "data",
      "status",
    ];

    function pickEntityFields(source = req.body, { allowSort = !sortDisabled } = {}) {
      const $set = {};
      for (const key of optional) {
        if (source[key] === undefined) continue;
        if (key === "sort_order" && !allowSort) continue;
        $set[key] = source[key];
      }
      return $set;
    }

    // 1) Update existing entity doc by id (override or extra)
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid id",
        });
      }
      const existing = await EntityPageSection.findOne({
        _id: id,
        page_key: page.key,
        entity_id,
      });
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Entity page section not found",
        });
      }

      const isExtra = !existing.page_tag_id;
      // Template overrides cannot change sort when page sort is disabled;
      // page-mapped extras always may set EntityPageSection.sort_order.
      if (
        sortDisabled &&
        !isExtra &&
        req.body.sort_order !== undefined
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Template section order is locked. Reorder on the page template CMS, or map a page-only section.",
          fields: { sort_order: "is_sort_disabled is true on this page" },
        });
      }

      const $set = pickEntityFields(req.body, {
        allowSort: !sortDisabled || isExtra,
      });
      const doc = await EntityPageSection.findOneAndUpdate(
        { _id: id, page_key: page.key, entity_id },
        { $set },
        { new: true, runValidators: true }
      );
      return res.json({ success: true, data: doc });
    }

    // 2) Template override (page_tag_id required — must exist on section.pages)
    if (page_tag_id) {
      if (!mongoose.Types.ObjectId.isValid(page_tag_id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid page_tag_id",
          fields: { page_tag_id: "Invalid id format" },
        });
      }

      const tag = section.pages.id(page_tag_id);
      if (!tag || tag.page_key !== page.key) {
        return res.status(400).json({
          success: false,
          message: `Placement ${page_tag_id} is not tagged on page "${page.key}" for section "${section.key}".`,
        });
      }

      if (sortDisabled && req.body.sort_order !== undefined) {
        return res.status(400).json({
          success: false,
          message:
            "Template section order is locked. Reorder on the page template CMS instead.",
          fields: { sort_order: "is_sort_disabled is true on this page" },
        });
      }

      const $set = {
        page_key: page.key,
        entity_id,
        page_tag_id: tag._id,
        section: section._id,
        section_key: section.key,
        ...pickEntityFields(req.body, { allowSort: !sortDisabled }),
      };

      const doc = await EntityPageSection.findOneAndUpdate(
        {
          page_key: page.key,
          entity_id,
          page_tag_id: tag._id,
        },
        { $set },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );

      return res.json({ success: true, data: doc });
    }

    // 3) Create entity-only extra (this page only — no template change)
    // Always store sort on EntityPageSection so newly mapped page sections can be ordered.
    let extraSort = req.body.sort_order;
    if (extraSort === undefined || extraSort === null) {
      const [tagSections, existingExtras] = await Promise.all([
        Section.find({ "pages.page_key": page.key }).select("pages").lean(),
        EntityPageSection.find({
          page_key: page.key,
          entity_id,
          page_tag_id: null,
        })
          .select("sort_order")
          .lean(),
      ]);
      let maxSort = 0;
      for (const s of tagSections) {
        for (const t of s.pages || []) {
          if (t.page_key === page.key) {
            maxSort = Math.max(maxSort, Number(t.sort_order) || 0);
          }
        }
      }
      for (const d of existingExtras) {
        maxSort = Math.max(maxSort, Number(d.sort_order) || 0);
      }
      extraSort = maxSort + 1;
    } else {
      extraSort = Number(extraSort);
    }

    const createDoc = {
      page_key: page.key,
      entity_id,
      page_tag_id: null,
      section: section._id,
      section_key: section.key,
      sort_order: extraSort,
      section_title: req.body.section_title ?? null,
      sub_title: req.body.sub_title ?? null,
      section_bg_img: req.body.section_bg_img ?? null,
      in_page_nav_title: req.body.in_page_nav_title ?? null,
      section_img_url: req.body.section_img_url ?? null,
      data: req.body.data ?? null,
      status: req.body.status !== false,
    };
    if (Array.isArray(req.body.buttons)) createDoc.buttons = req.body.buttons;
    if (Array.isArray(req.body.items)) createDoc.items = req.body.items;

    const doc = await EntityPageSection.create(createDoc);
    res.status(201).json({ success: true, data: doc, is_entity_extra: true });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getEntityPageSections = async (req, res) => {
  try {
    const { page_key, entity_id } = req.query;
    if (!page_key || !entity_id) {
      return res.status(400).json({
        success: false,
        message: "page_key and entity_id query params are required",
      });
    }

    const docs = await EntityPageSection.find({
      page_key: String(page_key).toLowerCase(),
      entity_id,
    })
      .sort({ sort_order: 1 })
      .lean();

    res.json({ success: true, count: docs.length, data: docs });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const deleteEntityPageSection = async (req, res) => {
  try {
    const doc = await EntityPageSection.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Entity page section override not found",
      });
    }
    res.json({ success: true, message: "Override removed", data: doc });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
