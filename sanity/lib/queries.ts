import { defineQuery } from "next-sanity";

export const LOGO_QUERY_BY_CHAIN_ID =
  defineQuery(`*[_type == "chainLogo" && chainId == $chainId][0] {
  title,
  "imageUrl": image.asset->url,
  alt,
  chainId
}
`);

export const LOGO_QUERY_ALL = defineQuery(`*[_type == "chainLogo"]    {
  title,
  "imageUrl": image.asset->url,
  alt,
  chainId
}
`);

export const INPUT_CONTENT_QUERY_BY_LANGUAGE =
  defineQuery(`*[_type == "inputContent" && language == $language][0] {
  title,
  chainInput,
  tokenInput,
  amountInput,
  inputButton,
  receiverInput,
  originInput
}
`);

export const TABLE_CONTENT_QUERY_BY_LANGUAGE =
  defineQuery(`*[_type == "tableContent" && language == $language][0] {
  title,
  user,
  origin,
  destination,
  transferToken,
  receivedToken,
  amount,
  time,
  page,
  next,
  previous
}
`);

export const WALLET_CONTENT_QUERY_BY_LANGUAGE =
  defineQuery(`*[_type == "walletContent" && language == $language][0] {
  title,
  connect,
  disconnect
}
`);

export const SOLANA_WALLET_CONTENT_QUERY_BY_LANGUAGE =
  defineQuery(`*[_type == "solanaWalletContent" && language == $language][0] {
  connect,
  disconnect
}
`);
