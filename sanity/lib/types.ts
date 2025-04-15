import { Image } from "sanity";

export interface ChainLogo {
  title: string;
  imageUrl: string;
  alt: string;
  chainId: number;
}

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
