import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'productLine',
      type: 'select',
      required: true,
      options: [
        { label: 'Lentils', value: 'lentils' },
        { label: 'Millets', value: 'millets' },
        { label: 'General', value: 'general' },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'author',
      type: 'text',
      defaultValue: 'Lentils & Millets Team',
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        description: 'Estimated reading time in minutes',
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        },
        {
          name: 'keywords',
          type: 'text',
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}