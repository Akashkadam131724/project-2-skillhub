# SkillHub — Postman API docs

Postman collection for the SkillHub backend (same style as `project-1-storage-app-v2/postman`).

## Files

| File | Purpose |
|------|---------|
| `SkillHub.postman_collection.json` | All API folders / requests (~100) |
| `SkillHub.local.postman_environment.json` | Local `baseUrl` + seed-friendly defaults |
| `build-collection.mjs` | Regenerates the collection from the route map |

## Import

1. Open Postman → **Import**
2. Select both JSON files above
3. Pick environment **SkillHub — Local**
4. Start the API: `cd server && npm run dev` (default port **3000**)

## Theme & section notes

- **Site / page theme** accepts **Colors** (`brand_primary`, `brand_hover`, `ink`) and **Surface** (`surface_mode` / `surface_pattern`) only.
- Dark / full-bleed sections are owned by section code, not CMS fields.

## Also available

Swagger UI (authored OpenAPI YAML under `server/src/docs/`):

- UI: http://127.0.0.1:3000/api-docs
- JSON: http://127.0.0.1:3000/api-docs.json

Blogs, navigation, site theme, entity page theme, section library, and uploads are in the Postman collection even when not yet fully covered in OpenAPI YAML.

## Suggested flow

1. **Vendors → Create vendor** (saves `vendorSlug` / `vendorId`)
2. Set `entityId` = `vendorId` for CMS entity overrides
3. **Products → Create** → **Courses → Create**
4. **Pages → Resolve sections** with `pageKey=vendor` + `entity_id`

Create requests write slug/id into collection variables via Test scripts.

## Regenerate

After adding routes, update `build-collection.mjs` then:

```bash
node postman/build-collection.mjs
```
