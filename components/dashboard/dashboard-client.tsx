"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { ArrowRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchSummary } from "@/redux/features/summarySlice"
import { fetchTransactions } from "@/redux/features/transactionsSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import SummaryCards from "@/components/dashboard/summary-cards"
import TransactionChart from "@/components/dashboard/transaction-chart"
import RecentTransactions from "@/components/dashboard/recent-transactions"

export default function DashboardClient() {
  const dispatch = useDispatch<AppDispatch>()
  const { summary, loading: summaryLoading } = useSelector((state: RootState) => state.summary)
  const { transactions, loading: transactionsLoading } = useSelector((state: RootState) => state.transactions)

  useEffect(() => {
    dispatch(fetchSummary())
    dispatch(fetchTransactions({ page: 1, limit: 5 }))
  }, [dispatch])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/transactions/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Link>
        </Button>
      </div>

      <SummaryCards summary={summary} loading={summaryLoading} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>Visualization of your financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activities</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={transactions} loading={transactionsLoading} />
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/transactions">
                View All Transactions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
