# Sailing Placemarks

Hapi + Handlebars applikation for managing sailing placemarks.

## Why
You can store your specific sailing placemarks like marinas, anchorages and other good spots.

## Features
- Signup & Login
- Create Placemarks with Name, Description and Location
- Browse through your placemarks
- Edit Placemarks

**Quick links**
- Entry: [src/server.ts](src/server.ts#L1-L120)
- Routes: [src/web-routes.ts](src/web-routes.ts#L1-L120)
- Controllers: [src/controllers](src/controllers)
- Stores: [src/models/json](src/models/json)

## Getting started

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
npm test
```

Then open http://localhost:3000 in your browser

## Environment

Copy or create a `.env` file with at least the cookie settings:

```
COOKIE_NAME=your_cookie_name
COOKIE_PASSWORD=long_secure_password_here
```

## Architecture (big picture)

- HTTP server: Hapi configured in [src/server.ts](src/server.ts#L1-L120). Views are served with Handlebars via `@hapi/vision`.
- Routes: centralized in [src/web-routes.ts](src/web-routes.ts#L1-L120). Each route maps to a controller `options` object.
- Controllers: located under `src/controllers`. Controllers export route option objects (properties: `auth`, `handler`, `validate`, etc.). Example controllers: `accountsController` and `dashboardController`.
- Data layer: lightweight JSON-backed stores using LowDB under `src/models/json`. Stores expose CRUD methods and are wired through the `db` object in [src/models/db.ts](src/models/db.ts#L1-L120).
- Views: Handlebars templates in `/views` with partials under `/views/partials` and layouts under `/views/layouts`.

Data flow summary:
- HTTP request -> route in `web-routes.ts` -> controller `options.handler` -> interacts with `db.<store>` -> controller returns a Handlebars view or redirect.

## Project-specific conventions and patterns

- Authentication: cookie-session strategy configured in [src/server.ts](src/server.ts#L1-L120). The `validate` function is `accountsController.validate` and should return `{ isValid, credentials }`.
- Controller exports: controllers export objects with named route option objects. Public handlers set `auth: false as const`.
- Validation: Joi schemas are defined in [src/models/joi-schemas.ts](src/models/joi-schemas.ts). Controllers attach `validate` blocks and use `failAction` to return view takeover responses (HTML), not JSON.
- Store usage: After `await db.init()` the `db` object has `placemarkStore`, `userStore`, `detailStore`. Use those stores instead of direct file access.
- Imports use `.js` extensions in TypeScript sources (to match emitted JS in `dist/`). Keep this pattern when adding new imports.
- IDs: Stores generate UUIDs (`_id`) for records; controller code expects `_id` fields.


## Scripts

- `npm run dev` — start with `ts-node-dev` (hot reload)
- `npm run build` — compile TypeScript to `dist`
- `npm run start` — build then run `node dist/server.js`
- `npm test` — run Mocha tests under `src/test`

## Tests

Tests are Mocha + TypeScript. Test live under `src/test`. Run `npm test`.

## Debugging tips

- Server logs appear in the console started by `npm run dev` or `npm run start`.
- If a store is `null` at runtime, ensure `await db.init()` was called before registering routes (see [src/server.ts](src/server.ts#L1-L120)).

## Where to look first

- `src/server.ts` — boot, auth, view config
- `src/web-routes.ts` — route surface area
- `src/controllers/*` — handler logic and Joi validation usage
- `src/models/json/*` — data persistence API

