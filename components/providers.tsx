"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { createConfig } from "wagmi";
import { baseSepolia, taikoHekla } from "wagmi/chains";
import { http } from "wagmi";
import { useState } from "react";

const providerConfig = createConfig({
  chains: [baseSepolia, taikoHekla],
  transports: {
    [baseSepolia.id]: http(),
    [taikoHekla.id]: http(),
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={providerConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
