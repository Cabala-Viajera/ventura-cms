import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-11-09'})
const posts = await client.fetch<{_id: string; language?: string; slug?: {current: string}}[]>(
  '*[_type == "post"]{_id, language, slug}',
)
const reserved = new Set([
  'es',
  'en',
  'articulos',
  'articles',
  'privacidad',
  'privacy',
  'api',
  '_next',
  '_vercel',
  'robots.txt',
  'sitemap.xml',
])
const issues: string[] = []
const slugs = new Map<string, string>()
for (const post of posts) {
  const language = post.language ?? 'es'
  if (!['es', 'en'].includes(language)) issues.push(`${post._id}: unsupported language ${language}`)
  const slug = post.slug?.current
  if (!slug) {
    issues.push(`${post._id}: missing slug`)
    continue
  }
  if (reserved.has(slug.toLowerCase()) || slug.includes('/') || slug.includes('.'))
    issues.push(`${post._id}: reserved/unsupported slug ${slug}`)
  const id = post._id.replace(/^drafts\./, '')
  const key = `${language}:${slug}`
  const previous = slugs.get(key)
  if (previous && previous !== id) issues.push(`${post._id}: duplicate ${key} with ${previous}`)
  slugs.set(key, id)
}
console.log(
  `Audited ${posts.length} post documents; ${posts.filter((post) => !post.language).length} need Spanish language assignment.`,
)
if (issues.length) {
  console.error(issues.join('\n'))
  process.exitCode = 1
} else console.log('No language or slug conflicts found.')
