import type { Metadata } from "next"
import TransactionForm from "@/components/transactions/transaction-form"

export const metadata: Metadata = {
  title: "Add Transaction | Personal Finance Tracker",
  description: "Add a new financial transaction",
}

export default function AddTransactionPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Add Transaction</h1>
      <TransactionForm />
    </div>
  )
}
