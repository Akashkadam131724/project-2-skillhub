/**
 * Turn Mongoose / Mongo errors into a clean API-friendly object.
 *
 * Usage in controllers:
 *   catch (err) {
 *     const formatted = formatMongooseError(err);
 *     return res.status(formatted.status).json(formatted);
 *   }
 */
export function formatMongooseError(err) {
  // ValidationError → field-level messages from Schema
  if (err?.name === "ValidationError") {
    const fields = {};
    for (const key of Object.keys(err.errors)) {
      fields[key] = err.errors[key].message;
    }
    return {
      status: 400,
      success: false,
      message: "Validation failed",
      fields,
    };
  }

  // Duplicate key (unique: true)
  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || "field";
    return {
      status: 409,
      success: false,
      message: `${field} already exists`,
      fields: { [field]: `${field} must be unique` },
    };
  }

  // Bad ObjectId in findById etc.
  if (err?.name === "CastError") {
    return {
      status: 400,
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
      fields: { [err.path]: "Invalid id format" },
    };
  }

  return {
    status: 500,
    success: false,
    message: err?.message || "Something went wrong",
  };
}
