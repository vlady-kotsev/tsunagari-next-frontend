"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function SolanaWallet() {
  return (
    <div>
      <h1>Connect Your Solana Wallet</h1>
      <WalletMultiButton />
    </div>
  );
}
