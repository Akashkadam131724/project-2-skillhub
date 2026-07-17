import { Schema, model } from "mongoose";

const navigationColumnSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    navigation: {
      type: Schema.Types.ObjectId,
      ref: "Navigation",
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    sort_order: {
      type: Number,
    },
  },
  { timestamps: true, versionKey: false }
);

navigationColumnSchema.pre("save", async function () {
  if (this.isNew && this.sort_order == null) {
    this.sort_order = (await NavigationColumn.countDocuments()) + 1;
  }
});

const NavigationColumn = model("NavigationColumn", navigationColumnSchema);
export default NavigationColumn;
