"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchTransactionsByCategory } from "@/redux/features/transactionsSlice"
import { Skeleton } from "@/components/ui/skeleton"

export default function TransactionChart() {
  const dispatch = useDispatch<AppDispatch>()
  const { transactionsByCategory, loading } = useSelector((state: RootState) => state.transactions)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    dispatch(fetchTransactionsByCategory())
  }, [dispatch])

  useEffect(() => {
    if (transactionsByCategory) {
      const formattedData = Object.entries(transactionsByCategory).map(([category, { income, expenses }]) => ({
        name: category,
        income: income || 0,
        expenses: Math.abs(expenses || 0),
      }))
      setChartData(formattedData)
    }
  }, [transactionsByCategory])

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, ""]} labelFormatter={(label) => `Category: ${label}`} />
        <Bar dataKey="income" name="Income" fill="#10b981">
          {chartData.map((entry, index) => (
            <Cell key={`cell-income-${index}`} fill="#10b981" />
          ))}
        </Bar>
        <Bar dataKey="expenses" name="Expenses" fill="#ef4444">
          {chartData.map((entry, index) => (
            <Cell key={`cell-expenses-${index}`} fill="#ef4444" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
