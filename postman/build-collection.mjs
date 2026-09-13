/**
 * Builds SkillHub.postman_collection.json from a structured route map.
 * Run: node postman/build-collection.mjs
 */
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { API } from "../client/src/lib/api/api-routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const saveSlug = (varName) => [
  "const json = pm.response.json();",
  "const row = json.data || json;",
  "if (row && row.slug) {",
  `  pm.collectionVariables.set('${varName}', row.slug);`,
  "}",
  "if (row && row._id) {",
  `  pm.collectionVariables.set('${varName}Id', String(row._id));`,
  "}",
];

const saveKey = (varName) => [
  "const json = pm.response.json();",
  "const row = json.data || json;",
  "if (row && row.key) {",
  `  pm.collectionVariables.set('${varName}', row.key);`,
  "}",
  "if (row && row._id) {",
  `  pm.collectionVariables.set('${varName}Id', String(row._id));`,
  "}",
];

const saveId = (varName, pathExpr = "json.data") => [
  "const json = pm.response.json();",
  `const row = ${pathExpr};`,
  "if (row && row._id) {",
  `  pm.collectionVariables.set('${varName}', String(row._id));`,
  "}",
];

function req(name, method, path, { body, description, query, test } = {}) {
  const url =
    typeof path === "string"
      ? {
          raw: `{{baseUrl}}${path}${query ? `?${query}` : ""}`,
          host: ["{{baseUrl}}"],
          path: path.replace(/^\//, "").split("/").filter(Boolean),
          ...(query
            ? {
                query: query.split("&").map((pair) => {
                  const [key, value] = pair.split("=");
                  return { key, value: value ?? "" };
                }),
              }
            : {}),
        }
      : path;

  const item = {
    name,
    request: {
      method,
      header: body
        ? [{ key: "Content-Type", value: "application/json" }]
        : [],
      url,
      ...(description ? { description } : {}),
      ...(body
        ? {
            body: {
              mode: "raw",
              raw: typeof body === "string" ? body : JSON.stringify(body, null, 2),
            },
          }
        : {}),
    },
  };

  if (test?.length) {
    item.event = [
      {
        listen: "test",
        script: { type: "text/javascript", exec: test },
      },
    ];
  }

  return item;
}

function folder(name, description, items) {
  return {
    name,
    ...(description ? { description } : {}),
    item: items,
  };
}

const collection = {
  info: {
    _postman_id: "c4e8a2b1-9f3d-4c70-8e1a-6d5b7a0f2e91",
    name: "SkillHub API",
    description:
      "SkillHub backend — catalog (vendors, products, courses, taxonomies), CMS (pages, sections, placements, themes), navigation, blogs, search, uploads.\n\nThemes accept **Colors** (`brand_primary`, `brand_hover`, `ink`) + **Surface** (`surface_mode` / `surface_pattern`) only.\n\nAlso available as Swagger UI at `{{baseUrl}}/api-docs`.\n\nNo auth on local API. Use the Local environment or collection `baseUrl` (default http://127.0.0.1:3000).",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  variable: [
    { key: "baseUrl", value: "http://127.0.0.1:3000" },
    { key: "vendorSlug", value: "microsoft" },
    { key: "vendorId", value: "" },
    { key: "productSlug", value: "" },
    { key: "productId", value: "" },
    { key: "courseSlug", value: "" },
    { key: "courseId", value: "" },
    { key: "skillingAreaSlug", value: "" },
    { key: "skillLevelSlug", value: "" },
    { key: "industrySlug", value: "" },
    { key: "contentSlug", value: "" },
    { key: "blogSlug", value: "" },
    { key: "sectionKey", value: "overview" },
    { key: "pageKey", value: "vendor" },
    { key: "pageSectionId", value: "" },
    { key: "entityPageSectionId", value: "" },
    { key: "entityId", value: "" },
    { key: "tagId", value: "" },
    { key: "navigationId", value: "" },
    { key: "navigationColumnId", value: "" },
  ],
  item: [
    folder("Health", "Root + Swagger", [
      req("Hello", "GET", "/", {
        description: "Root liveness — returns hello world.",
      }),
      req("OpenAPI JSON", "GET", "/api-docs.json", {
        description: "Raw OpenAPI 3 document (same source as Swagger UI).",
      }),
    ]),

    folder(
      "Vendors",
      "Catalog vendors — soft-delete via DELETE, restore via POST …/restore.",
      [
        req("List vendors", "GET", API.catalog.vendors.root, {
          query: "page=1&limit=20&q=",
          description: "Paginated list. Query: page, limit, status, isVerified, q.",
        }),
        req("Search vendors", "GET", API.catalog.vendors.searchFilters, {
          query: "page=1&limit=20&q=&category=",
        }),
        req(
          "Create vendor",
          "POST",
          API.catalog.vendors.root,
          {
            body: {
              name: "Postman Vendor",
              email: "postman-vendor@example.com",
              shortDescription: "Created from Postman collection",
              overviewTitle: "Build skills with Postman Vendor",
              overview: "<p>Sample overview body for Postman.</p>",
              status: "active",
              isVerified: false,
              categories: ["cloud"],
            },
            description: "Required: name, email. Saves slug + id to collection variables.",
            test: saveSlug("vendorSlug"),
          }
        ),
        req("Get vendor by slug", "GET", API.catalog.vendors.one("{{vendorSlug}}")),
        req("Update vendor", "PUT", API.catalog.vendors.one("{{vendorSlug}}"), {
          body: {
            shortDescription: "Updated from Postman",
            overviewTitle: "Updated overview title",
          },
        }),
        req("Soft-delete vendor", "DELETE", API.catalog.vendors.one("{{vendorSlug}}")),
        req("Restore vendor", "POST", API.catalog.vendors.restore("{{vendorSlug}}")),
      ]
    ),

    folder("Products", "Products under vendors", [
      req("List products", "GET", API.catalog.products.root, {
        query: "page=1&limit=20&q=",
      }),
      req("List by vendor id", "GET", API.catalog.products.byVendor("{{vendorId}}"), {
        query: "page=1&limit=20",
      }),
      req("Create product", "POST", API.catalog.products.root, {
        body: {
          name: "Postman Product",
          vendor: "{{vendorId}}",
          shortDescription: "Sample product",
          status: "active",
        },
        description: "Set vendorId from Create vendor (or a seeded vendor).",
        test: saveSlug("productSlug"),
      }),
      req("Get product by slug", "GET", API.catalog.products.one("{{productSlug}}")),
      req("Update product", "PUT", API.catalog.products.one("{{productSlug}}"), {
        body: { shortDescription: "Updated product" },
      }),
      req("Soft-delete product", "DELETE", API.catalog.products.one("{{productSlug}}")),
      req("Restore product", "POST", API.catalog.products.restore("{{productSlug}}")),
    ]),

    folder("Courses", "Courses + faceted catalog", [
      req("List courses", "GET", API.catalog.courses.root, {
        query: "page=1&limit=20&q=",
      }),
      req("Catalog courses", "GET", API.catalog.courses.catalog, {
        query:
          "page=1&limit=20&vendor=&product=&skillingArea=&skillLevel=&industry=&q=",
        description: "Faceted catalog. Multi-ids are comma-separated ObjectIds.",
      }),
      req("Catalog filters", "GET", API.catalog.courses.catalogFilters, {
        query: "vendor=&product=&skillingArea=&skillLevel=&industry=&q=",
      }),
      req("List by product id", "GET", API.catalog.courses.byProduct("{{productId}}"), {
        query: "page=1&limit=20",
      }),
      req("Create course", "POST", API.catalog.courses.root, {
        body: {
          name: "Postman Course",
          product: "{{productId}}",
          shortDescription: "Sample course",
          status: "active",
        },
        test: saveSlug("courseSlug"),
      }),
      req("Get course by slug", "GET", API.catalog.courses.one("{{courseSlug}}")),
      req("Update course", "PUT", API.catalog.courses.one("{{courseSlug}}"), {
        body: { shortDescription: "Updated course" },
      }),
      req("Soft-delete course", "DELETE", API.catalog.courses.one("{{courseSlug}}")),
      req("Restore course", "POST", API.catalog.courses.restore("{{courseSlug}}")),
    ]),

    folder("Skilling Areas", "", [
      req("List skilling areas", "GET", API.skilling.areas.root, {
        query: "page=1&limit=20&q=",
      }),
      req("Create skilling area", "POST", API.skilling.areas.root, {
        body: {
          name: "Postman Skilling Area",
          shortDescription: "Sample skilling area",
          status: "active",
        },
        test: saveSlug("skillingAreaSlug"),
      }),
      req("Map course skilling areas", "PUT", API.skilling.areas.mapCourse("{{courseId}}"), {
        body: { skillingAreas: ["{{skillingAreaSlug}}"] },
        description: "Body shape may accept ids or slugs — check controller.",
      }),
      req("Courses by skilling area", "GET", API.skilling.areas.courses("{{skillingAreaSlug}}"), {
        query: "page=1&limit=20",
      }),
      req("Get by slug", "GET", API.skilling.areas.one("{{skillingAreaSlug}}")),
      req("Update", "PUT", API.skilling.areas.one("{{skillingAreaSlug}}"), {
        body: { shortDescription: "Updated" },
      }),
      req("Soft-delete", "DELETE", API.skilling.areas.one("{{skillingAreaSlug}}")),
      req("Restore", "POST", API.skilling.areas.restore("{{skillingAreaSlug}}")),
    ]),

    folder("Skill Levels", "", [
      req("List skill levels", "GET", API.skilling.levels.root, {
        query: "page=1&limit=20&q=",
      }),
      req("Create skill level", "POST", API.skilling.levels.root, {
        body: {
          name: "Postman Skill Level",
          shortDescription: "Sample level",
          status: "active",
        },
        test: saveSlug("skillLevelSlug"),
      }),
      req("Courses by skill level", "GET", API.skilling.levels.courses("{{skillLevelSlug}}"), {
        query: "page=1&limit=20",
      }),
      req("Get by slug", "GET", API.skilling.levels.one("{{skillLevelSlug}}")),
      req("Update", "PUT", API.skilling.levels.one("{{skillLevelSlug}}"), {
        body: { shortDescription: "Updated" },
      }),
      req("Soft-delete", "DELETE", API.skilling.levels.one("{{skillLevelSlug}}")),
      req("Restore", "POST", API.skilling.levels.restore("{{skillLevelSlug}}")),
    ]),

    folder("Industries", "", [
      req("List industries", "GET", API.skilling.industries.root, {
        query: "page=1&limit=20&q=",
      }),
      req("Create industry", "POST", API.skilling.industries.root, {
        body: {
          name: "Postman Industry",
          shortDescription: "Sample industry",
          status: "active",
        },
        test: saveSlug("industrySlug"),
      }),
      req("Map course industries", "PUT", API.skilling.industries.mapCourse("{{courseId}}"), {
        body: { industries: ["{{industrySlug}}"] },
      }),
      req("Courses by industry", "GET", API.skilling.industries.courses("{{industrySlug}}"), {
        query: "page=1&limit=20",
      }),
      req("Get by slug", "GET", API.skilling.industries.one("{{industrySlug}}")),
      req("Update", "PUT", API.skilling.industries.one("{{industrySlug}}"), {
        body: { shortDescription: "Updated" },
      }),
      req("Soft-delete", "DELETE", API.skilling.industries.one("{{industrySlug}}")),
      req("Restore", "POST", API.skilling.industries.restore("{{industrySlug}}")),
    ]),

    folder("Contents", "Generic CMS content entities", [
      req("List contents", "GET", API.content.root, {
        query: "page=1&limit=20&q=",
      }),
      req("Create content", "POST", API.content.root, {
        body: {
          name: "Postman Content",
          title: "Postman Content Title",
          body: "<p>Sample content</p>",
          status: "active",
        },
        test: saveSlug("contentSlug"),
      }),
      req("Get by slug", "GET", API.content.one("{{contentSlug}}")),
      req("Update", "PUT", API.content.one("{{contentSlug}}"), {
        body: { title: "Updated content title" },
      }),
      req("Soft-delete", "DELETE", API.content.one("{{contentSlug}}")),
      req("Restore", "POST", API.content.restore("{{contentSlug}}")),
    ]),

    folder("Blogs", "Not yet in OpenAPI YAML — included here from routes.", [
      req("List blogs", "GET", API.blog.root, {
        query: "page=1&limit=12&q=&category=&tag=&featured=",
      }),
      req("Create blog", "POST", API.blog.root, {
        body: {
          title: "Postman Blog Post",
          excerpt: "Short excerpt",
          content: "<p>Hello from Postman.</p>",
          category: "engineering",
          tags: ["cms", "demo"],
          status: "active",
          featured: false,
        },
        test: saveSlug("blogSlug"),
      }),
      req("Get by slug", "GET", API.blog.one("{{blogSlug}}")),
      req("Update", "PUT", API.blog.one("{{blogSlug}}"), {
        body: { excerpt: "Updated excerpt" },
      }),
      req("Soft-delete", "DELETE", API.blog.one("{{blogSlug}}")),
      req("Restore", "POST", API.blog.restore("{{blogSlug}}")),
    ]),

    folder("Search", "", [
      req("Global search", "GET", API.site.search.root, {
        query: "q=microsoft&limit=20",
      }),
    ]),

    folder(
      "Sections",
      "CMS section catalog + page tags. Content fields only (title, subtitle, image, buttons, items, data).",
      [
      req("List sections", "GET", API.cms.sections.root, {
        query: "status=&content_scope=&q=",
      }),
      req("Create section", "POST", API.cms.sections.root, {
        body: {
          key: "postman_demo_section",
          name: "Postman Demo Section",
          status: true,
          content_scope: "page",
          section_title: "Demo title",
          sub_title: "Demo subtitle",
          data: { body: "<p>Demo body</p>" },
        },
        description:
          "Create catalog section (key, name, content fields).",
        test: saveKey("sectionKey"),
      }),
      req("Get by key", "GET", API.cms.sections.one("{{sectionKey}}")),
      req("Update section", "PUT", API.cms.sections.one("{{sectionKey}}"), {
        body: {
          section_title: "Updated demo title",
          data: { body: "<p>Updated body</p>" },
        },
        description:
          "Editable content fields only.",
      }),
      req("Set status", "PATCH", API.cms.sections.status("{{sectionKey}}"), {
        body: { status: true },
      }),
      req("Set section pages (replace tags)", "PUT", API.cms.sections.pages("{{sectionKey}}"), {
        body: {
          pages: [{ page_key: "{{pageKey}}", sort_order: 0, status: true }],
        },
      }),
      req("Tag section onto page", "POST", API.cms.sections.pageTag("{{sectionKey}}", "{{pageKey}}"), {
        body: { sort_order: 10, status: true },
        test: [
          "const json = pm.response.json();",
          "const tag = json.data || json;",
          "if (tag && tag._id) pm.collectionVariables.set('tagId', String(tag._id));",
          "if (tag && tag.pages) {",
          "  const last = Array.isArray(tag.pages) ? tag.pages[tag.pages.length - 1] : null;",
          "  if (last && last._id) pm.collectionVariables.set('tagId', String(last._id));",
          "}",
        ],
      }),
      req("Update page tag", "PUT", API.cms.sections.tag("{{sectionKey}}", "{{tagId}}"), {
        body: {
          section_title: "Tag override title",
          sort_order: 5,
        },
      }),
      req("Untag by tag id", "DELETE", API.cms.sections.tag("{{sectionKey}}", "{{tagId}}")),
      req("Untag by page key", "DELETE", API.cms.sections.byPage("{{sectionKey}}", "{{pageKey}}")),
      req("Delete section", "DELETE", API.cms.sections.one("{{sectionKey}}")),
    ]),

    folder("Section Categories", "", [
      req("List categories", "GET", API.cms.sectionCategories.root),
      req("Get category by key", "GET", API.cms.sectionCategories.one("content")),
    ]),

    folder("Section Library", "Showcase / gallery for section catalog", [
      req("List library categories", "GET", API.cms.sectionLibrary.categories),
      req("Library showcase (default)", "GET", API.cms.sectionLibrary.showcase),
      req("Library showcase by key", "GET", API.cms.sectionLibrary.showcaseOne("{{sectionKey}}")),
    ]),

    folder("Pages", "CMS page templates", [
      req("List pages", "GET", API.cms.pages.root, { query: "status=" }),
      req("Create page", "POST", API.cms.pages.root, {
        body: {
          key: "postman_demo_page",
          name: "Postman Demo Page",
          status: true,
        },
        test: saveKey("pageKey"),
      }),
      req("Resolve sections", "GET", API.cms.pages.sections("{{pageKey}}"), {
        query: "entity_id={{entityId}}",
        description:
          "Resolved placements for the template. Pass entity_id for vendor/product overrides.",
      }),
      req("Get page by key", "GET", API.cms.pages.one("{{pageKey}}")),
      req("Update page", "PUT", API.cms.pages.one("{{pageKey}}"), {
        body: {
          name: "Updated Postman Demo Page",
          theme: {
            brand_primary: "#1d4ed8",
            surface_mode: "alternating",
          },
        },
        description:
          "Optional `theme` patch uses Colors + Surface keys only.",
      }),
      req("Set page status", "PATCH", API.cms.pages.status("{{pageKey}}"), {
        body: { status: true },
      }),
      req("Delete page", "DELETE", API.cms.pages.one("{{pageKey}}")),
    ]),

    folder(
      "Page Sections",
      "Template tags + EntityPageSection overrides/extras. Band bg/theme fields are not writable.",
      [
        req("List page sections", "GET", API.cms.pageSections.root, {
          query: "page_key={{pageKey}}",
        }),
        req("Tag section to page", "POST", API.cms.pageSections.root, {
          body: {
            page_key: "{{pageKey}}",
            section_key: "{{sectionKey}}",
            sort_order: 0,
          },
          test: saveId("pageSectionId"),
        }),
        req("Reorder", "PUT", API.cms.pageSections.reorder, {
          body: {
            page_key: "{{pageKey}}",
            order: ["{{pageSectionId}}"],
          },
        }),
        req("List entity page sections", "GET", API.cms.pageSections.entity, {
          query: "page_key={{pageKey}}&entity_id={{entityId}}",
        }),
        req("Upsert entity page section", "PUT", API.cms.pageSections.entity, {
          body: {
            page_key: "{{pageKey}}",
            entity_id: "{{entityId}}",
            section_key: "{{sectionKey}}",
            status: true,
            section_title: "Entity override title",
            data: { body: "<p>Entity-specific body</p>" },
          },
          test: saveId("entityPageSectionId"),
        }),
        req(
          "Delete entity page section",
          "DELETE",
          API.cms.pageSections.entityOne("{{entityPageSectionId}}")
        ),
        req("Update page section", "PUT", API.cms.pageSections.one("{{pageSectionId}}"), {
          body: { section_title: "Updated placement title", sort_order: 2 },
        }),
        req("Set page section status", "PATCH", API.cms.pageSections.status("{{pageSectionId}}"), {
          body: { status: true },
        }),
        req("Delete page section", "DELETE", API.cms.pageSections.one("{{pageSectionId}}")),
      ]
    ),

    folder(
      "Site Theme",
      "Global theme (key=default). Accepts Colors + Surface only.",
      [
      req("Get site theme", "GET", API.cms.siteTheme.root),
      req("Update site theme", "PUT", API.cms.siteTheme.root, {
        body: {
          brand_primary: "#1d4ed8",
          brand_hover: "#1e40af",
          ink: "#0b1f4d",
          surface_mode: "alternating",
        },
        description:
          "Patch theme fields: preset, brand_primary, brand_hover, ink, surface_mode, surface_pattern. Empty body → 400.",
      }),
    ]),

    folder(
      "Entity Page Theme",
      "Per-entity theme override for a page_key (Colors + Surface; no page background).",
      [
      req("Get entity page theme", "GET", API.cms.entityPageTheme.root, {
        query: "page_key={{pageKey}}&entity_id={{entityId}}",
      }),
      req("Upsert entity page theme", "PUT", API.cms.entityPageTheme.root, {
        body: {
          page_key: "{{pageKey}}",
          entity_id: "{{entityId}}",
          theme: {
            brand_primary: "#0ea5e9",
            ink: "#0c4a6e",
          },
        },
        description:
          "Upsert entity theme override. Nested `theme` uses the same field keys as site theme.",
      }),
      req("Delete entity page theme", "DELETE", API.cms.entityPageTheme.root, {
        query: "page_key={{pageKey}}&entity_id={{entityId}}",
      }),
    ]),

    folder("Navigation", "Header nav tree, columns, links", [
      req("Get navigation tree", "GET", API.site.navigation.root),
      req("Filter navigation", "GET", API.site.navigation.filter, {
        query: "q=",
      }),
      req("Create navigation", "POST", API.site.navigation.root, {
        body: {
          name: "Postman Nav",
          language: "en",
          country: "US",
          status: true,
        },
        test: [
          "const json = pm.response.json();",
          "const nav = json.navigation || json.data;",
          "if (nav && nav._id) pm.collectionVariables.set('navigationId', String(nav._id));",
        ],
      }),
      req("List columns", "GET", API.site.navigation.columns),
      req("Create column", "POST", API.site.navigation.columns, {
        body: {
          navigation: "{{navigationId}}",
          name: "Postman Column",
          sort_order: 0,
          status: true,
        },
        test: [
          "const json = pm.response.json();",
          "const col = json.column || json.data || json;",
          "if (col && col._id) pm.collectionVariables.set('navigationColumnId', String(col._id));",
        ],
      }),
      req("Create column link", "POST", API.site.navigation.columnLinks, {
        body: {
          navigationColumn: "{{navigationColumnId}}",
          label: "Postman Link",
          url: API.catalog.vendors.root,
          sort_order: 0,
          status: true,
        },
      }),
      req("Update navigation", "PUT", API.site.navigation.one("{{navigationId}}"), {
        body: { name: "Postman Nav Updated", status: true },
      }),
    ]),

    folder("Uploads", "Base64 image upload → /uploads/{folder}/…", [
      req("Upload image (data URL)", "POST", API.site.uploads.api, {
        body: {
          folder: "sections",
          data_url:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        },
        description:
          "1×1 PNG. Max 4MB. Allowed: jpeg, png, webp, gif. Returns `{ url, path }`.",
      }),
    ]),
  ],
};

const out = join(__dirname, "SkillHub.postman_collection.json");
writeFileSync(out, `${JSON.stringify(collection, null, 2)}\n`);
console.log(`Wrote ${out}`);
console.log(
  `Folders: ${collection.item.length}, requests: ${collection.item.reduce(
    (n, f) => n + f.item.length,
    0
  )}`
);
