/**
 * Mongoose soft-delete plugin for catalog / site models (not CMS).
 * - Adds deletedAt
 * - Default queries exclude deleted rows (use .setOptions({ includeDeleted: true }))
 */
export function softDeletePlugin(schema) {
  if (schema.path("deletedAt")) return;

  schema.add({
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  });

  function excludeDeleted() {
    const opts = this.getOptions?.() || {};
    if (opts.includeDeleted) return;
    const conditions = this.getQuery();
    if (Object.prototype.hasOwnProperty.call(conditions, "deletedAt")) return;
    this.where({ deletedAt: null });
  }

  schema.pre("find", excludeDeleted);
  schema.pre("findOne", excludeDeleted);
  schema.pre("findOneAndUpdate", excludeDeleted);
  schema.pre("countDocuments", excludeDeleted);
  schema.pre("distinct", excludeDeleted);

  schema.methods.softDelete = function softDelete() {
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods.restore = function restore() {
    this.deletedAt = null;
    return this.save();
  };

  schema.statics.softDeleteOne = function softDeleteOne(filter) {
    return this.findOneAndUpdate(
      filter,
      { $set: { deletedAt: new Date() } },
      { new: true, runValidators: true }
    );
  };

  schema.statics.restoreOne = function restoreOne(filter) {
    return this.findOneAndUpdate(
      filter,
      { $set: { deletedAt: null } },
      { new: true, runValidators: true }
    ).setOptions({ includeDeleted: true });
  };
}
