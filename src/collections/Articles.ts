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
      name: 'nutritionalData',
      type: 'group',
      admin: {
        description: 'Nutritional facts for millet varieties',
        condition: (data) => data.productLine === 'millets',
      },
      fields: [
        {
          name: 'metric1',
          type: 'group',
          fields: [
            {
              name: 'value',
              type: 'text',  
              required: true,
              admin: {
                description: 'e.g., "200mm", "344mg", "50"',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., "Min Rainfall", "Calcium per 100g", "Glycemic Index"',
              },
            },
          ],
        },
        {
          name: 'metric2',
          type: 'group',
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., "46°C", "3.9mg", "12.3g"',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., "Heat Tolerance", "Iron per 100g", "Protein per 100g"',
              },
            },
          ],
        },
        {
          name: 'keyBenefits',
          type: 'array',
          minRows: 3,
          maxRows: 3,
          admin: {
            description: 'Exactly 3 key benefits/features',
          },
          fields: [
            {
              name: 'benefit',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., "Drought-resistant supercrop", "Superior to dairy for calcium"',
              },
            },
          ],
        },
      ],
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