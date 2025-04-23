"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ArrowDownIcon, ArrowUpIcon, PencilIcon } from "lucide-react"
import type { Transaction } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { getCategoryColor } from "@/lib/utils"

interface RecentTransactionsProps {
  transactions: Transaction[]
  loading: boolean
}

export default function RecentTransactions({ transactions, loading }: RecentTransactionsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
      </div>
    )
  }

  if (!transactions.length) {
    return <p className="text-center text-muted-foreground">No recent transactions found.</p>
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">{transaction.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={`inline-flex h-2 w-2 rounded-full ${getCategoryColor(transaction.category)}`} />
              <span>{transaction.category}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-medium ${transaction.amount > 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {transaction.amount > 0 ? (
                <ArrowUpIcon className="mr-1 inline h-3 w-3" />
              ) : (
                <ArrowDownIcon className="mr-1 inline h-3 w-3" />
              )}
              ${Math.abs(transaction.amount).toFixed(2)}
            </span>
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <Link href={`/transactions/edit/${transaction.id}`}>
                <PencilIcon className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
