import type { Metadata } from "next"
import TransactionsClient from "@/components/transactions/transactions-client"

export const metadata: Metadata = {
  title: "Transactions | Personal Finance Tracker",
  description: "View and manage your financial transactions",
}

export default function TransactionsPage() {
  return <TransactionsClient />
}
