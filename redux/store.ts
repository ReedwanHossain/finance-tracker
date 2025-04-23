import { configureStore } from "@reduxjs/toolkit"
import transactionsReducer from "./features/transactionsSlice"
import summaryReducer from "./features/summarySlice"

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    summary: summaryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
