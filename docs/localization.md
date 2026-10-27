# Spanish and English content

Spanish is the default. Existing Spanish URLs stay unchanged. English lives under `/en`.

## Release sequence

1. Confirm the intended project and dataset in `sanity.config.ts` and local environment.
2. Run `npx sanity exec scripts/audit-i18n.ts --with-user-token`. Resolve all conflicts before rollout. This is read-only and includes drafts.
3. Export a backup with `npx sanity dataset export <dataset> <backup-file.tar.gz>` and retain it outside version control.
4. Review `npx sanity migration run mark-posts-spanish --dry-run`. Apply with `npx sanity migration run mark-posts-spanish --no-dry-run`. It only sets missing languages, including drafts, and is safe to rerun.
5. Build and deploy the Studio. Create a linked English translation of one Spanish post, review it, and publish it.
6. Deploy the website and verify both article URLs, the language switcher, and metadata. English lists may initially be empty.

Never commit API tokens or dataset exports. The website also treats missing language as Spanish during rollout. The migration preserves IDs, slugs, content, assets, and publication state. If the frontend must be rolled back, keep language filtering in place while English documents exist to avoid mixing languages.

## Editorial workflow

- New standalone articles default to Spanish. Use the document language selector to create a linked English translation; do not create an unrelated English post.
- Translate title, description, country, slug, Portable Text, image alt text, and internal links. Reuse existing image assets where appropriate.
- Generated copies are drafts, not translated content. Review every field before publishing. Each language is published independently.
- Slugs are unique within each language. Reserved application paths cannot be used as article slugs.
- Unpublished translations are excluded from public lists, switcher links, sitemap, and language metadata. Missing translations do not fall back to Spanish on English pages.
- UI and privacy copy live in the website message dictionaries. Changing newsletter campaign language is a separate feature.
