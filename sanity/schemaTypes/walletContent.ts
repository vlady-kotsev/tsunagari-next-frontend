import { defineField, defineType } from "sanity";

export default defineType({
  name: "walletContent",
  title: "WalletContent",
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
