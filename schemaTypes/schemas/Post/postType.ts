import {defineField, defineType} from 'sanity'

const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
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
      options: {source: 'title'},
      validation: (rule) => rule.required(),
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
