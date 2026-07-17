import { Schema, model } from "mongoose";

const navLinkSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    navigationColumn: {
      type: Schema.Types.ObjectId,
      ref: "NavigationColumn",
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

navLinkSchema.pre("save", async function () {
  if (this.isNew && this.sort_order == null) {
    this.sort_order = (await NavigationLink.countDocuments()) + 1;
  }
});

const NavigationLink = model("NavigationLink", navLinkSchema);
export default NavigationLink;
