import mongoose from "mongoose";
import Navigation from "./navigation.model.js";
import NavigationColumn from "./navigation-column.model.js";
import NavigationLink from "./navigation-link.model.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";

export async function buildNavigationTree() {
  const navigations = await Navigation.find({ status: true }).sort({
    sort_order: 1,
  });
  const navIds = navigations.map((nav) => nav._id);

  const columns = await NavigationColumn.find({
    navigation: { $in: navIds },
    status: true,
  }).sort({ sort_order: 1 });
  const columnIds = columns.map((col) => col._id);

  const links = await NavigationLink.find({
    navigationColumn: { $in: columnIds },
    status: true,
  }).sort({ sort_order: 1 });

  const linksByColumn = {};
  for (const link of links) {
    const columnId = link.navigationColumn.toString();
    if (!linksByColumn[columnId]) linksByColumn[columnId] = [];
    linksByColumn[columnId].push(link.toObject());
  }

  const columnsByNav = {};
  for (const column of columns) {
    const navId = column.navigation.toString();
    const columnObj = column.toObject();
    columnObj.navLinks = linksByColumn[column._id.toString()] || [];
    if (!columnsByNav[navId]) columnsByNav[navId] = [];
    columnsByNav[navId].push(columnObj);
  }

  return navigations.map((nav) => {
    const navObj = nav.toObject();
    navObj.columns = columnsByNav[nav._id.toString()] || [];
    return navObj;
  });
}

