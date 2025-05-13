import { defineField, defineType } from "sanity";

export default defineType({
  name: "inputContent",
  title: "InputContent",
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
      name: "chainInput",
      title: "ChainInput",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tokenInput",
      title: "TokenInput",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountInput",
      title: "AmountInput",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "receiverInput",
      title: "ReceiverInput",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "originInput",
      title: "OriginInput",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "inputButton",
      title: "InputButton",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
