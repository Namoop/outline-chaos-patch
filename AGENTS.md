This repository is a fork of Outline, the open-source collaborative wiki.
Outline is a React and TypeScript application with a Koa API server, PostgreSQL,
Redis, real-time collaboration, and a responsive web client.

The purpose of this fork is to customize Outline for CHAOS, the outdoors club at
UC Berkeley. Treat this repository as a patch set on top of upstream Outline,
not as a divergent product. GitHub Actions are expected to reapply the fork's
changes whenever upstream `main` is updated, so every change should be designed
to minimize merge conflicts.

## Primary Components

- `app/` - React web client using TypeScript, MobX, React Router, and
  styled-components.
- `server/` - Koa API server, RPC endpoints, Sequelize models, background jobs,
  PostgreSQL access, Redis integration, and authentication.
- `shared/` - Shared TypeScript utilities, types, validation, and editor code.
- `plugins/` - Extension points and optional integrations.
- `public/` - Static assets served directly by the application.
- `docs/` - Architecture and operational documentation inherited from Outline.
- `patches/` - Package or dependency patches that should remain narrow and
  explainable.

Refer to `docs/ARCHITECTURE.md` for deeper architecture details.

## Patch Discipline

- Make surgical changes. Prefer the smallest change that solves the problem.
- Avoid broad refactors, formatting-only churn, file moves, and import reshuffles
  unless they are required for the task.
- Keep CHAOS-specific behavior compartmentalized in new files where practical.
  Wire those files into existing Outline code through small, obvious integration
  points.
- Prefer additive changes over editing upstream logic in place. When upstream
  files must change, keep the diff local to the relevant function, component, or
  route.
- Do not rename upstream exports, routes, database columns, translation keys, or
  shared types unless the task explicitly requires it.
- Preserve existing Outline conventions even when adding CHAOS-specific UI,
  navigation, styling, or embeds.
- Avoid changing dependency versions unless necessary. Use `yarn` for dependency
  management and run `yarn install` after dependency updates.
- Do not create new Markdown files unless explicitly asked.

## TypeScript And React

- Use strict TypeScript. Do not use `any`; avoid `unknown` unless necessary.
- Prefer interfaces for object shapes and named exports for new components.
- Use functional React components with hooks.
- Prefix event handlers with `handle`, such as `handleClick`.
- Use MobX stores for global state and keep business logic out of components.
- Use styled-components for styling and keep accessibility in mind.
- Do not manually add translation strings; they are extracted automatically.

## Backend And Data

- Keep API routes thin. Put business logic in models, commands, or services that
  match existing Outline patterns.
- Validate request data with existing validation middleware and schemas.
- Check authorization before accessing or mutating user data.
- Use transactions for multi-table writes and add indexes for new query paths.
- Handle database errors gracefully and avoid exposing sensitive details.

## Editor And Security

- Be especially careful in ProseMirror and editor code, which is shared and
  merge-prone.
- Always use `sanitizeUrl()` when setting `href` or `src` from user-controlled
  data in ProseMirror `toDOM` methods. `toDOM` writes raw DOM and does not get
  React's attribute sanitization.
- Sanitize user input, use existing CSRF and rate-limiting patterns, and keep
  secrets in environment variables.

## Tests And Quality

- Add focused tests for utilities, business logic, editor behavior, and
  user-facing workflows that the change affects.
- Prefer running targeted tests, for example `yarn test path/to/test.spec.ts`.
- Use `yarn lint`, `yarn tsc`, and targeted Jest runs when appropriate for the
  change.
- Follow the repository's Prettier and Oxlint configuration.

