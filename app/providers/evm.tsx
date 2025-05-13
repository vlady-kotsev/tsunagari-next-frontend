"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { createConfig } from "wagmi";
import { baseSepolia, taikoHekla, polygonAmoy } from "wagmi/chains";
import { http } from "wagmi";
import { useState } from "react";

export const providerConfig = createConfig({
  chains: [baseSepolia, taikoHekla, polygonAmoy],
  transports: {
    [baseSepolia.id]: http(),
    [taikoHekla.id]: http(),
    [polygonAmoy.id]: http(),
  },
});

export const EvmProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={providerConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
