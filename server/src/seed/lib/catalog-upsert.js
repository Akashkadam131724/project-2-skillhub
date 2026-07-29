import { seedSafeMode, logSafeMode } from "./seed-env.js";

/**
 * @param {import('mongoose').Model} Model
 * @param {object[]} docs
 * @param {string} keyField - unique key (e.g. slug)
 */
export async function replaceCatalogDocs(Model, docs, keyField = "slug") {
  if (!docs.length) return { inserted: 0, mode: "none" };

  if (seedSafeMode()) {
    logSafeMode(`upsert ${docs.length} ${Model.modelName} (no delete)`);
    let n = 0;
    for (const doc of docs) {
      const key = doc[keyField];
      if (key == null || key === "") continue;
      const { _id, ...rest } = doc;
      await Model.findOneAndUpdate(
        { [keyField]: key },
        { $set: rest },
        { upsert: true, setDefaultsOnInsert: true }
      );
      n += 1;
    }
    return { inserted: n, mode: "upsert" };
  }

  await Model.deleteMany({});
  const inserted = await Model.insertMany(docs, { ordered: false });
  return { inserted: inserted.length, mode: "replace" };
}
