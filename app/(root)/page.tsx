import Wallet from "@/components/wallet/Wallet";
import Image from "next/image";
import { eduFont } from "../layout";
import Link from "next/link";
import TransactionForm from "@/components/transactionForm/TransactionForm";
import MouseFollower from "@/components/mouseFollower/mouseFollower";
import TransactionsTable from "@/components/transactionTable/TransactionTable";
import DataService from "@/services/data.service/data.service";
import { Network } from "@/services/data.service/interfaces";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const tokens = await DataService.getAllTokens();
  const networks = await DataService.getAllNetworks();
  const networksMap = new Map<number, Network>();
  networks.items.forEach((n) => {
    networksMap.set(n.chainId, n);
  });
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
          Tsunagari
        </h1>
        <div className="mt-4 md:mt-0">
          <Wallet />
        </div>
      </header>
      <main className="flex flex-col w-full items-center">
        <MouseFollower />
        <section className="w-full max-w-4xl px-2 md:px-0">
          <TransactionForm tokens={tokens.items} networks={networksMap} />
        </section>
        <section className="w-full mt-10 px-0">
          <TransactionsTable
            className="hidden lg:flex"
            searchParams={searchParams}
          />
        </section>
      </main>
    </div>
  );
}
