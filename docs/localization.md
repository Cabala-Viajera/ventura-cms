# Spanish and English content

Spanish is the default. Existing Spanish URLs stay unchanged. English lives under `/en`.

## Release sequence

1. Confirm the intended project and dataset in `sanity.config.ts` and local environment.
2. Run `npx sanity exec scripts/audit-i18n.ts --with-user-token`. Resolve all conflicts before rollout. This is read-only and includes drafts.
3. Export a backup with `npx sanity dataset export <dataset> <backup-file.tar.gz>` and retain it outside version control.
4. Review `npx sanity migration run mark-posts-spanish --dry-run`. Apply with `npx sanity migration run mark-posts-spanish --no-dry-run`. It only sets missing languages, including drafts, and is safe to rerun.
5. Build and deploy the Studio. Create a post using the English template, review it, and publish it. A linked Spanish counterpart is optional.
6. Deploy the website and verify both article URLs, the language switcher, and metadata. English lists may initially be empty.

Never commit API tokens or dataset exports. The website hides posts without an explicit `es` or `en` language. Classify legacy posts individually in the editor and republish them, or use the Spanish backfill only after confirming the affected posts are Spanish. The migration preserves IDs, slugs, content, assets, and publication state. If the frontend must be rolled back, keep language filtering in place while English documents exist to avoid mixing languages.

## Editorial workflow

- When creating an article, choose the Español or English Post template to initialize its language. The generic Post template is hidden. You can still change the language in the required Language dropdown before publishing. There is no blank or clear option. Legacy posts without a supported language show a disabled "Select a language" prompt until explicitly classified; the editor does not assign a language automatically. Each post can be published without a counterpart. The internationalization plugin remains available for optional linked translations and SEO metadata.
- The language dropdown is disabled while publication state loads and whenever a published version already has a supported language, including when editing its draft. Legacy published posts without a language can be classified and republished. This editor protection is not an API permission restriction; unpublishing removes the current-publication lock.
- Translate title, description, country, slug, Portable Text, image alt text, and internal links. Reuse existing image assets where appropriate.
- Generated copies are drafts, not translated content. Review every field before publishing. Each language is published independently.
- Slugs are unique within each language. Reserved application paths cannot be used as article slugs.
- Only published posts with an explicit matching language appear in public lists and article routes. The sitemap includes only `es` and `en` posts. Changing website language always opens the selected language homepage; it does not require or link to a counterpart. Missing content never falls back to another language.
- UI and privacy copy live in the website message dictionaries. Changing newsletter campaign language is a separate feature.
