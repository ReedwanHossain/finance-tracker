import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "@/lib/api"
import type { FilterParams, Transaction } from "@/types"

interface TransactionsState {
  transactions: Transaction[]
  transaction: Transaction | null
  transactionsByCategory: Record<string, { income: number; expenses: number }> | null
  loading: boolean
  error: string | null
  total: number
  page: number
  limit: number
}

const initialState: TransactionsState = {
  transactions: [],
  transaction: null,
  transactionsByCategory: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
}

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (params: { page?: number; limit?: number } & FilterParams) => {
    const response = await api.getTransactions(params)
    return response
  },
)

export const fetchTransaction = createAsyncThunk("transactions/fetchTransaction", async (id: string) => {
  const response = await api.getTransaction(id)
  return response
})

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transaction: Omit<Transaction, "id">) => {
    const response = await api.createTransaction(transaction)
    return response
  },
)

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ id, transaction }: { id: string; transaction: Omit<Transaction, "id"> }) => {
    const response = await api.updateTransaction(id, transaction)
    return response
  },
)

export const deleteTransaction = createAsyncThunk("transactions/deleteTransaction", async (id: string) => {
  await api.deleteTransaction(id)
  return id
})

export const fetchTransactionsByCategory = createAsyncThunk("transactions/fetchTransactionsByCategory", async () => {
  const response = await api.getTransactionsByCategory()
  return response
})

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload.data
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch transactions"
      })

      .addCase(fetchTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.transaction = action.payload
      })
      .addCase(fetchTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch transaction"
      })

      .addCase(addTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = [action.payload, ...state.transactions]
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to add transaction"
      })

      .addCase(updateTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.transaction = action.payload
        state.transactions = state.transactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction,
        )
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update transaction"
      })

      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = state.transactions.filter((transaction) => transaction.id !== action.payload)
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to delete transaction"
      })

      .addCase(fetchTransactionsByCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactionsByCategory.fulfilled, (state, action) => {
        state.loading = false
        state.transactionsByCategory = action.payload
      })
      .addCase(fetchTransactionsByCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch transactions by category"
      })
  },
})

export default transactionsSlice.reducer
