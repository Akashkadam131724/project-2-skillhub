import { Schema, model } from "mongoose";

const navigationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sort_order: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      default: "EN",
    },
    country: {
      type: String,
      default: "US",
    },
  },
  { timestamps: true, versionKey: false }
);

navigationSchema.index({ name: 1, sort_order: 1 }, { unique: true });

navigationSchema.pre("save", async function () {
  if (this.isNew && this.sort_order == null) {
    this.sort_order = (await Navigation.countDocuments()) + 1;
  }
});

const Navigation = model("Navigation", navigationSchema);
export default Navigation;
