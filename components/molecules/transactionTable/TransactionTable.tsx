"use server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { Transfer } from "@/services/data.service/interfaces";
import DataService from "@/services/data.service/data.service";
import { Skeleton } from "../../atoms/skeleton";
import { Suspense } from "react";
import { Button } from "../../atoms/button";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { TABLE_CONTENT_QUERY_BY_LANGUAGE } from "@/sanity/lib/queries";
import { TableContent } from "@/sanity/lib/types";
import { SOLANA_CHAIN_ID } from "@/components/consts";
import bs58 from "bs58";

const TransactionsTable = async ({
  searchParams,
  className,
  lang,
}: {
  searchParams: { page?: string };
  className: string;
  lang: string;
}) => {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  try {
    const transfers = await DataService.getAllTransfers(currentPage);
    const { meta } = transfers;
    const content: TableContent = await client.fetch(
      TABLE_CONTENT_QUERY_BY_LANGUAGE,
      { language: lang }
    );

    const formatTxUser = (tx: Transfer) => {
      if (tx.destinationChainId === SOLANA_CHAIN_ID) {
        const userTx = tx.user.startsWith("0x") ? tx.user.slice(2) : tx.user;
        const buffer = Buffer.from(userTx, "hex");

        return bs58.encode(buffer);
      } else if (
        tx.originChainId !== SOLANA_CHAIN_ID &&
        tx.destinationChainId !== SOLANA_CHAIN_ID
      ) {
        return `0x${tx.user.slice(-40)}`;
      }

      return tx.user;
    };

    return (
      <div
        className={`${className} flex flex-col h-[500px] sm:h-[600px] w-full`}
      >
        <h1 className="text-primary text-3xl sm:text-4xl md:text-5xl text-center mb-4 md:mb-6 lg:mb-10">
          {content.title}
        </h1>
        <div className="overflow-x-auto overflow-y-auto border-2 border-primary rounded-md relative">
          <Table className="text-primary min-w-[800px] w-full">
            <TableHeader className="bg-gray-900/95 backdrop-blur-sm">
              <TableRow className="text-sm md:text-base lg:text-lg xl:text-xl border-b border-primary/50">
                <TableHead className="sticky top-0 z-10 w-[100px] text-primary px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap bg-gray-900/95 backdrop-blur-sm">
                  {content.user}
                </TableHead>
                <TableHead className="sticky top-0 z-10 text-primary px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap bg-gray-900/95 backdrop-blur-sm">
                  {content.origin}
                </TableHead>
                <TableHead className="sticky top-0 z-10 text-primary px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap bg-gray-900/95 backdrop-blur-sm">
                  {content.destination}
                </TableHead>
                <TableHead className="sticky top-0 z-10 text-primary px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap bg-gray-900/95 backdrop-blur-sm">
                  {content.transferToken}
                </TableHead>
                <TableHead className="sticky top-0 z-10 text-primary px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap bg-gray-900/95 backdrop-blur-sm">
                  {content.receivedToken}
                </TableHead>
                <TableHead className="sticky top-0 z-10 text-primary px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap bg-gray-900/95 backdrop-blur-sm">
                  {content.amount}
                </TableHead>
                <TableHead className="sticky top-0 z-10 text-primary px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap bg-gray-900/95 backdrop-blur-sm">
                  {content.time}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs md:text-sm lg:text-base divide-y divide-primary/20">
              <Suspense fallback={<SkeletonRow />} />
              {transfers.items.map((tx: Transfer) => (
                <TableRow
                  className="hover:bg-primary/10"
                  key={tx.timestamp.toString()}
                >
                  <TableCell className="font-medium px-2 py-3 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap">
                    {formatTxUser(tx)}
                  </TableCell>
                  <TableCell className="px-2 py-3 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap">
                    {tx.originChainId}
                  </TableCell>
                  <TableCell className="px-2 py-3 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap">
                    {tx.destinationChainId}
                  </TableCell>
                  <TableCell className="px-2 py-3 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap">
                    {tx.originTokenAddress}
                  </TableCell>
                  <TableCell className="px-2 py-3 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap">
                    {tx.destinationTokenAddress}
                  </TableCell>
                  <TableCell className="px-2 py-3 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap">
                    {(Number(tx.amount) / 1e18).toFixed(2)}
                  </TableCell>
                  <TableCell className="px-2 py-3 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap">
                    {new Date(tx.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center items-center gap-2 mt-4">
          {currentPage > 1 && (
            <Link href={`?page=${currentPage - 1}`}>
              <Button
                variant="outline"
                className="text-primary border-2 border-primary hover:bg-primary bg-gray-900 px-3 py-1 text-sm md:px-4 md:py-2 md:text-base"
              >
                {content.previous}
              </Button>
            </Link>
          )}
          <span className="flex items-center text-primary text-sm md:text-base">
            ${content.page} {currentPage} / {meta.totalPages}
          </span>
          {currentPage < meta.totalPages && (
            <Link href={`?page=${currentPage + 1}`}>
              <Button
                variant="outline"
                className="text-primary border-2 border-primary hover:bg-primary bg-gray-900 px-3 py-1 text-sm md:px-4 md:py-2 md:text-base"
              >
                {content.next}
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    return (
      <div className="text-primary text-center">Error loading transfers</div>
    );
  }
};

const SkeletonRow = () => {
  return (
    <>
      <TableRow className="border-primary">
        <TableCell className="font-medium">
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
      </TableRow>
    </>
  );
};

export default TransactionsTable;
