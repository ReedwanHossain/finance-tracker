import type { Summary, Transaction } from "@/types"

const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Grocery shopping",
    amount: -50.25,
    category: "Food",
    date: "2025-04-01",
  },
  {
    id: "2",
    description: "Monthly salary",
    amount: 3000,
    category: "Salary",
    date: "2025-04-02",
  },
  {
    id: "3",
    description: "Rent payment",
    amount: -1200,
    category: "Rent",
    date: "2025-04-03",
  },
  {
    id: "4",
    description: "Movie tickets",
    amount: -25.5,
    category: "Entertainment",
    date: "2025-04-05",
  },
  {
    id: "5",
    description: "Electricity bill",
    amount: -85.75,
    category: "Utilities",
    date: "2025-04-07",
  },
  {
    id: "6",
    description: "Freelance payment",
    amount: 500,
    category: "Other Income",
    date: "2025-04-10",
  },
  {
    id: "7",
    description: "Restaurant dinner",
    amount: -65.3,
    category: "Food",
    date: "2025-04-12",
  },
  {
    id: "8",
    description: "Internet bill",
    amount: -60,
    category: "Utilities",
    date: "2025-04-15",
  },
  {
    id: "9",
    description: "Concert tickets",
    amount: -120,
    category: "Entertainment",
    date: "2025-04-18",
  },
  {
    id: "10",
    description: "Grocery shopping",
    amount: -45.8,
    category: "Food",
    date: "2025-04-20",
  },
  {
    id: "11",
    description: "Bonus payment",
    amount: 1000,
    category: "Salary",
    date: "2025-04-22",
  },
  {
    id: "12",
    description: "Gas bill",
    amount: -40.25,
    category: "Utilities",
    date: "2025-04-25",
  },
]

const mockSummary: Summary = {
  totalIncome: 4500,
  totalExpenses: -1693.85,
  balance: 2806.15,
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  async getTransactions(params: {
    page?: number
    limit?: number
    category?: string
    startDate?: string
    endDate?: string
  }): Promise<{ data: Transaction[]; total: number; page: number; limit: number }> {
    await delay(500)

    const { page = 1, limit = 10, category, startDate, endDate } = params

    let filteredTransactions = [...mockTransactions]

    if (category) {
      filteredTransactions = filteredTransactions.filter((t) => t.category === category)
    }

    if (startDate) {
      filteredTransactions = filteredTransactions.filter((t) => t.date >= startDate)
    }

    if (endDate) {
      filteredTransactions = filteredTransactions.filter((t) => t.date <= endDate)
    }

    filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const total = filteredTransactions.length
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedTransactions = filteredTransactions.slice(start, end)

    return {
      data: paginatedTransactions,
      total,
      page,
      limit,
    }
  },

  async getTransaction(id: string): Promise<Transaction> {
    await delay(300)

    const transaction = mockTransactions.find((t) => t.id === id)

    if (!transaction) {
      throw new Error("Transaction not found")
    }

    return transaction
  },

  async createTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction> {
    await delay(500)

    const newTransaction = {
      ...transaction,
      id: String(mockTransactions.length + 1),
    }

    mockTransactions.push(newTransaction)

    if (newTransaction.amount > 0) {
      mockSummary.totalIncome += newTransaction.amount
    } else {
      mockSummary.totalExpenses += newTransaction.amount
    }
    mockSummary.balance += newTransaction.amount

    return newTransaction
  },

  async updateTransaction(id: string, transaction: Omit<Transaction, "id">): Promise<Transaction> {
    await delay(500)

    const index = mockTransactions.findIndex((t) => t.id === id)

    if (index === -1) {
      throw new Error("Transaction not found")
    }

    const oldTransaction = mockTransactions[index]

    if (oldTransaction.amount > 0) {
      mockSummary.totalIncome -= oldTransaction.amount
    } else {
      mockSummary.totalExpenses -= oldTransaction.amount
    }
    mockSummary.balance -= oldTransaction.amount

    if (transaction.amount > 0) {
      mockSummary.totalIncome += transaction.amount
    } else {
      mockSummary.totalExpenses += transaction.amount
    }
    mockSummary.balance += transaction.amount

    const updatedTransaction = {
      ...transaction,
      id,
    }

    mockTransactions[index] = updatedTransaction

    return updatedTransaction
  },

  async deleteTransaction(id: string): Promise<void> {
    await delay(500)

    const index = mockTransactions.findIndex((t) => t.id === id)

    if (index === -1) {
      throw new Error("Transaction not found")
    }

    const transaction = mockTransactions[index]

    if (transaction.amount > 0) {
      mockSummary.totalIncome -= transaction.amount
    } else {
      mockSummary.totalExpenses -= transaction.amount
    }
    mockSummary.balance -= transaction.amount

    mockTransactions.splice(index, 1)
  },

  async getSummary(): Promise<Summary> {
    await delay(300)
    return { ...mockSummary }
  },

  async getTransactionsByCategory(): Promise<Record<string, { income: number; expenses: number }>> {
    await delay(500)

    const categories: Record<string, { income: number; expenses: number }> = {}

    mockTransactions.forEach((transaction) => {
      if (!categories[transaction.category]) {
        categories[transaction.category] = { income: 0, expenses: 0 }
      }

      if (transaction.amount > 0) {
        categories[transaction.category].income += transaction.amount
      } else {
        categories[transaction.category].expenses += transaction.amount
      }
    })

    return categories
  },
}
