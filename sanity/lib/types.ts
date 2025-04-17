import { Image } from "sanity";

export interface ChainLogo {
  title: string;
  imageUrl: string;
  alt: string;
  chainId: number;
}
//@ts-expect-error sanity type
export interface SanityImage extends Image {
  asset: {
    url: string;
    metadata: {
      dimensions: {
        width: number;
        height: number;
      };
      lqip: string;
    };
  };
}

export interface InputContent {
  title: string;
  chainInput: string;
  tokenInput: string;
  amountInput: string;
  inputButton: string;
}

export interface TableContent {
  title: string;
  user: string;
  origin: string;
  destination: string;
  transferToken: string;
  receivedToken: string;
  amount: string;
  time: string;
  page: string;
  next: string;
  previous: string;
}

export interface WalletContent {
  connect: string;
  disconnect: string;
}
