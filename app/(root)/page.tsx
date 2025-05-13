import Wallet from "@/components/molecules/wallet/Wallet";
import Image from "next/image";
import { eduFont } from "../layout";
import Link from "next/link";
import TransactionForm from "@/components/organisms/transactionForm/TransactionForm";
import MouseFollower from "@/components/organisms/mouseFollower/mouseFollower";
import TransactionsTable from "@/components/molecules/transactionTable/TransactionTable";
import DataService from "@/services/data.service/data.service";
import { Network } from "@/services/data.service/interfaces";
import { client } from "@/sanity/lib/client";
import {
  INPUT_CONTENT_QUERY_BY_LANGUAGE,
  WALLET_CONTENT_QUERY_BY_LANGUAGE,
} from "@/sanity/lib/queries";
import { InputContent, WalletContent } from "@/sanity/lib/types";
import SolanaWallet from "@/components/molecules/solanaWallet/solanaWallet";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; language?: string };
}) {
  const { language } = await searchParams;

  const tokens = await DataService.getAllTokens();
  const networks = await DataService.getAllNetworks();
  const networksMap = new Map<number, Network>();
  networks.items.forEach((n) => {
    networksMap.set(n.chainId, n);
  });
  const inputContent: InputContent = await client.fetch(
    INPUT_CONTENT_QUERY_BY_LANGUAGE,
    {
      language: language ?? "en",
    }
  );
  const walletContent: WalletContent = await client.fetch(
    WALLET_CONTENT_QUERY_BY_LANGUAGE,
    { language: language ?? "en" }
  );
  return (
    <div className="mt-5 grid grid-rows-auto items-center justify-items-center min-h-screen p-2 sm:p-4 md:p-6 lg:p-8 pb-20 gap-8 md:gap-12 lg:gap-16 font-[family-name:var(--font-geist-sans)]">
      <header className="mt-10 md:mt-15 w-full flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 px-2 sm:px-4">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={150} height={100} />
          </Link>
        </div>
        <h1
          className={`${eduFont.className} text-primary border-b-2 border-primary text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-center md:text-left`}
        >
          {inputContent.title}
        </h1>
        <div className="mt-4 md:mt-0">
          <Wallet walletContent={walletContent} />
          <SolanaWallet />
        </div>
      </header>
      <main className="flex flex-col w-full items-center">
        <MouseFollower />
        <section className="w-full max-w-4xl px-2 md:px-0">
          <TransactionForm
            content={inputContent}
            tokens={tokens.items}
            networks={networksMap}
          />
        </section>
        <section className="w-full mt-10 px-0">
          <TransactionsTable
            className="hidden lg:flex"
            searchParams={searchParams}
          />
        </section>
      </main>
      <footer className="flex w-full justify-start">
        {(language === "en" || language === undefined) && (
          <Link className="text-primary" href={"/?language=jp"}>
            日本語
          </Link>
        )}
        {language === "jp" && (
          <Link className="text-primary" href={"/?language=en"}>
            English
          </Link>
        )}
      </footer>
    </div>
  );
}
