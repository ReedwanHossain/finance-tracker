import type { Metadata } from "next"
import DashboardClient from "@/components/dashboard/dashboard-client"

export const metadata: Metadata = {
  title: "Dashboard | Personal Finance Tracker",
  description: "View your financial summary and recent transactions",
}

export default function DashboardPage() {
  return <DashboardClient />
}
