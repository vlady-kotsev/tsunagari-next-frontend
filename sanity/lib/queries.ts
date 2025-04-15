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
