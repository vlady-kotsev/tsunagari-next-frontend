import { type SchemaTypeDefinition } from "sanity";
import chainLogo from "./image";
import inputContent from "./inputContent";
import tableContent from "./tableContent";
import walletContent from "./walletContent";
import solanaWalletContent from "./solanaWalletContent";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [chainLogo, inputContent, tableContent, walletContent, solanaWalletContent],
};
