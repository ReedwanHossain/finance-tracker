import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/redux/provider"
import Sidebar from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Personal Finance Tracker",
  description: "Track your income and expenses with ease",
    generator: 'finance-tracker',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
