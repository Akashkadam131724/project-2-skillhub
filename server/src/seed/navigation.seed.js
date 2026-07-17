import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Vendor from "../modules/vendor/vendor.model.js";
import Product from "../modules/product/product.model.js";
import SkillingArea from "../modules/skilling-area/skilling-area.model.js";
import Industry from "../modules/industry/industry.model.js";
import Navigation from "../modules/navigation/navigation.model.js";
import NavigationColumn from "../modules/navigation/navigation-column.model.js";
import NavigationLink from "../modules/navigation/navigation-link.model.js";

/**
 * Seeds header navigation from SkillHub catalog entities.
 *
 * Top-level:
 *   1. Catalog   — vendors + products
 *   2. Expertise — skilling areas + industries
 *   3. Explore   — studio / platform pages
 *   4. Company   — about / careers / campaigns
 *
 * Usage:
 *   npm run seed:navigation
 */

const VENDOR_LIMIT = Number(process.env.NAV_VENDOR_LIMIT) || 30;
const LINKS_PER_COLUMN = 8;

const VENDOR_COLUMNS = [
  {
    name: "Cloud & Platform",
    match:
      /(microsoft|aws|amazon|google|oracle|ibm|azure|citrix|vmware|dell|emc|netapp|hpe|hewlett)/i,
  },
  {
    name: "Security & Networking",
    match:
      /(cisco|comptia|ec-council|isc2|check point|fortinet|juniper|f5|mcafee|broadcom|brocade|cwnp)/i,
  },
  {
    name: "Business & Leadership",
    match: /(pmi|itil|hrci|iapp|isaca|dasa|agile|intuit|netcom)/i,
  },
  {
    name: "Design & Specialty",
    match: /./,
  },
];

const SKILLING_COLUMNS = [
  {
    name: "Technical Skills",
    match: /(ai|data|cloud|security|network|app development)/i,
  },
  {
    name: "Architecture & Design",
    match: /(architecture|design)/i,
  },
  {
    name: "Business Skills",
    match: /(business|leadership|process|application)/i,
  },
];

function assignToColumns(items, columnDefs, getText) {
  const buckets = columnDefs.map((col) => ({
    name: col.name,
    links: [],
    match: col.match,
  }));

  for (const item of items) {
    const text = getText(item);
    for (let i = 0; i < buckets.length; i++) {
      const isFallback = i === buckets.length - 1;
      if (isFallback || buckets[i].match.test(text)) {
        if (buckets[i].links.length < LINKS_PER_COLUMN) {
          buckets[i].links.push(item);
        }
        break;
      }
    }
  }

  return buckets
    .filter((b) => b.links.length > 0)
    .map(({ name, links }) => ({ name, links }));
}

