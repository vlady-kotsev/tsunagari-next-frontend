import { defineField, defineType } from "sanity";

export default defineType({
  name: "tableContent",
  title: "TableContent",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "user",
      title: "User",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "origin",
      title: "Origin",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "destination",
      title: "Destination",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "transferToken",
      title: "TransferToken",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "receivedToken",
      title: "ReceivedToken",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amount",
      title: "Amount",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "time",
      title: "Time",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "page",
      title: "Page",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "next",
      title: "Next",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "previous",
      title: "Previous",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
