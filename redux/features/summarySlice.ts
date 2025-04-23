import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "@/lib/api"
import type { Summary } from "@/types"

interface SummaryState {
  summary: Summary | null
  loading: boolean
  error: string | null
}

const initialState: SummaryState = {
  summary: null,
  loading: false,
  error: null,
}

export const fetchSummary = createAsyncThunk("summary/fetchSummary", async () => {
  const response = await api.getSummary()
  return response
})

const summarySlice = createSlice({
  name: "summary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false
        state.summary = action.payload
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch summary"
      })
  },
})

export default summarySlice.reducer
