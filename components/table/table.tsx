"use server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transfer } from "@/services/data.service/interfaces";
import DataService from "@/services/data.service/data.service";
import { Skeleton } from "../ui/skeleton";
import { Suspense } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const TransactionsTable = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const currentPage = Number((await searchParams).page) || 1;

  try {
    const transfers = await DataService.getAllTransfers(currentPage);
    const { meta } = transfers;

    return (
      <div className="flex flex-col h-[600px] w-[1200px]">
        <h1 className="text-primary text-5xl text-center mb-10">Transfers</h1>
        <div className="flex-1 overflow-auto">
          <Table className="border-2 border-primary text-primary">
            <TableHeader className="sticky top-0 bg-gray-900 z-10">
              <TableRow className="text-2xl border-primary">
                <TableHead className="w-[100px] text-primary">User</TableHead>
                <TableHead className="text-primary">Origin</TableHead>
                <TableHead className="text-primary">Destination</TableHead>
                <TableHead className="text-primary">Transfered Token</TableHead>
                <TableHead className="text-primary">Received Token</TableHead>
                <TableHead className="text-primary">Amount</TableHead>
                <TableHead className="text-primary">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <Suspense fallback={<SkeletonRow />} />
              {transfers.items.map((tx: Transfer) => (
                <TableRow
                  className="border-primary"
                  key={tx.timestamp.toString()}
                >
                  <TableCell className="font-medium">{tx.user}</TableCell>
                  <TableCell>{tx.originChainId}</TableCell>
                  <TableCell>{tx.destinationChainId}</TableCell>
                  <TableCell>{tx.originTokenAddress}</TableCell>
                  <TableCell>{tx.destinationTokenAddress}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>
                    {new Date(tx.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {currentPage > 1 && (
            <Link href={`?page=${currentPage - 1}`}>
              <Button
                variant="outline"
                className="text-primary border-2 border-primary hover:bg-primary bg-gray-900"
              >
                Previous
              </Button>
            </Link>
          )}
          <span className="flex items-center text-primary">
            Page {currentPage} of {meta.totalPages}
          </span>
          {currentPage < meta.totalPages && (
            <Link href={`?page=${currentPage + 1}`}>
              <Button
                variant="outline"
                className="text-primary border-2 border-primary hover:bg-primary bg-gray-900"
              >
                Next
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
