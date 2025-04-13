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

const TransactionsTable = async () => {
  const transfers = await DataService.getAllTransfers(1);
  return (
    <>
      <h1 className="text-primary text-5xl text-center mb-10">Transfers</h1>
      <Table className="border-2 border-primary  text-primary">
        <TableHeader>
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
            <TableRow className="border-primary " key={tx.timestamp.toString()}>
              <TableCell className="font-medium">{tx.user}</TableCell>
              <TableCell>{tx.originChainId}</TableCell>
              <TableCell>{tx.destinationChainId}</TableCell>
              <TableCell>{tx.originTokenAddress}</TableCell>
              <TableCell>{tx.destinationTokenAddress}</TableCell>
              <TableCell>{tx.amount}</TableCell>
              <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
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
