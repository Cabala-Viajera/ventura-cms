import {defineArrayMember, defineField, defineType} from 'sanity'

export const alertType = defineType({
  name: 'alert',
  title: 'Tip / alert',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional heading, written in the language of the post.',
    }),
    defineField({
      name: 'body',
      title: 'Tip text',
      type: 'array',
      description: 'Highlighted with an orange background on the blog.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'title', body: 'body'},
    prepare({title, body}) {
      const subtitle = body
        ?.flatMap(
          (block: {children?: {text?: string}[]}) =>
            block.children?.map((span) => span.text || '') || [],
        )
        .join(' ')
      return {title: title || 'Tip / alert', subtitle}
    },
  },
})
