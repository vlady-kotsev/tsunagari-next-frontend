import { defineField, defineType } from "sanity";

export default defineType({
  name: "chainLogo",
  title: "Image",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alternative Text",
      type: "string",
      description: "Important for SEO and accessibility.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "chainId",
      title: "Chain ID",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true, // Enables the hotspot functionality for image cropping
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
