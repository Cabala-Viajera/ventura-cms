# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Project overview

This is a Sanity Content Studio (Sanity v6) for "Cabala Viajera" (`ventura-cms`), a headless CMS for a travel/blog site. The Studio is the admin UI for managing structured content; there is no backend server or frontend app in this repo. Content is queried elsewhere via the Sanity API. The project and dataset are configured through environment variables (see `sanity.config.ts` / `sanity.cli.ts`); the development example uses `projectId: o1spw459` and `dataset: development`.

## Commands

- `npm run dev` — start the local Sanity Studio dev server
- `npm run start` — run the built studio
- `npm run build` — build the studio for deployment
- `npm run deploy` — deploy the studio to Sanity's hosting
- `npm run deploy-graphql` — deploy the GraphQL API for the current schema
- Lint: `npx eslint .` (config: `@sanity/eslint-config-studio`, see `eslint.config.mjs`)
- `npx sanity exec scripts/audit-i18n.ts --with-user-token` — read-only audit of post languages and slugs, including drafts; exits nonzero when conflicts are found
- `npx sanity migration run mark-posts-spanish --dry-run` — review the Spanish language backfill; use `--no-dry-run` to apply it only after auditing and exporting a dataset backup (see `docs/localization.md`)
- There is no test suite configured in this repo.

## Architecture

- `sanity.config.ts` — Studio entry point; wires up the `structureTool` (default document editing UI), `visionTool` (GROQ query playground), and `@sanity/document-internationalization` for Spanish (`es`) and English (`en`) posts, and registers the schema from `schemaTypes`.
- `sanity.cli.ts` — CLI-level config (project ID/dataset used by `sanity` CLI commands like `dev`/`deploy`).
- `schemaTypes/index.ts` — aggregates and exports all document schemas as `schemaTypes`, consumed by `sanity.config.ts`. New document types must be added to this array to appear in the Studio.
- `schemaTypes/schemas/<TypeName>/` — one folder per document type, each with an `index.ts` (barrel re-export) and a `<typeName>.ts` file defining the schema via `defineType`/`defineField` (e.g. `schemaTypes/schemas/Post/postType.ts` defines the `post` document type with title, description, country, slug, publishedAt, images, and a portable-text `content` array with inline images).

When adding a new content/document type, follow the existing `Post` folder pattern: create `schemaTypes/schemas/<Name>/<name>Type.ts` + `index.ts`, then add the export to `schemaTypes/index.ts`.

## Localization

- `post.language` is required, read-only in the editor, and restricted to `es` / `en`. New standalone posts default to Spanish; previews show the document language.
- Create English translations through the internationalization plugin so they remain linked to their Spanish originals. Copies require editorial translation and review, and each language is published independently.
- Slugs are unique within each language, excluding the current document's published and draft IDs. Missing language is treated as Spanish during rollout. Slugs reject reserved application paths (listed in the schema and audit script), `/`, and `.`; keep schema validation and audit rules aligned.
- `scripts/audit-i18n.ts` checks unsupported languages, missing/reserved slugs, and duplicate slugs per language, treating a draft and its published document as the same identity.
- `migrations/mark-posts-spanish/index.ts` sets only missing post languages to `es`, including drafts. It is safe to rerun and preserves IDs, slugs, content, assets, and publication state.
- Follow `docs/localization.md` for the rollout sequence: audit and resolve conflicts, export a backup, review and apply the migration, build/deploy the Studio, publish a reviewed linked translation, then deploy and verify the separate website. Website routing, language filtering, and message dictionaries are maintained outside this repo.

## Configuration & secrets

- `projectId`/`dataset` in `sanity.config.ts` and `sanity.cli.ts` read from `SANITY_STUDIO_PROJECT_ID`/`SANITY_STUDIO_DATASET`, with empty-string fallbacks. CLI deployment also reads `SANITY_STUDIO_APP_ID`. Set the intended values explicitly; there are no hardcoded project/dataset defaults.
- Copy `.env.development.example` to `.env.development` for `npm run dev`, and `.env.production.example` to `.env.production` for `npm run build` / `npm run deploy`. Set production to an existing dataset and rebuild after changing production settings, since Studio values are embedded at build time.
- Optional shared defaults go in `.env` (from `.env.example`). Environment-specific files override shared defaults; `.env.local` and `.env.<environment>.local` override their respective files, and shell variables take precedence. Sanity loads these files without an extra dotenv package.
- Actual environment files are gitignored; only the three example files are committed. `SANITY_STUDIO_` variables are exposed to the browser, so never use that prefix for secrets. `SANITY_API_TOKEN` is reserved for authenticated scripts and must never be exposed to client code. Never commit API tokens or dataset exports.

## Commit convention

Use Gitmoji for commit messages: `<emoji> <short imperative summary>` (for example, `✨ Add category document schema`). Choose one emoji that describes the primary purpose of the change:

- ✨ New features
- 🐛 Bug fixes
- 📝 Documentation
- ♻️ Code refactoring
- 🎨 Code formatting or structure improvements
- ⚡️ Performance improvements
- ✅ Tests
- 🔧 Configuration changes
- ⬆️ Dependency upgrades
- ⬇️ Dependency downgrades
- 🔥 Remove code or files
- 🚑️ Critical hotfixes

Keep the subject concise, write it in English, and omit a trailing period. Keep each commit focused on one logical change; use the body when additional context or a breaking change needs explanation.
