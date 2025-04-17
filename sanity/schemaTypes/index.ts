import { type SchemaTypeDefinition } from "sanity";
import chainLogo from "./image";
import inputContent from "./inputContent";
import tableContent from "./tableContent";
import walletContent from "./walletContent";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [chainLogo, inputContent, tableContent, walletContent],
};
