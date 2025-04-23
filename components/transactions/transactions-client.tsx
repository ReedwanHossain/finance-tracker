"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { fetchTransactions } from "@/redux/features/transactionsSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import TransactionTable from "@/components/transactions/transaction-table"
import TransactionFilters from "@/components/transactions/transaction-filters"
import type { FilterParams } from "@/types"

export default function TransactionsClient() {
  const dispatch = useDispatch<AppDispatch>()
  const { transactions, loading, total } = useSelector((state: RootState) => state.transactions)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<FilterParams>({
    category: "",
    startDate: "",
    endDate: "",
  })

  const limit = 10

  useEffect(() => {
    dispatch(fetchTransactions({ page, limit, ...filters }))
  }, [dispatch, page, filters])

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button asChild>
          <Link href="/transactions/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Link>
        </Button>
      </div>

      <TransactionFilters onFilterChange={handleFilterChange} />

      <TransactionTable
        transactions={transactions}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
