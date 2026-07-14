const PORT = process.env.PORT || 3000;

import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import vendorRoutes from "./src/modules/vendor/vendor.routes.js";
import productRoutes from "./src/modules/product/product.routes.js";
import courseRoutes from "./src/modules/course/course.routes.js";
import skillingAreaRoutes from "./src/modules/skilling-area/skilling-area.routes.js";
import skillLevelRoutes from "./src/modules/skill-level/skill-level.routes.js";
import industryRoutes from "./src/modules/industry/industry.routes.js";
import contentRoutes from "./src/modules/content/content.routes.js";
import searchRoutes from "./src/modules/search/search.routes.js";
import sectionRoutes from "./src/modules/cms/section.routes.js";
import pageRoutes from "./src/modules/cms/page.routes.js";
import pageSectionRoutes from "./src/modules/cms/page-section.routes.js";
import uploadRoutes, {
  UPLOADS_ROOT,
} from "./src/modules/uploads/upload.routes.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "6mb" }));

await connectDB();
app.get("/", (req, res) => {
  res.send({ message: "hello world" });
});

app.use("/uploads", express.static(UPLOADS_ROOT));
app.use("/api/uploads", uploadRoutes);

app.use("/vendors", vendorRoutes);
app.use("/products", productRoutes);
app.use("/courses", courseRoutes);
app.use("/skilling-areas", skillingAreaRoutes);
app.use("/skill-levels", skillLevelRoutes);
app.use("/industries", industryRoutes);
app.use("/contents", contentRoutes);
app.use("/search", searchRoutes);
app.use("/sections", sectionRoutes);
app.use("/pages", pageRoutes);
app.use("/page-sections", pageSectionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
