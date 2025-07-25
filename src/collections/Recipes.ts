import type { CollectionConfig } from 'payload'

export const Recipes: CollectionConfig = {
  slug: 'recipes',
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
      ],
    },
    {
      name: 'description',
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
      name: 'ingredients',
      type: 'array',
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
        {
          name: 'amount',
          type: 'text',
        },
      ],
    },
    {
      name: 'instructions',
      type: 'array',
      fields: [
        {
          name: 'step',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'cookingTime',
      type: 'number',
      admin: {
        description: 'Cooking time in minutes',
      },
    },
    {
      name: 'difficulty',
      type: 'select',
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
      ],
    },
    {
      name: 'nutritionalInfo',
      type: 'group',
      fields: [
        { name: 'calories', type: 'number' },
        { name: 'protein', type: 'text' },
        { name: 'fiber', type: 'text' },
        { name: 'iron', type: 'text' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
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