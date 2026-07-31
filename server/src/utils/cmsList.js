import {
  withCountQueryOptions,
  withListQueryOptions,
} from "./softDeleteQuery.js";

export const CMS_LIST_FILTER_IDS = ["all", "active", "disabled", "deleted"];

const EMPTY_COUNTS = Object.freeze({
  all: 0,
  active: 0,
  disabled: 0,
  deleted: 0,
});

/** Parse page/limit from query string. */
export function parsePagination(req, { defaultLimit = 20, maxLimit = 100 } = {}) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(
    Math.max(Number(req.query.limit) || defaultLimit, 1),
    maxLimit
  );
  return { page, limit, skip: (page - 1) * limit };
}

/** Build a case-insensitive $or regex filter across fields. */
export function buildTextSearchFilter(q, fields) {
  const search = String(q || "").trim();
  if (!search || !fields?.length) return {};
  return {
    $or: fields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    })),
  };
}

/**
 * Resolve CMS tab filter (`all|active|disabled|deleted`) or legacy status/deleted params.
 * Returns { status?, deletedOnly, includeDeleted } for soft-delete helpers.
 */
export function resolveListScope(req) {
  const tab = String(req.query.filter || "").toLowerCase();
  if (CMS_LIST_FILTER_IDS.includes(tab)) {
    if (tab === "active") {
      return { status: "active", deletedOnly: false, includeDeleted: false };
    }
    if (tab === "disabled") {
      return { status: "inactive", deletedOnly: false, includeDeleted: false };
    }
    if (tab === "deleted") {
      return { deletedOnly: true, includeDeleted: true };
    }
    return { deletedOnly: false, includeDeleted: false };
  }

  const deletedOnly =
    req.query.deletedOnly === "true" || req.query.deletedOnly === "1";
  const includeDeleted =
    req.query.includeDeleted === "true" ||
    req.query.includeDeleted === "1" ||
    deletedOnly;

  return {
    status: req.query.status || undefined,
    deletedOnly,
    includeDeleted,
  };
}

function mergeFilterClause(filter, clause) {
  if (!filter || Object.keys(filter).length === 0) return clause;
  return { $and: [filter, clause] };
}

function applyStatusToFilter(filter, scope) {
  if (!scope.status) return filter;
  if (scope.status === "active") {
    // Legacy rows may lack status after schema was added
    return mergeFilterClause(filter, {
      $or: [
        { status: "active" },
        { status: { $exists: false } },
        { status: null },
      ],
    });
  }
  return { ...filter, status: scope.status };
}

function scopeToReqQuery(req, scope) {
  const query = { ...req.query };
  delete query.filter;
  delete query.includeCounts;

  if (scope.deletedOnly) {
    query.deletedOnly = "true";
    query.includeDeleted = "true";
  } else if (scope.includeDeleted) {
    query.includeDeleted = "true";
    delete query.deletedOnly;
  } else {
    delete query.deletedOnly;
    delete query.includeDeleted;
  }

  return { query };
}

function shouldIncludeCounts(req) {
  return (
    req.query.includeCounts === "true" || req.query.includeCounts === "1"
  );
}

/** Count rows per CMS filter tab (respects search q + baseFilter, not current tab). */
export async function fetchCmsListCounts(Model, req, baseFilter = {}) {
  const scopes = {
    all: { deletedOnly: false, includeDeleted: false },
    active: { status: "active", deletedOnly: false, includeDeleted: false },
    disabled: { status: "inactive", deletedOnly: false, includeDeleted: false },
    deleted: { deletedOnly: true, includeDeleted: true },
  };

  const entries = await Promise.all(
    Object.entries(scopes).map(async ([key, scope]) => {
      const filter = applyStatusToFilter(baseFilter, scope);
      const count = await withCountQueryOptions(
        Model.countDocuments(filter),
        scopeToReqQuery(req, scope)
      );
      return [key, count];
    })
  );

  return Object.fromEntries(entries);
}

/**
 * Shared paginated CMS list handler.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {object} options
 * @param {import('mongoose').Model} options.Model
 * @param {(req: import('express').Request) => object|Promise<object>} options.buildFilter - entity filters + search (no status/deleted)
 * @param {object} options.sort
 * @param {string|object|Array} [options.populate]
 * @param {number} [options.defaultLimit]
 * @param {boolean} [options.lean=true]
 */
export async function paginatedCmsList(req, res, options) {
  const {
    Model,
    buildFilter,
    sort,
    populate,
    defaultLimit = 20,
    lean = true,
  } = options;

  const { page, limit, skip } = parsePagination(req, { defaultLimit });
  const scope = resolveListScope(req);
  const baseFilter = (await buildFilter(req)) || {};
  const mongoFilter = applyStatusToFilter(baseFilter, scope);
  const listReq = scopeToReqQuery(req, scope);

  let query = Model.find(mongoFilter).sort(sort).skip(skip).limit(limit);
  if (populate) {
    if (Array.isArray(populate)) {
      for (const spec of populate) query = query.populate(spec);
    } else {
      query = query.populate(populate);
    }
  }
  if (lean) query = query.lean();

  const includeCounts = shouldIncludeCounts(req);

  const tasks = [
    withListQueryOptions(query, listReq),
    withCountQueryOptions(Model.countDocuments(mongoFilter), listReq),
  ];
  if (includeCounts) {
    tasks.push(fetchCmsListCounts(Model, req, baseFilter));
  }

  const results = await Promise.all(tasks);
  const rows = results[0];
  const total = results[1];
  const counts = includeCounts ? results[2] : undefined;

  const payload = {
    success: true,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    count: rows.length,
    data: rows,
    filter: String(req.query.filter || "all").toLowerCase(),
  };

  if (counts) payload.counts = counts;

  res.json(payload);
}
