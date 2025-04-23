"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AppDispatch, RootState } from "@/redux/store"
import { addTransaction, fetchTransaction, updateTransaction } from "@/redux/features/transactionsSlice"
import { CATEGORIES } from "@/lib/constants"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) !== 0, {
    message: "Amount must be a non-zero number",
  }),
  category: z.string().min(1, "Category is required"),
  date: z.date({
    required_error: "Date is required",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface TransactionFormProps {
  id?: string
}

export default function TransactionForm({ id }: TransactionFormProps) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { transaction, loading } = useSelector((state: RootState) => state.transactions)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "",
      date: new Date(),
    },
  })

  useEffect(() => {
    if (id) {
      dispatch(fetchTransaction(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id && transaction) {
      form.reset({
        description: transaction.description,
        amount: String(Math.abs(transaction.amount)),
        category: transaction.category,
        date: new Date(transaction.date),
      })
    }
  }, [form, id, transaction])

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const amountValue = Number.parseFloat(data.amount)
      const isExpense = data.category !== "Salary" && data.category !== "Other Income"
      const finalAmount = isExpense ? -Math.abs(amountValue) : Math.abs(amountValue)

      const transactionData = {
        description: data.description,
        amount: finalAmount,
        category: data.category,
        date: format(data.date, "yyyy-MM-dd"),
      }

      if (id) {
        await dispatch(updateTransaction({ id, transaction: transactionData }))
      } else {
        await dispatch(addTransaction(transactionData))
      }

      router.push("/transactions")
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (id && loading) {
    return <div className="flex justify-center p-8">Loading transaction data...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Grocery shopping" {...field} />
              </FormControl>
              <FormDescription>Enter a brief description of the transaction.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input placeholder="0.00" className="pl-7" {...field} />
                </div>
              </FormControl>
              <FormDescription>Enter the transaction amount (positive value).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select the category that best describes this transaction.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Select the date when this transaction occurred.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : id ? "Update Transaction" : "Add Transaction"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/transactions")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
