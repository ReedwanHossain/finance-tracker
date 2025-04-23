"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, DollarSign, Home, Plus } from "lucide-react"

import { cn } from "@/lib/utils"

export default function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Dashboard",
    },
    {
      href: "/transactions",
      icon: CreditCard,
      label: "Transactions",
    },
    {
      href: "/transactions/add",
      icon: Plus,
      label: "Add Transaction",
    },
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <DollarSign className="h-6 w-6" />
          <span>Finance Tracker</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === route.href && "bg-muted text-primary",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
