# Sailing Placemarks

Hapi + Handlebars applikation for managing sailing placemarks.

## Why
You can store your specific sailing placemarks like marinas, anchorages and other good spots.

## Features
- Signup & Login (with secure password hashing and salting)
- **Create** Placemarks with Name, Description and Location
- **Categorize placemarks** (Marina, Anchorage, Beach, Other)
- **Add multiple images** to placemarks via Cloudinary upload
- **Browse** through your placemarks
- **Edit** Placemarks and View Details
- **Comments & Ratings**: Rate placemarks (1-5 stars) and leave text comments
- **Visibility Toggle**: Set placemarks as Private or Public
- **Interactive Dashboard Map**: View all visible placemarks on a map with category filtering
- Placemark Detail Map: View location of individual placemarks
- Public Placemarks: View public placemarks from all users alongside your own
- **Admin Dashboard**: View list of users and delete users (Admin privileges required)

**Quick links**
- Entry: [src/server.ts](src/server.ts#L1-L120)
- Routes: [src/web-routes.ts](src/web-routes.ts#L1-L120)
- Controllers: [src/controllers](src/controllers)
- Stores: [src/models/json](src/models/)

## Getting started

Live-Demo on: https://sailplacemarkcore.onrender.com/
Open-API(Swagger) on: https://sailplacemarkcore.onrender.com/documentation
MongoDB Cloud Deployment on: https://cloud.mongodb.com/v2/

Prerequisites: Node.js (16+ recommended) and npm.

Install dependencies:

```bash
npm install
```

Run in development (hot reload):

```bash
npm run dev
```

Build and run production bundle:

```bash
npm run build
npm run start
```

Run tests:

```bash
npm run test
npm run test:e2e
```

Then open http://localhost:3000 in your browser

## Environment

Copy or create a `.env` file with at least the cookie settings:

```
COOKIE_NAME=your_cookie_name
COOKIE_PASSWORD=long_secure_password_here
```

### Cloudinary Configuration (Image Upload)
To enable image uploads, you need a Cloudinary account. Add your credentials to the `.env` file:

```
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
```

To create an admin account on startup, add the following variables:

```
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=P@ssw0rd
```

The app can also use a MongoDB-backed store. When using `mongo` as the storage option (for example by calling `db.init("mongo")`), set the MongoDB connection string in the `DB` environment variable (or `db` for legacy compatibility). Example:

```
DB=mongodb://localhost:27017/sailPlacemarkCore
```

Note:
- To run the test suite with the Mongo store, ensure a MongoDB server is running and reachable at the URI above (e.g., start `mongod`).
- You can also point `DB` to an external MongoDB URI for cloud mongo database.

## Architecture

- HTTP server: Hapi configured in [src/server.ts](src/server.ts#L1-L120). Views are served with Handlebars via `@hapi/vision`.
- Routes: centralized in [src/web-routes.ts](src/web-routes.ts#L1-L120). Each route maps to a controller `options` object.
- Controllers: located under `src/controllers`. Controllers export route option objects (properties: `auth`, `handler`, `validate`, etc.).
- Data layer: Flexible storage system supporting both lightweight JSON-backed stores (using LowDB) and MongoDB. Stores expose CRUD methods and are wired through the `db` object in [src/models/db.ts](src/models/db.ts#L1-L120).
- Views: Handlebars templates in `/views` with partials under `/views/partials` and layouts under `/views/layouts`.

Data flow summary:
- HTTP request -> route in `web-routes.ts` -> controller `options.handler` -> interacts with `db.<store>` -> controller returns a Handlebars view or redirect.

## Project-specific conventions and patterns

- Authentication: cookie-session strategy configured in [src/server.ts](src/server.ts#L1-L120). The `validate` function is `accountsController.validate` and should return `{ isValid, credentials }`.
- Controller exports: controllers export objects with named route option objects. Public handlers set `auth: false as const`.
- Validation: Joi schemas are defined in [src/models/joi-schemas.ts](src/models/joi-schemas.ts). Controllers attach `validate` blocks and use `failAction` to return view takeover responses (HTML), not JSON.
- Store usage: After `await db.init()` the `db` object has `placemarkStore`, `userStore`, `detailStore`. Use those stores instead of direct file access.
- Imports use `.js` extensions in TypeScript sources (to match emitted JS in `dist/`). 
- IDs: Stores generate UUIDs (`_id`) for records; controller code expects `_id` fields.
- Security: User passwords are automatically hashed and salted using `bcryptjs` upon registration. Hashed passwords are saved in the database, and `bcryptjs` is used to compare input passwords during login.



## Scripts

- `npm run dev` — start with `ts-node-dev` (hot reload)
- `npm run build` — compile TypeScript to `dist`
- `npm run start` — build then run `node dist/server.js`
- `npm run test` — run Mocha tests under `src/test`
- `npx playwright test` — run E2E tests (requires running server or uses webServer config)

## Tests

### Unit & Integration (Mocha)
Tests live under `src/test`. Run `npm run test`.

### End-to-End (Playwright)
Tests live under `src/tests/`.
- Run all tests: `npx playwright test`
- Run specific test: `npx playwright test -g "signup"`
- Show report: `npx playwright show-report`

## Debugging tips

- Server logs appear in the console started by `npm run dev` or `npm run start`.
- If a store is `null` at runtime, ensure `await db.init()` was called before registering routes (see [src/server.ts](src/server.ts#L1-L120)).

## Where to look first

- `src/server.ts` — boot, auth, view config
- `src/web-routes.ts` — route surface area
- `src/controllers/*` — handler logic and Joi validation usage
- `src/models/json/*` — data persistence API

