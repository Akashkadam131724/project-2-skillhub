import mongoose from "mongoose";
import connectDB from "../config/db.js";

/**
 * Migration: remove sku, price, stock from existing products
 *
 * Run:
 *   npm run migrate:remove-product-sku-price-stock
 *
 * Why: schema no longer has these fields, but old seeded docs still store them.
 * MongoDB keeps old keys until you $unset them.
 */
async function migrate() {
  await connectDB();

  const products = mongoose.connection.collection("products");

  const before = await products.countDocuments({
    $or: [
      { sku: { $exists: true } },
      { price: { $exists: true } },
      { stock: { $exists: true } },
    ],
  });

  console.log(`Products still having sku/price/stock: ${before.toLocaleString()}`);

  // Drop unique sku index FIRST — otherwise $unset makes many nulls and unique fails
  try {
    await products.dropIndex("sku_1");
    console.log("Dropped index: sku_1");
  } catch (err) {
    if (err?.codeName === "IndexNotFound" || err?.code === 27) {
      console.log("Index sku_1 not found (already gone) — ok");
    } else {
      throw err;
    }
  }

  const result = await products.updateMany(
    {
      $or: [
        { sku: { $exists: true } },
        { price: { $exists: true } },
        { stock: { $exists: true } },
      ],
    },
    {
      $unset: {
        sku: "",
        price: "",
        stock: "",
      },
    }
  );

  console.log(`Matched: ${result.matchedCount.toLocaleString()}`);
  console.log(`Modified: ${result.modifiedCount.toLocaleString()}`);

  const after = await products.countDocuments({
    $or: [
      { sku: { $exists: true } },
      { price: { $exists: true } },
      { stock: { $exists: true } },
    ],
  });

  console.log(`Remaining with those fields: ${after}`);
  await mongoose.disconnect();
  console.log("Migration done.");
}

migrate().catch(async (err) => {
  console.error("Migration failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
