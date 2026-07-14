# SkillHub

A training / skilling marketplace inspired by enterprise learning catalogs (vendors → products → courses). Browse the public site, then customize each page with a CMS of reusable sections.

| Layer | Package | Stack |
|-------|---------|--------|
| **Client** | `skillhub-client` | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| **Server** | `skillhub-server` | Express 5, Mongoose 9, MongoDB |

Default ports: API **3000**, client **3001**. MongoDB: `mongodb://localhost:27017/netcom-clone`.

---

## What this project does

1. **Catalog** — Vendors publish products; products own courses. Courses can be tagged with skill levels, skilling areas, and industries.
2. **Public site** — List + detail pages for vendors, products, courses, industries, skilling areas, and a home `Content` page.
3. **CMS** — Page templates (e.g. `product`, `home`) are built from **Sections**. Per-entity overrides live in **EntityPageSection**. Heroes/banners come from the entity document itself, not from sections.

---

## How models connect

### Schema diagram

![SkillHub database ER diagram](./Untitled%20(1).png)

Source DBML: [`server/docs/schema.dbml`](./server/docs/schema.dbml)

### Catalog graph

```┌──────────┐         ┌──────────┐         ┌──────────┐
│  Vendor  │────1:*──│ Product  │────1:*──│  Course  │
└──────────┘         └──────────┘         └────┬─────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
              SkillLevel                 SkillingArea[]              Industry[]
              (0..1 ref)                  (many-to-many)             (many-to-many)
```

| Model | Path | Connects to |
|-------|------|-------------|
| **Vendor** | `server/src/modules/vendor/vendor.model.js` | Virtual `products` → Product |
| **Product** | `server/src/modules/product/product.model.js` | Required `vendor` → Vendor; virtual `courses` → Course |
| **Course** | `server/src/modules/course/course.model.js` | Required `product` → Product; optional `skillLevel`; `skillingAreas[]`; `industries[]` |
| **SkillLevel** | `server/src/modules/skill-level/skill-level.model.js` | Virtual `courses` (via `Course.skillLevel`) |
| **SkillingArea** | `server/src/modules/skilling-area/skilling-area.model.js` | Virtual `courses` (via `Course.skillingAreas`) |
| **Industry** | `server/src/modules/industry/industry.model.js` | Virtual `courses` (via `Course.industries`) |
| **Content** | `server/src/modules/content/content.model.js` | Standalone CMS entity (e.g. home slug `home`) — no catalog refs |

Deletes are **not** cascaded in MongoDB. Removing a vendor does not auto-delete its products/courses.

---

### CMS graph

```
┌──────┐   Section.pages[] (embedded tags)   ┌─────────┐
│ Page │◄────────────────────────────────────│ Section │
└──────┘   page + page_key + sort + content  └────┬────┘
                                                  │
                                   EntityPageSection
                                   (section ref + entity_id
                                    + optional page_tag_id)
```

| Model | Path | Role |
|-------|------|------|
| **Page** | `server/src/modules/cms/page.model.js` | Template (`key`: `home`, `product`, `course`, …) + `entity_type` |
| **Section** | `server/src/modules/cms/section.model.js` | Reusable block (`overview`, `faq`, `hero_classic`, …). Owns defaults + `pages[]` placements |
| **EntityPageSection** | `server/src/modules/cms/entity-page-section.model.js` | Per-entity placement override or entity-only extra |
| **button / item** | `server/src/modules/cms/*.schema.js` | Embedded CTAs and list rows on Section / tags / entity mappings |

**Status layers (all must allow the section to show):**

1. `Section.status` — global on/off  
2. `Section.pages[].status` — enabled on this page template  
3. `EntityPageSection.status` — enabled on this entity  

**Content cascade** (`Section.content_scope`), resolved in `server/src/modules/cms/resolve.js`:

| Scope | Source order for titles / data / items / buttons |
|-------|--------------------------------------------------|
| `global` | Section only |
| `template` | Page tag → Section (entity ignored) |
| `page` (default) | Entity → page tag → Section |

Client renders resolved placements with `SECTION_COMPONENTS` in `client/src/lib/section-registry.js`.

---

## Repo layout

```
project-2-skillhub/
├── client/                 # Next.js UI + /cms admin
│   └── src/
│       ├── app/            # Public + CMS routes
│       ├── components/     # sections/, cms/, catalog/, detail/
│       └── lib/            # api.js, cms-api.js, section-registry.js
└── server/
    ├── index.js            # Express entry — mounts routes
    ├── uploads/            # Uploaded images
    └── src/
        ├── modules/        # vendor, product, course, cms, …
        ├── seed/           # npm run seed:*
        └── config/db.js
```

### Main API mounts

| Mount | Module |
|-------|--------|
| `/vendors`, `/products`, `/courses` | Catalog |
| `/skilling-areas`, `/skill-levels`, `/industries` | Taxonomy |
| `/contents` | Content entities |
| `/sections`, `/pages`, `/page-sections` | CMS |
| `/search` | Cross-model search |
| `/api/uploads`, `/uploads` | Images |

---

## Quick start

```bash
# Server
cd server
cp .env.example .env   # if present — set MONGO_URI, PORT
npm install
npm run seed:all       # optional demo data
npm run dev            # http://localhost:3000

# Client
cd client
# set NEXT_PUBLIC_API_URL=http://localhost:3000 in .env.local
npm install
npm run dev            # http://localhost:3001
```

CMS admin: `http://localhost:3001/cms`
# project-2-skillhub
