# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is a Sanity Content Studio (Sanity v5) for "Cabala Viajera" (`ventura-cms`), a headless CMS for a travel/blog site. The Studio is the admin UI for managing structured content; there is no backend server or frontend app in this repo — content is queried elsewhere via the Sanity API using `projectId: o1spw459` and `dataset: development` (see `sanity.config.ts` / `sanity.cli.ts`).

## Commands

- `npm run dev` — start the local Sanity Studio dev server
- `npm run start` — run the built studio
- `npm run build` — build the studio for deployment
- `npm run deploy` — deploy the studio to Sanity's hosting
- `npm run deploy-graphql` — deploy the GraphQL API for the current schema
- Lint: `npx eslint .` (config: `@sanity/eslint-config-studio`, see `eslint.config.mjs`)
- There is no test suite configured in this repo.

## Architecture

- `sanity.config.ts` — Studio entry point; wires up the `structureTool` (default document editing UI) and `visionTool` (GROQ query playground), and registers the schema from `schemaTypes`.
- `sanity.cli.ts` — CLI-level config (project ID/dataset used by `sanity` CLI commands like `dev`/`deploy`).
- `schemaTypes/index.ts` — aggregates and exports all document schemas as `schemaTypes`, consumed by `sanity.config.ts`. New document types must be added to this array to appear in the Studio.
- `schemaTypes/schemas/<TypeName>/` — one folder per document type, each with an `index.ts` (barrel re-export) and a `<typeName>.ts` file defining the schema via `defineType`/`defineField` (e.g. `schemaTypes/schemas/Post/postType.ts` defines the `post` document type with title, description, country, slug, publishedAt, images, and a portable-text `content` array with inline images).

When adding a new content/document type, follow the existing `Post` folder pattern: create `schemaTypes/schemas/<Name>/<name>Type.ts` + `index.ts`, then add the export to `schemaTypes/index.ts`.

## Configuration & secrets

- `projectId`/`dataset` in `sanity.config.ts` and `sanity.cli.ts` read from `SANITY_STUDIO_PROJECT_ID`/`SANITY_STUDIO_DATASET` env vars (falling back to the current `o1spw459`/`development` values). Sanity's Vite-based tooling auto-loads `.env` files and exposes `SANITY_STUDIO_`-prefixed vars — no extra dotenv package needed.
- Copy `.env.example` to `.env` for local overrides; `.env` is gitignored and must never be committed. `SANITY_API_TOKEN` is reserved for authenticated scripts (e.g. content migrations) and must never be exposed to client code.
