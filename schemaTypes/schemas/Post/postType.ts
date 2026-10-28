import {defineField, defineType} from 'sanity'
import {LanguageInput} from './LanguageInput'

const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  initialValue: {language: 'es'},
  preview: {
    select: {title: 'title', language: 'language', media: 'imgUrl'},
    prepare({title, language, media}) {
      return {title, subtitle: language === 'en' ? 'English' : 'Español', media}
    },
  },
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      description:
        'Choose the language before publishing. Published posts keep their language to preserve their URL.',
      components: {input: LanguageInput},
      options: {
        list: [
          {title: 'Español', value: 'es'},
          {title: 'English', value: 'en'},
        ],
      },
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            value === 'es' || value === 'en' ? true : 'Choose Spanish or English.',
          ),
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'country',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        isUnique: async (slug, context) => {
          const {document, getClient} = context
          const id = document?._id?.replace(/^drafts\./, '')
          const language = document?.language || 'es'
          return getClient({apiVersion: '2025-11-09'}).fetch<boolean>(
            '!defined(*[_type == "post" && coalesce(language, "es") == $language && slug.current == $slug && !(_id in [$id, $draftId])][0]._id)',
            {slug, language, id, draftId: `drafts.${id}`},
          )
        },
      },
      validation: (rule) =>
        rule.required().custom((value) => {
          const reserved = [
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
          ]
          return value?.current &&
            (reserved.includes(value.current.toLowerCase()) ||
              value.current.includes('/') ||
              value.current.includes('.'))
            ? 'This slug is reserved or contains unsupported path characters.'
            : true
        }),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imgUrl',
      type: 'image',
    }),
    defineField({
      name: 'thumbnailImgUrl',
      type: 'image',
    }),

    defineField({
      name: 'content',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        // this is our first custom block which will make it possible to add block images with alt text fields into your portable text
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessiblity.',
              options: {
                isHighlighted: true,
              },
            },
          ],
        },
      ],
    }),
  ],
})

export default postType
