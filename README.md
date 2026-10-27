# Cabala Viajera CMS

Sanity v6 Content Studio for the Cabala Viajera travel blog. This repository
contains the admin UI and content schemas. The public website is maintained
separately and queries content through the Sanity API.

The Studio includes the document editor, the Vision GROQ query playground,
and linked Spanish and English posts through `@sanity/document-internationalization`.

## Getting started

Requirements: Node.js 22.12 or newer, npm, and access to the intended Sanity
project and dataset.

```sh
npm ci
cp .env.example .env.development
```

Edit `.env.development` with your project's values, then start the Studio:

```sh
npm run dev
```

Open the URL printed by the CLI and sign in with a Sanity account that has
access to the project.

## Environment configuration

Sanity automatically selects the environment file for each command:

| Command | Environment file |
| --- | --- |
| `npm run dev` | `.env.development` |
| `npm run build` | `.env.production` |
| `npm run deploy` | `.env.production` |

Create environment-specific files from the committed `.env.example`:

```sh
cp .env.example .env.development
cp .env.example .env.production
```

| Variable | Purpose |
| --- | --- |
| `SANITY_STUDIO_PROJECT_ID` | Sanity project ID used by the Studio and CLI |
| `SANITY_STUDIO_DATASET` | Dataset used by the Studio and CLI |
| `SANITY_STUDIO_APP_ID` | Studio app ID used for Sanity hosting deployment |
| `SANITY_API_TOKEN` | Optional token for authenticated scripts; never expose it to client code |

Project ID and dataset have no hardcoded defaults. Set them explicitly for
each environment, and set the app ID for deployment. The production
dataset must already exist in your Sanity project. Rebuild after changing
production settings; Studio environment values are embedded during the build.

You can keep shared defaults in `.env`. Environment-specific files override
those defaults. Optional `.env.local` and `.env.<environment>.local` files
override shared and environment-specific settings respectively; variables
already set in the shell take precedence over all files.

Actual environment files are gitignored; `.env.example` is committed.
Keep `SANITY_API_TOKEN` in local files for authenticated scripts and never use
a `SANITY_STUDIO_` prefix for secrets, since those variables are exposed to the
browser.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Studio development server |
| `npm run build` | Build the Studio into `dist/` |
| `npm run start` | Serve the built Studio locally |
| `npm run deploy` | Deploy the Studio to Sanity hosting |
| `npm run deploy-graphql` | Deploy the GraphQL API for the current schema |
| `npx eslint .` | Lint the repository |

There is no test suite configured. Use lint and a production build to check
code and schema changes before deployment.

## Content and localization

The `post` schema contains title, description, country, slug, publication date,
main and thumbnail images, and Portable Text content with inline images and
alternative text.

- New standalone posts default to Spanish (`es`). The language field is required
  and read-only in the editor.
- Create linked English (`en`) translations using the internationalization
  plugin's document language selector. Translate and review the copied fields
  before publishing; each language is published independently.
- Slugs must be unique within each language. Reserved application paths and
  slugs containing `/` or `.` are rejected. During rollout, posts without a
  language are treated as Spanish by slug validation and the audit.

Run the read-only language and slug audit, including drafts, with:

```sh
npx sanity exec scripts/audit-i18n.ts --with-user-token
```

The audit exits nonzero when it finds conflicts. Before backfilling existing
posts with Spanish, resolve audit findings, export a dataset backup, and review
the migration with:

```sh
npx sanity migration run mark-posts-spanish --dry-run
```

Follow [the localization guide](docs/localization.md) for the full backup,
migration, deployment, and editorial workflow. Never commit dataset exports or
API tokens. Website routing, language filtering, and message dictionaries are
maintained in the separate website repository.

## Project structure

| Path | Purpose |
| --- | --- |
| `sanity.config.ts` | Studio configuration, plugins, and schema registration |
| `sanity.cli.ts` | CLI project, dataset, and deployment configuration |
| `schemaTypes/index.ts` | Registry of document schemas |
| `schemaTypes/schemas/Post/` | Post schema and barrel export |
| `scripts/audit-i18n.ts` | Read-only post language and slug audit |
| `migrations/mark-posts-spanish/` | Backfill missing post languages with `es` |
| `docs/localization.md` | Localization rollout and editorial instructions |

To add a document type, follow the `Post` folder pattern: create
`schemaTypes/schemas/<Name>/<name>Type.ts` and `index.ts`, then register the
type in `schemaTypes/index.ts`.
