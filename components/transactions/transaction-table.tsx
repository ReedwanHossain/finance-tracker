"use client"

import { useState } from "react"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { format } from "date-fns"
import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { Transaction } from "@/types"
import type { AppDispatch } from "@/redux/store"
import { deleteTransaction } from "@/redux/features/transactionsSlice"
import { getCategoryColor } from "@/lib/utils"

interface TransactionTableProps {
  transactions: Transaction[]
  loading: boolean
  page: number
  limit: number
  total: number
  onPageChange: (page: number) => void
}

export default function TransactionTable({
  transactions,
  loading,
  page,
  limit,
  total,
  onPageChange,
}: TransactionTableProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const totalPages = Math.ceil(total / limit)

  const handleDelete = async () => {
    if (deletingId) {
      await dispatch(deleteTransaction(deletingId))
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(limit)
              .fill(0)
              .map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{format(new Date(transaction.date), "MMM dd, yyyy")}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-2 w-2 rounded-full ${getCategoryColor(transaction.category)}`} />
                    {transaction.category}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className={transaction.amount > 0 ? "text-emerald-500" : "text-rose-500"}>
                    {transaction.amount > 0 ? (
                      <ArrowUpIcon className="mr-1 inline h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="mr-1 inline h-3 w-3" />
                    )}
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link href={`/transactions/edit/${transaction.id}`}>
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-500 hover:text-rose-600"
                          onClick={() => setDeletingId(transaction.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this transaction. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeletingId(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-rose-500 hover:bg-rose-600">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-2">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} transactions
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
