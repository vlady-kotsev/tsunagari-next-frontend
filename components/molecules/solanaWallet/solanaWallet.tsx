/* eslint-disable @next/next/no-img-element */
"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function SolanaWallet({
  solanaLogo,
  connectText,
  disconnectText,
}: {
  solanaLogo: string;
  connectText: string;
  disconnectText: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { wallet, connected, publicKey } = useWallet();
  return (
    <div className="mt-5 flex flex-col items-center">
      <WalletMultiButton>{connected? disconnectText: connectText}</WalletMultiButton>
      {connected && (
        <div className="w-10 h-auto mt-5">
          <img src={solanaLogo} alt="solana logo" />
        </div>
      )}
    </div>
  );
}
