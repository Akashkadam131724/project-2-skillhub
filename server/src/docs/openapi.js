import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadYaml(relPath) {
  const full = path.join(__dirname, relPath);
  return YAML.parse(fs.readFileSync(full, "utf8"));
}

function loadPaths() {
  const dir = path.join(__dirname, "paths");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".yaml"));
  return files.reduce((acc, file) => {
    Object.assign(acc, loadYaml(path.join("paths", file)));
    return acc;
  }, {});
}

/**
 * Manual OpenAPI 3 document — YAML lives under src/docs/,
 * separate from controllers/routes.
 */
export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "SkillHub API",
    version: "1.0.0",
    description:
      "Catalog (vendors, products, courses, taxonomies) and CMS (pages, sections, placements) API. Docs are authored manually in `src/docs/`.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development",
    },
  ],
  tags: [
    { name: "Vendors", description: "Vendor catalog" },
    { name: "Products", description: "Products under vendors" },
    { name: "Courses", description: "Courses + faceted catalog" },
    { name: "Skilling Areas", description: "Skilling area taxonomy" },
    { name: "Skill Levels", description: "Skill level taxonomy" },
    { name: "Industries", description: "Industry taxonomy" },
    { name: "Contents", description: "Generic content entities" },
    { name: "Search", description: "Global search" },
    { name: "Pages", description: "CMS page templates" },
    { name: "Sections", description: "CMS section catalog + page tags" },
    {
      name: "Page Sections",
      description: "Template tags + per-entity placements",
    },
  ],
  paths: loadPaths(),
  components: {
    schemas: loadYaml("components.yaml"),
  },
};

export function mountSwagger(app) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, {
      customSiteTitle: "SkillHub API Docs",
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: "list",
        filter: true,
      },
    })
  );

  app.get("/api-docs.json", (_req, res) => {
    res.json(openApiDocument);
  });
}
