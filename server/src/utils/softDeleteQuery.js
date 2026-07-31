/** Parse list query flags for soft-deleted rows. */
export function listQueryOptions(req) {
  const includeDeleted =
    req.query.includeDeleted === "true" || req.query.includeDeleted === "1";
  const deletedOnly =
    req.query.deletedOnly === "true" || req.query.deletedOnly === "1";
  return {
    includeDeleted: includeDeleted || deletedOnly,
    deletedOnly,
  };
}

export function withListQueryOptions(query, req) {
  const { includeDeleted, deletedOnly } = listQueryOptions(req);
  if (includeDeleted) query.setOptions({ includeDeleted: true });
  if (deletedOnly) query.where({ deletedAt: { $ne: null } });
  return query;
}

export function withCountQueryOptions(countQuery, req) {
  const { includeDeleted, deletedOnly } = listQueryOptions(req);
  if (includeDeleted) countQuery.setOptions({ includeDeleted: true });
  if (deletedOnly) countQuery.where({ deletedAt: { $ne: null } });
  return countQuery;
}