function takeLinks(links, limit) {
  const seen = new Set();
  const out = [];
  for (const link of links) {
    const key = `${link.name}::${link.url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(link);
    if (out.length >= limit) break;
  }
  return out;
}

async function fetchCatalogData() {
  const [vendors, skillingAreas, industries] = await Promise.all([
    Vendor.find({ status: { $in: ["active", "pending"] } })
      .select("name slug status courseCount productCount")
      .sort({ courseCount: -1, name: 1 })
      .limit(VENDOR_LIMIT)
      .lean(),
    SkillingArea.find({ status: "active" })
      .select("name slug sortOrder")
      .sort({ sortOrder: 1, name: 1 })
      .lean(),
    Industry.find({ status: "active" })
      .select("name slug sortOrder")
      .sort({ sortOrder: 1, name: 1 })
      .lean(),
  ]);

  const featuredVendors = vendors.slice(0, 4);
  const productBatches = await Promise.all(
    featuredVendors.map((vendor) =>
      Product.find({
        status: { $in: ["active", "draft"] },
        vendor: vendor._id,
      })
        .select("name slug category vendor status")
        .sort({ name: 1 })
        .limit(LINKS_PER_COLUMN)
        .lean()
    )
  );

  const vendorById = new Map(vendors.map((v) => [String(v._id), v]));
  const products = productBatches.flat().map((product) => ({
    ...product,
    vendorDoc: vendorById.get(String(product.vendor)) || null,
  }));

  console.log(
    `Fetched → vendors: ${vendors.length}, products: ${products.length}, skillingAreas: ${skillingAreas.length}, industries: ${industries.length}`
  );

  return { vendors, products, skillingAreas, industries };
}

function buildSeedData({ vendors, products, skillingAreas, industries }) {
  const vendorBuckets = assignToColumns(
    vendors,
    VENDOR_COLUMNS,
    (v) => `${v.name} ${v.slug || ""}`
  );

  const partnerCloud =
    vendorBuckets.find((c) => /cloud/i.test(c.name))?.links || [];
  const partnerSecurity =
    vendorBuckets.find((c) => /security/i.test(c.name))?.links || [];
  const partnerBusiness =
    vendorBuckets.find((c) => /business/i.test(c.name))?.links || [];
  const partnerSpecialty =
    vendorBuckets.find((c) => /design|specialty/i.test(c.name))?.links || [];

  const featuredPrograms = takeLinks(
    products.map((p) => ({
      name: p.name,
      url: `/products/${p.slug}`,
    })),
    10
  );

  const skillBuckets = assignToColumns(
    skillingAreas,
    SKILLING_COLUMNS,
    (a) => `${a.name} ${a.slug || ""}`
  );
  const skillTechnical =
    skillBuckets.find((c) => /technical/i.test(c.name))?.links ||
    skillingAreas.slice(0, 8);
  const skillBusiness = takeLinks(
    [
      ...(skillBuckets.find((c) => /business/i.test(c.name))?.links || []),
      ...(skillBuckets.find((c) => /architecture|design/i.test(c.name))
        ?.links || []),
    ].map((a) => ({
      name: a.name,
      url: `/skilling-areas/${a.slug}`,
    })),
    8
  );

  const industriesLinks = takeLinks(
    industries.map((i) => ({
      name: i.name,
      url: `/industries/${i.slug}`,
    })),
    10
  );

  return [
    {
      name: "Catalog",
      language: "EN",
      country: "IN",
      columns: [
        {
          name: "Technology Partners",
          links: takeLinks(
            [
              { name: "All Vendors", url: "/vendors" },
              ...partnerCloud.map((v) => ({
                name: v.name,
                url: `/vendors/${v.slug}`,
              })),
              ...partnerSpecialty.map((v) => ({
                name: v.name,
                url: `/vendors/${v.slug}`,
              })),
            ],
            10
          ),
        },
        {
          name: "Security & Network",
          links: takeLinks(
            partnerSecurity.map((v) => ({
              name: v.name,
              url: `/vendors/${v.slug}`,
            })),
            8
          ),
        },
        {
          name: "Featured Programs",
          links: takeLinks(
            [{ name: "All Products", url: "/products" }, ...featuredPrograms],
            10
          ),
        },
        {
          name: "Business Partners",
          links: takeLinks(
            partnerBusiness.map((v) => ({
              name: v.name,
              url: `/vendors/${v.slug}`,
            })),
            8
          ),
        },
      ].filter((col) => col.links.length > 0),
    },
    {
      name: "Expertise",
      language: "EN",
      country: "IN",
      columns: [
        {
          name: "Technical Skills",
          links: takeLinks(
            [
              { name: "All Skilling Areas", url: "/skilling-areas" },
              ...skillTechnical.map((a) => ({
                name: a.name,
                url: `/skilling-areas/${a.slug}`,
              })),
            ],
            10
          ),
        },
        {
          name: "Business & Design",
          links: skillBusiness,
        },
        {
          name: "Industries",
          links: takeLinks(
            [
              { name: "All Industries", url: "/industries" },
              ...industriesLinks,
            ],
            10
          ),
        },
      ].filter((col) => col.links.length > 0),
    },
    {
      name: "Explore",
      language: "EN",
      country: "IN",
      columns: [
        {
          name: "Learning",
          links: [
            { name: "Catalog Guide", url: "/catalog-guide" },
            { name: "How It Works", url: "/how-it-works" },
            { name: "Learning Campus", url: "/learning-campus" },
            { name: "Course Catalog", url: "/courses" },
            { name: "Blogs", url: "/blogs" },
          ],
        },
        {
          name: "Solutions",
          links: [
            { name: "Solutions", url: "/solutions" },
            { name: "Cloud Academy", url: "/cloud-academy" },
            { name: "Security Lab", url: "/security-lab" },
            { name: "Data Academy", url: "/data-academy" },
            { name: "Enterprise", url: "/enterprise" },
            { name: "Innovation Lab", url: "/innovation-lab" },
          ],
        },
        {
          name: "Platform",
          links: [
            { name: "Platform", url: "/platform" },
            { name: "Pricing", url: "/pricing" },
            { name: "Showcase", url: "/showcase" },
            { name: "Launch", url: "/launch" },
            { name: "Site Builder", url: "/site-builder" },
            { name: "Contact Us", url: "/contact-us" },
          ],
        },
      ],
    },
    {
      name: "Company",
      language: "EN",
      country: "IN",
      columns: [
        {
          name: "About",
          links: [
            { name: "About Us", url: "/about-us" },
            { name: "Our Team", url: "/our-team" },
            { name: "Contact Us", url: "/contact-us" },
          ],
        },
        {
          name: "Careers & Awards",
          links: [
            { name: "Careers", url: "/company/careers" },
            { name: "Company Awards", url: "/company/awards" },
          ],
        },
        {
          name: "Campaigns",
          links: [
            {
              name: "Vendor Microsoft Skillfest",
              url: "/campaign/microsoft/skill-fest",
            },
          ],
        },
      ],
    },
  ];
}

async function clearNavigation() {
  await NavigationLink.deleteMany({});
  await NavigationColumn.deleteMany({});
  await Navigation.deleteMany({});
}

async function seed() {
  await connectDB();

  try {
    await NavigationColumn.collection.dropIndex("name_1");
    console.log("Dropped unique index navigationcolumns.name_1");
  } catch (error) {
    if (error.codeName !== "IndexNotFound") {
      // Collection may not exist yet on first run
      if (error.codeName !== "NamespaceNotFound") throw error;
    }
  }

  const catalog = await fetchCatalogData();
  const seedData = buildSeedData(catalog);

  await clearNavigation();
  console.log("Cleared existing navigation collections");

  let navOrder = 1;
  let columnOrder = 1;
  let linkOrder = 1;

  const navDocs = [];
  const columnDocs = [];
  const linkDocs = [];

  for (const navItem of seedData) {
    const navId = new mongoose.Types.ObjectId();
    navDocs.push({
      _id: navId,
      name: navItem.name,
      language: navItem.language,
      country: navItem.country,
      status: true,
      sort_order: navOrder++,
    });

    for (const columnItem of navItem.columns) {
      const columnId = new mongoose.Types.ObjectId();
      columnDocs.push({
        _id: columnId,
        name: columnItem.name,
        navigation: navId,
        status: true,
        sort_order: columnOrder++,
      });

      for (const linkItem of columnItem.links) {
        linkDocs.push({
          name: linkItem.name,
          url: linkItem.url,
          navigationColumn: columnId,
          status: true,
          sort_order: linkOrder++,
        });
      }
    }
  }

  await Navigation.insertMany(navDocs);
  await NavigationColumn.insertMany(columnDocs);
  await NavigationLink.insertMany(linkDocs);

  console.log(
    `Seeded → navigations: ${navDocs.length}, columns: ${columnDocs.length}, links: ${linkDocs.length}`
  );

  for (const nav of seedData) {
    console.log(`\n${nav.name}`);
    for (const col of nav.columns) {
      console.log(`  ▸ ${col.name} (${col.links.length})`);
    }
  }

  console.log("\nDone. GET http://localhost:3000/navigation");
}

try {
  await seed();
} catch (error) {
  console.error("Seed failed:", error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}
