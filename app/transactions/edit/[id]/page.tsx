import type { Metadata } from "next"
import TransactionForm from "@/components/transactions/transaction-form"

export const metadata: Metadata = {
  title: "Edit Transaction | Personal Finance Tracker",
  description: "Edit an existing financial transaction",
}

export default function EditTransactionPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Edit Transaction</h1>
      <TransactionForm id={params.id} />
    </div>
  )
}
