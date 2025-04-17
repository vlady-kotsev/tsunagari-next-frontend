"use client";

import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "../ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { LOGO_QUERY_BY_CHAIN_ID } from "@/sanity/lib/queries";
import { WalletContent } from "@/sanity/lib/types";

const Wallet = ({ walletContent }: { walletContent: WalletContent }) => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [logo, setLogo] = useState<{
    chainId: number;
    imageUrl: string;
    alt: string;
  } | null>(null);
  const chain = useChainId();
  useEffect(() => {
    (async () => {
      const chainLogo = await client.fetch(LOGO_QUERY_BY_CHAIN_ID, {
        chainId: chain,
      });
      setLogo(chainLogo || null);
    })();
  }, [chain]);

  if (isConnected)
    return (
      <div className="flex w-[200px] flex-col justify-center items-center">
        <Button
          className="w-full px-4 py-2 bg-primary text-gray-900 rounded"
          onClick={() => disconnect()}
        >
          {walletContent.disconnect} {address?.slice(0, 6)}...
          {address?.slice(-4)}
        </Button>
        {chain && (
          <div className="mt-5 flex gap-5">
            {logo && (
              <Image
                width={50}
                height={50}
                alt={logo.alt}
                src={logo.imageUrl}
              />
            )}
            <h3 className="mt-2 text-primary text-3xl">{chain}</h3>
          </div>
        )}
      </div>
    );

  return (
    <div className="w-[200px]">
      <Button
        className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        onClick={() => connect({ connector: injected() })}
      >
        {walletContent.connect}
      </Button>
    </div>
  );
};

export default Wallet;
