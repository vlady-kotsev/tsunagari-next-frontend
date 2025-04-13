import TransactionsTable from "@/components/table/table";
import WalletButton from "@/components/wallet/Wallet";
import Image from "next/image";
import { eduFont } from "../layout";
import Link from "next/link";
import TransactionForm from "@/components/transactionForm/TransactionForm";
import MouseFollower from "@/components/mouseFollower/mouseFollower";

export default function Page() {
  return (
    <div className="mt-5 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="mt-15 w-full flex justify-between items-center px-4">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={200} height={150} />
          </Link>
        </div>
        <h1
          className={`${eduFont.className} text-primary border-b-2 border-primary  text-9xl font-bold tracking-tight`}
        >
          Tsunagari
        </h1>
        <div>
          <WalletButton />
        </div>
      </header>
      <main className="flex flex-col">
        <MouseFollower />
        <section>
          <TransactionForm />
        </section>
        <section>
          <TransactionsTable />
        </section>
      </main>
    </div>
  );
}
