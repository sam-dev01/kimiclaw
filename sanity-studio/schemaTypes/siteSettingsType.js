import {defineField, defineType} from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
      initialValue: 'KimiClaw AI Blog',
    }),
    defineField({
      name: 'description',
      title: 'Default description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'featuredCategoryLabel',
      title: 'Featured category label',
      type: 'string',
      initialValue: 'Featured',
    }),
  ],
});
