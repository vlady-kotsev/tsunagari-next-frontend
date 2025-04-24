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

const TransactionsTable = async ({
  searchParams,
  className,
}: {
  searchParams: { page?: string; language?: string };
  className: string;
}) => {
  const { page, language } = await searchParams;
  const currentPage = Number(page) || 1;

  try {
    const transfers = await DataService.getAllTransfers(currentPage);
    const { meta } = transfers;
    const content: TableContent = await client.fetch(
      TABLE_CONTENT_QUERY_BY_LANGUAGE,
      { language: language ?? "en" }
    );
    return (
      <div
        className={`${className} flex flex-col h-[500px] sm:h-[600px] w-full`}
      >
        <h1 className="text-primary text-3xl sm:text-4xl md:text-5xl text-center mb-4 md:mb-6 lg:mb-10">
          {content.title}
        </h1>
        <div className="flex-1 overflow-x-auto overflow-y-auto border-2 border-primary rounded-md relative">
          <Table className="text-primary min-w-[800px] w-full">
            <TableHeader className="sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10">
              <TableRow className="text-sm md:text-base lg:text-lg xl:text-xl border-b border-primary/50">
                <TableHead className="w-[100px] text-primary px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap">
                  {content.user}
                </TableHead>
                <TableHead className="text-primary px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap">
                  {content.origin}
                </TableHead>
                <TableHead className="text-primary px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap">
                  {content.destination}
                </TableHead>
                <TableHead className="text-primary px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap">
                  {content.transferToken}
                </TableHead>
                <TableHead className="text-primary px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap">
                  {content.receivedToken}
                </TableHead>
                <TableHead className="text-primary px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap">
                  {content.amount}
                </TableHead>
                <TableHead className="text-primary px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-3 whitespace-nowrap">
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
                    {tx.user}
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
                    {tx.amount}
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
