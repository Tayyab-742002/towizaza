import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'upcomingSong',
  title: 'Upcoming Songs',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Release Type',
      type: 'string',
      options: {
        list: [
          { title: 'Album', value: 'album' },
          { title: 'EP', value: 'ep' },
          { title: 'Single', value: 'single' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      description: 'When this song will be released',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'artwork',
      title: 'Cover Artwork',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Release Year',
      type: 'number',
      description: 'Auto-calculated from release date',
      readOnly: ({ document }) => {
        if (document?.releaseDate) {
          return true;
        }
        return false;
      },
      initialValue: ({ document }) => {
        if (document?.releaseDate) {
          return new Date(document.releaseDate).getFullYear();
        }
        return new Date().getFullYear();
      },
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'streamUrl',
      title: 'Future Stream URL',
      description: 'Where this music will be available for streaming (optional)',
      type: 'url',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      description: 'Show on home page',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'tracks',
      title: 'Tracks',
      description: 'Tracks in this upcoming release',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'id',
              title: 'Track ID',
              type: 'string',
              initialValue: () => Math.random().toString(36).substring(2, 9),
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Track Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'duration',
              title: 'Track Duration',
              type: 'string',
              description: 'Format: M:SS or MM:SS (e.g., 3:45)',
              validation: (Rule) => Rule.required().regex(/^\d+:\d{2}$/, {
                name: 'duration format',
                invert: false
              }),
            }),
            defineField({
              name: 'trackNumber',
              title: 'Track Number',
              type: 'number',
              validation: (Rule) => Rule.integer().positive(),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      media: 'artwork',
      date: 'releaseDate',
    },
    prepare(selection) {
      const {title, subtitle, media, date} = selection
      const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : 'No date';
      
      return {
        title,
        subtitle: `${subtitle || 'Release'} • Coming ${formattedDate}`,
        media,
      }
    },
  },
}) 