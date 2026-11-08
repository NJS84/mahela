import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Mahela Cares (/mahela-cares). Every field is optional: anything left empty shows the approved copy
 * that is built into the site, so the page never breaks while content is being moved across.
 */
export const caresPage = defineType({
  name: 'caresPage',
  title: 'Mahela Cares page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'employees', title: 'Our employees' },
    { name: 'community', title: 'Our community' },
    { name: 'cta', title: 'Call to action' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'heroEyebrow', title: 'Small label above the title', type: 'string', group: 'hero', placeholder: 'Mahela Cares' }),
    defineField({ name: 'heroTitle', title: 'Page title (H1)', type: 'string', group: 'hero', validation: (r) => r.max(80) }),
    defineField({ name: 'heroLead', title: 'Intro sentence', type: 'text', rows: 3, group: 'hero' }),
    defineField({
      name: 'heroImage',
      title: 'Hero photo',
      description: 'Landscape, at least 2400 px wide. Click the crop icon to set the focus point. Leave empty to keep the current team photo.',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
    }),
    defineField({
      name: 'employeeCards',
      title: 'Employee cards',
      description: 'The five glass cards, in order: SIZA, Training, Crèche, Sport, Vegetables. Icons, colours and photos stay as designed.',
      type: 'array',
      group: 'employees',
      validation: (r) => r.max(5),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'card',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'text', type: 'text', rows: 4, validation: (r) => r.max(320).warning('Long text may not fit the card.') }),
          ],
          preview: { select: { title: 'title', subtitle: 'text' } },
        }),
      ],
    }),
    defineField({ name: 'programmes', title: 'Programmes on our farms (list)', type: 'array', group: 'employees', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'communityTitle', title: 'Section title', type: 'string', group: 'community', placeholder: 'Our community' }),
    defineField({ name: 'communityText', title: 'Paragraphs', type: 'array', group: 'community', of: [defineArrayMember({ type: 'text', rows: 4 })] }),
    defineField({ name: 'schoolCardTitle', title: 'School card title', type: 'string', group: 'community' }),
    defineField({ name: 'schoolCardText', title: 'School card line', type: 'string', group: 'community' }),
    defineField({ name: 'ctaTitle', title: 'CTA heading', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaText', title: 'CTA text', type: 'text', rows: 3, group: 'cta' }),
    defineField({
      name: 'seoDescription',
      title: 'Meta description',
      description: 'Shown by Google and AI search. Aim for 140 to 160 characters.',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (r) => r.max(170).warning('Google usually cuts descriptions after about 160 characters.'),
    }),
  ],
  preview: { prepare: () => ({ title: 'Mahela Cares page' }) },
});
