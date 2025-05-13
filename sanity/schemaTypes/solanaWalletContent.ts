import { defineField, defineType } from "sanity";

export default defineType({
  name: "solanaWalletContent",
  title: "SolanaWalletContent",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "connect",
      title: "Connect",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "disconnect",
      title: "Disconnect",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