export const getNavigation = async (req, res) => {
  try {
    const navigation = await buildNavigationTree();
    res.status(200).json({ navigation });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const createNavigation = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    if (!name || name.length < 3) {
      return res
        .status(400)
        .json({ message: "Name must be at least 3 characters long." });
    }

    const exists = await Navigation.exists({ name });
    if (exists) {
      return res.status(409).json({ errors: { name: ["Name already exists"] } });
    }

    const navigation = await Navigation.create({
      name,
      language: req.body.language,
      country: req.body.country,
      status: req.body.status,
    });
    res
      .status(201)
      .json({ message: "Navigation created successfully.", navigation });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const updateNavigation = async (req, res) => {
  try {
    const navigation = await Navigation.findById(req.params.id);
    if (!navigation) {
      return res.status(404).json({ message: "Navigation not found." });
    }

    if (req.body.name) {
      const exists = await Navigation.exists({
        name: req.body.name,
        _id: { $ne: req.params.id },
      });
      if (exists) {
        return res
          .status(409)
          .json({ errors: { name: ["Name already exists"] } });
      }
    }

    if (
      req.body.sort_order !== undefined &&
      Number(req.body.sort_order) !== navigation.sort_order
    ) {
      const newSortOrder = Number(req.body.sort_order);
      const oldSortOrder = navigation.sort_order;
      const targetNav = await Navigation.findOne({ sort_order: newSortOrder });
      if (targetNav) {
        await Navigation.findByIdAndUpdate(navigation._id, { sort_order: -1 });
        await Navigation.findByIdAndUpdate(targetNav._id, {
          sort_order: oldSortOrder,
        });
      }
    }

    const updatedNavigation = await Navigation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Navigation updated successfully.",
      updatedNavigation,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getNavigationColumns = async (req, res) => {
  try {
    const navigationColumns = await NavigationColumn.find().sort({
      sort_order: 1,
    });
    res.status(200).json({ navigationColumns });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const createNavigationColumn = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const navigationId = req.body.navigation;

    if (!name || name.length < 3) {
      return res
        .status(400)
        .json({ message: "Name must be at least 3 characters long." });
    }
    if (!mongoose.Types.ObjectId.isValid(navigationId)) {
      return res
        .status(400)
        .json({ errors: { navigation: ["Invalid navigation ID."] } });
    }

    const navigation = await Navigation.findById(navigationId);
    if (!navigation) {
      return res
        .status(404)
        .json({ errors: { navigation: ["Navigation not found"] } });
    }

    const navigationColumn = await NavigationColumn.create({
      name,
      navigation: navigationId,
      status: req.body.status,
    });
    res.status(201).json({
      message: "Navigation column created successfully.",
      navigationColumn,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const createNavLink = async (req, res) => {
  try {
    const { name, url, navigationColumn } = req.body;
    if (!name || !url || !navigationColumn) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const navColumn = await NavigationColumn.findById(navigationColumn);
    if (!navColumn) {
      return res.status(404).json({ message: "Navigation column not found" });
    }

    const navLink = await NavigationLink.create({
      name,
      url,
      navigationColumn: navColumn._id,
    });
    res
      .status(201)
      .json({ message: "Navigation link created successfully", navLink });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toObjectId(value) {
  if (!value || value === "all") return null;
  return value;
}

export const filterNavigation = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      48,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 12)
    );
    const search = String(req.query.search || "").trim();

    let navigationId = toObjectId(req.query.navigation);
    let columnId = toObjectId(req.query.column);

    if (columnId) {
      const selectedColumn = await NavigationColumn.findById(columnId).select(
        "navigation"
      );
      if (!selectedColumn) {
        return res.status(404).json({ message: "Column not found." });
      }
      navigationId = selectedColumn.navigation.toString();
    }

    const searchMatch = search
      ? {
          $or: [
            { name: { $regex: escapeRegex(search), $options: "i" } },
            { url: { $regex: escapeRegex(search), $options: "i" } },
          ],
        }
      : {};

    let scopedColumnIds = null;
    if (columnId) {
      scopedColumnIds = [columnId];
    } else if (navigationId) {
      const navColumns = await NavigationColumn.find({
        navigation: navigationId,
      }).select("_id");
      scopedColumnIds = navColumns.map((col) => col._id);
    }

    const linkMatch = { ...searchMatch };
    if (scopedColumnIds) {
      linkMatch.navigationColumn = { $in: scopedColumnIds };
    }

    const total = await NavigationLink.countDocuments(linkMatch);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);

    const links = await NavigationLink.find(linkMatch)
      .sort({ sort_order: 1 })
      .skip((safePage - 1) * limit)
      .limit(limit)
      .populate({
        path: "navigationColumn",
        select: "name navigation sort_order",
        populate: { path: "navigation", select: "name sort_order" },
      });

    const navigations = await Navigation.find()
      .sort({ sort_order: 1 })
      .select("name sort_order");
    const allColumns = await NavigationColumn.find()
      .sort({ sort_order: 1 })
      .select("name navigation sort_order");

    const columnsByNav = {};
    for (const column of allColumns) {
      const navKey = column.navigation.toString();
      if (!columnsByNav[navKey]) columnsByNav[navKey] = [];
      columnsByNav[navKey].push(column._id);
    }

    const navCounts = await Promise.all(
      navigations.map(async (nav) => {
        const columnIds = columnsByNav[nav._id.toString()] || [];
        const count =
          columnIds.length === 0
            ? 0
            : await NavigationLink.countDocuments({
                ...searchMatch,
                navigationColumn: { $in: columnIds },
              });
        return {
          _id: nav._id,
          name: nav.name,
          sort_order: nav.sort_order,
          count,
        };
      })
    );

    const columnSource = navigationId
      ? allColumns.filter((col) => col.navigation.toString() === navigationId)
      : allColumns;

    const columnCounts = await Promise.all(
      columnSource.map(async (column) => {
        const count = await NavigationLink.countDocuments({
          ...searchMatch,
          navigationColumn: column._id,
        });
        return {
          _id: column._id,
          name: column.name,
          navigation: column.navigation,
          sort_order: column.sort_order,
          count,
        };
      })
    );

    res.status(200).json({
      links,
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages,
        hasNext: safePage < totalPages,
        hasPrev: safePage > 1,
      },
      filters: {
        navigations: navCounts,
        columns: columnCounts,
      },
      selected: {
        navigation: navigationId,
        column: columnId,
        search,
      },
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
